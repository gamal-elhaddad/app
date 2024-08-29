import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
    build.mutation<Response, body>({
        query: body => ({
            url: `/v3/pitch-owner-dashboard/bookings/${body.id}/cancel`,
            method: 'POST',

        }),
    })

export interface body {
    id: number
}
