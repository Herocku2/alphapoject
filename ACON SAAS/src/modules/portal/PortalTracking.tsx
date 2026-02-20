import React from 'react';
import {
    FileText,
    Download
} from 'lucide-react';
import { getMockOperations } from './PortalService';

const PortalTracking: React.FC = () => {
    const operations = getMockOperations();
    const op = operations[0]; // Tracking the main one

    return (
        <div className="portal-tracking">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>

                {/* Visual Tracking Map/Timeline */}
                <div className="tracking-main">
                    <div className="portal-table-section" style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <div>
                                <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Referencia de Operación</h4>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{op.id} <span style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: 400 }}>• {op.serviceType.toUpperCase()}</span></h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>ETA Estimada</h4>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{op.eta}</h3>
                            </div>
                        </div>

                        {/* Visual Timeline */}
                        <div className="tracking-viz" style={{ padding: '40px 0', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                {/* Background Line */}
                                <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '4px', backgroundColor: '#f1f5f9', zIndex: 1 }}></div>
                                <div style={{ position: 'absolute', top: '15px', left: '0', width: `${op.progressPct}%`, height: '4px', backgroundColor: '#3b82f6', zIndex: 2, transition: 'width 1s ease' }}></div>

                                {op.milestones.map((m) => (
                                    <div key={m.id} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: m.completed ? '#3b82f6' : 'white',
                                            border: `4px solid ${m.completed ? '#dbeafe' : '#f1f5f9'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            marginBottom: '12px'
                                        }}>
                                            {m.completed && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></div>}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', color: m.completed ? '#1e293b' : '#94a3b8' }}>{m.label}</span>
                                        {m.date && <span style={{ fontSize: '0.625rem', color: '#64748b', marginTop: '4px' }}>{m.date}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Milestones Detailed Log */}
                    <div className="portal-table-section">
                        <h3>Bitácora de Eventos</h3>
                        <div className="event-log" style={{ marginTop: '24px' }}>
                            {op.milestones.map((m, idx) => (
                                <div key={m.id} style={{ display: 'flex', gap: '24px', paddingBottom: '24px', position: 'relative' }}>
                                    {idx !== op.milestones.length - 1 && <div style={{ position: 'absolute', top: '30px', left: '11px', bottom: '0', width: '2px', backgroundColor: '#f1f5f9' }}></div>}
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: m.completed ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: m.completed ? '#10b981' : '#94a3b8' }}></div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: m.completed ? '#1e293b' : '#94a3b8' }}>{m.label}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.completed ? '05 Feb, 14:30' : 'Pendiente'}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>{m.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Digital Documents */}
                <div className="tracking-sidebar">
                    <div className="portal-table-section" style={{ height: '100%', border: 'none', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <FileText size={20} className="text-primary-600" />
                            <h3>Documentación</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {op.documents.map(doc => (
                                <div key={doc.id} style={{ padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                        <FileText size={18} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{doc.name}</div>
                                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{doc.type} • {doc.uploadDate}</div>
                                    </div>
                                    <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Download size={18} /></button>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px dashed #3b82f6' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#1e40af', textAlign: 'center', fontWeight: 600 }}>¿Necesitas subir un documento?</p>
                            <button style={{ width: '100%', marginTop: '12px', padding: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Cargar Archivo</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PortalTracking;
