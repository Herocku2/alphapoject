export interface Currency {
    code: string;
    symbol: string;
    name: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' }
];

export const getMockExchangeRate = (from: string, to: string): number => {
    const rates: Record<string, number> = {
        'USD-MXN': 20.45,
        'USD-EUR': 0.92,
        'EUR-USD': 1.09,
        'MXN-USD': 0.049,
        'USD-USD': 1,
        'MXN-MXN': 1,
        'EUR-EUR': 1
    };
    return rates[`${from}-${to}`] || 1;
};

export const convertCurrency = (amount: number, rate: number): number => {
    return amount * rate;
};

export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};
