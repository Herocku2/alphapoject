import { apiSlice } from '../apiSlice'; // Asegúrate de que la ruta a tu apiSlice principal sea correcta

// --- TIPOS E INTERFACES ---

// Define los datos que la mutación recibe como argumento.
// Idealmente, este tipo se comparte desde un archivo de tipos común.
interface TransferFormInputs {
    transfer_type: 'balance' | 'utility' | 'investment';
    receiver_username: string;
    amount: number;
    secret_code: string;
}

// Define la forma de la respuesta exitosa que esperamos del backend.
interface TransferSuccessResponse {
    detail: string;
}

interface FoundUser {
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

interface FindUserBody {
    email: string;
}


interface Transfer {
    id: number;
    amount: string;
    timestamp: string;
    transfer_type_display: string;
    sender_username: string;
    receiver_username: string;
}

interface PaginatedTransferResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Transfer[];
    total_pages: number; // Suponiendo que tu paginador lo devuelve
}

export const transfersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        /**
         * Definición de la mutación para crear una transferencia.
         * Se tipa con <Resultado, Argumento>
         * - Resultado: TransferSuccessResponse (lo que devuelve la API si tiene éxito)
         * - Argumento: TransferFormInputs (los datos que se le pasan al hook)
         */
        createUserTransfer: builder.mutation<TransferSuccessResponse, TransferFormInputs>({
            query: (transferData) => ({
                url: '/transfers/create/', // La URL del endpoint de Django
                method: 'POST',
                body: transferData, // TypeScript ahora sabe que esto debe ser de tipo TransferFormInputs
            }),
            invalidatesTags: ['User', 'UserTransfers'], // Para refrescar los saldos y el historial
        }),
        findUserByEmail: builder.mutation<FoundUser, FindUserBody>({
            query: (body) => ({
                url: '/transfers/find/',
                method: 'POST', // CAMBIADO a POST
                body: body,      // Enviamos el email en el cuerpo de la petición
            }),
        }),
        getTransferHistory: builder.query<PaginatedTransferResponse, number>({
            query: (page = 1) => `/transfers/history/?page=${page}`,
            providesTags: ['UserTransfers'], // Etiqueta para el cache
        }),
    })
});

// Exportamos el hook autogenerado para usarlo en los componentes.
// El hook ahora estará correctamente tipado.
export const {
    useCreateUserTransferMutation,
    useFindUserByEmailMutation,
    useGetTransferHistoryQuery
} = transfersApiSlice;