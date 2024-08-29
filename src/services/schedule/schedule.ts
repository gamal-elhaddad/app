import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Booking } from 'src/types/apps/booking';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<Response, Body>({
    query: (body) => ({
      url: 'v3/pitch-owner-dashboard/calendar',
      method: 'POST',
      body
    }),
  })

interface Body {
  from_date: string;
  to_date: string;
  pitches: number[];
}

export interface Response {
  data: Booking[]
}
