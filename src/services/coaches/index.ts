import { api } from 'src/services'

import coaches from './coaches'

export const authApis = api.injectEndpoints({
  endpoints: build => ({
    fetchCoaches: coaches(build),
  }),
  overrideExisting: true,
})

export const {
  useLazyFetchCoachesQuery,
} = authApis
