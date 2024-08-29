import { api } from 'src/services'

import login from './login'

export const authApis = api.injectEndpoints({
  endpoints: build => ({
    login: login(build),
  }),
  overrideExisting: true,
})

export const {
  useLoginMutation,
} = authApis
