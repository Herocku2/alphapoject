type Links = {
    next: string | null; // `next` can be a string or null
    previous: string | null; // `previous` can be a string or null
}

type Referral = {
    date: string;  // ISO 8601 date string
    id: number; // Numeric ID
    referred: number; // Referred user's ID
    referred_email: string; // Email of the referred user
    referred_phone_number: string; // Phone number of the referred user (can be empty)
    referred_username: string; // Username of the referred user
    side: string; // Side (could represent a category or type)
    user: number; // User ID of the person making the referral
    status: boolean
    is_master_code: boolean
}

type ReferralResponse = {
    count: number; // Total count of referrals
    links: Links; // Links for pagination
    results: Referral[]; // Array of Referral objects
    total_pages: number; // Total number of pages
}