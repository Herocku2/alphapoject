type DirectPayment = {
    user_username: string
    user_email: string
    investment: number
    amount: number
    date: string
    investment_amount: number
    level: number
}

type PasivePayment = {
    current_investment_amount: string
    amount: string
    date: string
}


type BinaryPayment = {
    amount: string
    date: string
    left_points: string
    right_points: string
}

type BinaryPointsPayment = {
    amount: string
    date: string
    points: string
    side: string
    level: string
    detail: string
}


type DirectPaymentResponse = {
    count: number; // Total count of referrals
    links: Links; // Links for pagination
    results: DirectPayment[]; // Array of Referral objects
    total_pages: number; // Total number of pages
}

type PasivePaymentResponse = {
    count: number; // Total count of referrals
    links: Links; // Links for pagination
    results: PasivePayment[]; // Array of Referral objects
    total_pages: number; // Total number of pages
}



type BinaryPaymentsResponse = {
    count: number; // Total count of referrals
    links: Links; // Links for pagination
    results: BinaryPayment[]; // Array of Referral objects
    total_pages: number; // Total number of pages
}

type BinaryPointsPaymentsResponse = {
    count: number; // Total count of referrals
    links: Links; // Links for pagination
    results: BinaryPointsPayment[]; // Array of Referral objects
    total_pages: number; // Total number of pages
}