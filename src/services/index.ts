// src/api/apiSlice.js
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { AppState } from 'src/store/Store'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL_GENERAL,
  prepareHeaders: (headers, { getState }) => {
    const user = (getState() as AppState).authReducer.user

    // If we have a token set in state, let's assume that we should be passing it.
    if (user?.token) {
      headers.set('authorization', `Bearer ${user.token}`)
    }

    // Set language to expect localized content
    // headers.set('X-Locale', I18nManager.isRTL ? 'ar' : 'en')
    headers.set('App-Platform', 'malaeb-business')

    headers.set('accept', 'application/json');

    return headers;
  },
})

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  console.debug(result)
  
  // const status = result.meta?.response?.status

  // if (status && status >= 400) {
  //   Sentry.sentryErrorHandler(
  //     result.error?.data,
  //     result.meta?.response?.status,
  //     result?.meta?.request?.method,
  //     result?.meta?.request?._bodyInit,
  //   )
  // }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});

