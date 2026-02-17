import { apiSlice } from "../apiSlice";

const treeURL = 'tree/get-binary-tree/'

export const treeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBinaryTree: builder.query<TreeLeaf[], void>({
      query: () => ({
        url: treeURL,
      }),
      providesTags: ['Tree']
    }),
    getReferrals: builder.query<ReferralResponse, {page: string}>({
      query: (params) => ({
        url: "tree/get-referrals/?" + new URLSearchParams(params),
      }),
      providesTags: ['Tree']
    }),
    activateMasterCode: builder.mutation<{message: string}, {id: number}>({
      query: ({id}) => ({
        url: `tree/get-referrals/${id}/activate-master-code/`,
        method: "POST"
      }),
      invalidatesTags: ['Tree']
    }),
  }),
});
export const { useGetBinaryTreeQuery, useGetReferralsQuery, useActivateMasterCodeMutation } = treeApi;
