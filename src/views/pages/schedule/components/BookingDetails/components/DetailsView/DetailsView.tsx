import React, { useState, useMemo, useCallback } from 'react';

import { Typography, Box, Grid, IconButton, Tooltip, Switch } from '@mui/material';
import {
    Bookmark as BookmarkIcon,
    Stadium as StadiumIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    CalendarToday as CalendarTodayIcon,
    AccessTime as AccessTimeIcon,
    SportsMartialArts as SportsMartialArtsIcon,
    AttachMoney as AttachMoneyIcon,
    LocalOffer as LocalOfferIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
    Receipt as ReceiptIcon,
    Note as NoteIcon,
    Edit as EditIcon,
    Cancel as CancelIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    EventRepeat as EventRepeatIcon
} from '@mui/icons-material';

import { Booking } from 'src/types/apps/booking';
import { useCancelBookingMutation, useCancelFixedBookingMutation, useMarkAsNotShowMutation } from 'src/services/schedule';

import EventInfoGridItem from '../EventInfoGridItem/EventInfoGridItem';
import moment from 'moment';

import EditBooking from '../../../EditBooking/EditBooking';
import Addons from '../../../Addons/Addons';

import useScheduleHook from '../../../../hooks/useScheduleHook'
import ConfirmationAlertDialog from 'src/components/shared/ConfirmationAlertDialog';
import useToast from 'src/hooks/useToast';
import PopupDialog from 'src/components/shared/PopupDialog'


interface EventDetailsDrawerProps {
    booking: Booking | undefined
    onClose: () => void;
}

const DetailsView: React.FC<EventDetailsDrawerProps> = ({ booking, onClose }) => {
    const [isBookingFormOpen, setBookingFormOpen] = useState(false)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [updateSingleBooking, setSingleBooking] = useState(false)

    const [cancelBooking] = useCancelBookingMutation()
    const [cancelFixedBooking] = useCancelFixedBookingMutation()
    const [markAsNotShow] = useMarkAsNotShowMutation()

    const [noShow, setNotShow] = useState(booking?.no_show || false)
    const [isAddonsOpen, setAddonsFormOpen] = useState(false)

    const { fetchBookings } = useScheduleHook()
    const { toastPromise } = useToast()

    const handleCancelBooking = useCallback(() => {
        if (booking) {
            toastPromise({
                request: () => cancelBooking({ id: booking?.id }),
                onSuccess: (result: any) => {
                    if ('error' in result) throw result.error;
                    fetchBookings();
                    onClose();

                    return 'Booking has been cancelled!';
                },
                onError: (err) => {
                    if (err.data?.errors) {
                        return Object.values(err.data.errors).flat().join('. ');
                    }

                    return err?.data?.message || 'An error occurred while cancelling the booking.';
                },
            });
        }
    }, [booking?.id, cancelBooking, fetchBookings, onClose, toastPromise]);


    const handleCancelFixedBooking = useCallback(() => {
        const fixedBookingId = booking?.fixed_booking?.id;
        if (fixedBookingId) {
            toastPromise({
                request: () => cancelFixedBooking({ id: fixedBookingId }),
                onSuccess: (result: any) => {
                    if ('error' in result) throw result.error;
                    fetchBookings();
                    onClose();

                    return 'Booking has been cancelled!';
                },
                onError: (err) => {
                    if (err.data?.errors) {
                        return Object.values(err.data.errors).flat().join('. ');
                    }

                    return err?.data?.message || 'An error occurred while cancelling the booking.';
                },
            });
        }
    }, [booking?.id, cancelBooking, fetchBookings, onClose, toastPromise]);


    const makeAsNotShow = useCallback(() => {
        const bookingId = booking?.id;
        if (bookingId) {
            toastPromise({
                request: () => markAsNotShow({ id: bookingId, no_show: !noShow }),
                onSuccess: (result: any) => {
                    if ('error' in result) throw result.error;

                    setNotShow(!noShow)

                    return 'Booking updated!';
                },
                onError: (err) => {
                    if (err.data?.errors) {
                        return Object.values(err.data.errors).flat().join('. ');
                    }

                    return err?.data?.message || 'An error occurred while cancelling the booking.';
                },
            });
        }
    }, [booking?.id, cancelBooking, fetchBookings, onClose, toastPromise, noShow]);

    const handleEditClick = useCallback(() => {
        if (booking?.fixed_booking) {
            setIsPopupOpen(true);
        } else {
            setBookingFormOpen(true);
        }
    }, [booking?.fixed_booking]);

    const handlePopupClose = useCallback((selectedValue: string) => {
        setIsPopupOpen(false);
        if (selectedValue === 'all') {
            setSingleBooking(false)
            setBookingFormOpen(true);
        } else if (selectedValue === 'one') {
            setSingleBooking(true)
            setBookingFormOpen(true);
        }
    }, []);

    const iconButtons = useMemo(() => [
        {
            title: "Edit Booking",
            icon: <EditIcon />,
            onClick: handleEditClick,
            sx: { mr: 1 }
        },
        {
            title: booking?.fixed_booking ? "Cancel Fixed Booking" : "Cancel Booking",
            icon: <CancelIcon />,
            onClick: handleCancelBooking,
            sx: { color: 'error.main', mr: 1 },
            isConfirmation: true,
            confirmationProps: booking?.fixed_booking ? {
                title: "Cancel Fixed Booking",
                message: "Do you want to cancel all future bookings or just this one?",
                buttons: [
                    { text: 'Cancel All', color: 'warning' as const, onClick: handleCancelFixedBooking },
                    { text: 'Cancel This', color: 'warning' as const, onClick: handleCancelBooking },
                    { text: 'No' }
                ]
            } : {
                title: "Cancel Booking",
                message: 'Are you sure that you want to cancel this booking?',
                buttons: [
                    { text: 'Yes', color: 'warning' as const, onClick: handleCancelBooking },
                    { text: 'No' }
                ]
            }
        }, {
            title: "Addons",
            icon: <AddCircleOutlineIcon />,
            onClick: () => setAddonsFormOpen(true),
            sx: { mr: 1 }
        },
        {
            title: "No Show",
            icon: <Switch
                checked={noShow}
                onChange={makeAsNotShow}
                color="primary"
                size="small"
            />,
            sx: { mr: 1 }
        },
    ], [setBookingFormOpen, handleCancelBooking, booking, noShow]);

    if (!booking) return null;

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Booking Information</Typography>
                <Box>
                    {iconButtons.map((button, index) => (
                        <Tooltip key={index} title={button.title}>
                            {button.isConfirmation ? (
                                <ConfirmationAlertDialog
                                    title={button.confirmationProps.title}
                                    message={button.confirmationProps.message}
                                    buttons={button.confirmationProps.buttons}
                                >
                                    <IconButton size="small" sx={button.sx}>
                                        {button.icon}
                                    </IconButton>
                                </ConfirmationAlertDialog>
                            ) : (
                                <IconButton size="small" onClick={button.onClick} sx={button.sx}>
                                    {button.icon}
                                </IconButton>
                            )}
                        </Tooltip>
                    ))}
                </Box>
            </Box>

            <Box sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                mb: 3
            }}>
                <Grid container>
                    <EventInfoGridItem
                        Icon={BookmarkIcon}
                        title="Booking ID:"
                        value={booking.id}
                    />
                    <EventInfoGridItem
                        Icon={BookmarkIcon}
                        title="Booking Type:"
                        value={booking?.is_coaching_booking ? "Coach" : "Stadium"}
                    />
                    <EventInfoGridItem
                        Icon={StadiumIcon}
                        title="Pitch ID:"
                        value={booking.pitch_id}
                    />
                    <EventInfoGridItem
                        Icon={PersonIcon}
                        title="Booking Name"
                        value={booking.booking_name}
                    />
                    {booking?.is_coaching_booking ? (
                        <EventInfoGridItem
                            Icon={SportsMartialArtsIcon}
                            title="Coach Name"
                            value={booking?.coach?.name || ""}
                        />
                    ) : <></>}
                    <EventInfoGridItem
                        Icon={PhoneIcon}
                        title="Phone"
                        value={booking?.booking_phone_number || ""}
                    />
                    <EventInfoGridItem
                        Icon={CalendarTodayIcon}
                        title="Match Date"
                        value={booking?.match_date || ""}
                    />
                    <EventInfoGridItem
                        Icon={AccessTimeIcon}
                        title="Match time"
                        value={moment(booking?.match_time, "HH:mm:ss").format("hh:mm A") || ""}
                    />
                </Grid>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>Payment Details</Typography>

            <Box sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                mb: 3
            }}>
                <Grid container>
                    <EventInfoGridItem
                        Icon={AttachMoneyIcon}
                        title="Price Per Booking:"
                        value={booking.payment_actual_amount && booking.payment_actual_amount !== 0 ? `${booking.payment_actual_amount} ${booking.payment_currency}` : '-'}
                    />
                    <EventInfoGridItem
                        Icon={AttachMoneyIcon}
                        title="Total Add-Ons Price:"
                        value={booking?.total_addons_amount && booking.total_addons_amount !== 0 ? `${booking.total_addons_amount} ${booking.payment_currency}` : '-'}
                    />
                    <EventInfoGridItem
                        Icon={AttachMoneyIcon}
                        title="Amount Received:"
                        value={booking?.amount_paid && booking.amount_paid !== 0 ? `${booking.amount_paid} ${booking.payment_currency}` : '-'}
                    />
                    <EventInfoGridItem
                        Icon={LocalOfferIcon}
                        title="Coupon:"
                        value={booking?.coupon_code || "-"}
                    />
                    <EventInfoGridItem
                        Icon={LocalOfferIcon}
                        title="Coupon Discount:"
                        value={booking?.coupon_discount && booking.coupon_discount !== 0 ? `${booking.coupon_discount} ${booking.payment_currency}` : '-'}
                    />
                    <EventInfoGridItem
                        Icon={AccountBalanceWalletIcon}
                        title="Wallet:"
                        value={booking?.credit_amount && booking.credit_amount !== 0 ? `${booking.credit_amount} ${booking.payment_currency}` : '-'}
                    />
                    <EventInfoGridItem
                        Icon={ReceiptIcon}
                        title="Booking Status:"
                        value={booking?.booking_status_label || "-"}
                    />
                    <EventInfoGridItem
                        Icon={AttachMoneyIcon}
                        title="Final Price:"
                        value={booking?.final_price && booking.final_price !== 0 ? `${booking.final_price + booking?.total_addons_amount} ${booking.payment_currency}` : '-'}
                    />
                    <EventInfoGridItem
                        Icon={NoteIcon}
                        showTooltip
                        title="Note:"
                        value={booking?.booking_note || "-"}
                    />
                </Grid>
            </Box>

            <EditBooking
                open={isBookingFormOpen}
                onClose={() => setBookingFormOpen(false)}
                booking={booking}
                extraData={{
                    updateSingleBooking
                }}
            />

            <Addons
                open={isAddonsOpen}
                onClose={() => setAddonsFormOpen(false)}
                booking={booking} />

            <PopupDialog
                open={isPopupOpen}
                onClose={handlePopupClose}
                title="Edit Fixed Booking"
                selectedValue=''
                actions={[
                    { value: 'all', label: 'Edit all future bookings', icon: <EventRepeatIcon /> },
                    { value: 'one', label: 'Edit only this booking', icon: <EditIcon /> }
                ]}
            />
        </>
    );
};

export default DetailsView;