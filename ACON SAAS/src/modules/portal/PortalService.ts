import type { Operation, PortalNotification } from './types';
import type { Quote } from '../quoter/types';

export const getMockOperations = (): Operation[] => [
    {
        id: 'OP-7654',
        quoteId: 'QT-1234',
        clientName: 'Industrial Heavy Machinery',
        serviceType: 'maritime-fcl',
        origin: 'Shanghai, CN',
        destination: 'Manzanillo, MX',
        status: 'active',
        currentStage: 'En Tránsito',
        progressPct: 65,
        eta: '2026-03-15',
        milestones: [
            { id: '1', label: 'Booking Confirmed', completed: true, description: 'Reserva confirmada con la naviera.' },
            { id: '2', label: 'Gate-In Port', completed: true, description: 'Contenedor ingresado en terminal de origen.' },
            { id: '3', label: 'On Board', completed: true, description: 'Carga a bordo del buque MSC CANCUN.' },
            { id: '4', label: 'Arrival at Port', completed: false, description: 'Estimated arrival at Manzanillo.' },
        ],
        documents: [
            { id: 'd1', name: 'Master BL #SHAMZ0982', type: 'BL', uploadDate: '2026-02-01', url: '#' },
            { id: 'd2', name: 'Commercial Invoice', type: 'Invoice', uploadDate: '2026-02-01', url: '#' }
        ]
    }
];

export const getMockClientNotifications = (): PortalNotification[] => [
    {
        id: 'n1',
        title: 'Nueva Cotización Disponible',
        message: 'Tienes una nueva propuesta para la ruta Seoul -> CDMX.',
        timestamp: new Date().toISOString(),
        type: 'info',
        read: false
    },
    {
        id: 'n2',
        title: 'Documento Cargado',
        message: 'Se ha subido el Pedimento para la operación OP-7654.',
        timestamp: new Date().toISOString(),
        type: 'success',
        read: false
    }
];

export const getClientData = () => {
    return {
        user: {
            id: 'CL-001',
            name: 'Carlos Mendoza',
            company: 'Industrial Heavy Machinery',
            email: 'c.mendoza@ihmachinery.com',
            role: 'client-admin'
        },
        stats: {
            activeQuotes: 3,
            ongoingOps: 2,
            pendingDocs: 1
        }
    };
};
