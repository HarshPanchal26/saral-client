import { createAsyncThunk } from "@reduxjs/toolkit"
import ApiService from "./ApiService"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../redux/store"
import { setCredentials, setCredentialsForVerificationStatus } from "@/redux/slices/authSlice"


/**
 * 
 * RTK Query for query which are simeple to execute and need to caching  
 */

export const Authapi = createApi({
  reducerPath : "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3333/api/v1/", // Updated to match your API URL
    prepareHeaders: (headers, { getState }) => {
      headers.set("Authorization", `Bearer ${localStorage.getItem('access_token')}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    verify: builder.query<{ user: any }, void>({
      query: () => ({
        url: "verify",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setCredentialsForVerificationStatus({
            isVerificationInProgress: true,
            isVeificationFails: false,
            verificationError: null,
            isVerificationSuccess: false
          }))

          const { data } = await queryFulfilled

          dispatch(setCredentialsForVerificationStatus({
            isVerificationInProgress: false,
            isVeificationFails: false,
            verificationError: null,
            isVerificationSuccess: true
          }))

          dispatch(setCredentials({
            user: data.user,
            isAuthenticated: true,
            token: localStorage.getItem('access_token')
          }))

        } catch (error) {
          console.log("Check error while login====>" , error)
          localStorage.removeItem('access_token')
          dispatch(setCredentialsForVerificationStatus({
            isVerificationInProgress: false,
            isVeificationFails: true,
            verificationError: error,
            isVerificationSuccess: false
          }))
        } finally {
          // localStorage.removeItem('access_token')
          // dispatch(setCredentialsForVerificationStatus({
          //   isVerificationInProgress: false,
          //   isVeificationFails: true,
          //   verificationError: null,
          //   isVerificationSuccess: false
          // }))
        }
      },
    }),
    login: builder.mutation<{ user: any; token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    // Add more endpoints as needed for your school ERP system
  }
  ),
})

export const { useVerifyQuery } = Authapi


/**
 *  
 *   Query using Thunk for complicated one , which need some operation after or before trigger query 
 */

export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await ApiService.post("/login", credentials);
      const { user, token } = response.data;

      // Store token properly
      ApiService.setTokenInLocal(token.token);
      return { user , token };

    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await ApiService.post("/logout", {});
    ApiService.removeTokenFromLocal();
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Logout failed");
  }
});
