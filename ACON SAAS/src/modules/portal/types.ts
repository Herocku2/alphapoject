import type { TransportMode } from '../quoter/types';

export interface OperationMilestone {
    id: string;
    label: string;
    date?: string;
    completed: boolean;
    description: string;
}

export interface Operation {
    id: string;
    quoteId: string;
    clientName: string;
    serviceType: TransportMode;
    origin: string;
    destination: string;
    status: 'active' | 'completed' | 'on-hold' | 'cancelled';
    currentStage: string;
    progressPct: number;
    milestones: OperationMilestone[];
    documents: PortalDocument[];
    eta?: string;
}

export interface PortalDocument {
    id: string;
    name: string;
    type: 'BL' | 'AWB' | 'Invoice' | 'PackingList' | 'Pedimento' | 'Quote' | 'Evidence';
    uploadDate: string;
    url: string;
    size?: string;
}

export interface PortalNotification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    type: 'info' | 'warning' | 'success';
    read: boolean;
}

export interface PortalUser {
    id: string;
    name: string;
    company: string;
    email: string;
    role: 'client-admin' | 'client-viewer';
}
