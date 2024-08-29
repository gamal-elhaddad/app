import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Pitch } from 'src/types/apps/stadium'

export default (build: EndpointBuilder<any, any, any>) =>
    build.query<Response, Body>({
        query: body => ({
            url: `/v4/pitch-owner-dashboard/stadiums/${body.stadium_id}/pitches`,
            method: 'GET',
        }),
    })

interface Body {
    stadium_id: number
}

interface Response {
    data: Pitch[]
}
