import type { Quote, QuoteAcceptance } from './types';

export const generateAcceptanceEvidence = (name: string, role: string, signature?: string): QuoteAcceptance => {
    return {
        acceptedBy: name,
        role: role,
        signature: signature,
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1', // Mocked or fetched from a service
        userAgent: navigator.userAgent,
        legalVersion: 'V.2.0-2026',
        appliedExchangeRate: 1 // This should be the rate at the moment of acceptance
    };
};

export const lockQuoteAfterAcceptance = (quote: Partial<Quote>, acceptance: QuoteAcceptance): Partial<Quote> => {
    return {
        ...quote,
        status: 'accepted',
        isLocked: true,
        acceptance: acceptance,
        exchangeRate: {
            ...quote.exchangeRate!,
            isLocked: true // Force lock FX on acceptance
        }
    };
};

export const verifyIPAddress = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (e) {
        return 'Unknown';
    }
};
