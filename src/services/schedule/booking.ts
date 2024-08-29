import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { Booking } from 'src/types/apps/booking';

export default (build: EndpointBuilder<any, any, any>) =>
    build.query<Response, Body>({
        query: (body) => ({
            url: `v4/pitch-owner-app/bookings/${body?.booking_id}`,
            method: 'GET',
        }),
    })

interface Body {
    booking_id: number;
}

export interface Response {
    data: Booking
}
