import React, { useState } from 'react';
import {
    Search,
    Upload,
    Ship,
    Plane,
    Truck,
    Bot,
    CheckCircle2,
    Info,
    Save,
    X
} from 'lucide-react';
import './VendorPricing.css';

const VendorPricing: React.FC = () => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState('maritime');

    const runAIExtraction = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);
        }, 2500);
    };

    const vendorRatesByModality: Record<string, any[]> = {
        maritime: [
            { id: 1, vendor: 'MSC (Mediterranean Shipping)', route: 'Shanghai → Manzanillo', type: '40HC', rate: '$1,450', validity: '2024-06-30', concepts: 'Flete + BAF + THC' },
            { id: 2, vendor: 'Maersk Line', route: 'Ningbo → Veracruz', type: '20ST', rate: '$1,100', validity: '2024-05-15', concepts: 'Flete + PSS + Bunker' },
            { id: 3, vendor: 'CMA CGM', route: 'Qingdao → Lázaro Cárdenas', type: '40ST', rate: '$1,320', validity: '2024-07-01', concepts: 'Flete + GRI' },
        ],
        air: [
            { id: 10, vendor: 'Cargolux', route: 'HKG → MEX', type: 'Per Kg (Min 500)', rate: '$4.20', validity: '2024-04-10', concepts: 'Rate + FSC + SSC' },
            { id: 11, vendor: 'Lufthansa Cargo', route: 'FRA → MEX', type: 'General Cargo', rate: '$3.85', validity: '2024-03-20', concepts: 'Rate + Fuel + Security' },
            { id: 12, vendor: 'DHL Aviation', route: 'CIN → GDL', type: 'Express Cargo', rate: '$6.50', validity: '2024-05-05', concepts: 'All-in' },
        ],
        land: [
            { id: 20, vendor: 'Traxion Land', route: 'Laredo → Monterrey', type: 'Caja 53"', rate: '$1,200', validity: '2024-12-31', concepts: 'Flete + Cruce + GPS', currency: 'USD' },
            { id: 21, vendor: 'Schneider National', route: 'Chicago → Nuevo Laredo', type: 'FTL Flatbed', rate: '$2,800', validity: '2024-06-15', concepts: 'Flete + Fuel Surcharge', currency: 'USD' },
            { id: 22, vendor: 'TUM Logística', route: 'Veracruz → CDMX', type: 'FCL 40\'', rate: '$18,500', validity: '2024-08-20', concepts: 'Flete + Maniobras', currency: 'MXN' },
            { id: 23, vendor: 'Transportes Castores', route: 'Manzanillo → Guadalajara', type: 'FCL 20\'', rate: '$12,400', validity: '2024-09-15', concepts: 'Flete Door-to-Door', currency: 'MXN' },
        ]
    };

    const currentRates = vendorRatesByModality[activeTab] || vendorRatesByModality.maritime;

    return (
        <div className="vpricing-container animate-fade-in">
            <div className="vpricing-header">
                <div>
                    <h1>Tarifario de Proveedores</h1>
                    <p>Gestiona y automatiza tarifas de navieras, aerolíneas y transportistas mediante IA.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsWizardOpen(true)}>
                    <Upload size={18} />
                    <span>Cargar Tarifas (AI)</span>
                </button>
            </div>

            <div className="vpricing-tabs card-glass">
                <div className="modality-selector">
                    <button className={`mod-btn ${activeTab === 'maritime' ? 'active' : ''}`} onClick={() => setActiveTab('maritime')}>
                        <Ship size={18} />
                        <span>Navieras (FCL/LCL)</span>
                    </button>
                    <button className={`mod-btn ${activeTab === 'air' ? 'active' : ''}`} onClick={() => setActiveTab('air')}>
                        <Plane size={18} />
                        <span>Aéreo (Líneas)</span>
                    </button>
                    <button className={`mod-btn ${activeTab === 'land' ? 'active' : ''}`} onClick={() => setActiveTab('land')}>
                        <Truck size={18} />
                        <span>Terrestre</span>
                    </button>
                </div>

                <div className="pricing-filters">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Buscar por proveedor o ruta..." />
                    </div>
                </div>

                <div className="v-table">
                    <div className="v-header">
                        <span>Proveedor</span>
                        <span>Ruta</span>
                        <span>Conceptos / Equipo</span>
                        <span>Costo Base</span>
                        <span>Vigencia</span>
                        <span>Estado IA</span>
                    </div>
                    {currentRates.map(rate => (
                        <div key={rate.id} className="v-row">
                            <span className="v-name">{rate.vendor}</span>
                            <span className="v-route">{rate.route}</span>
                            <span className="v-type" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rate.concepts || rate.type}</span>
                            <span className="v-rate">{rate.rate} <small style={{ opacity: 0.6 }}>{rate.currency || 'USD'}</small></span>
                            <span className="v-validity">{rate.validity}</span>
                            <span className="v-status"><CheckCircle2 size={14} color="#10B981" /> Sincronizado</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Upload Wizard */}
            {isWizardOpen && (
                <div className="wizard-overlay">
                    <div className="wizard-modal animate-slide-up">
                        <div className="wizard-header">
                            <div>
                                <h2>Carga Inteligente de Tarifas <span className="ai-badge">AI Powered</span></h2>
                                <p>Sube tus archivos XML, CSV o PDF para que la IA extraiga los costos automáticamente.</p>
                            </div>
                            <button className="icon-btn" onClick={() => setIsWizardOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="wizard-content">
                            {step === 1 ? (
                                <div className="dropzone-area" onClick={runAIExtraction}>
                                    {isProcessing ? (
                                        <div className="ai-processing">
                                            <div className="ai-scanner"></div>
                                            <Bot size={48} className="animate-pulse text-primary" />
                                            <h3>Analizando Estructura de Costos...</h3>
                                            <p>Extrayendo fletes, recargos BAF/CAF y validez de tarifa.</p>
                                        </div>
                                    ) : (
                                        <div className="drop-prompt">
                                            <Upload size={48} className="text-muted" />
                                            <h3>Arrastra o selecciona tus archivos</h3>
                                            <p>Soporta XML, CSV, XLSX y PDF de Navieras/Aerolíneas</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="validation-step">
                                    <h3>Datos Extraídos Correctamente</h3>
                                    <div className="detected-grid">
                                        <div className="det-field">
                                            <label>Proveedor Detectado</label>
                                            <input type="text" defaultValue="MSC Mediterranean Shipping" />
                                        </div>
                                        <div className="det-field">
                                            <label>Validez de Tarifa</label>
                                            <input type="text" defaultValue="2024-06-30" />
                                        </div>
                                        <div className="det-field">
                                            <label>Total de Rutas Leídas</label>
                                            <input type="text" defaultValue="142 Rutas" />
                                        </div>
                                        <div className="det-field">
                                            <label>Moneda de Extracción</label>
                                            <input type="text" defaultValue={activeTab === 'land' ? 'MXN' : 'USD'} />
                                        </div>
                                    </div>
                                    <div className="ai-disclaimer">
                                        <Info size={16} />
                                        <span>La IA ha mapeado automáticamente las columnas de origen a nuestro esquema de costos.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="wizard-footer">
                            {step === 2 && (
                                <button className="btn-primary" onClick={() => setIsWizardOpen(false)}>
                                    <Save size={18} />
                                    <span>Guardar y Sincronizar Tarifario</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorPricing;
