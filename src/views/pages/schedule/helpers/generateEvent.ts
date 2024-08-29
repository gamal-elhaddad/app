import { Booking, BookingTypes } from "src/types/apps/booking";
import { ColorVariation } from "./eventColors";

export default (item: Booking) => {

    const startDate = new Date(`${item.match_date}T${item.match_time}`);
    const endDate = new Date(`${item.match_date}T${item.match_end_time}`);

    let color = 'default'
    if (item.is_coaching_booking) {
        color = ColorVariation?.[3].eColor
    } else {
        if (item.booking_type === BookingTypes.OwnerMadeBooking) {
            color = ColorVariation?.[2].eColor
        } else if (item.booking_type === BookingTypes.UserMadeBooking)(
            color = ColorVariation?.[1].eColor
        )
    }

    const booking = {
        title: item?.booking_name,
        allDay: false,
        start: startDate,
        end: endDate,
        color: color,
        booking: item
    }

    return booking
}