import React, { useState } from 'react';
import {
    LayoutDashboard,
    FileStack,
    BarChart3,
    Files,
    Bell,
    User,
    Menu,
    X,
    LogOut,
    Bot
} from 'lucide-react';
import './Portal.css';

interface Props {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const PortalLayout: React.FC<Props> = ({ children, activeTab, onTabChange }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'quotes', label: 'Cotizaciones', icon: <FileStack size={20} /> },
        { id: 'tracking', label: 'Tracking Visual', icon: <BarChart3 size={20} /> },
        { id: 'documents', label: 'Expediente Dig.', icon: <Files size={20} /> },
    ];

    return (
        <div className="portal-shell">
            {/* Sidebar */}
            <aside className={`portal-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="portal-logo">
                    <img src="/src/assets/logo-acon-white.png" alt="ACON LOGO" className="logo-img-portal" />
                </div>

                <nav className="portal-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => onTabChange(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="portal-sidebar-footer">
                    <button className="ai-assistant-link" onClick={() => onTabChange('ai-assistant')}>
                        <Bot size={20} />
                        <span>Asistente Logístico</span>
                    </button>
                    <button className="logout-btn">
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="portal-main">
                <header className="portal-header">
                    <div className="header-left">
                        <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h2 className="page-title">{navItems.find(n => n.id === activeTab)?.label}</h2>
                    </div>

                    <div className="header-right">
                        <div className="notification-bell">
                            <Bell size={20} />
                            <span className="badge">2</span>
                        </div>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">Carlos Mendoza</span>
                                <span className="user-company">Industrial Heavy Machinery</span>
                            </div>
                            <div className="user-avatar">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="portal-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PortalLayout;
