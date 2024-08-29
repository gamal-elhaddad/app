import React from 'react';
import './BookingForm.css';

import { Box, Drawer, IconButton, Tab, Typography } from '@mui/material';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// components
import BlankCard from 'src/components/shared/BlankCard';
import AddSingleBooking from '../AddSingleBooking/AddSingleBooking';
import AddFixedBooking from '../AddFixedBooking/AddFixedBooking';
import AddCoachBooking from '../AddCoachBooking/AddCoachBooking';

import {
  Event, Repeat, Close, SportsMartialArts as SportsMartialArtsIcon,
} from '@mui/icons-material';
import { SlotInfo } from 'react-big-calendar';

interface FormTabsProps {
  open: boolean;
  onClose: () => void;
  slotInfo: SlotInfo;
}

const FormTabs: React.FC<FormTabsProps> = ({ open, onClose, slotInfo }) => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const tabConfig = [
    { value: '1', label: 'Single Bookings', icon: <Event />, component: AddSingleBooking },
    { value: '2', label: 'Fixed Bookings', icon: <Repeat />, component: AddFixedBooking },
    { value: '3', label: 'Coach Bookings', icon: <SportsMartialArtsIcon />, component: AddCoachBooking },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '50%',
          padding: '20px',
        },
      }}
      className="booking-form-drawer"
    >
      <BlankCard className="booking-form-card">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, padding: 2 }} className="booking-form-header">
          <Typography variant="h4" className="booking-form-title">Add New Booking</Typography>
          <IconButton onClick={onClose} className="booking-form-close-button">
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ height: 'calc(100vh - 100px)', overflow: 'auto', paddingBottom: "20px" }} className="booking-form-content">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: (theme: any) => theme.palette.divider }} className="booking-form-tabs">
              <TabList onChange={handleChange} aria-label="booking form tabs" variant="fullWidth" scrollButtons="auto">
                {tabConfig.map(({ value, label, icon }) => (
                  <Tab key={value} icon={icon} iconPosition="start" label={label} value={value} />
                ))}
              </TabList>
            </Box>
            {tabConfig.map(({ value, component: Component }) => (
              <TabPanel key={value} value={value} className="booking-form-tab-panel">
                <Component slotInfo={slotInfo} onClose={onClose} />
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </BlankCard>
    </Drawer>
  );
};

export default FormTabs;