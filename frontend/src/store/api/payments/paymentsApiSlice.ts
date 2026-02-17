import { apiSlice } from "../apiSlice";


export const treeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBinaryPayments: builder.query<BinaryPaymentsResponse, {}>({
      query: (params) => ({
        url: "payments/binary-payments/?"+ new URLSearchParams(params),
      }),
      providesTags: ['Payments']
    }),
    getBinaryPoints: builder.query<BinaryPointsPaymentsResponse, {}>({
      query: (params) => ({
        url: "payments/binary-points-payments/?"+ new URLSearchParams(params),
      }),
      providesTags: ['Payments']
    }),
    getDirectPayments: builder.query<DirectPaymentResponse, {page: string}>({
      query: (params) => ({
        url: "payments/direct-payments/?"+ new URLSearchParams(params),
      }),
      providesTags: ['Payments']
    }),
    getPasivePayments: builder.query<PasivePaymentResponse, {page: string}>({
      query: (params) => ({
        url: "payments/pasive-payments/?"+ new URLSearchParams(params),
      }),
      providesTags: ['Payments']
    }),
     getMonthlyEarnings: builder.query<[], number>({
      query: (year) => `payments/earnings/${year}/`,
    }),
  }),
});
export const { useGetBinaryPaymentsQuery, useGetDirectPaymentsQuery, useGetPasivePaymentsQuery, useGetBinaryPointsQuery,
  useGetMonthlyEarningsQuery
 } = treeApi;
