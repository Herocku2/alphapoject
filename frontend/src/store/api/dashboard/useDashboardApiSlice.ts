import { apiSlice } from "../apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStadistics: builder.query<DashboardStadisticsResponse, void>({
            query: () => ({
                url: `core/dashboard/`,
                method: "GET",
            }),
            providesTags: ['Dashboard']
        }),
    })
})

export  const {useGetDashboardStadisticsQuery} = dashboardApi