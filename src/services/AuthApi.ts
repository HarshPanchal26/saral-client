// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// import type { RootState } from "../redux/store"
// import ApiService from "./ApiService"

// export const Authapi = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:3333/api/v1", // Updated to match your API URL
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.token
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`)
//       }
//       return headers
//     },
//   }),
//   endpoints: (builder) => ({
//     login: builder.mutation<{ user: any; token: string }, { email: string; password: string }>({
//       query: (credentials) => ({
//         url: "login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     verify: builder.query<{ user: any }, void>({
//       query: () => ({
//         url: "verify",
//         method: "GET",
//       }),
//     })
//     // Add more endpoints as needed for your school ERP system
//   }
//   ),
// })

// export const { useLoginMutation , useVerifyQuery} = Authapi











// // Integrate with ApiService for non-RTK Query requests

// // export const extendedApi = {
// //   ...Authapi,
// //   login: (credentials: { email: string; password: string }) => ApiService.post("/login", credentials),
// //   logout: () => ApiService.post("/logout", {}),
// // }

