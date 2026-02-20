export type TransportMode = 'maritime-fcl' | 'maritime-lcl' | 'air' | 'land-ftl' | 'land-ltl';

export interface Location {
    name: string;
    code?: string;
}

export type Incoterm = 'EXW' | 'FCA' | 'FOB' | 'CFR' | 'CIF' | 'CPT' | 'CIP' | 'DAP' | 'DPU' | 'DDP';

export interface Surcharge {
    id: string;
    name: string;
    amount: number;
    type: 'fixed' | 'percentage';
    applyTo: 'unit' | 'total';
}

export interface TechnicalSpecs {
    weightKg: number;
    volumeCbm: number;
    dimensions?: { length: number; width: number; height: number };
    containerType?: string;
    isDangerous: boolean;
    isTemperatureControlled: boolean;
}

export interface ExchangeRate {
    rate: number;
    from: string;
    to: string;
    source: 'manual' | 'api' | 'fixed';
    timestamp: string;
    isLocked: boolean;
}

export interface QuoteAcceptance {
    signature?: string; // Base64 image
    acceptedBy: string;
    role: string;
    timestamp: string;
    ip: string;
    userAgent: string;
    legalVersion: string;
    appliedExchangeRate: number;
}

export type UserRole = 'sales' | 'operations' | 'finance' | 'management' | 'admin';

export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    role: UserRole;
    action: string;
    module: 'quoter' | 'crm' | 'ops' | 'admin';
    targetId: string; // ID de la entidad afectada (ej. Quote ID)
    details: string; // JSON or human readable diff
    severity: 'info' | 'warning' | 'critical';
    ip: string;
}

export interface Quote {
    id: string;
    version: number;
    parentQuoteId?: string; // Para trazabilidad de versiones
    clientId: string;
    serviceType: TransportMode;
    incoterm: Incoterm;
    origin: Location;
    destination: Location;
    cargoType: string;
    specs: TechnicalSpecs;
    baseCosts: {
        freight: number;
        origin: number;
        destination: number;
        customs: number;
        lastMile: number;
    };
    surcharges: Surcharge[];
    margin: {
        type: 'percentage' | 'fixed';
        value: number;
    };
    currency: string;             // Moneda base de cálculo (ej. USD)
    presentationCurrency: string; // Moneda de vista al cliente (ej. MXN)
    exchangeRate: ExchangeRate;
    status: 'draft' | 'sent' | 'accepted' | 'cancelled' | 'converted';
    transitTimeDays: number;
    validityDays: number;
    acceptance?: QuoteAcceptance;
    isLocked: boolean;
    createdAt: string;
    updatedAt: string;
}
