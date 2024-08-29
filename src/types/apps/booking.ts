export interface Booking {
    action_log: ActionLog[],
    addons?: AddonObj[],
    amount_paid: number,
    booking_name: string,
    booking_note: string
    booking_phone_number: string
    booking_status: number
    booking_status_label: string
    booking_type: BookingTypes
    coupon_code: string
    coupon_discount: number
    end: Date | string
    fixed_booking?: FixedBooking
    id: number
    is_single_booking: boolean
    is_used_coupon?: boolean
    is_user_made?: boolean
    match_date: string,
    match_end_time: string
    match_time: string
    net_amount: number
    no_show: boolean
    payment_actual_amount: number
    payment_currency: string
    payment_expected_amount: number
    payment_method: PaymentMethods
    payment_method_label: string
    payment_order_duration: number
    payment_paid_status: number
    pitch: Pitch
    pitch_id: number
    resourceId: number
    stadium_id: number
    start: Date | string
    total_addons_amount: number
    user_id: number | string | null
    coach: Coach | null
    is_coaching_booking: boolean
    is_issued_invoice: boolean
    final_price: number
    credit_amount: number
    is_use_credit: boolean
    duration: BookingDuration
}


export enum BookingTypes {
    UserMadeBooking = 1,
    OwnerMadeBooking = 2
}

export enum BookingDuration {
    Duration60 = 60,
    Duration90 = 90,
    Duration120 = 120,
}

export interface ActionLog {
    id: number;
    action: string;
    created_at: string;
    data: {
        match_date: string;
        match_time: string;
        booking_status: number;
        booking_type: BookingTypes;
        amount_paid: number;
        booking_name: string;
        booking_phone_number: number;
        payment_actual_amount: string;
        payment_expected_amount: number;
        payment_order_duration: number;
    };
    user_data: {
        role: string;
        sub_role: number;
        name: string;
        id: number;
    };
}

interface Pitch {
    id: number;
    is_stackable: number;
    label: string; // Fixed typo from 'lable' to 'label'
    min_players: number;
    pitch_size: number;
    price: number;
    price_60: number;
    price_90: number;
    price_120: number;
    stadium_id: number;
    virtual_pitch_child1: number;
    virtual_pitch_child2: number;
    virtual_pitch_child3: number;
    virtual_pitch_child4: number;
}


export interface PhoneCode {
    body_length: number
    code: string
    country_id: number
    mask: string
    phone_mask: string
    tag: string
}

export interface ItemInReactSelect {
    label: string,
    label_ar?: string,
    id: number,
}

export interface paymentMethodOfStadium {
    label: string,
    id: number,
    value: number
}

export enum PaymentMethods {
    Cash = 1,
    Tap = 5,
    ApplePay = 11
}

export interface FixedBooking {
    amount_paid?: number
    bookings_count?: number
    created_at?: string
    day_of_week?: number
    duration?: number
    first_match_date?: string
    id?: number
    is_expiring_soon?: boolean
    last_match_date?: string
    owner_booking?: string
    payment_method?: PaymentMethods
    pitch_id?: number | string
    stadium_id?: number
    updated_at?: string
    user_booking?: number
}

export interface changedData {
    match_date?: string
    match_time?: string,
    booking_status?: number,
    booking_type?: BookingTypes
    booking_name?: string,
    booking_phone_number?: string
    amount_paid?: number
    payment_actual_amount?: number
    payment_expected_amount?: number
    payment_order_duration?: number
}

export interface userDataInLogs {
    role: string
    name: string
    id: number
}
export interface AddonObj extends Record<string, any> {
    cost: string
    id: number
    name: string
}

export interface phoneCode {
    body_length: number
    code: string
    country_id: number
    mask: string
    phone_mask: string
    tag: string
}
export interface Coach {
    id: number
    name: string,
    image: string
}