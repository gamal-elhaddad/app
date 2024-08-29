export interface Coach {
    available_time_ranges: any[]; // Consider using a more specific type
    bio: string;
    currency: string;
    email: string;
    id: number;
    image: string;
    name: string;
    phone_number: number;
    spoken_languages: string[];
    sport_type_id: number;
    stadium_data: {
      id: number;
      stadium_title: string;
      price_120: number;
      price_60: number;
    };
    starting_price: number;
    supported_payment_methods: string[];
    user_id: number;
  }