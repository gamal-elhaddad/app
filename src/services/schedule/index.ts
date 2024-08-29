import { api } from 'src/services'

import schedule from './schedule'
import discounts from './discounts'
import daysoff from './daysoff'
import booking from './booking'
import addBooking from './addBooking'
import fetchBookingPrice from './getBookingSlotPrice'
import addFixedBooking from './fixedBooking'
import cancelBooking from './cancelBooking'
import cancelFixedBooking from './cancelFixedBooking'
import markAsNotShow from './markAsNotShow'
import editBooking from './editBooking'
import editFixedBooking from './editFixedBooking'

export const authApis = api.injectEndpoints({
  endpoints: build => ({
    fetchSchedule: schedule(build),
    fetchDiscounts: discounts(build),
    fetchDaysoff: daysoff(build),
    fetchBooking: booking(build),
    addBooking: addBooking(build),
    fetchBookingPrice: fetchBookingPrice(build),
    addFixedBooking: addFixedBooking(build),
    cancelBooking: cancelBooking(build),
    cancelFixedBooking: cancelFixedBooking(build),
    markAsNotShow: markAsNotShow(build),
    editBooking: editBooking(build),
    editFixedBooking: editFixedBooking(build)
  }),
  overrideExisting: true,
})

export const {
 useFetchScheduleMutation,
 useFetchDiscountsMutation,
 useLazyFetchDaysoffQuery,
 useLazyFetchBookingQuery,
 useAddBookingMutation,
 useFetchBookingPriceMutation,
 useAddFixedBookingMutation,
 useCancelBookingMutation,
 useCancelFixedBookingMutation,
 useMarkAsNotShowMutation,
 useEditBookingMutation,
 useEditFixedBookingMutation
} = authApis
