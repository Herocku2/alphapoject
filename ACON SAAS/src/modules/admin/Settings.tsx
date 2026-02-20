import React, { useState } from 'react';
import {
    Shield,
    Percent,
    Plus,
    ArrowRight,
    Scale,
    DollarSign,
    RefreshCw,
    Search,
    History,
    Download,
    X,
    CheckCircle2
} from 'lucide-react';
import { getAuditLogs, exportAuditLogs } from '../quoter/AuditService';
import './Settings.css';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;
    return (
        <div className="settings-overlay">
            <div className="settings-modal animate-slide-up">
                <div className="modal-header">
                    <h2>{icon} {title}</h2>
                    <button className="icon-btn-small" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="btn-outline-small" onClick={onClose}>Cancelar</button>
                    <button className="btn-primary" onClick={onClose}>Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};

const Settings: React.FC = () => {
    const [activeSetting, setActiveSetting] = useState<string | null>(null);

    const renderRoles = () => (
        <div className="roles-content">
            <div className="section-header">
                <h3>Gestión de Usuarios y Accesos</h3>
                <button className="btn-primary-small"><Plus size={16} /> Nuevo Usuario</button>
            </div>
            <div className="settings-table">
                <div className="table-header" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 100px' }}>
                    <span>Nombre / Email</span>
                    <span>Rol Asignado</span>
                    <span>Último Acceso</span>
                    <span>Acciones</span>
                </div>
                {[
                    { name: 'Enrique Cobian', email: 'enrique@acon.com', role: 'Administrador', last: 'Ahora', badge: 'role-admin' },
                    { name: 'Ana Garcia', email: 'ana.g@acon.com', role: 'Ventas Senior', last: 'Hace 2h', badge: 'role-sales' },
                    { name: 'Carlos Ruiz', email: 'c.ruiz@acon.com', role: 'Operaciones', last: 'Ayer', badge: 'role-ops' },
                    { name: 'Sofia Mendez', email: 's.mendez@acon.com', role: 'Legal & Compliance', last: 'Hace 3d', badge: 'role-legal' },
                ].map((user, i) => (
                    <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 100px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="font-600">{user.name}</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</span>
                        </div>
                        <div><span className={`user-role-badge ${user.badge}`}>{user.role}</span></div>
                        <span style={{ fontSize: '13px' }}>{user.last}</span>
                        <button className="btn-outline-small">Editar</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderMargins = () => (
        <div className="margins-content">
            <div className="fx-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ margin: 0, color: 'white' }}>Margen Global de Utilidad</h4>
                        <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '13px' }}>Basado en el rendimiento YTD</p>
                    </div>
                    <span style={{ fontSize: '32px', fontWeight: 800 }}>18.5%</span>
                </div>
            </div>
            <div className="settings-input-grid">
                <div className="settings-field">
                    <label>Transporte Marítimo (FCL)</label>
                    <input type="text" defaultValue="15%" />
                </div>
                <div className="settings-field">
                    <label>Transporte Marítimo (LCL)</label>
                    <input type="text" defaultValue="22%" />
                </div>
                <div className="settings-field">
                    <label>Carga Aérea</label>
                    <input type="text" defaultValue="12%" />
                </div>
                <div className="settings-field">
                    <label>Terrestre Nacional</label>
                    <input type="text" defaultValue="18%" />
                </div>
                <div className="settings-field">
                    <label>Seguro de Carga</label>
                    <input type="text" defaultValue="10%" />
                </div>
                <div className="settings-field">
                    <label>Gastos en Origen / Destino</label>
                    <input type="text" defaultValue="20%" />
                </div>
            </div>
        </div>
    );

    const renderLegal = () => (
        <div className="legal-content">
            <div className="legal-clause-card">
                <h4>
                    <span>Términos y Condiciones (SaaS)</span>
                    <CheckCircle2 className="text-green" size={18} />
                </h4>
                <p>Define la relación legal entre ACON y el cliente, incluyendo uso del software, propiedad intelectual y límites de responsabilidad.</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <span className="code-badge">v2.4.1</span>
                    <span className="code-badge">Inmutable</span>
                </div>
            </div>
            <div className="legal-clause-card">
                <h4>
                    <span>NDA Standard Logístico</span>
                    <CheckCircle2 className="text-green" size={18} />
                </h4>
                <p>Acuerdo de confidencialidad para la protección de tarifas y rutas estratégicas de los clientes.</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <span className="code-badge">v1.2.0</span>
                    <span className="code-badge">Activo</span>
                </div>
            </div>
            <div className="legal-clause-card">
                <h4>
                    <span>Disclaimer de Tarifas Volátiles</span>
                    <CheckCircle2 className="text-green" size={18} />
                </h4>
                <p>Cláusula de protección ante cambios imprevistos en fletes marítimos (BAF/CAF).</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <span className="code-badge">v3.0.0</span>
                    <span className="code-badge">Mandatorio</span>
                </div>
            </div>
        </div>
    );

    const renderFX = () => (
        <div className="fx-content">
            <div className="fx-card" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div className="icon-box" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, color: 'white' }}>Moneda Base del Sistema</h4>
                        <span style={{ fontSize: '24px', fontWeight: 800 }}>USD - United States Dollar</span>
                    </div>
                </div>
            </div>
            <h4 className="sub-title-premium">Colchones Cambiarios (Hedge Margin)</h4>
            <div className="settings-input-grid">
                <div className="settings-field">
                    <label>Margen de Protección USD/MXN</label>
                    <input type="text" defaultValue="+1.5%" />
                </div>
                <div className="settings-field">
                    <label>Margen de Protección USD/EUR</label>
                    <input type="text" defaultValue="+0.5%" />
                </div>
                <div className="settings-field">
                    <label>Frecuencia de Actualización</label>
                    <select defaultValue="1h">
                        <option value="15m">Cada 15 minutos</option>
                        <option value="1h">Cada 1 hora</option>
                        <option value="1d">Diario</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderAuditoria = () => (
        <div className="auditoria-content">
            <div className="section-header">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Buscar por ID, Usuario o Acción..." />
                </div>
                <button className="btn-outline-small" onClick={exportAuditLogs}><Download size={16} /> Exportar CSV</button>
            </div>
            <div className="settings-table">
                <div className="table-header" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr 100px' }}>
                    <span>Timestamp</span>
                    <span>Usuario</span>
                    <span>Módulo</span>
                    <span>Detalle de la Acción</span>
                    <span>Impacto</span>
                </div>
                {getAuditLogs().reverse().slice(0, 5).map((log, i) => (
                    <div key={i} className="table-row" style={{ gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr 100px', fontSize: '13px' }}>
                        <span className="font-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span>{log.userName}</span>
                        <span className="code-badge">{log.details.split(' ')[0]}</span>
                        <span style={{ color: '#64748b' }}>{log.action} en {log.details}</span>
                        <span className={`badge ${log.severity === 'info' ? 'success' : 'warning'}`}>{log.severity.toUpperCase()}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const getCurrentModalProps = () => {
        switch (activeSetting) {
            case 'roles': return { title: 'Roles y Permisos', icon: <Shield size={24} className="text-primary-600" />, content: renderRoles() };
            case 'margins': return { title: 'Márgenes y Tarifas', icon: <Percent size={24} className="text-green" />, content: renderMargins() };
            case 'legal': return { title: 'Blindaje Legal', icon: <Scale size={24} className="text-orange" />, content: renderLegal() };
            case 'fx': return { title: 'Multimoneda & FX', icon: <DollarSign size={24} className="text-yellow" />, content: renderFX() };
            case 'auditoria': return { title: 'Compliance & Auditoría', icon: <History size={24} className="text-red" />, content: renderAuditoria() };
            default: return null;
        }
    };

    const modalProps = getCurrentModalProps();

    return (
        <div className="settings-container animate-fade-in">
            <div className="settings-header">
                <h1>Configuración del Sistema</h1>
                <p>Ajusta parámetros operativos, márgenes y permisos globales.</p>
            </div>

            <div className="settings-grid">
                <div className="settings-card card-glass" onClick={() => setActiveSetting('roles')}>
                    <div className="card-header">
                        <div className="icon-box blue"><Shield size={20} /></div>
                        <h3>Roles y Permisos</h3>
                    </div>
                    <p className="card-desc">Gestiona usuarios y niveles de acceso (Ventas, Operaciones, Dirección).</p>
                    <div className="card-action">
                        <span>12 Usuarios Activos</span>
                        <div className="btn-small"><ArrowRight size={16} /></div>
                    </div>
                </div>

                <div className="settings-card card-glass" onClick={() => setActiveSetting('margins')}>
                    <div className="card-header">
                        <div className="icon-box green"><Percent size={20} /></div>
                        <h3>Márgenes y Tarifas</h3>
                    </div>
                    <p className="card-desc">Configura márgenes por defecto por tipo de flete y recargos fijos.</p>
                    <div className="card-action">
                        <span>Margen Global: 18%</span>
                        <div className="btn-small"><ArrowRight size={16} /></div>
                    </div>
                </div>

                <div className="settings-card card-glass" onClick={() => setActiveSetting('legal')}>
                    <div className="card-header">
                        <div className="icon-box orange"><Scale size={20} /></div>
                        <h3>Blindaje Legal</h3>
                    </div>
                    <p className="card-desc">Administra disclaimers, términos de servicio y cláusulas de responsabilidad.</p>
                    <div className="card-action">
                        <span className="text-primary-600">6 Cláusulas Activas</span>
                        <div className="btn-small"><ArrowRight size={16} /></div>
                    </div>
                </div>

                <div className="settings-card card-glass" onClick={() => setActiveSetting('fx')}>
                    <div className="card-header">
                        <div className="icon-box yellow"><DollarSign size={20} /></div>
                        <h3>Multimoneda & FX</h3>
                    </div>
                    <p className="card-desc">Define moneda base, fuentes de tipo de cambio y colchones cambiarios.</p>
                    <div className="card-action">
                        <span>Base: USD • 4 Currencies</span>
                        <div className="btn-small"><ArrowRight size={16} /></div>
                    </div>
                </div>

                <div className="settings-card card-glass" onClick={() => setActiveSetting('auditoria')}>
                    <div className="card-header">
                        <div className="icon-box red"><History size={20} /></div>
                        <h3>Compliance & Auditoría</h3>
                    </div>
                    <p className="card-desc">Trazabilidad inmutable de todas las acciones críticas del sistema.</p>
                    <div className="card-action">
                        <span className="text-red font-700">Audit Log Activo</span>
                        <div className="btn-small"><ArrowRight size={16} /></div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={!!activeSetting}
                onClose={() => setActiveSetting(null)}
                title={modalProps?.title || ''}
                icon={modalProps?.icon}
            >
                {modalProps?.content}
            </Modal>

            <div className="settings-section card-glass">
                <div className="section-header">
                    <h3>Variables de Cotización</h3>
                    <button className="btn-outline-small">
                        <Plus size={14} />
                        <span>Nuevo Recargo</span>
                    </button>
                </div>
                <div className="settings-table">
                    <div className="table-header">
                        <span>Nombre del Recargo</span>
                        <span>Abreviatura</span>
                        <span>Tipo</span>
                        <span>Valor Sugerido</span>
                    </div>
                    {[
                        { name: 'Bunker Adjustment Factor', code: 'BAF', type: 'Variable', value: '$150 USD' },
                        { name: 'Currency Adjustment Factor', code: 'CAF', type: 'Variable', value: '3.5%' },
                        { name: 'Terminal Handling Charge', code: 'THC', type: 'Fixed', value: '$350 USD' },
                    ].map((row, i) => (
                        <div key={i} className="table-row">
                            <span className="font-600">{row.name}</span>
                            <span className="code-badge">{row.code}</span>
                            <span>{row.type}</span>
                            <span className="font-700">{row.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="settings-section card-glass" style={{ marginTop: '32px' }}>
                <div className="section-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RefreshCw size={18} /> Tipos de Cambio en Tiempo Real</h3>
                    <button className="btn-outline-small">Actualizar API</button>
                </div>
                <div className="settings-table">
                    <div className="table-header">
                        <span>Par de Monedas</span>
                        <span>Valor de Mercado</span>
                        <span>Colchón Operativo</span>
                        <span>TC Aplicado ADI</span>
                    </div>
                    {[
                        { pair: 'USD / MXN', market: '20.45', hedge: '+1.5%', applied: '20.75' },
                        { pair: 'USD / EUR', market: '0.92', hedge: '+0.5%', applied: '0.925' },
                        { pair: 'EUR / MXN', market: '22.20', hedge: '+2.0%', applied: '22.64' },
                    ].map((row, i) => (
                        <div key={i} className="table-row">
                            <span className="font-600">{row.pair}</span>
                            <span>{row.market}</span>
                            <span className="text-warning">{row.hedge}</span>
                            <span className="font-700 text-primary-600">{row.applied}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
