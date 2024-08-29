import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
    build.mutation<Response, noShowFlag>({
        query: body => ({
            url: `/v3/pitch-owner-dashboard/bookings/${body.id}/no-show`,
            method: 'POST',
            body,
        }),
    })

export interface noShowFlag {
    no_show: boolean,
    id: number | undefined
}
