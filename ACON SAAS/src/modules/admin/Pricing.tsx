import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    Ship,
    Plane,
    Truck,
    Edit2,
    Trash2,
    Globe,
    User
} from 'lucide-react';
import './Pricing.css';

const PricingPage: React.FC = () => {
    const [activeModality, setActiveModality] = useState('maritime');

    const pricingData = [
        { id: 1, route: 'Shanghai → Manzanillo', client: 'General', type: '20ST', rate: '$1,200', profit: '15%', validity: '2024-03-15' },
        { id: 2, route: 'Shanghai → Manzanillo', client: 'Industrial Heavy Machinery', type: '40HC', rate: '$1,850', profit: '12%', validity: '2024-04-01' },
        { id: 3, route: 'Seoul → Mexico City', client: 'General', type: 'Air (kg)', rate: '$4.20', profit: '20%', validity: '2024-02-28' },
        { id: 4, route: 'Guadalajara → Los Angeles', client: 'AgroExportadora', type: 'FTL 53', rate: '$2,400', profit: '18%', validity: '2024-05-15' },
        { id: 5, route: 'Ningbo → Veracruz', client: 'General', type: '20ST', rate: '$1,450', profit: '15%', validity: '2024-03-10' },
    ];

    return (
        <div className="pricing-container animate-fade-in">
            <div className="pricing-header">
                <div>
                    <h1>Tarifario Global</h1>
                    <p>Gestiona tus tarifas preferenciales por cliente y ruta.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Nueva Tarifa</span>
                </button>
            </div>

            <div className="pricing-tabs card-glass">
                <div className="modality-selector">
                    <button
                        className={`mod-btn ${activeModality === 'maritime' ? 'active' : ''}`}
                        onClick={() => setActiveModality('maritime')}
                    >
                        <Ship size={18} />
                        <span>Marítimo</span>
                    </button>
                    <button
                        className={`mod-btn ${activeModality === 'air' ? 'active' : ''}`}
                        onClick={() => setActiveModality('air')}
                    >
                        <Plane size={18} />
                        <span>Aéreo</span>
                    </button>
                    <button
                        className={`mod-btn ${activeModality === 'land' ? 'active' : ''}`}
                        onClick={() => setActiveModality('land')}
                    >
                        <Truck size={18} />
                        <span>Terrestre</span>
                    </button>
                </div>

                <div className="pricing-filters">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Filtrar por ruta o cliente..." />
                    </div>
                    <button className="btn-filter">
                        <Filter size={18} />
                        <span>Avanzado</span>
                    </button>
                </div>

                <div className="pricing-table">
                    <div className="table-header">
                        <span>Ruta</span>
                        <span>Cliente</span>
                        <span>Equipo</span>
                        <span>Tarifa Base</span>
                        <span>Margen</span>
                        <span>Vigencia</span>
                        <span>Acciones</span>
                    </div>
                    {pricingData.map(item => (
                        <div key={item.id} className="table-row">
                            <div className="p-route">
                                <Globe size={14} className="text-muted" />
                                <span>{item.route}</span>
                            </div>
                            <div className="p-client">
                                <User size={14} className="text-muted" />
                                <span>{item.client}</span>
                            </div>
                            <div className="p-type">{item.type}</div>
                            <div className="p-rate">{item.rate}</div>
                            <div className="p-profit">{item.profit}</div>
                            <div className="p-validity">{item.validity}</div>
                            <div className="p-actions">
                                <button className="icon-btn"><Edit2 size={16} /></button>
                                <button className="icon-btn text-red"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
