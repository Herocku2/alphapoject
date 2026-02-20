import React, { useState } from 'react';
import {
    Search,
    Download,
    CheckCircle2,
    Eye
} from 'lucide-react';
import ApprovalModal from '../quoter/ApprovalModal';
import type { QuoteAcceptance } from '../quoter/types';
import { formatCurrency } from '../quoter/CurrencyService';
import { logAction } from '../quoter/AuditService';

const PortalQuotes: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<any>(null);

    // Mock quotes for the client
    const [quotes, setQuotes] = useState<any[]>([
        {
            id: 'QT-8821',
            serviceType: 'maritime-fcl',
            origin: { name: 'Shanghai' },
            destination: { name: 'Manzanillo' },
            status: 'sent',
            totalUSD: 2450.00,
            currency: 'USD',
            presentationCurrency: 'MXN',
            exchangeRate: { rate: 20.45 },
            totalPresentation: 50102.50,
            validUntil: '2026-02-25',
            isLocked: false
        },
        {
            id: 'QT-8799',
            serviceType: 'air',
            origin: { name: 'Seoul' },
            destination: { name: 'México CDMX' },
            status: 'accepted',
            totalUSD: 1850.00,
            currency: 'USD',
            presentationCurrency: 'USD',
            exchangeRate: { rate: 1 },
            totalPresentation: 1850.00,
            validUntil: '2026-02-10',
            isLocked: true,
            acceptance: { acceptedBy: 'Carlos Mendoza', timestamp: '2026-02-05T10:00:00Z' }
        }
    ]);

    const handleAcceptance = (acceptance: QuoteAcceptance) => {
        const updatedQuotes = quotes.map(q => {
            if (q.id === selectedQuote.id) {
                return {
                    ...q,
                    status: 'accepted',
                    isLocked: true,
                    acceptance
                };
            }
            return q;
        });
        setQuotes(updatedQuotes);
        setIsModalOpen(false);
        logAction('CL-001', 'Carlos Mendoza', 'client-admin' as any, 'Formal Acceptance via Portal', 'quoter', selectedQuote.id, `Signed by ${acceptance.acceptedBy}`, 'info');
    };

    return (
        <div className="portal-quotes">
            <div className="portal-table-section">
                <div className="section-header">
                    <div className="search-box-portal" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', width: '300px' }}>
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Buscar cotización..." style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div className="quotes-list-client">
                    <div className="table-header-client" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 120px', padding: '12px 16px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        <span>Folio / Fecha</span>
                        <span>Ruta / Servicio</span>
                        <span>Vigencia</span>
                        <span>Inversión</span>
                        <span>Estatus</span>
                        <span style={{ textAlign: 'right' }}>Acciones</span>
                    </div>

                    {quotes.map(q => (
                        <div key={q.id} className="table-row-client" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 120px', padding: '20px 16px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{q.id}</span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>05 Feb, 2026</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{q.origin.name} → {q.destination.name}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{q.serviceType.toUpperCase()}</span>
                            </div>

                            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{q.validUntil}</div>

                            <div style={{ fontWeight: 700, color: '#1e293b' }}>
                                {formatCurrency(q.totalPresentation, q.presentationCurrency)}
                            </div>

                            <div>
                                <span
                                    className={`badge-portal ${q.status}`}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.6875rem',
                                        fontWeight: 800,
                                        backgroundColor: q.status === 'accepted' ? '#f0fdf4' : q.status === 'sent' ? '#eff6ff' : '#f1f5f9',
                                        color: q.status === 'accepted' ? '#16a34a' : q.status === 'sent' ? '#3b82f6' : '#64748b'
                                    }}
                                >
                                    {q.status.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button className="icon-btn-portal" title="Ver Detalles"><Eye size={16} /></button>
                                <button className="icon-btn-portal" title="Descargar PDF"><Download size={16} /></button>
                                {q.status === 'sent' && (
                                    <button
                                        className="btn-accept-client"
                                        onClick={() => { setSelectedQuote(q); setIsModalOpen(true); }}
                                        style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <CheckCircle2 size={14} /> Firmar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedQuote && (
                <ApprovalModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAccept={handleAcceptance}
                    quoteTotal={formatCurrency(selectedQuote.totalPresentation, selectedQuote.presentationCurrency)}
                    currency={selectedQuote.presentationCurrency}
                />
            )}
        </div>
    );
};

export default PortalQuotes;
