import apiSlice from '@/lib/api/apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),
    changePassword: builder.mutation({
      query: (params) => ({
        url: '/change-password',
        method: 'POST',
        body: { ...params },
      }),
    }),
    challenge: builder.mutation({
      query: (params) => ({
        url: '/challenge',
        method: 'POST',
        body: { ...params },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (params) => ({
        url: '/forgot-password',
        method: 'POST',
        body: { ...params },
      }),
    }),
    confirmForgotPassword: builder.mutation({
      query: (params) => ({
        url: '/reset-password',
        method: 'POST',
        body: { ...params },
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useChallengeMutation,
  useForgotPasswordMutation,
  useConfirmForgotPasswordMutation
} = authApiSlice
