type DashboardStadisticsResponse = {
    investment_amount: number,
    total_profit : number,
    daily: number,
    direct_users : number,
    indirect_users : number
    daily_payment: number,
    days_profit: number,
    daily_percentage: number
    withdrawable_date: string
    chart_data: {
        labels: Array
        series: Array
    }
    withdrawable_date: string
    investment_progress: number
}