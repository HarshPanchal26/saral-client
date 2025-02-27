import { createAsyncThunk } from "@reduxjs/toolkit"
import ApiService from "./ApiService"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { LeaveApplicationForOtherStaff, LeaveApplicationForTeachingStaff, LeavePolicy, LeaveRequest, LeaveType } from "@/types/leave"
import { url } from "inspector"
import { PageMeta } from "@/types/global"
import { setLeavePolicy } from "@/redux/slices/leaveSlice"

// Types for request payloads and responses
interface CreateLeaveRequestPayload {
  userId: string
  userName: string
  startDate: string
  endDate: string
  reason: string
  type: "sick" | "vacation" | "personal" | "other"
}

interface UpdateLeaveRequestStatusPayload {
  requestId: string
  newStatus: "approved" | "rejected"
}

interface ApiErrorResponse {
  message: string
}

/**
 * RTK Query for simple queries that need caching
 */
export const leaveApi = createApi({
  reducerPath: "leaveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3333/api/v1/",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Authorization", `Bearer ${localStorage.getItem('access_token')}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getLeaveTypeForSchool: builder.query<{ data: LeaveType[], page: PageMeta }, void>({
      query: () => ({
        url: `/leave-type?page=all`,
        method: "GET"
      })
    }),

    getAllLeavePoliciesForUser: builder.query<LeavePolicy[], void>({
      query: () => ({
        url: `/leave-policy/user`,
        method: "GET"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setLeavePolicy(data))

        } catch (error) {
          console.log("Check Error while fetching user Policy", error)
        }
      },

    }),

    getLeavePolicyForSchoolPageWise: builder.query<{ data: LeavePolicy[], page: PageMeta }, { page: number }>({
      query: ({ page }) => ({
        url: `/leave-policy?page=${page}`,
        method: "GET"
      })
    }),
    createLeaveType: builder.mutation<LeaveType, Omit<LeaveType, 'id' | 'school_id'>>({
      query: (payload) => ({
        url: `/leave-type`,
        method: "GET"
      })
    }),
    getLeavePolicyForSchool: builder.query<{ data: LeavePolicy[], page: PageMeta }, void>({
      query: () => ({
        url: `/leave-policy`,
        method: "GET"
      })
    }),
    getTeachersLeaveAppication: builder
      .query<{ data: LeaveApplicationForTeachingStaff[], page: PageMeta }, { teacher_id: number, status: 'pending' | 'approved' | 'rejected' | 'cancelled', page: number }>({
        query: ({ teacher_id, page, status }) => ({
          url: `/leave-application/${teacher_id}?role=teacher&status=${status}&page=${page}`,
          method: "GET"
        })
      }),

    applyLeaveForTeacher: builder
      .mutation<LeaveApplicationForTeachingStaff, Omit<LeaveApplicationForTeachingStaff, 'id' | 'uuid' | 'status' | 'number_of_days' | 'applied_by_self' | 'applied_by' | 'leave_type' | 'staff'>>({
        query: (payload) => ({
          url: `/leave-application?staff=teachers`,
          method: "POST",
          body: payload
        })
      }),

    updateLeaveForTeacher: builder
      .mutation<LeaveApplicationForTeachingStaff, Partial<LeaveApplicationForTeachingStaff>>({
        query: (payload) => ({
          url: `/leave-application?staff=teachers`,
          method: "POST",
          body: payload
        })
      }),

    fetchTeachersLeaveApplicationForAdmin: builder
      .query<{ data: LeaveApplicationForTeachingStaff[], meta: PageMeta }, { status: 'pending' | 'approved' | 'rejected' | 'cancelled', page: number , date : string | undefined }>({
        query: ({ date, status, page = 1 }) => ({
          url: date !== undefined ? 
          `/leave-application?role=teacher&status=${status}&page=${page}`
          : `/leave-application?role=teacher&status=${status}&page=${page}`
          ,
          method: "GET"
        })
    }),

    fetchOtherStaffLeaveApplicationForAdmin: builder
      .query<{ data: LeaveApplicationForOtherStaff[], meta: PageMeta }, { status: 'pending' | 'approved' | 'rejected' | 'cancelled', page: number }>({
        query: ({ status, page = 1 }) => ({
          url: `/leave-application?role=other&status=${status}&page=${page}`,
          method: "GET"
        })
    }),


  }),
})

export const {
  useLazyGetLeaveTypeForSchoolPageWiseQuery,
  useLazyGetLeavePolicyForSchoolPageWiseQuery,
  useLazyGetAllLeaveTypeForSchoolQuery,
  useGetAllLeaveTypeForSchoolQuery,

  useLazyGetAllLeavePoliciesForUserQuery,

  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,

  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,

  useApplyLeaveForTeacherMutation,
  useUpdateLeaveForTeacherMutation,

  useLazyFetchTeachersLeaveApplicationForAdminQuery,
  useLazyFetchOtherStaffLeaveApplicationForAdminQuery,

  useLazyGetTeachersLeaveAppicationQuery
} = LeaveApi

/**
 * Thunks for more complex operations
 */
// export const createLeaveRequest = createAsyncThunk<LeaveRequest, CreateLeaveRequestPayload>(
//   "leave/createLeaveRequest",
//   async (leaveRequest, { rejectWithValue }) => {
//     try {
//       const response = await ApiService.post("/leave", leaveRequest)
//       return response.data
//     } catch (error: any) {
//       const errorResponse = error.response?.data as ApiErrorResponse
//       return rejectWithValue(errorResponse?.message || "Failed to create leave request")
//     }
//   },
// )

// export const updateLeaveRequestStatus = createAsyncThunk<LeaveRequest, UpdateLeaveRequestStatusPayload>(
//   "leave/updateLeaveRequestStatus",
//   async ({ requestId, newStatus }, { rejectWithValue }) => {
//     try {
//       const response = await ApiService.put(`/leave/${requestId}`, { status: newStatus })
//       return response.data
//     } catch (error: any) {
//       const errorResponse = error.response?.data as ApiErrorResponse
//       return rejectWithValue(errorResponse?.message || "Failed to update leave request status")
//     }
//   },
// )

// export const deleteLeaveRequest = createAsyncThunk<void, string>(
//   "leave/deleteLeaveRequest",
//   async (requestId, { rejectWithValue }) => {
//     try {
//       await ApiService.delete(`/leave/${requestId}`)
//     } catch (error: any) {
//       const errorResponse = error.response?.data as ApiErrorResponse
//       return rejectWithValue(errorResponse?.message || "Failed to delete leave request")
//     }
//   },
// )

