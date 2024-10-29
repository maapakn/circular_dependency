import { logOut, setCredentials } from '@/lib/features/auth/authSlice'
import type { RootState } from '@/lib/store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { setCookie, deleteCookie } from 'cookies-next'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_APP_BACKEND,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 401) {
    const {
      refreshToken,
      user: { email },
    } = (api.getState() as RootState).auth

    const refereshTokenArgs = {
      url: '/refresh-token',
      method: 'POST',
      body: {
        email: email,
        refresh_token: refreshToken,
      },
    }

    const refreshResult: any = await baseQuery(
      refereshTokenArgs,
      api,
      extraOptions,
    )

    if (refreshResult && refreshResult?.data?.data.access_token) {
      const refreshData = {
        profile: refreshResult.data.data.profile,
        access_token: refreshResult.data.data.access_token,
        refresh_token: refreshToken,
      }
      api.dispatch({ type: 'auth/setCredentials', payload: { ...refreshData } })
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch({ type: 'auth/logOut' })
      logOut
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryReAuth,
  keepUnusedDataFor: 5,
  tagTypes: [],
  endpoints: () => ({}),
})

export default apiSlice
