import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Coach } from 'src/types/apps/coach';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Response, { stadium_id: number; page: number }>({
    query: (body) => ({
      url: `v4/pitch-owner-app/stadiums/${body.stadium_id}/coaches?get_all_data=0&page=${body.page}`,
      method: 'GET',
    }),
  })


export interface Response {
  data: Coach[]
  meta_data: {
    current_page: number
    last_page: number
    total: number
  }
}
