import { api } from 'src/services'

import stadiums from './stadiums'
import pitches from './pitches'

export const authApis = api.injectEndpoints({
  endpoints: build => ({
    fetchStadiums: stadiums(build),
    fetchPitches: pitches(build)
  }),
  overrideExisting: true,
})

export const {
  useLazyFetchStadiumsQuery,
  useLazyFetchPitchesQuery
} = authApis
