import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
    build.mutation<Response, data>({
        query: body => ({
            url: `/v3/pitch-owner-dashboard/fixed-bookings/${body.id}`,
            method: 'POST',
            body,
        }),
    })

interface data {
    id: number | undefined
    amount_paid: number,
    booking_name: string,
    booking_note: string,
    booking_type: number,
    duration: number,
    last_match_date: string,
    match_date: string,
    match_time: string,
    payment_actual_amount: number,
    phone_number: string,
    pitch_id: number,
    user_id: number | undefined
    payment_method?: number
}