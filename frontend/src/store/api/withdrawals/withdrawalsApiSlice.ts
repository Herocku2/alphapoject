import { apiSlice } from "../apiSlice";

const withdrawalsURL = 'withdrawals/withdrawals/'

export const withdrawalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWithdrawals: builder.query<WithdrawalsResponse, {}>({
      query: (params) => ({
        url: withdrawalsURL + "?" + new URLSearchParams(params),
      }),
      providesTags: ['Withdrawals']
    }),
    createWithdrawal: builder.mutation<string, {}>({
      query: (body) => ({
        url: withdrawalsURL,
        body: body,
        method: "POST"
      }),
      invalidatesTags: ['User', 'Withdrawals', "Dashboard", "InvestmentHistory", "Tree"]
    }),
    createSecretCode: builder.mutation<string, void>({
      query: () => ({
        url: 'withdrawals/withdrawals/create-code/',
        method: "POST"
      }),
    }),
    getAdminWithdrawals: builder.query<WithdrawalsResponse, { page?: number; pageSize?: number; status?: string; method?: string; username?: string }>({
      query: ({ page = 1, pageSize = 10, status = '', method = "", username = "" }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('page_size', pageSize.toString()); // Assuming your backend uses page_size
        if (status) {
          params.append('status', status);
        }
        if (method) {
          params.append("method", method)
        }
        if (username) {
          params.append("username", username);
        }
        return `withdrawals/withdrawals/admin-withdrawals/?${params.toString()}`;
      },
      providesTags: ['Withdrawals']
    }),
    // This mutation will be used to mark withdrawals as paid
    payWithdrawals: builder.mutation<string, { withdrawalIds: number[]; hash: string }>({
      query: ({ withdrawalIds, hash }) => ({
        url: 'withdrawals/withdrawals/pay-admin-withdrawals/', // Or whatever your admin endpoint is for paying
        method: 'POST',
        body: { withdrawalIds: withdrawalIds, hash }, // Example payload
      }),
      invalidatesTags: ['User', 'Withdrawals', "Dashboard", "InvestmentHistory", "Tree"]
    }),
    processFiatWithdrawal: builder.mutation({
      query: (formData) => ({
        url: '/withdrawals/withdrawals/pay-admin-withdrawals-fiat/', // ⚠️ Define este endpoint en tu Django backend
        method: 'POST',
        body: formData,
        // NOTA: No necesitas 'Content-Type', el navegador lo establece automáticamente para FormData
      }),
      // Invalida el caché de retiros para que la lista se actualice automáticamente
      invalidatesTags: ['User', 'Withdrawals', "Dashboard", "InvestmentHistory", "Tree"]
    }),
    refuseWithdrawals: builder.mutation<string, { withdrawalIds: number[]; hash: string }>({
      query: ({ withdrawalIds, msg }) => ({
        url: 'withdrawals/withdrawals/refuse-withdrawals/', // Or whatever your admin endpoint is for paying
        method: 'POST',
        body: { withdrawalIds: withdrawalIds, msg }, // Example payload
      }),
      invalidatesTags: ['User', 'Withdrawals', "Dashboard", "InvestmentHistory", "Tree"]
    }),
  }),
});
export const { useCreateWithdrawalMutation, useGetWithdrawalsQuery, useCreateSecretCodeMutation,
  useGetAdminWithdrawalsQuery, usePayWithdrawalsMutation, useRefuseWithdrawalsMutation,
  useProcessFiatWithdrawalMutation
} = withdrawalsApi;
