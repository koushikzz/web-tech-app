import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';

const FinanceForm = () => {
    const { addFinance } = useContext(FinanceContext);
    const [formData, setFormData] = useState({
        type: 'Expense',
        title: '',
        amount: '',
        billingDate: '',
        category: 'Utilities',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) return setError('Title is required');
        if (!formData.amount || Number(formData.amount) <= 0) return setError('Amount must be a positive number');
        if (!formData.billingDate) return setError('Billing date is required');

        addFinance({ ...formData, amount: Number(formData.amount) });
        setFormData({ type: 'Expense', title: '', amount: '', billingDate: '', category: 'Utilities' });
    };

    return (
        <div className="card">
            <h2 className="header-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>New Record</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Record Type</label>
                    <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                        <option value="Expense">Variable Expense</option>
                        <option value="Subscription">Fixed Subscription</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} placeholder="e.g. Netflix, Groceries" />
                </div>
                <div className="form-group">
                    <label>Amount ($)</label>
                    <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} placeholder="0.00" />
                </div>
                <div className="form-group">
                    <label>Billing Date</label>
                    <input type="date" name="billingDate" className="form-control" value={formData.billingDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Food">Food</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {error && <div className="error-text">{error}</div>}
                <button type="submit" className="btn">Add Record</button>
            </form>
        </div>
    );
};

export default FinanceForm;
