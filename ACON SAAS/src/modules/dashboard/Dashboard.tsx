import React from 'react';
import {
    DollarSign,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Activity,
    Globe,
    TrendingUp,
    ShieldCheck,
    Clock,
    PieChart
} from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Total Gross Revenue (YTD)', value: '$2,842,500', growth: '+18.4%', isUp: true, icon: <DollarSign size={20} /> },
        { label: 'Net Operating Margin', value: '$486,200', growth: '+12.5%', isUp: true, icon: <TrendingUp size={20} /> },
        { label: 'DSO Performance (Days)', value: '24.5 Days', growth: '-5.2%', isUp: false, icon: <Clock size={20} /> },
        { label: 'On-Time Performance (OTP)', value: '94.2%', growth: '+2.1%', isUp: true, icon: <ShieldCheck size={20} /> },
    ];

    // Mock data for Line Chart (Revenue)
    const revenueData = [30, 45, 35, 60, 55, 80, 75, 90, 85, 95, 88, 100];
    const gridLines = [25, 50, 75];
    const points = revenueData.map((val, i) => `${(i * 100) / 11},${100 - val}`).join(' ');

    // Mock data for Bar Chart (Volume)
    const volumeData = [40, 65, 50, 85, 70, 95];
    const volumeLabels = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'];

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>Global Logistics Strategic Control</h1>
                    <p className="subtitle">Real-time profitability monitoring and operational command.</p>
                </div>
                <div className="date-filter">
                    <Globe size={16} />
                    <span>Global Network | Q1 2026</span>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card card-glass">
                        <div className="stat-top">
                            <div className="stat-icon-wrapper">{stat.icon}</div>
                            <div className={`growth-badge ${stat.isUp ? 'up' : 'down'}`}>
                                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.growth}
                            </div>
                        </div>
                        <div className="stat-main">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Line Chart: Revenue Trend */}
                <div className="chart-wrapper card-glass">
                    <div className="card-header">
                        <div className="header-info">
                            <h3>Financial Yield Trend</h3>
                            <span className="subtitle">Net revenue growth by month (Global YTD)</span>
                        </div>
                        <Target size={18} className="text-muted" />
                    </div>
                    <div className="chart-container">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="revenue-chart">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--primary-orange)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="var(--primary-orange)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            {gridLines.map(line => (
                                <line
                                    key={line}
                                    x1="0" y1={100 - line}
                                    x2="100" y2={100 - line}
                                    stroke="var(--neutral-100)"
                                    strokeWidth="0.5"
                                />
                            ))}
                            <path
                                d={`M 0,100 L 0,${100 - revenueData[0]} L ${points} L 100,100 Z`}
                                fill="url(#chartGradient)"
                            />
                            <polyline
                                fill="none"
                                stroke="var(--primary-orange)"
                                strokeWidth="2"
                                points={points}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="chart-x-axis">
                            {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map(m => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar Chart: Volume Distribution */}
                <div className="distribution-card card-glass">
                    <div className="card-header">
                        <div className="header-info">
                            <h3>Operational Throughput</h3>
                            <span className="subtitle">Containerized units (TEUs) & LCL Volume</span>
                        </div>
                        <Activity size={18} className="text-muted" />
                    </div>
                    <div className="bar-chart-container">
                        <div className="bars-area">
                            {volumeData.map((val, i) => (
                                <div key={i} className="bar-group">
                                    <div className="bar-fill" style={{ height: `${val}%` }}>
                                        <div className="bar-tooltip">{val} units</div>
                                    </div>
                                    <span className="bar-label">{volumeLabels[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-secondary">
                {/* Strategic Accounts */}
                <div className="modality-card card-glass">
                    <div className="card-header">
                        <div className="header-info">
                            <h3>Key Strategic Accounts</h3>
                            <span className="subtitle">High-yield partnership performance</span>
                        </div>
                        <PieChart size={18} className="text-muted" />
                    </div>
                    <div className="client-revenue-list">
                        {[
                            { name: 'Industrial Heavy Machinery', val: '$420k', pct: 85, color: 'var(--institutional-dark)' },
                            { name: 'TechExports S.A.', val: '$310k', pct: 65, color: '#334155' },
                            { name: 'Global Pharma Core', val: '$285k', pct: 58, color: '#475569' },
                            { name: 'AutoParts LatAm', val: '$190k', pct: 40, color: 'var(--primary-orange)' },
                            { name: 'Retail Logistics MX', val: '$150k', pct: 32, color: '#94a3b8' },
                        ].map((client, i) => (
                            <div key={i} className="client-rev-item">
                                <div className="client-rev-info">
                                    <span className="client-name">{client.name}</span>
                                    <span className="client-val">{client.val}</span>
                                </div>
                                <div className="rev-progress-bg">
                                    <div className="rev-progress-fill" style={{ width: `${client.pct}%`, backgroundColor: client.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="critical-ops-card card-glass">
                    <div className="card-header">
                        <div className="header-info">
                            <h3>Operational Risk Center</h3>
                            <span className="subtitle">Real-time deviation and cost alerts</span>
                        </div>
                        <AlertTriangle size={18} className="text-orange" />
                    </div>
                    <div className="mini-ops-list">
                        {[
                            { id: 'ACON-9481', client: 'Automotriz S.A.', risk: 'Critical', type: 'Port Congestion' },
                            { id: 'ACON-9485', client: 'PharmaCore', risk: 'Medium', type: 'Customs Hold' },
                            { id: 'ACON-9490', client: 'TechExports', risk: 'Low', type: 'Inspection' },
                        ].map((op, i) => (
                            <div key={i} className="mini-op-item">
                                <div className="op-main">
                                    <span className="op-id">{op.id}</span>
                                    <span className="op-client">{op.client}</span>
                                </div>
                                <div className="op-status">
                                    <span className="op-type">{op.type}</span>
                                    <div className={`risk-dot ${op.risk.toLowerCase()}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-black-small w-full mt-4">Access Risk Management</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
