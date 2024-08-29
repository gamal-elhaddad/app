import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Moment } from 'moment'

export default (build: EndpointBuilder<any, any, any>) =>
    build.mutation<Response, data>({
        query: body => ({
            url: `/v3/pitch-owner-dashboard/booking-slot-price`,
            method: 'POST',
            body,
        }),
    })

interface data {
    pitch_id: number,
    match_date: string | Moment,
    match_time: string,
    duration: number,
    day_of_week?: number
}

interface Response {
    data: {
        price: number
    }
}