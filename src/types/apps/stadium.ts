export interface Stadium {
    id: number;
    main_currency: number;
    main_currency_label: string;
    main_currency_label_ar: string;
    phone_code: string;
    support_malaeb_live: boolean;
    supported_payment_methods: string[];
    title: string;
    title_ar: string;
    name: string;
}
export interface Pitch {
    id: number;
    lable: string;
    lable_ar: string;
    pitch_size: number;
    prices: Price[];
    sport_type: number[];
}

export interface ModifiedPitch extends Pitch {
    femaleFriendlyTimes: Price[];
}

export interface Price {
    id: number;
    day: number;
    pitch_id: number;
    price: number;
    price_60: number;
    price_90: number;
    price_120: number;
    valid_from: string;
    female_friendly: number;
    online_payment_only: number;
    upfront_available: number;
    valid_to: string;
    updated_at: string;
}