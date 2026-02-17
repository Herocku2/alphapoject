import { apiSlice } from "../apiSlice";
import { jsonToFormData } from "../utils";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<LoginAuthResponse, { data: RegisterCredentials, ref_code: string | undefined }>({
      query: ({ data: user, ref_code }) => ({
        url: `auth/register/${ref_code}/`,
        method: "POST",
        body: user,
      }),
      transformResponse: (response: LoginAuthResponse) => {
        const now = new Date().getTime()
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('timestamp', `${now + 5 * 60 * 1000}`);
        return response
      }
    }),
    login: builder.mutation<LoginAuthResponse, LoginAuthRequest>({
      query: (data) => ({
        url: "auth/token/",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: LoginAuthResponse) => {
        const now = new Date().getTime()
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('timestamp', `${now + 5 * 60 * 1000}`);
        return response
      }
    }),
    getUser: builder.query<UserDataResponse, void>({
      query: () => ({
        url: "/auth/user/",
        method: "GET",
      }),
      providesTags: ['User']
    }),
    refreshToken: builder.mutation({
      query: ({ refresh }) => ({
        url: "auth/token/refresh/",
        method: "POST",
        body: { "refresh": refresh },
      }),
      transformResponse: (response: LoginAuthResponse) => {
        const now = new Date().getTime()
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('timestamp', `${now + 5 * 60 * 1000}`);
        return response
      }
    }),
    sendOTP: builder.mutation({
      query: (credentials) => ({
        url: 'auth/reset-password/send/',
        method: "POST",
        body: {email: credentials},
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: 'auth/reset-password/',
        method: "POST",
        body: credentials,
      }),
    }),
    updateProfile: builder.mutation<UserDataResponse | string, object>({
      query: (body) => ({
        url: 'auth/user/',
        method: "PATCH",
        body: jsonToFormData(body),
      }),
      invalidatesTags: ['User', 'Dashboard', 'Tree',]
    }),
    changePassword: builder.mutation<UserDataResponse, object>({
      query: (body) => ({
        url: 'auth/user/change-password/',
        method: "POST",
        body: jsonToFormData(body),
      }),
      invalidatesTags: ['User']
    }),
  }),
});
export const { useRegisterUserMutation, useLoginMutation, useGetUserQuery, useRefreshTokenMutation, useSendOTPMutation,
   useUpdateProfileMutation, useResetPasswordMutation, useChangePasswordMutation
 } = authApi;
