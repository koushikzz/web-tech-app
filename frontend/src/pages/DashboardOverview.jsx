import React, { useContext, useEffect, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import axios from 'axios';

const DashboardOverview = () => {
    const { finances, projection, loading } = useContext(FinanceContext);
    const [forex, setForex] = useState({ EUR: 0, GBP: 0, INR: 0 });

    const isHealthy = projection.totalProjection < 5000; 
    const recent = finances.slice(0, 3);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await axios.get('https://open.er-api.com/v6/latest/USD');
                setForex({
                    EUR: res.data.rates.EUR,
                    GBP: res.data.rates.GBP,
                    INR: res.data.rates.INR
                });
            } catch (err) {
                console.error('Forex fetch failed');
            }
        };
        fetchRates();
    }, []);

    return (
        <div className="page-container">
            <h1 className="header-title">Overview</h1>
            
            <div className="dashboard-grid">
                <div className={`card health-card ${isHealthy ? 'good' : 'bad'}`}>
                    <div className="health-status">{isHealthy ? 'Healthy Outlook' : 'High Expenses Warning'}</div>
                    <div className="health-value">${projection.totalProjection.toFixed(2)}</div>
                    <div className="health-meta">6-Month Projected Cost (WMA Algorithm applied)</div>
                </div>

                <div className="card">
                    <h2 style={{marginBottom: '1rem'}}>Global Currency Valuation</h2>
                    <div className="flex-column gap-1">
                        <div className="currency-row"><span>EUR (€)</span> <strong>€{(projection.totalProjection * forex.EUR).toFixed(2)}</strong></div>
                        <div className="currency-row"><span>GBP (£)</span> <strong>£{(projection.totalProjection * forex.GBP).toFixed(2)}</strong></div>
                        <div className="currency-row"><span>INR (₹)</span> <strong>₹{(projection.totalProjection * forex.INR).toFixed(2)}</strong></div>
                    </div>
                    <div className="health-meta" style={{marginTop:'1rem'}}>Live Exchange Rates updated instantly via External Service</div>
                </div>
            </div>

            <div className="card mt-2">
                <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Recent Activity</h2>
                {loading ? <p>Loading...</p> : (
                    <div className="list-container">
                        {recent.map(item => (
                            <div key={item._id} className="list-item">
                                <div className="item-info">
                                    <h4>{item.title}</h4>
                                    <div className="item-meta">{item.category} • {new Date(item.billingDate).toLocaleDateString()}</div>
                                </div>
                                <span className={`item-amount ${item.type}`}>
                                    {item.type === 'Expense' ? '-' : ''}${item.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardOverview;
