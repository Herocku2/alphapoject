import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  Users,
  Ship,
  Bot,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
  ExternalLink
} from 'lucide-react';
import './AppShell.css';

const AppShell: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleNewQuote = () => {
    navigate('/quoter');
    // If we're already on the quoter, we might want to trigger a reset
    // This can be done via state or by checking the location
    if (window.location.pathname === '/quoter') {
      window.dispatchEvent(new CustomEvent('resetQuoter'));
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Cotizador', path: '/quoter', icon: <Calculator size={20} /> },
    { name: 'CRM Logístico', path: '/crm', icon: <Users size={20} /> },
    { name: 'Operaciones', path: '/operations', icon: <Ship size={20} /> },
    { name: 'Tarifas Clientes', path: '/pricing', icon: <Calculator size={20} /> },
    { name: 'Tarifas Proveedores', path: '/vendor-pricing', icon: <Users size={20} /> },
    { name: 'Asistente IA', path: '/ai', icon: <Bot size={20} /> },
    { name: 'Configuración', path: '/settings', icon: <Settings size={20} /> },
    { name: 'Portal Cliente', path: '/portal', icon: <ExternalLink size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/src/assets/logo-acon-white.png" alt="ACON LOGO" className="logo-img" />
          </div>
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <User size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">Enrique Cobian</span>
              <span className="user-role">Architect</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            {!isSidebarOpen && (
              <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </button>
            )}
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Buscar operación, cliente o ruta..." />
            </div>
          </div>
          <div className="header-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="divider"></div>
            <button className="btn-primary" onClick={handleNewQuote}>
              <Calculator size={18} />
              <span>Nueva Cotización</span>
            </button>
          </div>
        </header>

        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AppShell;
