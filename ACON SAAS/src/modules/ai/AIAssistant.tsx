import React, { useState } from 'react';
import {
    Bot,
    Send,
    Sparkles,
    TrendingUp,
    ShieldCheck,
    FileSearch,
    MessageSquare
} from 'lucide-react';
import './AIAssistant.css';

const AIAssistant: React.FC = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hola Enrique. Soy tu asistente avanzado de ACON SAAS. ¿En qué puedo apoyarte hoy con tus operaciones?' }
    ]);
    const [input, setInput] = useState('');

    const suggestions = [
        { icon: <TrendingUp size={16} />, text: 'Análisis de rentabilidad SHA-MAN' },
        { icon: <ShieldCheck size={16} />, text: 'Validar documentos OP-7654' },
        { icon: <FileSearch size={16} />, text: 'Resumen de mercado Freightos Feb' }
    ];

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        setInput('');
        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', text: 'He analizado tu solicitud. Según los datos actuales, la ruta seleccionada tiene una tendencia de alza del 5% para la próxima semana. Te sugiero cerrar la cotización hoy.' }]);
        }, 1000);
    };

    return (
        <div className="ai-container animate-fade-in">
            <div className="ai-layout">
                <div className="chat-section card-glass">
                    <div className="chat-header">
                        <div className="ai-badge">
                            <Bot size={20} />
                            <span>ACON AI Core</span>
                        </div>
                        <div className="ai-status">
                            <span className="pulse-dot"></span>
                            En línea
                        </div>
                    </div>

                    <div className="chat-body">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="msg-content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-footer">
                        <div className="suggestions">
                            {suggestions.map((s, i) => (
                                <button key={i} className="suggestion-pill">
                                    {s.icon}
                                    <span>{s.text}</span>
                                </button>
                            ))}
                        </div>
                        <div className="input-area">
                            <input
                                type="text"
                                placeholder="Escribe tu consulta logística..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className="send-btn" onClick={handleSend}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="knowledge-section">
                    <h3>Capacidades de IA</h3>
                    <div className="capability-card">
                        <div className="cap-icon"><Sparkles size={20} /></div>
                        <div className="cap-info">
                            <strong>Predicción de Rutas</strong>
                            <p>Modelos predictivos basados en data histórica de fletes.</p>
                        </div>
                    </div>
                    <div className="capability-card">
                        <div className="cap-icon"><MessageSquare size={20} /></div>
                        <div className="cap-info">
                            <strong>Soporte al Cliente</strong>
                            <p>Generación de respuestas automáticas para estatus de carga.</p>
                        </div>
                    </div>
                    <div className="capability-card">
                        <div className="cap-icon"><ShieldCheck size={20} /></div>
                        <div className="cap-info">
                            <strong>Compliance Check</strong>
                            <p>Validación automática de documentos (BL, Pedimentos).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
