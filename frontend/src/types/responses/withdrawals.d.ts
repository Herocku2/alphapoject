
type Withdrawal = {
    user: string;  // Username or identifier
    username?: string; // Explicit username from backend
    id: number; // Numeric ID
    amount: number | string; // Amount withdrawn
    date: string; // ISO 8601 date string
    type: string
    payed_date: string
    payment_link: string
    status: string
    fee: number
    verbose_type: string
    verbose_status: string
    verbose_method: string
    wallet_address: string
    bank_account_number: string
    bank_name: string
    bank_country: string
    method: string
    payment_invoice: string
    total_invested?: number  // Total invested by user (all approved investment transactions)
    total_withdrawn?: number  // Total withdrawn by user (INVESTMENT withdrawals + P2P transfers)
    total_p2p_transfers?: number  // Total P2P transfers sent by user (INVESTMENT type)
    refuse_message?: string
}

type WithdrawalsResponse = {
    count: number; // Total count of referrals
    links: Links; // Links for pagination
    results: Withdrawal[]; // Array of Referral objects
    total_pages: number; // Total number of pages
}