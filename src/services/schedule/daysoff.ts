import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { DayOff } from 'src/types/apps/dayoff';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Response, Body>({
    query: (body) => ({
      url: `v4/pitch-owner-dashboard/stadiums/${body?.stadium_id}/daysoff`,
      method: 'GET',
    }),
  })

interface Body {
  stadium_id: number;
}

export interface Response {
  data: DayOff[]
}
