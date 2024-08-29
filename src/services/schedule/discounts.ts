import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Discount } from 'src/types/apps/discount';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<Response, Body>({
    query: (body) => ({
      url: `v3/pitch-owner-dashboard/stadiums/${body.stadium_id}/pitches/discounts`,
      method: 'POST',
      body
    }),
  })

interface Body {
  start_date: string;
  end_date: string;
  stadium_id: number
  pitch_id: number;
}

interface Response {
  data: {
    [key: string]: Discount[]
  }
}
