import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Plus,
    TrendingUp,
    MapPin,
    MoreVertical,
    X,
    CheckCircle2,
    FileText,
    Send,
    ArrowLeft,
    ArrowRight,
    Save,
    Box,
    ShieldCheck,
    Cpu,
    Zap,
    Sparkles
} from 'lucide-react';
import './CRM.css';

const CRM: React.FC = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [docsUploaded, setDocsUploaded] = useState({
        csf: false,
        address: false,
        act: false,
        id: false
    });

    const [clientList, setClientList] = useState([
        { id: 1, name: 'Industrial Heavy Machinery S.A.', type: 'Importador', routes: 'SHA-MAN, HAM-VER', profit: '$115,400', status: 'active', score: 92 },
        { id: 2, name: 'AgroExportadora del Norte', type: 'Exportador', routes: 'GUA-LAX, GUA-MIA', profit: '$84,200', status: 'active', score: 88 },
        { id: 3, name: 'TechLogistics Solutions', type: 'Importador', routes: 'SZX-MEX, ICN-MEX', profit: '$222,100', status: 'warning', score: 45 },
        { id: 4, name: 'Automotriz del Bajío', type: 'Importador', routes: 'NAGO-LZC, DET-MEX', profit: '$340,500', status: 'active', score: 95 },
        { id: 5, name: 'PharmaCore Internacional', type: 'Importador', routes: 'FRA-MEX, BRU-MEX', profit: '$198,000', status: 'active', score: 91 },
        { id: 6, name: 'Global Retail & Fashion', type: 'Importador', routes: 'BKK-MAN, HKG-MAN', profit: '$156,700', status: 'warning', score: 58 },
        { id: 7, name: 'Minería del Sur S.A.', type: 'Exportador', routes: 'MEX-ROT, LZC-SHA', profit: '$412,000', status: 'active', score: 89 },
        { id: 8, name: 'Electronic Parts Depot', type: 'Importador', routes: 'SFO-MEX, PVG-MEX', profit: '$76,400', status: 'active', score: 72 },
        { id: 9, name: 'Bebidas Mundiales S.A.', type: 'Exportador', routes: 'MEX-MAD, MEX-BCN', profit: '$124,300', status: 'active', score: 85 },
        { id: 10, name: 'Textiles del Istmo', type: 'Exportador', routes: 'VER-BAL, VER-NYC', profit: '$54,200', status: 'warning', score: 52 },
    ]);

    const [newClientData, setNewClientData] = useState({
        name: '',
        rfc: '',
        giro: 'Logística',
        contact: '',
        country: 'México'
    });

    const handleFinishOnboarding = () => {
        const newClient = {
            id: clientList.length + 1,
            name: newClientData.name || 'Nuevo Cliente Propuesto',
            type: 'Importador',
            routes: 'Por definir',
            profit: '$0',
            status: 'active',
            score: 0
        };

        setClientList([newClient, ...clientList]);
        setIsOnboardingOpen(false);
        setOnboardingStep(1);
        setDocsUploaded({ csf: false, address: false, act: false, id: false });
        setNewClientData({ name: '', rfc: '', giro: 'Logística', contact: '', country: 'México' });
    };

    const toggleDoc = (doc: keyof typeof docsUploaded) => {
        const newState = !docsUploaded[doc];
        setDocsUploaded(prev => ({ ...prev, [doc]: newState }));

        // AI Auto-fill Simulation
        if (newState && (doc === 'csf' || doc === 'act')) {
            // Trigger auto-fill if not already filled
            if (!newClientData.name || !newClientData.rfc) {
                setTimeout(() => {
                    setNewClientData(prev => ({
                        ...prev,
                        name: doc === 'csf' ? 'LOGÍSTICA INTEGRAL MÉXICO S.A.' : 'INDUSTRIAL HEAVY MACHINERY S.A.',
                        rfc: doc === 'csf' ? 'LIM120524ABC' : 'IHM980715H42',
                        contact: 'Lic. Ricardo Arona'
                    }));
                    // Optionally move to step 1 to show results or just notify
                }, 800);
            }
        }
    };

    return (
        <>
            <div className="crm-container animate-fade-in">
                <div className="crm-header">
                    <div>
                        <h1>CRM Logístico</h1>
                        <p>Gestiona tus clientes y maximiza la rentabilidad por operación.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsOnboardingOpen(true)}>
                        <Plus size={18} />
                        <span>Nuevo Cliente</span>
                    </button>
                </div>

                <div className="crm-stats-grid">
                    <div className="crm-stat-card">
                        <div className="stat-icon blue"><Users size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Clientes Totales</span>
                            <span className="stat-value">124</span>
                        </div>
                    </div>
                    <div className="crm-stat-card">
                        <div className="stat-icon green"><TrendingUp size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Rentabilidad Promedio</span>
                            <span className="stat-value">18.4%</span>
                        </div>
                    </div>
                    <div className="crm-stat-card">
                        <div className="stat-icon orange"><MapPin size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Rutas Activas</span>
                            <span className="stat-value">42</span>
                        </div>
                    </div>
                </div>

                <div className="crm-content card-glass">
                    <div className="content-filters">
                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                                onClick={() => setActiveTab('active')}
                            >
                                Clientes Activos
                            </button>
                            <button
                                className={`tab ${activeTab === 'inactive' ? 'active' : ''}`}
                                onClick={() => setActiveTab('inactive')}
                            >
                                Inactivos
                            </button>
                        </div>
                        <div className="search-box">
                            <Search size={18} />
                            <input type="text" placeholder="Filtrar por nombre, tipo o ruta..." />
                        </div>
                        <button className="btn-filter">
                            <Filter size={18} />
                            <span>Filtros</span>
                        </button>
                    </div>

                    <div className="client-table">
                        <div className="table-header">
                            <span>Cliente</span>
                            <span>Tipo</span>
                            <span>Rutas Frecuentes</span>
                            <span>Rentabilidad (YTD)</span>
                            <span>Prob. Cierre (IA)</span>
                            <span>Acciones</span>
                        </div>
                        {clientList.map(client => (
                            <div key={client.id} className="table-row">
                                <div className="client-info">
                                    <div className="client-avatar">{client.name.charAt(0)}</div>
                                    <div className="client-details">
                                        <span className="client-name">{client.name}</span>
                                        <span className="client-id">ID: #C-102{client.id}</span>
                                    </div>
                                </div>
                                <div className="client-type-badge">{client.type}</div>
                                <div className="client-routes">{client.routes}</div>
                                <div className="client-profit">{client.profit}</div>
                                <div className="client-score">
                                    <div className="score-bar-bg">
                                        <div className={`score-bar-fill ${client.status}`} style={{ width: `${client.score}%` }}></div>
                                    </div>
                                    <span className="score-text">{client.score}%</span>
                                </div>
                                <div className="client-actions">
                                    <button className="icon-btn-small"><MoreVertical size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isOnboardingOpen && (
                <div className="onboarding-overlay">
                    <div className="onboarding-modal animate-slide-up">
                        <div className="onboarding-header">
                            <div className="header-info">
                                <h2>
                                    <Sparkles className="text-orange" size={28} />
                                    Alta de Nuevo Cliente
                                    <span className="ai-badge-premium">Powered by AI</span>
                                </h2>
                                <p>Configura el perfil comercial y legal del cliente con asistencia inteligente.</p>
                            </div>
                            <button className="icon-btn-small" style={{ color: 'white' }} onClick={() => setIsOnboardingOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="onboarding-steps-indicator">
                            <div className={`ind-step ${onboardingStep === 1 ? 'active' : ''}`}>1. Perfil Comercial</div>
                            <div className={`ind-line ${onboardingStep >= 2 ? 'active' : ''}`}></div>
                            <div className={`ind-step ${onboardingStep === 2 ? 'active' : ''}`}>2. Expediente Digital</div>
                            <div className={`ind-line ${onboardingStep >= 3 ? 'active' : ''}`}></div>
                            <div className={`ind-step ${onboardingStep === 3 ? 'active' : ''}`}>3. Cumplimiento & Firma</div>
                        </div>

                        <div className="onboarding-content">
                            {onboardingStep === 1 && (
                                <div className="step-1 animate-fade-in step-inner-container">
                                    <h3 className="sub-title-premium">Información General</h3>
                                    <div className="input-grid-premium">
                                        <div className="field-group">
                                            <label>Razón Social</label>
                                            <input
                                                type="text"
                                                placeholder="Ej. Industrial Heavy Machinery S.A."
                                                value={newClientData.name}
                                                onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="field-group">
                                            <label>RFC / TAX ID</label>
                                            <input
                                                type="text"
                                                placeholder="ABC123456XYZ"
                                                value={newClientData.rfc}
                                                onChange={(e) => setNewClientData({ ...newClientData, rfc: e.target.value })}
                                            />
                                        </div>
                                        <div className="field-group">
                                            <label>País de Operación</label>
                                            <input
                                                type="text"
                                                placeholder="Ej. México"
                                                value={newClientData.country}
                                                onChange={(e) => setNewClientData({ ...newClientData, country: e.target.value })}
                                            />
                                        </div>
                                        <div className="field-group">
                                            <label>Contacto Principal</label>
                                            <input
                                                type="text"
                                                placeholder="Nombre del tomador de decisiones"
                                                value={newClientData.contact}
                                                onChange={(e) => setNewClientData({ ...newClientData, contact: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="sub-title-premium" style={{ marginTop: '32px' }}>Giro Comercial</h3>
                                    <div className="sector-grid">
                                        {[
                                            { id: 'Pharma', icon: <ShieldCheck size={20} />, label: 'Pharma' },
                                            { id: 'Tech', icon: <Cpu size={20} />, label: 'Tech' },
                                            { id: 'Retail', icon: <Box size={20} />, label: 'Retail' },
                                            { id: 'Industrial', icon: <Zap size={20} />, label: 'Industrial' },
                                        ].map(sector => (
                                            <div
                                                key={sector.id}
                                                className={`sector-card ${newClientData.giro === sector.id ? 'active' : ''}`}
                                                onClick={() => setNewClientData({ ...newClientData, giro: sector.id })}
                                            >
                                                <div className="icon-wrap">{sector.icon}</div>
                                                <span className="sector-name">{sector.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {onboardingStep === 2 && (
                                <div className="step-2 animate-fade-in step-inner-container">
                                    <h3 className="sub-title-premium">Expediente Digital por IA</h3>
                                    <div className="doc-upload-grid">
                                        {[
                                            { id: 'csf', label: 'CSF (Constancia Fiscal)', desc: 'Validación SAT automática' },
                                            { id: 'address', label: 'Comprobante de Domicilio', desc: 'Recibo CFE, IZZI o Predial' },
                                            { id: 'act', label: 'Acta Constitutiva', desc: 'Con Registro Público y Poderes' },
                                            { id: 'id', label: 'Identificación RL', desc: 'INE o Pasaporte vigente' },
                                        ].map(doc => (
                                            <div
                                                key={doc.id}
                                                className={`doc-card ${docsUploaded[doc.id as keyof typeof docsUploaded] ? 'uploaded' : ''}`}
                                                onClick={() => toggleDoc(doc.id as keyof typeof docsUploaded)}
                                            >
                                                <div className="doc-icon"><FileText size={24} /></div>
                                                <div className="doc-info">
                                                    <span className="doc-label">{doc.label}</span>
                                                    <span className="doc-desc">{doc.desc}</span>
                                                </div>
                                                <div className="doc-status">
                                                    {docsUploaded[doc.id as keyof typeof docsUploaded] ?
                                                        <CheckCircle2 size={24} className="text-green" /> :
                                                        <div className="upload-btn-mini"><Plus size={16} /></div>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {onboardingStep === 3 && (
                                <div className="step-3 animate-fade-in step-inner-container">
                                    <h3 className="sub-title-premium">Contratos & Shielding Legal</h3>
                                    <div className="contract-preview-area">
                                        <div className="contract-status-card">
                                            <div className="status-header">
                                                <span className="ai-badge-premium">Redacción IA</span>
                                                <h3>Contrato de Prestación de Servicios Logísticos</h3>
                                            </div>
                                            <p>Cláusulas personalizadas según giro {newClientData.giro} detectado para {newClientData.name || 'el prospecto'}.</p>
                                            <div className="contract-actions">
                                                <button className="btn-premium-back" style={{ padding: '8px 16px', fontSize: '12px' }}><FileText size={16} /> Ver PDF</button>
                                                <button className="btn-premium-finish" style={{ padding: '8px 16px', fontSize: '12px', background: '#25D366' }} onClick={() => alert('Contrato enviado por WhatsApp a ' + (newClientData.contact || 'contacto'))}><Zap size={16} /> WhatsApp</button>
                                                <button className="btn-premium-finish" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => alert('Contrato enviado por Email a ' + (newClientData.contact || 'contacto'))}><Send size={16} /> Email</button>
                                            </div>
                                        </div>
                                        <div className="contract-status-card mt-6">
                                            <div className="status-header">
                                                <span className="ai-badge-premium">Privacy Core</span>
                                                <h3>NDA (Convenio de Confidencialidad)</h3>
                                            </div>
                                            <p>Protección inmutable de datos comerciales y tarifarios para {newClientData.name || 'el cliente'}.</p>
                                            <div className="contract-actions">
                                                <button className="btn-premium-back" style={{ padding: '8px 16px', fontSize: '12px' }}><FileText size={16} /> Ver PDF</button>
                                                <button className="btn-premium-finish" style={{ padding: '8px 16px', fontSize: '12px', background: '#25D366' }} onClick={() => alert('NDA enviado por WhatsApp')}><Zap size={16} /> WhatsApp</button>
                                                <button className="btn-premium-finish" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => alert('NDA enviado por Email')}><Send size={16} /> Email</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="onboarding-footer">
                            {onboardingStep > 1 ? (
                                <button className="btn-premium-back" onClick={() => setOnboardingStep(onboardingStep - 1)}>
                                    <ArrowLeft size={18} />
                                    <span>Paso Anterior</span>
                                </button>
                            ) : (
                                <div />
                            )}

                            {onboardingStep < 3 ? (
                                <button className="btn-premium-next" onClick={() => setOnboardingStep(onboardingStep + 1)}>
                                    <span>Continuar</span>
                                    <ArrowRight size={20} />
                                </button>
                            ) : (
                                <button className="btn-premium-finish" onClick={handleFinishOnboarding}>
                                    <Save size={20} />
                                    <span>Finalizar Alta de Cliente</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CRM;
