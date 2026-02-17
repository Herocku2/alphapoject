type InvestmentPlan = {
  id: number
  start_price: number
  end_price: number
  name: string
  details: string
  is_in_discount: boolean
  pasive_percentage: number
  direct_bonus: number
  discount_price: number
  binary_bonus: number
  renovation_precentage: number
  coinbase_guarantee: boolean
}

type PaymentPlanResponse = {
  error: string;
  result: {
    amount: string;
    txn_id: string;
    address: string;
    confirms_needed: string;
    timeout: number;
    checkout_url: string;
    status_url: string;
    qrcode_url: string;
  };
};

type TransactionResponse = {
    amount: string;
    amount_identifier: number;
    attemps_to_verify: number;
    created_date: string; // ISO 8601 string
    end_block_number: number;
    from_wallet: string;
    id: number;
    information: Record<string, any>; // Use a more specific type if known
    last_time_stamp_attempt: string;
    network: string;
    receiver_wallet: string;
    start_block_number: number;
    status: string;
    token: string;
    txn_id: string;
    user: string;
};

type InvestmentHistory = {
  id: number;
  amount: string;
  coinpayments_response: object;
  status: string;
  date: string;
  txn_id: string;
  pay_with_balance: boolean;
  levels_paid: boolean;
  current_investment: number;
  before_investment_value: number
  withdrawn_from_deposit: number
};


type InvestmentHistoryResponse = {
  count: number; // Total count of referrals
  links: Links; // Links for pagination
  results: InvestmentHistory[]; // Array of Referral objects
  total_pages: number; // Total number of pages
}

// Define la estructura para los datos del gráfico
interface InvestmentChartData {
  labels: string[]; // Un arreglo de strings, ej: ["Enero", "Febrero", ...]
  data: number[];   // Un arreglo de números, ej: [50000, 150000, ...]
}

// Define la estructura completa de la respuesta de la API
interface InvestmentDashboardData {
  totalInvestments: number;
  totalInvestors: number;
  investmentGoal: number;
  chartData: InvestmentChartData; // Usa la interfaz definida arriba
  all_withdrawals_sum: number
}