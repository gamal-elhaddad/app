import React, { useEffect, useState } from 'react';
import {
  CardContent,
} from '@mui/material';
import { Calendar, DateRangeFormatFunction, momentLocalizer, SlotInfo, SlotPropGetter, View } from 'react-big-calendar';

import StadiumPitchesButton from 'src/layouts/full/vertical/header/StadiumPitchesButton'

import moment from 'moment';
import { EventType } from 'src/views/apps/calendar/EventData';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './Schedule.css';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import BlankCard from 'src/components/shared/BlankCard';

import useScheduleHook, { EventView } from './hooks/useScheduleHook'

import useHelpers from './hooks/useHelpers';
import BookingForm from './components/BookingForm/BookingForm';

import { AppState, dispatch, useSelector } from 'src/store/Store';
import { BookingCard, BookingsDetails } from './components';
import { setScheduleConfig } from 'src/store/apps/schedule/ScheduleSlice';
import { Pitch } from 'src/types/apps/stadium';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

type EvType = {
  title: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  color?: string;
};

const BigCalendar = () => {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const [currentView, setCurrentView] = useState<EventView>(EventView.Week);

  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo>();

  const pitches = useSelector((state: AppState) => state.configReducer.pitches);
  const scheduleConfig = useSelector((state: AppState) => state.scheduleReducer.scheduleConfig);
  const bookings = useSelector((state: AppState) => state.scheduleReducer.bookings);

  // Fetch schedule data based on visible range and current view
  const { setAllowAutoUpdate } = useScheduleHook()

  const { renderSlot } = useHelpers()

  // Handle navigation to a new date
  const handleNavigate = (newDate: Date) => {
    const from_date = moment(newDate).startOf('week').format('YYYY-MM-DD');
    const to_date = moment(newDate).endOf('week').format('YYYY-MM-DD')

    dispatch(setScheduleConfig({
      from_date,
      to_date,
      showAllPitches: currentView === EventView.Day
    }))

  };

  useEffect(() => {
    // .. this to add enable option to refresh the calendar
    setAllowAutoUpdate(true)
  }, [])

  useEffect(() => {
    if (!scheduleConfig?.from_date) {
      const currentDate = new Date();
      const from_date = moment(currentDate).startOf('week').format('YYYY-MM-DD')
      const to_date = moment(currentDate).endOf('week').format('YYYY-MM-DD')

      dispatch(setScheduleConfig({
        from_date,
        to_date,
        showAllPitches: currentView === EventView.Day
      }))

      return
    }

    dispatch(setScheduleConfig({
      from_date: scheduleConfig?.from_date,
      to_date: scheduleConfig?.to_date,
      showAllPitches: currentView === EventView.Day
    }))
  }, [currentView])

  // Handle view change (month, week, day)
  const handleViewChange = (newView: View) => {
    setCurrentView(newView as EventView);
  };

  // Handle click on an event
  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  // Close the event details drawer
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedEvent(null);
  };

  // Determine event color based on event properties
  const eventColors = (event: EvType) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  // Get properties for rendering time slots
  const slotPropGetter: SlotPropGetter = (date: Date, resourceId?: string | number) => {
    const className = renderSlot(date, resourceId, currentView === EventView.Day);

    return { className };
  };

  // Handle selection of a time slot
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (slotInfo) {
      setSelectedSlot(slotInfo);
    }
    setIsBookingFormOpen(true);
  };

  // Close the booking form
  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setSelectedSlot(undefined);
  };

  // Custom format function for event time range (returns empty string)
  const eventTimeRangeFormat: DateRangeFormatFunction = () => '';

  return (
    <PageContainer title="Schedule" description="this is schedule page">
      <Breadcrumb title="Schedule" subtitle="App" />
      <BlankCard>
        {currentView !== EventView.Day ? <StadiumPitchesButton /> : <></>}
        <CardContent>
          <Calendar<any, Pitch>
            selectable
            events={bookings || []}
            defaultView={EventView.Week}
            views={['month', 'week', 'day',]}
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 350px' }}
            onSelectEvent={handleEventClick}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={(event: any) => eventColors(event)}
            onNavigate={handleNavigate}
            formats={{
              eventTimeRangeFormat
            }}
            components={{
              event: BookingCard
            }}
            slotPropGetter={slotPropGetter}
            onView={handleViewChange}
            resources={currentView === EventView.Day ? pitches : undefined}
            resourceIdAccessor="id"
            resourceTitleAccessor="lable"
          />
        </CardContent>
      </BlankCard>

      <BookingsDetails
        open={drawerOpen}
        onClose={handleDrawerClose}
        event={selectedEvent}
      />

      {selectedSlot ? (
        <BookingForm
          open={isBookingFormOpen}
          onClose={handleCloseBookingForm}
          slotInfo={selectedSlot}
        />
      ) : <></>}
    </PageContainer>
  );
};

export default BigCalendar;