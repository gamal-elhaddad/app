import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Moment } from 'moment'

export default (build: EndpointBuilder<any, any, any>) =>
    build.mutation<Response, data>({
        query: body => ({
            url: `v3/pitch-owner-dashboard/fixed-bookings`,
            method: 'POST',
            body,
        }),
    })

interface data {
    coach_id?: number
    pitch_id: number
    booking_type: number
    stadium_id?: number
    match_date: string | Moment
    last_match_date: string
    match_time: string
    duration: number
    booking_name: string
    phone_number: string
    booking_note: string
    amount_paid: number
    payment_method: number
    payment_actual_amount: number
    user_id?: number
}