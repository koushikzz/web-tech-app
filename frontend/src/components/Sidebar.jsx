import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, PieChart } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-brand">FinanceAI</div>
            <nav className="sidebar-nav">
                <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/ledger" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <List size={20} />
                    <span>Ledger</span>
                </NavLink>
                <NavLink to="/analytics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <PieChart size={20} />
                    <span>Analytics</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
