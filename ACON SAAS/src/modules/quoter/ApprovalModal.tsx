import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, CheckCircle2, ShieldCheck, User, Briefcase, MousePointer2 } from 'lucide-react';
import { generateAcceptanceEvidence, verifyIPAddress } from './AcceptanceService';
import type { QuoteAcceptance } from './types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (acceptance: QuoteAcceptance) => void;
    quoteTotal: string;
    currency: string;
}

const ApprovalModal: React.FC<Props> = ({ isOpen, onClose, onAccept, quoteTotal, currency }) => {
    const sigPad = useRef<SignatureCanvas>(null);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const clear = () => sigPad.current?.clear();

    const handleSubmit = async () => {
        if (!name || !role || !agreement || sigPad.current?.isEmpty()) {
            alert('Por favor complete todos los campos y firme la cotización.');
            return;
        }

        setIsSubmitting(true);
        const ip = await verifyIPAddress();
        const signature = sigPad.current?.getTrimmedCanvas().toDataURL('image/png');

        const evidence = generateAcceptanceEvidence(name, role, signature);
        evidence.ip = ip;

        setTimeout(() => {
            onAccept(evidence);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(8px)'
        }}>
            <div className="modal-content card-glass animate-scale-up" style={{
                width: '100%', maxWidth: '500px', padding: '32px',
                borderRadius: '16px', background: 'white', position: 'relative'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '56px', height: '56px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
                        <ShieldCheck size={32} className="text-primary-600" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Aceptación Formal</h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Confirma la validez legal de esta cotización por {quoteTotal} {currency}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="input-field">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={14} /> Nombre Completo</label>
                        <input
                            type="text"
                            placeholder="Ej. Juan Pérez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <div className="input-field">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase size={14} /> Cargo / Rol</label>
                        <input
                            type="text"
                            placeholder="Ej. Gerente de Compras"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <div className="signature-area">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><MousePointer2 size={14} /> Firma Digital</label>
                        <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                            <SignatureCanvas
                                ref={sigPad}
                                penColor='#0f172a'
                                canvasProps={{ width: 436, height: 150, className: 'sigCanvas' }}
                            />
                        </div>
                        <button onClick={clear} style={{ fontSize: '0.75rem', color: '#ef4444', border: 'none', background: 'none', marginTop: '4px', cursor: 'pointer' }}>Borrar firma</button>
                    </div>

                    <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', fontSize: '0.75rem', marginTop: '8px' }}>
                        <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
                        <span style={{ color: '#475569', lineHeight: '1.4' }}>
                            Acepto explícitamente los Términos y Condiciones vigentes asociados a esta propuesta logística y autorizo el inicio de la operación bajo el folio de cotización actual.
                        </span>
                    </label>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '12px' }}
                    >
                        {isSubmitting ? 'Procesando Firma...' : (
                            <>
                                <CheckCircle2 size={20} />
                                <span>Firmar y Aceptar Cotización</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
