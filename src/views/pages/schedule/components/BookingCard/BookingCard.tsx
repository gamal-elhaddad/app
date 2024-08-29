import { Tooltip, Typography } from "@mui/material";
import { EventType } from "src/views/apps/calendar/EventData";

const BookingCard = ({ event }: { event: EventType }) => {
    return (
      <div className="custom-event" style={{ backgroundColor: event.color }}>
        <div className="custom-event-header">
          <Tooltip title={event.title} arrow>
            <Typography
              variant="caption"
              noWrap
              className="custom-event-title"
            >
              {event.title}
            </Typography>
          </Tooltip>
          <Typography variant="caption" className="custom-event-price">
            {event?.booking?.final_price} {event?.booking?.payment_currency}
          </Typography>
        </div>
        <div className="custom-event-booking-type">
          {event.booking?.fixed_booking ? 'Fixed Booking' : 'Single'}
        </div>
      </div>
    );
  }

  export default BookingCard