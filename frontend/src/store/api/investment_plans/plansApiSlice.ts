import { apiSlice } from "../apiSlice";

export const plansApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation<TransactionResponse, { amount: number, payPasive?: boolean }>({
            query: (body) => ({
                url: `plans/create-investment-payment/`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ['User', 'Dashboard', 'Tree', 'InvestmentHistory']
        }),
        verifyPayment: builder.mutation<string, { id: number }>({
            query: ({ id }) => ({
                url: `plans/verify-investment-amount/`,
                method: "POST",
                body: { id: id }
            }),
            invalidatesTags: ['User', 'Dashboard', 'Tree', 'InvestmentHistory']
        }),
        getInvestmentHistory: builder.query<InvestmentHistoryResponse, { page: string }>({
            query: (params) => ({
                url: "plans/history/?" + new URLSearchParams(params),
            }),
            providesTags: ['InvestmentHistory']
        }),
        getInvestmentPanel: builder.query<InvestmentDashboardData, void>({
            query: () => ({
                url: "plans/investment-panel/?",
            }),
            providesTags: ['InvestmentHistory']
        }),
        createReinvestment: builder.mutation<TransactionResponse, { amount: number, payPasive?: boolean }>({
            query: (body) => ({
                url: `plans/reinvest/`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ['User', 'Dashboard', 'Tree', 'InvestmentHistory']
        }),
    })
})

export const { useCreatePaymentMutation, useVerifyPaymentMutation, useGetInvestmentHistoryQuery,
    useGetInvestmentPanelQuery, useCreateReinvestmentMutation
 } = plansApi