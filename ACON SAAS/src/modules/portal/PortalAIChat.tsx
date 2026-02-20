import React, { useState } from 'react';
import {
    Send,
    Bot,
    User,
    Sparkles,
    ShieldAlert
} from 'lucide-react';

const PortalAIChat: React.FC = () => {
    const [messages, setMessages] = useState([
        { id: '1', role: 'assistant', text: 'Hola Carlos, soy tu asistente logístico de ACON. ¿En qué puedo ayudarte hoy con tus operaciones o cotizaciones?' }
    ]);
    const [input, setInput] = useState('');

    const suggestions = [
        '¿Qué significa Incoterm DDP?',
        'Estatus de la operación OP-7654',
        '¿Cómo acepto una cotización?',
        'Documentos faltantes'
    ];

    const handleSend = () => {
        if (!input) return;
        setMessages([...messages, { id: Date.now().toString(), role: 'user', text: input }]);
        setInput('');

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: 'Entendido. Estoy analizando tu solicitud. Según mis registros, la operación OP-7654 se encuentra cruzando el Pacífico y su ETA sigue firme para el 15 de marzo.'
            }]);
        }, 1000);
    };

    return (
        <div className="portal-ai-chat" style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>

            {/* Disclaimer */}
            <div style={{ padding: '12px 20px', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <ShieldAlert size={18} color="#f59e0b" />
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9a3412', lineHeight: '1.4' }}>
                    Esta IA está diseñada para orientación logística. Por favor, valide decisiones críticas con su ejecutivo de cuenta asignado.
                </p>
            </div>

            {/* Chat Body */}
            <div className="chat-container-portal" style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {messages.map(m => (
                        <div key={m.id} style={{ display: 'flex', gap: '12px', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            {m.role === 'assistant' && (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                    <Bot size={18} />
                                </div>
                            )}
                            <div style={{
                                padding: '12px 18px',
                                borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                backgroundColor: m.role === 'user' ? '#3b82f6' : '#f8fafc',
                                color: m.role === 'user' ? 'white' : '#1e293b',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                boxShadow: m.role === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
                            }}>
                                {m.text}
                            </div>
                            {m.role === 'user' && (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <User size={18} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Suggestions */}
                <div style={{ padding: '0 24px 16px', display: 'flex', gap: '8px', overflowX: 'auto', flexWrap: 'nowrap' }}>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(s)}
                            style={{ whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: '20px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe tu consulta logística..."
                            style={{ width: '100%', padding: '12px 40px 12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                        />
                        <Sparkles size={16} color="#3b82f6" style={{ position: 'absolute', right: '16px', top: '14px' }} />
                    </div>
                    <button
                        onClick={handleSend}
                        style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortalAIChat;
