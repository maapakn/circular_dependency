import { createSlice } from '@reduxjs/toolkit'
import { authApiSlice } from './authApiSlice'
import { setCookie, deleteCookie } from 'cookies-next'

interface Policy {
  category: string
  create: boolean
  update: boolean
  delete: boolean
  show: boolean
}

export interface UserProfile {
  id: number | null
  name: string | undefined
  last_name: string | undefined
  avatar_url: string | null
  phone_number: string | null
  subject: string | undefined
  username: string | undefined
  email: string | undefined
  roles: string[] | null
  national_nid: string | undefined
  push_token: string | undefined
  policies: Policy[] | undefined
}

export interface IAuthState {
  user: UserProfile | null
  token: string | null
  refreshToken: string | null
}

const initialState: IAuthState = {
  user: null,
  token: null,
  refreshToken: null,
}

const setAuthCookie = (name: string, token: string) => {
  setCookie(name, token)
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {
        profile,
        access_token: accessToken,
        refresh_token: refreshToken,
      } = action.payload
      return {
        ...state,
        user: profile,
        token: accessToken,
        refreshToken,
      }
    },
    setCredentialstoVerify: (state, action) => {
      const { profile, session } = action.payload
      return {
        ...state,
        email: profile.email,
        session,
      }
    },
    logOut: () => deleteCookie('auth')
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApiSlice.endpoints.login.matchFulfilled,
      (_state, { payload }) => {
        setAuthCookie('auth', payload.data.access_token)
      },
    )
    .addMatcher(
      authApiSlice.endpoints.challenge.matchFulfilled,
      (_state, { payload }) => {
        setAuthCookie('auth', payload.data.access_token)
      },
    )
  },
})

export const { setCredentials, setCredentialstoVerify, logOut } =
  authSlice.actions
export const authReducer = authSlice.reducer
export const selectedCurrentUsername = (state: IAuthState) => state.user
export const selecteCurrentToken = (state: IAuthState) => state.token
