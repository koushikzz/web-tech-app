import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import FinanceForm from '../components/FinanceForm';

const Ledger = () => {
    const { finances, loading, deleteFinance } = useContext(FinanceContext);

    return (
        <div className="page-container">
            <h1 className="header-title">Transaction Ledger</h1>
            <div className="app-container">
                <div className="main-content">
                    <div className="card">
                        <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>All Records</h2>
                        {loading ? <p>Loading...</p> : (
                            <div className="list-container">
                                {finances.map(item => (
                                    <div key={item._id} className="list-item">
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
        </div>
    );
};

export default Ledger;
