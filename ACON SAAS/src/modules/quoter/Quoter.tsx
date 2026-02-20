import React, { useState, useMemo } from 'react';
import {
    Ship,
    Plane,
    Truck,
    Globe,
    ArrowRight,
    ArrowLeft,
    Plus,
    X,
    AlertCircle,
    TrendingUp,
    Bot,
    Save,
    FileText,
    Share2,
    CheckCircle2,
    DollarSign,
    Box,
    ThermometerSnowflake,
    Flame,
    Info,
    Scale,
    Copy,
    Zap,
    Mail,
    Phone
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { QuotePDFDocument } from './QuotePDF';
import ApprovalModal from './ApprovalModal';
import type { Quote, Surcharge, TransportMode, Incoterm, QuoteAcceptance, UserRole } from './types';
import { lockQuoteAfterAcceptance } from './AcceptanceService';
import { logAction } from './AuditService';
import { SUPPORTED_CURRENCIES, getMockExchangeRate, formatCurrency } from './CurrencyService';
import './Quoter.css';

const ProfessionalQuoter: React.FC = () => {
    const [step, setStep] = useState(1);
    const [legalAccepted, setLegalAccepted] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [showAISuggestion, setShowAISuggestion] = useState(false);

    // Mocked current user for Audit purposes
    const currentUser = { id: 'USR-001', name: 'Enrique Cobian', role: 'admin' as UserRole };

    const [quote, setQuote] = useState<Partial<Quote>>({
        id: `QT-${Math.floor(Math.random() * 10000)}`,
        version: 1,
        serviceType: 'maritime-fcl',
        incoterm: 'FOB',
        specs: {
            weightKg: 0,
            volumeCbm: 0,
            isDangerous: false,
            isTemperatureControlled: false
        },
        baseCosts: {
            freight: 0,
            origin: 0,
            destination: 0,
            customs: 0,
            lastMile: 0
        },
        surcharges: [
            { id: '1', name: 'BAF', amount: 150, type: 'fixed', applyTo: 'total' },
            { id: '2', name: 'THC', amount: 350, type: 'fixed', applyTo: 'total' }
        ],
        margin: { type: 'percentage', value: 18 },
        currency: 'USD',
        presentationCurrency: 'USD',
        exchangeRate: {
            rate: 1,
            from: 'USD',
            to: 'USD',
            source: 'manual',
            timestamp: new Date().toISOString(),
            isLocked: false
        },
        transitTimeDays: 25,
        validityDays: 15,
        isLocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    // Reset listener for header button
    React.useEffect(() => {
        const handleReset = () => {
            setStep(1);
            setQuote(prev => ({
                ...prev,
                id: `QT-${Math.floor(Math.random() * 10000)}`,
                version: 1,
                serviceType: 'maritime-fcl',
                incoterm: 'FOB',
                origin: 'SHANGHAI, CN',
                destination: 'MANZANILLO, MX',
                specs: {
                    weightKg: 0,
                    volumeCbm: 0,
                    isDangerous: false,
                    isTemperatureControlled: false
                },
                baseCosts: { freight: 0, origin: 0, destination: 0, customs: 0, lastMile: 0 },
                status: 'draft',
                isLocked: false
            }));
            setShowAISuggestion(false);
        };
        window.addEventListener('resetQuoter', handleReset);
        return () => window.removeEventListener('resetQuoter', handleReset);
    }, []);

    // Calculation Logic
    const totals = useMemo(() => {
        const base =
            (quote.baseCosts?.freight || 0) +
            (quote.baseCosts?.origin || 0) +
            (quote.baseCosts?.destination || 0) +
            (quote.baseCosts?.customs || 0) +
            (quote.baseCosts?.lastMile || 0);

        const surchargesTotal = quote.surcharges?.reduce((acc, s) => {
            if (s.type === 'fixed') return acc + s.amount;
            return acc + (base * (s.amount / 100));
        }, 0) || 0;

        const netCost = base + surchargesTotal;

        let salePrice = 0;
        let profit = 0;

        if (quote.margin?.type === 'percentage') {
            salePrice = netCost / (1 - (quote.margin.value / 100));
            profit = salePrice - netCost;
        } else {
            profit = quote.margin?.value || 0;
            salePrice = netCost + profit;
        }

        const fxRate = quote.exchangeRate?.rate || 1;
        const salePricePresentation = salePrice * fxRate;

        return {
            netCost,
            surchargesTotal,
            salePrice,
            profit,
            marginPct: (profit / salePrice) * 100,
            salePricePresentation
        };
    }, [quote]);

    // Handlers
    const handlePresentationCurrencyChange = (currencyCode: string) => {
        const rate = getMockExchangeRate(quote.currency!, currencyCode);
        setQuote(prev => ({
            ...prev,
            presentationCurrency: currencyCode,
            exchangeRate: {
                ...prev.exchangeRate!,
                from: prev.currency!,
                to: currencyCode,
                rate: rate,
                timestamp: new Date().toISOString()
            }
        }));
        logAction(currentUser.id, currentUser.name, currentUser.role, 'Change Presentation Currency', 'quoter', quote.id!, `Changed to ${currencyCode}`, 'info');
    };

    const handleExchangeRateChange = (newRate: number) => {
        setQuote(prev => ({
            ...prev,
            exchangeRate: {
                ...prev.exchangeRate!,
                rate: newRate,
                source: 'manual'
            }
        }));
        logAction(currentUser.id, currentUser.name, currentUser.role, 'Manual FX Override', 'quoter', quote.id!, `New rate: ${newRate}`, 'warning');
    };

    const toggleFXLock = () => {
        setQuote(prev => ({
            ...prev,
            exchangeRate: {
                ...prev.exchangeRate!,
                isLocked: !prev.exchangeRate?.isLocked
            }
        }));
        logAction(currentUser.id, currentUser.name, currentUser.role, quote.exchangeRate?.isLocked ? 'Unlock FX' : 'Lock FX', 'quoter', quote.id!, `FX status toggled`, 'info');
    };

    const handleAcceptance = (acceptance: QuoteAcceptance) => {
        const lockedQuote = lockQuoteAfterAcceptance(quote, acceptance);
        setQuote(lockedQuote);
        setIsApprovalModalOpen(false);
        logAction(currentUser.id, currentUser.name, currentUser.role, 'Quote Formally Accepted', 'quoter', quote.id!, `Accepted by ${acceptance.acceptedBy} (${acceptance.role})`, 'info');
    };

    const createNewVersion = () => {
        const oldId = quote.id;
        const newVersion = (quote.version || 1) + 1;
        setQuote(prev => ({
            ...prev,
            version: newVersion,
            parentQuoteId: oldId,
            status: 'draft',
            isLocked: false,
            acceptance: undefined,
            updatedAt: new Date().toISOString()
        }));
        setStep(1);
        logAction(currentUser.id, currentUser.name, currentUser.role, 'Create New Version', 'quoter', quote.id!, `New version ${newVersion} from ${oldId}`, 'info');
    };

    const logPDFDownload = () => {
        logAction(currentUser.id, currentUser.name, currentUser.role, 'Generate PDF', 'quoter', quote.id!, `PDF Document generated and downloaded`, 'info');
    };

    const matchVendorRates = () => {
        setIsMatching(true);
        setTimeout(() => {
            setIsMatching(false);
            setShowAISuggestion(true);

            const isLand = quote.serviceType === 'land-ftl';
            const fxRate = quote.exchangeRate?.rate || 18.5;

            setQuote(prev => ({
                ...prev,
                baseCosts: {
                    ...prev.baseCosts!,
                    // If Land, use an MXN-based estimate converted to USD
                    freight: isLand ? Math.round(18500 / fxRate) : 1050,
                },
                surcharges: isLand
                    ? [
                        { id: 'l1', name: 'Cruce Fronterizo', amount: Math.round(3500 / fxRate), type: 'fixed', applyTo: 'total' },
                        { id: 'l2', name: 'Monitoreo GPS / Custodia', amount: Math.round(1200 / fxRate), type: 'fixed', applyTo: 'total' }
                    ]
                    : [
                        { id: '1', name: 'BAF', amount: 120, type: 'fixed', applyTo: 'total' },
                        { id: '2', name: 'THC', amount: 80, type: 'fixed', applyTo: 'total' }
                    ]
            }));

            const vendorMsg = isLand ? 'Matched with TUM Logística (MXN converted to USD)' : 'Matched with Maersk Line via AI';
            logAction(currentUser.id, currentUser.name, currentUser.role, 'AI Rate Match', 'quoter', quote.id!, vendorMsg, 'info');
        }, 1500);
    };

    const handleNextStep = () => {
        if (step === 1) {
            setStep(2);
            // Automatic AI Matching on transition
            matchVendorRates();
        }
    };

    const handleBaseCostChange = (key: keyof Quote['baseCosts'], value: number) => {
        setQuote(prev => ({
            ...prev,
            baseCosts: { ...prev.baseCosts!, [key]: value }
        }));
    };

    const handleSurchargeChange = (id: string, field: keyof Surcharge, value: any) => {
        setQuote(prev => ({
            ...prev,
            surcharges: prev.surcharges?.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const addSurcharge = () => {
        const newS: Surcharge = { id: Date.now().toString(), name: 'Nuevo Recargo', amount: 0, type: 'fixed', applyTo: 'total' };
        setQuote(prev => ({ ...prev, surcharges: [...(prev.surcharges || []), newS] }));
        logAction(currentUser.id, currentUser.name, currentUser.role, 'Add Surcharge', 'quoter', quote.id!, `New surcharge added`, 'info');
    };

    const removeSurcharge = (id: string) => {
        setQuote(prev => ({ ...prev, surcharges: prev.surcharges?.filter(s => s.id !== id) }));
        logAction(currentUser.id, currentUser.name, currentUser.role, 'Remove Surcharge', 'quoter', quote.id!, `Surcharge ${id} removed`, 'warning');
    };

    const isMarginLow = totals.marginPct < 15;

    return (
        <div className="professional-quoter-container animate-fade-in">
            {/* Header with Title and Quick Actions */}
            <div className="quoter-header">
                <div className="title-group">
                    <h1>Cotizador Logístico Pro</h1>
                    <p>Potenciado por ACON AI Core • Version 2.0</p>
                </div>
                <div className="header-actions">
                    <button className={`btn-outline-small ${isMatching ? 'animate-pulse' : ''}`} onClick={matchVendorRates}>
                        <Zap size={16} color={showAISuggestion ? '#FF6B00' : 'currentColor'} />
                        <span>{isMatching ? 'Buscando...' : showAISuggestion ? 'Tarifas Aplicadas' : 'Sugerir Tarifas (AI)'}</span>
                    </button>
                    <button className="btn-outline-small">
                        <Save size={16} />
                        <span>Guardar Borrador</span>
                    </button>
                    <PDFDownloadLink
                        document={<QuotePDFDocument quote={quote as any} totals={totals} />}
                        fileName={`COTIZACION_${quote.id || 'NUEVA'}.pdf`}
                    >
                        {({ loading }) => (
                            <button className="btn-primary-small" disabled={loading} onClick={logPDFDownload}>
                                <FileText size={16} />
                                <span>{loading ? 'Generando...' : 'Generar PDF'}</span>
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {showAISuggestion && (
                <div className="ai-insight-banner animate-slide-down" style={{
                    backgroundColor: 'rgba(255, 107, 0, 0.05)',
                    border: '1px solid rgba(255, 107, 0, 0.2)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.875rem'
                }}>
                    <Bot size={20} color="#FF6B00" />
                    <span><b>IA Insight:</b> Se han aplicado las tarifas de <b>Maersk Line</b> (Vigencia 2024-03-31) para la ruta <b>SHANGHAI → MANZANILLO</b>. Ahorro detectado: <b>$240 USD</b> vs mercado.</span>
                </div>
            )}

            <div className="quoter-main-layout">
                {/* Left: Input Section / Wizard */}
                <div className="quoter-inputs">
                    <div className="wizard-steps">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    </div>

                    <div className="wizard-content card-glass">
                        {step === 1 ? (
                            <div className="wizard-step-1">
                                <h3 className="section-title"><Globe size={18} /> Ruta y Tipo de Carga</h3>
                                <div className="input-grid">
                                    <div className="input-field">
                                        <label>Cliente</label>
                                        <select>
                                            <option>Seleccionar cliente existente...</option>
                                            <option>Industrial Heavy Machinery</option>
                                            <option>AgroExportadora</option>
                                            <option>+ Nuevo Cliente</option>
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <label>Incoterm</label>
                                        <select value={quote.incoterm} onChange={(e) => setQuote({ ...quote, incoterm: e.target.value as Incoterm })}>
                                            {['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'DDP'].map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <label>Origen</label>
                                        <input type="text" placeholder="Puerto o Ciudad" value={quote.origin || ''} onChange={(e) => setQuote({ ...quote, origin: e.target.value })} />
                                    </div>
                                    <div className="input-field">
                                        <label>Destino</label>
                                        <input type="text" placeholder="Puerto o Ciudad" value={quote.destination || ''} onChange={(e) => setQuote({ ...quote, destination: e.target.value })} />
                                    </div>
                                    <div className="input-field">
                                        <label>Vigencia (Días)</label>
                                        <select value={quote.validityDays} onChange={(e) => setQuote({ ...quote, validityDays: Number(e.target.value) })}>
                                            <option value={5}>5 días (Express)</option>
                                            <option value={7}>7 días (Estándar)</option>
                                            <option value={15}>15 días (Project)</option>
                                        </select>
                                    </div>
                                    {(quote.serviceType === 'maritime-fcl' || quote.serviceType === 'land-ftl') && (
                                        <div className="input-field">
                                            <label>Tipo de Contenedor / Equipo</label>
                                            <select
                                                value={quote.specs?.containerType || ''}
                                                onChange={(e) => setQuote({
                                                    ...quote,
                                                    specs: { ...quote.specs!, containerType: e.target.value }
                                                })}
                                            >
                                                <option value="">Seleccionar equipo...</option>
                                                <option value="20ST">20' Standard</option>
                                                <option value="40ST">40' Standard</option>
                                                <option value="40HC">40' High Cube</option>
                                                <option value="40REF">40' Refriferado</option>
                                                <option value="40OT">40' Open Top</option>
                                                <option value="53FT">53' Dry Van (Truck)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="transport-selector">
                                    <label>Tipo de Servicio</label>
                                    <div className="mode-options">
                                        {[
                                            { id: 'maritime-fcl', label: 'Marítimo FCL', icon: <Ship size={18} /> },
                                            { id: 'maritime-lcl', label: 'Marítimo LCL', icon: <Ship size={18} /> },
                                            { id: 'air', label: 'Aéreo', icon: <Plane size={18} /> },
                                            { id: 'land-ftl', label: 'Terrestre FTL', icon: <Truck size={18} /> },
                                        ].map(mode => (
                                            <button
                                                key={mode.id}
                                                className={`mode-opt ${quote.serviceType === mode.id ? 'active' : ''}`}
                                                onClick={() => setQuote({ ...quote, serviceType: mode.id as TransportMode })}
                                            >
                                                {mode.icon}
                                                <span>{mode.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="tech-specs-section">
                                    <h3 className="section-title"><Box size={18} /> Datos Técnicos</h3>
                                    <div className="specs-grid">
                                        <div className="input-field">
                                            <label>Peso Bruto (KG)</label>
                                            <input
                                                type="number"
                                                value={quote.specs?.weightKg}
                                                onChange={(e) => setQuote({ ...quote, specs: { ...quote.specs!, weightKg: Number(e.target.value) } })}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>Volumen (CBM)</label>
                                            <input
                                                type="number"
                                                value={quote.specs?.volumeCbm}
                                                onChange={(e) => setQuote({ ...quote, specs: { ...quote.specs!, volumeCbm: Number(e.target.value) } })}
                                            />
                                        </div>
                                    </div>
                                    <div className="checkbox-group">
                                        <label className={`check-btn ${quote.specs?.isDangerous ? 'active' : ''}`}>
                                            <input
                                                type="checkbox"
                                                hidden
                                                checked={quote.specs?.isDangerous}
                                                onChange={(e) => setQuote({ ...quote, specs: { ...quote.specs!, isDangerous: e.target.checked } })}
                                            />
                                            <Flame size={16} /> Mercancía Peligrosa
                                        </label>
                                        <label className={`check-btn ${quote.specs?.isTemperatureControlled ? 'active' : ''}`}>
                                            <input
                                                type="checkbox"
                                                hidden
                                                checked={quote.specs?.isTemperatureControlled}
                                                onChange={(e) => setQuote({ ...quote, specs: { ...quote.specs!, isTemperatureControlled: e.target.checked } })}
                                            />
                                            <ThermometerSnowflake size={16} /> Temperatura Controlada
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="wizard-step-2">
                                <h3 className="section-title"><DollarSign size={18} /> Ingeniería de Costos</h3>
                                <div className="costs-table-container">
                                    <div className="cost-entry-header">
                                        <span>Concepto Base</span>
                                        <span>Costo USD</span>
                                    </div>
                                    <div className="cost-entry">
                                        <span>Flete Internacional</span>
                                        <input type="number" value={quote.baseCosts?.freight} onChange={(e) => handleBaseCostChange('freight', Number(e.target.value))} />
                                    </div>
                                    <div className="cost-entry">
                                        <span>Gastos en Origen</span>
                                        <input type="number" value={quote.baseCosts?.origin} onChange={(e) => handleBaseCostChange('origin', Number(e.target.value))} />
                                    </div>
                                    <div className="cost-entry">
                                        <span>Gastos en Destino</span>
                                        <input type="number" value={quote.baseCosts?.destination} onChange={(e) => handleBaseCostChange('destination', Number(e.target.value))} />
                                    </div>
                                    <div className="cost-entry">
                                        <span>Gastos Aduanales / Honorarios</span>
                                        <input type="number" value={quote.baseCosts?.customs} onChange={(e) => handleBaseCostChange('customs', Number(e.target.value))} />
                                    </div>
                                </div>

                                <div className="fx-management-section card-glass" style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--primary-100)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9375rem' }}><DollarSign size={18} /> Moneda y Tipo de Cambio</h4>
                                        <button
                                            onClick={toggleFXLock}
                                            style={{ backgroundColor: quote.exchangeRate?.isLocked ? '#fee2e2' : '#f1f5f9', color: quote.exchangeRate?.isLocked ? '#b91c1c' : '#475569', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}
                                        >
                                            {quote.exchangeRate?.isLocked ? 'TC BLOQUEADO' : 'BLOQUEAR TC'}
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="input-field">
                                            <label>Ver Propuesta en</label>
                                            <select
                                                value={quote.presentationCurrency}
                                                onChange={(e) => handlePresentationCurrencyChange(e.target.value)}
                                                disabled={quote.exchangeRate?.isLocked}
                                            >
                                                {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="input-field">
                                            <label>Tipo de Cambio (1 {quote.currency} = ?)</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="number"
                                                    step="0.0001"
                                                    value={quote.exchangeRate?.rate}
                                                    onChange={(e) => handleExchangeRateChange(Number(e.target.value))}
                                                    disabled={quote.exchangeRate?.isLocked}
                                                />
                                                <span style={{ fontSize: '10px', color: '#64748b', alignSelf: 'center' }}>{quote.presentationCurrency}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px' }}>
                                        Actualizado: {new Date(quote.exchangeRate?.timestamp!).toLocaleString()} • Fuente: {quote.exchangeRate?.source}
                                    </p>
                                </div>

                                <div className="surcharges-section">
                                    <div className="section-header">
                                        <h4>Recargos y Manejos</h4>
                                        <button className="add-surcharge-btn" onClick={addSurcharge}><Plus size={14} /> Agregar</button>
                                    </div>
                                    {quote.surcharges?.map(s => (
                                        <div key={s.id} className="surcharge-row">
                                            <input className="s-name" value={s.name} onChange={(e) => handleSurchargeChange(s.id, 'name', e.target.value)} />
                                            <input className="s-amount" type="number" value={s.amount} onChange={(e) => handleSurchargeChange(s.id, 'amount', Number(e.target.value))} />
                                            <select className="s-type" value={s.type} onChange={(e) => handleSurchargeChange(s.id, 'type', e.target.value)}>
                                                <option value="fixed">USD</option>
                                                <option value="percentage">%</option>
                                            </select>
                                            <button className="btn-del" onClick={() => removeSurcharge(s.id)}><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>

                                <div className="margin-control-section">
                                    <h3 className="section-title"><TrendingUp size={18} /> Control de Margen</h3>
                                    <div className="margin-input-group">
                                        <div className="m-input">
                                            <label>Margen de Utilidad</label>
                                            <div className="input-with-suffix">
                                                <input
                                                    type="number"
                                                    value={quote.margin?.value}
                                                    onChange={(e) => setQuote({ ...quote, margin: { ...quote.margin!, value: Number(e.target.value) } })}
                                                />
                                                <span>{quote.margin?.type === 'percentage' ? '%' : 'USD'}</span>
                                            </div>
                                        </div>
                                        <div className="margin-type-toggle">
                                            <button
                                                className={quote.margin?.type === 'percentage' ? 'active' : ''}
                                                onClick={() => setQuote({ ...quote, margin: { ...quote.margin!, type: 'percentage' } })}
                                            >%</button>
                                            <button
                                                className={quote.margin?.type === 'fixed' ? 'active' : ''}
                                                onClick={() => setQuote({ ...quote, margin: { ...quote.margin!, type: 'fixed' } })}
                                            >Fixed</button>
                                        </div>
                                    </div>
                                    {isMarginLow && (
                                        <div className="margin-alert">
                                            <AlertCircle size={16} />
                                            <span>El margen está por debajo del 15%. Requiere aprobación de Dirección Comercial.</span>
                                        </div>
                                    )}

                                    <div className="legal-shield-check" style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: '600', color: '#475569' }}>
                                            <input type="checkbox" checked={legalAccepted} onChange={(e) => setLegalAccepted(e.target.checked)} />
                                            <span>He validado que la cotización incluye los disclaimers operativos y legales vigentes (V.2.0).</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="wizard-navigation">
                        {step === 2 && (
                            <button className="btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={18} /> Anterior</button>
                        )}
                        <div style={{ flex: 1 }}></div>
                        {step === 1 ? (
                            <button className="btn-primary" onClick={handleNextStep}>
                                {isMatching ? 'Procesando IA...' : 'Analizar Costos (AI)'} <ArrowRight size={18} />
                            </button>
                        ) : quote.status === 'accepted' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: '700' }}>
                                    <CheckCircle2 size={24} />
                                    <span>COTIZACIÓN ACEPTADA Y BLOQUEADA</span>
                                </div>
                                <button className="btn-outline-small" onClick={createNewVersion} style={{ border: '1px solid #16a34a', color: '#16a34a' }}>
                                    <Copy size={16} />
                                    <span>Gererar Nueva Versión</span>
                                </button>
                            </div>
                        ) : (
                            <button className="btn-success" disabled={isMarginLow || !legalAccepted} onClick={() => setIsApprovalModalOpen(true)}>
                                <CheckCircle2 size={18} /> Finalizar y Firmar
                            </button>
                        )}
                    </div>
                </div>

                <ApprovalModal
                    isOpen={isApprovalModalOpen}
                    onClose={() => setIsApprovalModalOpen(false)}
                    onAccept={handleAcceptance}
                    quoteTotal={totals.salePricePresentation.toLocaleString()}
                    currency={quote.presentationCurrency!}
                />

                {/* Right: Summary / Profitability Sidebar */}
                <div className="quoter-sidebar">
                    <div className="profitability-card card-premium shadow-lg">
                        <h3>Desglose Financiero</h3>
                        <div className="p-item">
                            <span>Costo Neto (Cost Out)</span>
                            <span className="p-val">${totals.netCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="p-item">
                            <span>Recargos Totales</span>
                            <span className="p-val">${totals.surchargesTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="p-divider"></div>
                        <div className="p-item profit text-accent-green">
                            <span>Utilidad Estimada</span>
                            <span className="p-val">+${totals.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="p-item margin-indicator">
                            <span>Margen ROI</span>
                            <span className={`p-val badge ${totals.marginPct < 15 ? 'warning' : 'success'}`}>
                                {totals.marginPct.toFixed(1)}%
                            </span>
                        </div>
                        <div className="p-divider"></div>
                        <div className="p-total">
                            <span className="total-label">PRECIO VENTA (USD)</span>
                            <span className="total-amount">${totals.salePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        {quote.presentationCurrency !== 'USD' && (
                            <div className="p-total" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                                <span className="total-label" style={{ color: '#bfdbfe' }}>VISTA CLIENTE ({quote.presentationCurrency})</span>
                                <span className="total-amount" style={{ fontSize: '1.25rem' }}>
                                    {formatCurrency(totals.salePricePresentation, quote.presentationCurrency!)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="ai-coach-card card-glass">
                        <div className="coach-header">
                            <Bot size={20} className="text-primary-600" />
                            <h4>AI Pricing Coach</h4>
                        </div>
                        <div className="coach-body">
                            <ul className="ai-insights">
                                <li><TrendingUp size={14} className="text-accent-green" /> Ruta SHA-MAN estable. Se sugiere margen de 22% para esta cuenta.</li>
                                <li><Info size={14} className="text-info" /> El Incoterm {quote.incoterm} indica que el cliente absorbe seguros. Considere ofrecer póliza ADI.</li>
                                {quote.specs?.isDangerous && (
                                    <li><AlertCircle size={14} className="text-warning" /> Carga IMO detectada. Asegurar vigencia de certificados de proveedor.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="client-summary-card card-glass animate-fade-in" style={{ marginTop: '24px', padding: '24px', border: '1px solid var(--primary-100)' }}>
                        <div className="coach-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <FileText size={18} className="text-primary-400" />
                            <h4 style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--primary-700)' }}>Resumen para Cliente (IA)</h4>
                        </div>
                        <p className="summary-text" style={{ fontSize: '0.8125rem', lineHeight: '1.5', color: 'var(--neutral-600)', fontStyle: 'italic' }}>
                            "Propuesta para envío marítimo desde Shanghai a Manzanillo. El costo incluye flete principal y gastos de manejo portuario bajo términos {quote.incoterm}. Tiempo estimado 25 días."
                        </p>
                    </div>

                    <div className="legal-disclaimers-card card-glass" style={{ marginTop: '24px', padding: '20px', border: '1px solid #fee2e2' }}>
                        <div className="coach-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <Scale size={18} className="text-danger" />
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#991b1b' }}>Reglas Legales (Blindaje)</h4>
                        </div>
                        <ul style={{ listStyle: 'none', fontSize: '0.75rem', color: '#7f1d1d', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>• Tarifas sujetas a disponibilidad de espacio.</li>
                            <li>• Válido solo por {quote.validityDays} días.</li>
                            <li>• No incluye almacenajes ni demoras en puerto.</li>
                            <li>• Sujeto a revisión de peso y medidas.</li>
                        </ul>
                    </div>

                    <div className="share-actions-group" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                        <button className="btn-whatsapp-full">
                            <Share2 size={18} /> Ver Propuesta Online
                        </button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button className="btn-outline-small" style={{ borderColor: '#25D366', color: '#128C7E' }}>
                                <Phone size={14} /> WhatsApp
                            </button>
                            <button className="btn-outline-small" style={{ borderColor: '#3b82f6', color: '#2563eb' }}>
                                <Mail size={14} /> Enviar Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalQuoter;
