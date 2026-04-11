import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    const { finances, budgets, updateBudget } = useContext(FinanceContext);
    
    const [budgetForm, setBudgetForm] = useState({ category: 'Food', limit: '' });

    const handleBudgetSubmit = (e) => {
        e.preventDefault();
        updateBudget(budgetForm.category, budgetForm.limit);
        setBudgetForm({ ...budgetForm, limit: '' });
    };

    const handleExport = () => {
        window.open('http://localhost:5000/api/finance/export', '_blank');
    };

    const categoryData = useMemo(() => {
        const expenses = finances.filter(f => f.type === 'Expense');
        const map = {};
        expenses.forEach(e => {
            map[e.category] = (map[e.category] || 0) + e.amount;
        });
        return Object.keys(map).map(k => ({ name: k, value: map[k] }));
    }, [finances]);

    const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981'];

    return (
        <div className="page-container">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h1 className="header-title" style={{marginBottom: 0}}>Analytics & Reports</h1>
                <button onClick={handleExport} className="btn" style={{width: 'auto', marginTop: 0}}>Export CSV Report</button>
            </div>

            <div className="dashboard-grid mt-2" style={{marginTop:'2rem'}}>
                <div className="card" style={{ height: '400px' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Expenses by Category</h2>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h2 style={{ marginBottom: '1rem' }}>Budget Alerts Setup</h2>
                    <form onSubmit={handleBudgetSubmit} className="mb-2">
                        <div className="form-group">
                            <label>Category</label>
                            <select className="form-control" value={budgetForm.category} onChange={e => setBudgetForm({...budgetForm, category: e.target.value})}>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Food">Food</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Maximum Limit ($)</label>
                            <input type="number" className="form-control" value={budgetForm.limit} onChange={e => setBudgetForm({...budgetForm, limit: e.target.value})} required/>
                        </div>
                        <button type="submit" className="btn">Save Limit</button>
                    </form>

                    <h3 style={{marginTop: '2rem', marginBottom: '1rem', fontSize:'1rem'}}>Active Limits:</h3>
                    {budgets.map(b => (
                        <div key={b._id} className="currency-row" style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'0.5rem', marginBottom:'0.5rem'}}>
                            <span>{b.category}</span>
                            <strong>${b.limit}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
