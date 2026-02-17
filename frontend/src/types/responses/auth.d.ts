type LoginAuthResponse = {
    access: string
    refresh: string
}

type UserDataResponse  = {
    avatar : string  
    email: string
    first_name: string
    last_name: string
    username: string
    phone_number: string
    ref_code: string
    balance: number
    usdt_wallet: string
    is_fundator: boolean
    investment_balance: number
    is_superuser: boolean
    bank_full_name: string
    bank_account_number: string
    bank_name: string
    bank_country: string
    bank_swift_code: string
}