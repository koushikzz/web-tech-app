import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import FinanceForm from './FinanceForm';

const Dashboard = () => {
    const { finances, projection, loading, deleteFinance } = useContext(FinanceContext);

    const isHealthy = projection.totalProjection < 5000; 

    return (
        <div className="app-container">
            <div className="main-content">
                <h1 className="header-title">Finance Tracker</h1>
                
                <div className={`card health-card ${isHealthy ? 'good' : 'bad'}`}>
                    <div className="health-status">{isHealthy ? 'Healthy Outlook' : 'High Expenses Warning'}</div>
                    <div className="health-value">${projection.totalProjection.toFixed(2)}</div>
                    <div className="health-meta">6-Month Projected Cost (WMA Algorithm applied)</div>
                </div>

                <div className="card">
                    <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Activity Ledger</h2>
                    {loading ? (
                        <p className="item-meta">Loading financial records...</p>
                    ) : (
                        <div className="list-container">
                            {finances.length === 0 && <p className="item-meta">No records found. Start adding expenses.</p>}
                            {finances.map(item => (
                                <div key={item._id} className={`list-item ${item.isOptimistic ? 'optimistic' : ''}`}>
                                    <div className="item-info">
                                        <h4>{item.title}</h4>
                                        <div className="item-meta">{item.category} • {new Date(item.billingDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="item-right">
                                        <span className={`item-amount ${item.type}`}>
                                            {item.type === 'Expense' ? '-' : ''}${item.amount.toFixed(2)}
                                        </span>
                                        <button className="delete-btn" onClick={() => deleteFinance(item._id)}>X</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="side-panel">
                <FinanceForm />
            </div>
        </div>
    );
};

export default Dashboard;
