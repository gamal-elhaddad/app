export interface DayOff {
    id: number;
    pitch_ids: string[];
    start_at: string; // ISO date format
    end_at: string; // ISO date format
    start_time_at: string; // HH:mm:ss format
    end_time_at: string; // HH:mm:ss format
    created_at: string | null; // ISO datetime format or null
    updated_at: string | null; // ISO datetime format or null
}