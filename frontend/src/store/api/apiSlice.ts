import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BACKEND_DOMAIN
const refreshURL = 'auth/token/refresh/'

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["User", "Tree", "Payments", "Withdrawals",
     'Dashboard', 'InvestmentHistory', 'UserTransfers'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      let token = localStorage.getItem('access');
      const refresh = localStorage.getItem('refresh');
      if (token) {
        const timestamp = localStorage.getItem('timestamp');
        const now = new Date().getTime();
        if (timestamp) {
          const expiry = parseInt(timestamp);
          if (expiry < now) {
            try {
              const response = await fetch(baseURL + refreshURL, {
                method: 'POST',
                body: JSON.stringify({
                  refresh: refresh,
                }),
                headers: { 'Content-Type': 'application/json' },
              });
              if (!response.ok) throw new Error('Network response was not ok');
              const data = await response.json();
              token = data.access;
              localStorage.setItem('access', data.access);
              localStorage.setItem('refresh', data.refresh);
              // Asegurándose de que el tiempo de expiración está en milisegundos
              localStorage.setItem('timestamp', `${now + 5 * 60 * 1000}`);
            } catch (error) {
              console.error('Error refreshing token:', error);
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              localStorage.removeItem('timestamp');
            }
          }
        }
      }
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
