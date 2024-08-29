import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    Switch,
    Theme,
    Typography
} from "@mui/material";

import { fixedBookingValidationSchema } from "../BookingForm/validationSchema";

import {
    useAddFixedBookingMutation,
    useEditFixedBookingMutation,
    useFetchBookingPriceMutation
} from "src/services/schedule";

import {
    AppState,
    useSelector
} from "src/store/Store";
import { SlotInfo } from "react-big-calendar";
import { Booking, BookingTypes } from "src/types/apps/booking";

import { countryCodes } from "../../helpers/getCountryCodes";
import { durations } from "../../helpers/getDuration";
import { bookingTypes } from "../../helpers/getBookingTypes";
import { paymentMethods } from "../../helpers/getPaymentMethods";
import { differenceInDays } from "date-fns";

import useToast from "src/hooks/useToast";
import moment from 'moment';
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "src/components/forms/theme-elements/CustomSelect";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import useScheduleHook from '../../hooks/useScheduleHook'

import "./AddFixedBooking.css";
import { getInitialCountryCode } from "../../helpers/getInitialCountryCode";

interface IProps {
    slotInfo?: SlotInfo
    onClose: () => void;
    booking?: Booking;
} 

const AddFixedBooking = (props: IProps) => {
    const data = props?.booking
    const [request] = useAddFixedBookingMutation();
    const [fetchBookingPrice] = useFetchBookingPriceMutation()
    const [updateBooking] = useEditFixedBookingMutation()

    const [repeatDay, setRepeatDay] = useState<string>("");
    const [repeatDuration, setRepeatDuration] = useState<string>("");
    const [bookingPrice, setBookingPrice] = useState(0)


    const [phonePlaceholder, setPhonePlaceholder] = useState(countryCodes[0].placeholder);

    const pitch = useSelector((state: AppState) => state.configReducer.pitch)
    const stadium = useSelector((state: AppState) => state.configReducer.selectedStadium)

    const { toastPromise } = useToast()

    const { fetchBookings } = useScheduleHook()

    const formik = useFormik({
        initialValues: {
            amount_paid: data?.amount_paid || "",
            booking_name: data?.booking_name || "",
            booking_note: data?.booking_note || "",
            booking_type: data?.booking_type || undefined,
            duration: data?.duration || 60,
            last_match_date: data?.fixed_booking?.last_match_date,
            match_date: moment(props?.slotInfo?.start || data?.match_date).format('YYYY-MM-DD'),
            match_time: moment(props?.slotInfo?.start || data?.match_time, "HH:mm:ss").format('HH:mm'),
            payment_actual_amount: data?.fixed_booking?.amount_paid || "",
            payment_method: data?.payment_method || "",
            country_code: getInitialCountryCode(data?.booking_phone_number) || "+973",
            phone_number: data?.booking_phone_number ? data.booking_phone_number.replace(/^\+\d+/, '') : "",
            pitch_id: props?.slotInfo?.resourceId || pitch?.id,
            alreadyPaid: false,
            user_id: data?.user_id || "",
        },
        validationSchema: fixedBookingValidationSchema,
        onSubmit: (values) => {
            const submissionValues = {
                ...values,
                pitch_id: Number(values.pitch_id),
                amount_paid: Number(values.amount_paid),
                payment_actual_amount: Number(values.payment_actual_amount),
                booking_type: Number(values.booking_type),
                payment_method: Number(values.payment_method),
                match_time: moment(values.match_time, "HH:mm").format('HH:mm:ss'),
                user_id: values.user_id ? Number(values.user_id) : undefined,
                day_of_week: moment(values.match_date).day(),
                last_match_date: values?.last_match_date || "",

                // Add these required properties
                match_date: values.match_date,
                duration: Number(values.duration),
                booking_name: values.booking_name,
                phone_number: values.phone_number,
                booking_note: values.booking_note,
            };

            toastPromise(
                {
                    request: () => {
                        if (data?.id) {
                            // .. edit booking
                            return updateBooking({
                                ...submissionValues,
                                id: data?.id
                            })
                        }

                        return request(submissionValues)
                    },
                    onSuccess: (result: any) => {
                        if ('error' in result) {
                            // If there's an error, throw it to be caught by the error handler
                            throw result.error;
                        }

                        fetchBookings();
                        props.onClose();

                        return data?.id ? 'Booking edit successfully' : 'Booking added successfully';
                    },
                    onError: (err) => {

                        if (err.data && err.data.errors) {
                            const errorMessages = Object.values(err.data.errors).flat().join('. ');

                            return errorMessages;
                        }

                        if (err?.data?.message) {
                            return err?.data?.message;
                        }

                        return 'An error occurred while submitting the form.';
                    },
                }
            );
        },
    });


    useEffect(() => {
        if (formik.values.match_date) {
            const date = new Date(formik.values.match_date);
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
            setRepeatDay(dayOfWeek);
        }
    }, [formik.values.match_date]);

    useEffect(() => {
        if (props.slotInfo) {
            fetchBookingPrice({
                pitch_id: Number(props?.slotInfo?.resourceId ?? pitch?.id ?? 0),
                match_date: props.slotInfo.start.toISOString().split('T')[0],
                match_time: props.slotInfo.start.toTimeString().slice(0, 8),
                duration: formik?.values?.duration || 60
            }).then((data) => {
                if ('data' in data) {
                    formik?.setFieldValue('payment_actual_amount', String(data?.data?.data?.price));
                    setBookingPrice(data?.data?.data?.price)
                }
            })
        }
    }, [formik?.values?.duration])


    useEffect(() => {
        if (formik.values.match_date && formik.values.last_match_date) {
            const startDate = new Date(formik.values.match_date);
            const endDate = new Date(formik.values.last_match_date);
            const daysDifference = differenceInDays(endDate, startDate);
            const weeksDifference = Math.floor(daysDifference / 7);
            setRepeatDuration(`${weeksDifference}`);

            console.log({bookingPrice})

            const numberOfBookings = weeksDifference + 1; // Include the initial booking
            const totalPrice = bookingPrice * numberOfBookings;
            formik.setFieldValue('payment_actual_amount', totalPrice.toString());
        } else {
            setRepeatDuration("");
        }
    }, [formik.values.match_date, formik.values.last_match_date]);


    const handleAlreadyPaidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        formik.setFieldValue("alreadyPaid", isChecked);
        if (isChecked) {
            formik.setFieldValue("amount_paid", formik.values.payment_actual_amount);
        }
    };

    const handleCountryCodeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedCode = event.target.value as string;
        formik.setFieldValue("country_code", selectedCode);

        const selectedCountry = countryCodes.find(country => country.value === selectedCode);
        setPhonePlaceholder(selectedCountry?.placeholder || "");
        formik.setFieldValue("phone_number", "");
    };


    const getPendingAmount = () => {
        const actualAmount = Number(formik.values.payment_actual_amount);
        const amountPaid = Number(formik.values.amount_paid);

        if (actualAmount && amountPaid) {
            if (amountPaid > actualAmount) {
                return "error";
            }

            return actualAmount - amountPaid;
        }

        return null;
    };


    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="booking_name">Booking Name</CustomFormLabel>
                            <CustomTextField
                                id="booking_name"
                                fullWidth
                                {...formik.getFieldProps("booking_name")}
                                error={formik.touched.booking_name && Boolean(formik.errors.booking_name)}
                                helperText={formik.touched.booking_name && formik.errors.booking_name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="duration">Duration</CustomFormLabel>
                            <CustomSelect
                                id="duration"
                                fullWidth
                                {...formik.getFieldProps("duration")}
                                error={formik.touched.duration && Boolean(formik.errors.duration)}
                                helperText={formik.touched.duration && formik.errors.duration}
                            >
                                {durations.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </CustomSelect>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="match_date">Starting Date</CustomFormLabel>
                            <CustomTextField
                                id="match_date"
                                type="date"
                                fullWidth
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                {...formik.getFieldProps("match_date")}
                                error={formik.touched.match_date && Boolean(formik.errors.match_date)}
                                helperText={formik.touched.match_date && formik.errors.match_date}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="match_time">Starting Time</CustomFormLabel>
                            <CustomTextField
                                id="match_time"
                                type="time"
                                fullWidth
                                {...formik.getFieldProps("match_time")}
                                error={formik.touched.match_time && Boolean(formik.errors.match_time)}
                                helperText={formik.touched.match_time && formik.errors.match_time}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const time = e.target.value;
                                    const [hours, minutes] = time.split(':');
                                    const roundedMinutes = parseInt(minutes) < 15 ? '00' : '30';
                                    const roundedTime = `${hours}:${roundedMinutes}`;
                                    formik.setFieldValue('match_time', roundedTime);
                                }}
                            ></CustomTextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={formik.values.booking_type === BookingTypes.UserMadeBooking ? 6 : 12}>
                                    <CustomFormLabel htmlFor="booking_type">Booking Type</CustomFormLabel>
                                    <CustomSelect
                                        id="booking_type"
                                        fullWidth
                                        {...formik.getFieldProps("booking_type")}
                                        error={formik.touched.booking_type && Boolean(formik.errors.booking_type)}
                                        helperText={formik.touched.booking_type && formik.errors.booking_type}
                                    >
                                        {bookingTypes.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </CustomSelect>
                                    {formik.touched.booking_type && formik.errors.booking_type && (
                                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                                            {formik.errors.booking_type}
                                        </Box>
                                    )}
                                </Grid>

                                {formik.values.booking_type === BookingTypes.UserMadeBooking && (
                                    <Grid item xs={12} sm={6}>
                                        <CustomFormLabel htmlFor="user_id">User ID</CustomFormLabel>
                                        <CustomTextField
                                            id="user_id"
                                            fullWidth
                                            {...formik.getFieldProps("user_id")}
                                            error={formik.touched.user_id && Boolean(formik.errors.user_id)}
                                            helperText={formik.touched.user_id && formik.errors.user_id}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="phone_number">Phone Number</CustomFormLabel>
                            <CustomTextField
                                id="phone_number"
                                fullWidth
                                placeholder={phonePlaceholder}
                                {...formik.getFieldProps("phone_number")}
                                error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                                helperText={formik.touched.phone_number && formik.errors.phone_number}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" className="country-code-select">
                                            <CustomSelect
                                                id="country_code"
                                                value={formik.values.country_code}
                                                disableUnderline
                                                onChange={handleCountryCodeChange}
                                                sx={(theme: Theme) => ({
                                                    '& .MuiSelect-select': {
                                                        border: 'none',
                                                        paddingRight: '24px',
                                                        borderRight: `1px solid ${theme.palette.grey[300]}`, // Use theme color
                                                        borderRightWidth: 1,
                                                        borderRadius: 0,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none',
                                                    },
                                                    '& .MuiSelect-icon': {
                                                        right: 0,
                                                    },
                                                })}
                                            >
                                                {countryCodes.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </CustomSelect>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="payment_method">Payment Method</CustomFormLabel>
                            <Box sx={{ height: '44px' }}>
                                <CustomSelect
                                    id="payment_method"
                                    fullWidth
                                    {...formik.getFieldProps("payment_method")}
                                    error={formik.touched.payment_method && Boolean(formik.errors.payment_method)}
                                >
                                    {paymentMethods.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </CustomSelect>
                                {formik.touched.payment_method && formik.errors.payment_method && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{
                                            display: 'block',
                                            mt: 0.5
                                        }}
                                    >
                                        {formik.errors.payment_method}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>


                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="match_date">End Date</CustomFormLabel>
                            <CustomTextField
                                id="last_match_date"
                                type="date"
                                fullWidth
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                {...formik.getFieldProps("last_match_date")}
                                error={formik.touched.last_match_date && Boolean(formik.errors.last_match_date)}
                                helperText={formik.touched.last_match_date && formik.errors.last_match_date}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="repeat_day">Repeat Booking Day</CustomFormLabel>
                            <Box display="flex" alignItems="center" gap={2}>
                                <CustomTextField
                                    id="repeat_day"
                                    fullWidth
                                    value={repeatDay}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                {repeatDuration && (
                                    <Typography variant="body2" color="textSecondary">
                                        Number Of Bookings: {repeatDuration}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <CustomFormLabel>Payment Details</CustomFormLabel>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                        <Box flexGrow={1}>
                            <CustomFormLabel htmlFor="payment_actual_amount">Booking Price</CustomFormLabel>
                            <CustomTextField
                                id="payment_actual_amount"
                                type="number"
                                fullWidth
                                {...formik.getFieldProps("payment_actual_amount")}
                                error={formik.touched.payment_actual_amount && Boolean(formik.errors.payment_actual_amount)}
                                helperText={formik.touched.payment_actual_amount && formik.errors.payment_actual_amount}
                            />
                        </Box>
                        <Box flexGrow={1}>
                            <CustomFormLabel htmlFor="amount_paid">Total Received</CustomFormLabel>
                            <Box display="flex" alignItems="center">
                                <CustomTextField
                                    id="amount_paid"
                                    type="number"
                                    fullWidth
                                    {...formik.getFieldProps("amount_paid")}
                                    error={formik.touched.amount_paid && Boolean(formik.errors.amount_paid)}
                                    helperText={
                                        (formik.touched.amount_paid && formik.errors.amount_paid) ||
                                        (getPendingAmount() === "error" && "Amount paid cannot exceed the booking price")
                                    }
                                    disabled={formik.values.alreadyPaid}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formik.values.alreadyPaid}
                                            onChange={handleAlreadyPaidChange}
                                            name="alreadyPaid"
                                        />
                                    }
                                    label="Already paid"
                                    sx={{ ml: 2 }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    {getPendingAmount() !== null && !formik.values.alreadyPaid && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            Pending: {getPendingAmount()} {stadium?.main_currency_label}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <CustomFormLabel htmlFor="booking_note">Additional Notes</CustomFormLabel>
                    <CustomTextField
                        id="booking_note"
                        multiline
                        rows={4}
                        fullWidth
                        {...formik.getFieldProps("booking_note")}
                        error={formik.touched.booking_note && Boolean(formik.errors.booking_note)}
                        helperText={formik.touched.booking_note && formik.errors.booking_note}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <Button variant="text" color="error" onClick={formik.handleReset}>
                            Cancel
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default AddFixedBooking;