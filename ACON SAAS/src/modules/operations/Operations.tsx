import React, { useState } from 'react';
import {
    Ship,
    Plane,
    Truck,
    Search,
    Clock,
    MoreHorizontal,
    ArrowRight,
    Plus,
    X,
    Upload,
    Zap,
    CheckCircle2,
    Info,
    Save,
    ArrowLeft,
    Bot
} from 'lucide-react';
import './Operations.css';

const Operations: React.FC = () => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [detectedData, setDetectedData] = useState<any>(null);

    const [ops, setOps] = useState([
        {
            id: 'OP-7654',
            client: 'Industrial Heavy Machinery',
            type: 'maritime',
            origin: 'Shanghai',
            dest: 'Manzanillo',
            stage: 'En Tránsito',
            progress: 65,
            docs: { bl: true, invoice: true, packing: true, customs: false }
        },
        {
            id: 'OP-7655',
            client: 'TechLogistics Solutions',
            type: 'air',
            origin: 'Seoul',
            dest: 'México CDMX',
            stage: 'Aduana Destino',
            progress: 85,
            docs: { bl: true, invoice: true, packing: true, customs: true }
        },
        {
            id: 'OP-7656',
            client: 'AgroExportadora',
            type: 'land',
            origin: 'Guadalajara',
            dest: 'Los Angeles',
            stage: 'Carga en Origen',
            progress: 15,
            docs: { bl: false, invoice: true, packing: true, customs: false }
        }
    ]);

    const runAIExtraction = () => {
        setIsAIProcessing(true);
        setTimeout(() => {
            setDetectedData({
                reference: `OP-${Math.floor(Math.random() * 10000)}`,
                client: 'Industrial Heavy Machinery',
                route: 'Shanghai → Manzanillo',
                type: 'maritime',
                origin: 'Shanghai',
                dest: 'Manzanillo',
                items: 'Máquinas Industriales x 4 pcs'
            });
            setIsAIProcessing(false);
            setWizardStep(2);
        }, 2000);
    };

    const handleCreateOperation = () => {
        if (!detectedData) return;

        const newOp = {
            id: detectedData.reference,
            client: detectedData.client,
            type: detectedData.type,
            origin: detectedData.origin,
            dest: detectedData.dest,
            stage: 'Apertura',
            progress: 10,
            docs: { bl: false, invoice: false, packing: false, customs: false }
        };

        setOps([newOp, ...ops]);
        setIsWizardOpen(false);
        setWizardStep(1);
        setDetectedData(null);
    };

    return (
        <div className="operations-container animate-fade-in">
            <div className="operations-header">
                <div>
                    <h1>Operación Logística</h1>
                    <p>Control total sobre el flujo operativo y cumplimiento documental.</p>
                </div>
                <div className="op-actions">
                    <button className="btn-outline">Exportar Reporte</button>
                    <button className="btn-primary" onClick={() => setIsWizardOpen(true)}>
                        <Plus size={18} />
                        <span>Nueva Operación</span>
                    </button>
                </div>
            </div>

            {isWizardOpen && (
                <div className="wizard-overlay">
                    <div className="wizard-modal card-glass animate-slide-up">
                        <div className="wizard-header">
                            <div className="header-info">
                                <h2>Nueva Operación <span className="ai-badge">AI Powered</span></h2>
                                <p>Extrae datos automáticamente de tus documentos.</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsWizardOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="wizard-content">
                            {wizardStep === 1 && (
                                <div className="step-upload">
                                    <div className="dropzone-area" onClick={runAIExtraction}>
                                        {isAIProcessing ? (
                                            <div className="ai-processing">
                                                <div className="ai-scanner"></div>
                                                <Bot size={48} className="text-orange animate-pulse" />
                                                <h3>Analizando Documentos...</h3>
                                                <p>La IA está extrayendo referencias, pesos y rutas.</p>
                                            </div>
                                        ) : (
                                            <div className="drop-prompt">
                                                <Upload size={48} className="text-muted" />
                                                <h3>Suela aquí tus documentos</h3>
                                                <p>BL, Packing List e Invoice (PDF o JPG)</p>
                                                <button className="btn-black-small mt-4">Seleccionar Archivos</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ai-benefits">
                                        <div className="benefit">
                                            <Zap size={18} className="text-orange" />
                                            <span>Ahorra 15 mins por alta</span>
                                        </div>
                                        <div className="benefit">
                                            <CheckCircle2 size={18} className="text-orange" />
                                            <span>99% precisión en OCR</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {wizardStep === 2 && detectedData && (
                                <div className="step-validate">
                                    <h3 className="sub-title-wiz">Validar Datos Extraídos</h3>
                                    <div className="detected-grid">
                                        <div className="det-field">
                                            <label>Referencia MBL</label>
                                            <input type="text" defaultValue={detectedData.reference} />
                                        </div>
                                        <div className="det-field">
                                            <label>Cliente</label>
                                            <input type="text" defaultValue={detectedData.client} />
                                        </div>
                                        <div className="det-field">
                                            <label>Ruta Detectada</label>
                                            <input type="text" defaultValue={detectedData.route} />
                                        </div>
                                        <div className="det-field">
                                            <label>Mercancía</label>
                                            <input type="text" defaultValue={detectedData.items} />
                                        </div>
                                    </div>
                                    <div className="ai-disclaimer">
                                        <Info size={16} />
                                        <span>Por favor verifique los datos antes de confirmar.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="wizard-footer">
                            {wizardStep === 2 && (
                                <button className="btn-secondary" onClick={() => setWizardStep(1)}>
                                    <ArrowLeft size={18} />
                                    <span>Re-escanear</span>
                                </button>
                            )}
                            <div className="spacer"></div>
                            {wizardStep === 2 && (
                                <button className="btn-primary" onClick={handleCreateOperation}>
                                    <Save size={18} />
                                    <span>Crear Operación</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="operations-pipeline">
                {['Apertura', 'Recolección', 'Aduana Origen', 'En Tránsito', 'Aduana Destino', 'Entrega'].map((stage, idx) => (
                    <div key={idx} className={`pipeline-stage ${idx === 3 ? 'active' : ''}`}>
                        <span className="stage-dot"></span>
                        <span className="stage-name">{stage}</span>
                    </div>
                ))}
            </div>

            <div className="operations-list card-glass">
                <div className="list-filters">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Buscar por Referencia o Cliente..." />
                    </div>
                    <div className="filter-group">
                        <select>
                            <option>Todos los Modos</option>
                            <option>Marítimo</option>
                            <option>Aéreo</option>
                            <option>Terrestre</option>
                        </select>
                    </div>
                </div>

                <div className="op-table">
                    <div className="table-header">
                        <span>Referencia / Cliente</span>
                        <span>Ruta</span>
                        <span>Estatus / Progreso</span>
                        <span>Documentación</span>
                        <span>Acciones</span>
                    </div>
                    {ops.map(op => (
                        <div key={op.id} className="table-row">
                            <div className="op-main-info">
                                <div className="op-type-icon">
                                    {op.type === 'maritime' ? <Ship size={18} /> : op.type === 'air' ? <Plane size={18} /> : <Truck size={18} />}
                                </div>
                                <div className="op-ident">
                                    <span className="op-id">{op.id}</span>
                                    <span className="op-client">{op.client}</span>
                                </div>
                            </div>

                            <div className="op-route">
                                <div className="route-flow">
                                    <span>{op.origin}</span>
                                    <ArrowRight size={14} />
                                    <span>{op.dest}</span>
                                </div>
                            </div>

                            <div className="op-status">
                                <div className="status-label">
                                    <Clock size={14} />
                                    <span>{op.stage}</span>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-bar" style={{ width: `${op.progress}%` }}></div>
                                </div>
                            </div>

                            <div className="op-docs">
                                <div className={`doc-tag ${op.docs.bl ? 'done' : ''}`}>BL</div>
                                <div className={`doc-tag ${op.docs.invoice ? 'done' : ''}`}>INV</div>
                                <div className={`doc-tag ${op.docs.packing ? 'done' : ''}`}>PL</div>
                                <div className={`doc-tag ${op.docs.customs ? 'done' : ''}`}>PED</div>
                            </div>

                            <div className="op-actions">
                                <button className="icon-btn-small"><MoreHorizontal size={20} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Operations;
