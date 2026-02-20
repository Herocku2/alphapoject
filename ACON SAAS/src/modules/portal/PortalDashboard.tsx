import React from 'react';
import {
    FileText,
    Ship,
    AlertCircle,
    ArrowRight,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { getMockOperations, getClientData, getMockClientNotifications } from './PortalService';

const PortalDashboard: React.FC = () => {
    const data = getClientData();
    const operations = getMockOperations();
    const notifications = getMockClientNotifications();

    return (
        <div className="portal-dashboard">
            {/* KPI Cards */}
            <div className="portal-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue"><FileText size={24} /></div>
                    <div className="stat-info">
                        <h4>Cotizaciones Activas</h4>
                        <div className="stat-val">{data.stats.activeQuotes}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><Ship size={24} /></div>
                    <div className="stat-info">
                        <h4>Operaciones en Curso</h4>
                        <div className="stat-val">{data.stats.ongoingOps}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange"><AlertCircle size={24} /></div>
                    <div className="stat-info">
                        <h4>Docs. Pendientes</h4>
                        <div className="stat-val">{data.stats.pendingDocs}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                {/* Active Operations List */}
                <div className="portal-table-section">
                    <div className="section-header">
                        <h3>Tracking de Operaciones</h3>
                        <span className="view-all">Ver todas <ArrowRight size={14} /></span>
                    </div>

                    <div className="op-mini-list">
                        {operations.map(op => (
                            <div key={op.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                    <Ship size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{op.id}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ETA: {op.eta}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{op.origin} → {op.destination}</div>
                                    <div style={{ marginTop: '8px', height: '4px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${op.progressPct}%`, backgroundColor: '#3b82f6' }}></div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>{op.currentStage}</div>
                                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{op.progressPct}% completado</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="portal-table-section" style={{ backgroundColor: '#f8fafc', border: 'none' }}>
                    <div className="section-header">
                        <h3>Centro de Alertas</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {notifications.map(n => (
                            <div key={n.id} style={{ padding: '16px', backgroundColor: 'white', borderRadius: '12px', borderLeft: `4px solid ${n.type === 'success' ? '#10b981' : '#3b82f6'}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {n.type === 'success' ? <CheckCircle2 size={16} color="#10b981" /> : <Clock size={16} color="#3b82f6" />}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '2px' }}>{n.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>{n.message}</div>
                                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '8px' }}>hace 10 minutos</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8125rem', color: '#64748b', cursor: 'pointer' }}>
                        Limpiar Notificaciones
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortalDashboard;
