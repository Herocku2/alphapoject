export interface LegalTemplate {
    id: string;
    serviceType: 'global' | 'maritime' | 'air' | 'land';
    text: string;
    updatedAt: string;
    version: number;
}

export const GLOBAL_DISCLAIMERS = [
    'Las cotizaciones son estimadas, no definitivas.',
    'Precios sujetos a disponibilidad de espacio y equipo.',
    'Tarifas sujetas a cambios sin previo aviso según mercado.',
    'Tipo de cambio variable aplicado al momento de la facturación.',
    'El sistema no garantiza tiempos exactos de tránsito (sujetos a navieras/aerolíneas).',
    'No somos responsables por eventos de fuerza mayor o huelgas.'
];

export const SERVICE_LEGAL_TEMPLATES: Record<string, string> = {
    maritime: 'Sujeto a recargos BAF/CAF variables. Responsabilidades limitadas según reglas de la Haya-Visby.',
    air: 'Tarifas calculadas sobre peso volumétrico (1:6000). Responsabilidad según Convenio de Montreal.',
    land: 'Seguro de mercancía no incluido a menos de que se solicite por escrito. Sujeto a disponibilidad de equipo.'
};

export const LEGAL_CORE = {
    liabilityLimit: 'ACON LOGISTICS actúa únicamente como Agente de Carga Internacional (Forwarder) y su responsabilidad es limitada de acuerdo a los términos estándar de FIATA.',
    paymentTerms: 'Pago de fletes debe realizarse previo a la liberación de documentos en destino, salvo crédito autorizado.',
    cancellationPolicy: 'Cancelaciones con menos de 48 horas de la salida programada pueden generar cargos por "Dead Freight".'
};
