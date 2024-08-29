import React, { useEffect, useState } from 'react';


import { Drawer, Typography, Box, IconButton, Tabs, Tab } from '@mui/material';
import { EventType } from 'src/views/apps/calendar/EventData';
import { InfoOutlined, HistoryOutlined, Close as CloseIcon } from '@mui/icons-material';

import { useLazyFetchBookingQuery } from 'src/services/schedule';
import { DetailsView, LogsView } from './components';

import BlankCard from 'src/components/shared/BlankCard';
import './BookingsDetails.css';

interface EventDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  event: EventType | null;
}

const EventDetailsDrawer: React.FC<EventDetailsDrawerProps> = ({ open, onClose, event }) => {
  const [activeTab, setActiveTab] = useState(0);

  const [request, response] = useLazyFetchBookingQuery()

  useEffect(() => {
    if (event?.booking?.id) {
      request({
        booking_id: event?.booking?.id
      })
    }
  }, [event])

  useEffect(() => {
    if (!open) {
      setActiveTab(0)
    }
  }, [open])

  if (!event) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };


  const data = response?.data?.data

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      classes={{ paper: 'drawer-paper' }}
    >
      <BlankCard className="booking-form-card">
        <Box className="booking-form-header">
          <Typography variant="h4" className="booking-form-title">Booking Details</Typography>
          <IconButton onClick={onClose} className="booking-form-close-button">
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} className="booking-tabs">
          <Tab
            icon={<InfoOutlined />}
            label="Booking Details"
            iconPosition="start"
            className="booking-tab"
            sx={{ fontSize: '1.1rem' }}
          />
          <Tab
            icon={<HistoryOutlined />}
            label="Reservation History"
            iconPosition="start"
            className="booking-tab"
            sx={{ fontSize: '1.1rem' }}
          />
        </Tabs>

        <Box sx={{
          p: 2
        }}>
          {activeTab === 0 ? <DetailsView booking={data} onClose={onClose} /> : <></>}
          {activeTab === 1 ? <LogsView booking={data} /> : <></>}

        </Box>
      </BlankCard>
    </Drawer>
  );
};

export default EventDetailsDrawer;