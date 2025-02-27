import React from 'react';
import './EditBooking.css';

import { Box, Drawer, IconButton, Typography } from '@mui/material';

// import TabPanel from '@mui/lab/TabPanel';

// components
import BlankCard from 'src/components/shared/BlankCard';
import {
    ArrowBack
} from '@mui/icons-material';
import { Booking } from 'src/types/apps/booking';

import AddSingleBooking from '../AddSingleBooking/AddSingleBooking';
import AddFixedBooking from '../AddFixedBooking/AddFixedBooking';
import AddCoachBooking from '../AddCoachBooking/AddCoachBooking';

interface FormTabsProps {
    open: boolean;
    onClose: () => void;
    booking: Booking;
    extraData?: {
        [key: string]: string | boolean
    }
}


const RenderBooking = (booking: Booking, onClose: () => void, extraData?: {
    [key: string]: string | boolean
}) => {
    if (booking?.is_coaching_booking) {
        return <AddCoachBooking booking={booking} onClose={onClose} />
    }

    if (booking?.fixed_booking && !extraData?.updateSingleBooking) {
        return <AddFixedBooking booking={booking} onClose={onClose} />
    }

    return <AddSingleBooking booking={booking} onClose={onClose} />
};

const EditBooking: React.FC<FormTabsProps> = ({ open, onClose, booking, extraData }) => {


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
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2, padding: 2 }} className="booking-form-header">
                    <IconButton onClick={onClose} className="booking-form-back-button" sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" className="booking-form-title">Edit Booking</Typography>
                </Box>
                <Box sx={{ height: 'calc(100vh - 100px)', overflow: 'auto', padding: "20px", paddingBottom: "40px" }} className="booking-form-content">
                    {RenderBooking(booking, onClose, extraData)}
                </Box>
            </BlankCard>
        </Drawer>
    );
};

export default EditBooking;