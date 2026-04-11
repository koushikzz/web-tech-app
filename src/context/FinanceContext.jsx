import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [finances, setFinances] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [projection, setProjection] = useState({ totalProjection: 0, sixMonthSubs: 0, sixMonthExpenses: 0, monthlyAverage: 0 });
    const [loading, setLoading] = useState(true);

    const baseURL = 'http://localhost:5000/api/finance';
    const budgetURL = 'http://localhost:5000/api/budget';

    const fetchFinances = useCallback(async () => {
        try {
            const { data } = await axios.get(baseURL);
            setFinances(data);
        } catch (error) {
            console.error('Error fetching finances', error);
        }
    }, []);

    const fetchProjection = useCallback(async () => {
        try {
            const { data } = await axios.get(`${baseURL}/projection`);
            setProjection(data);
        } catch (error) {
            console.error('Error fetching projection', error);
        }
    }, []);

    const fetchBudgets = useCallback(async () => {
        try {
            const { data } = await axios.get(budgetURL);
            setBudgets(data);
        } catch (error) {
            console.error('Error fetching budgets', error);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchFinances();
            await fetchProjection();
            await fetchBudgets();
            setLoading(false);
        };
        init();
    }, [fetchFinances, fetchProjection, fetchBudgets]);

    const addFinance = async (newItem) => {
        const optimisticId = Date.now().toString();
        const optimisticItem = { ...newItem, _id: optimisticId, isOptimistic: true };
        setFinances((prev) => [optimisticItem, ...prev]);

        try {
            const { data } = await axios.post(baseURL, newItem);
            setFinances((prev) => prev.map((item) => (item._id === optimisticId ? data : item)));
            fetchProjection();
        } catch (error) {
            setFinances((prev) => prev.filter((item) => item._id !== optimisticId));
        }
    };

    const deleteFinance = async (id) => {
        const backup = [...finances];
        setFinances((prev) => prev.filter((item) => item._id !== id));

        try {
            await axios.delete(`${baseURL}/${id}`);
            fetchProjection();
        } catch (error) {
            setFinances(backup);
        }
    };

    const updateBudget = async (category, limit) => {
        try {
            await axios.post(budgetURL, { category, limit: Number(limit) });
            await fetchBudgets();
        } catch (error) {
            console.error('Error updating budget', error);
        }
    };

    return (
        <FinanceContext.Provider value={{ finances, projection, budgets, loading, addFinance, deleteFinance, updateBudget }}>
            {children}
        </FinanceContext.Provider>
    );
};
