import { Booking } from "src/types/apps/booking";

export interface EventType {
  title?: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  color?: string;
  booking: Booking
}

const Events: EventType[] = [
];

export default Events

