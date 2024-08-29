import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Stadium } from 'src/types/apps/stadium';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Response, undefined>({
    query: () => ({
      url: 'v4/pitch-owner-dashboard/stadiums',
      method: 'GET',
    }),
  })


export interface Response {
  data: Stadium[]
}
