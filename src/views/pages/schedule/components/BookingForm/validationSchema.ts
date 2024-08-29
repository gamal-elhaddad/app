import { BookingTypes } from 'src/types/apps/booking';
import * as Yup from 'yup';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const baseValidationSchema = Yup.object().shape({
  booking_name: Yup.string().required('Booking name is required'),
  phone_number: Yup.string()
  .required('Phone number is required')
  .test('valid-phone', 'Invalid phone number for the selected country', function (value) {
    const { country_code } = this.parent;
    if (!country_code || !value) return false;

    const fullNumber = `${country_code}${value}`;

    try {
      const phoneNumber = parsePhoneNumber(fullNumber);

      return isValidPhoneNumber(fullNumber) && phoneNumber.countryCallingCode === country_code.slice(1);
    } catch (error) {
      return false;
    }
  }),
  match_date: Yup.date().required('Match date is required'),
  match_time: Yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').required('Starting time is required'), duration: Yup.number().required('Duration is required'),
  booking_type: Yup.string().required('Booking type is required'),
  payment_actual_amount: Yup.number().min(0).required('Booking price is required'),
  payment_method: Yup.string().required('Payment method is required'),
  amount_paid: Yup.number().min(0),
  booking_note: Yup.string(),
  pitch_id: Yup.string().required('Pitch ID is required'),
  alreadyPaid: Yup.boolean(),
  user_id: Yup.string().when('booking_type', {
    is: (value: BookingTypes) => value && value == BookingTypes.UserMadeBooking,
    then: (schema) => schema.required('User ID is required when booking type is User Made Booking'),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const singleBookingValidationSchema = baseValidationSchema;

export const fixedBookingValidationSchema = baseValidationSchema.shape({
  booking_name: Yup.string().required('Booking name is required'),
  phone_number: Yup.string()
  .required('Phone number is required')
  .test('valid-phone', 'Invalid phone number for the selected country', function (value) {
    const { country_code } = this.parent;
    if (!country_code || !value) return false;

    const fullNumber = `${country_code}${value}`;

    try {
      const phoneNumber = parsePhoneNumber(fullNumber);

      console.log({phoneNumber, test: country_code.slice(1)})

      return isValidPhoneNumber(fullNumber) && phoneNumber.countryCallingCode === country_code.slice(1);
    } catch (error) {
      return false;
    }
  }),
  match_date: Yup.date().required('Start Date is required'),
  last_match_date: Yup.date().required('End Date is required'),
  match_time: Yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').required('Starting time is required'), duration: Yup.number().required('Duration is required'),
  booking_type: Yup.string().required('Booking type is required'),
  payment_actual_amount: Yup.number().min(0).required('Booking price is required'),
  payment_method: Yup.string().required('Payment method is required'),
  amount_paid: Yup.number().min(0),
  booking_note: Yup.string(),
  pitch_id: Yup.string().required('Pitch ID is required'),
  alreadyPaid: Yup.boolean(),
  user_id: Yup.string().when('booking_type', {
    is: (value: BookingTypes) => value && value == BookingTypes.UserMadeBooking,
    then: (schema) => schema.required('User ID is required when booking type is User Made Booking'),
    otherwise: (schema) => schema.nullable(),
  }),
});



const coachBaseValidationSchema = Yup.object().shape({
  booking_name: Yup.string().required('Booking name is required'),
  phone_number: Yup.string()
  .required('Phone number is required')
  .test('valid-phone', 'Invalid phone number for the selected country', function (value) {
    const { country_code } = this.parent;
    if (!country_code || !value) return false;

    const fullNumber = `${country_code}${value}`;

    try {
      const phoneNumber = parsePhoneNumber(fullNumber);

      return isValidPhoneNumber(fullNumber) && phoneNumber.countryCallingCode === country_code.slice(1);
    } catch (error) {
      return false;
    }
  }),
  match_date: Yup.date().required('Match date is required'),
  match_time: Yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').required('Starting time is required'), duration: Yup.number().required('Duration is required'),
  booking_type: Yup.string().required('Booking type is required'),
  payment_actual_amount: Yup.number().min(0).required('Booking price is required'),
  payment_method: Yup.string().required('Payment method is required'),
  amount_paid: Yup.number().min(0),
  booking_note: Yup.string(),
  pitch_id: Yup.string().required('Pitch ID is required'),
  alreadyPaid: Yup.boolean(),
  user_id: Yup.string().when('booking_type', {
    is: (value: BookingTypes) => value && value == BookingTypes.UserMadeBooking,
    then: (schema) => schema.required('User ID is required when booking type is User Made Booking'),
    otherwise: (schema) => schema.nullable(),
  }),
  coach_id: Yup.string().required()
});

export const coachBookingValidationSchema = coachBaseValidationSchema;
