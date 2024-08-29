import { useEffect, useState } from "react";
import { useFetchDiscountsMutation, useFetchScheduleMutation, useLazyFetchDaysoffQuery } from "src/services/schedule";
import { resetSchedule, setDaysOff, setDiscounts } from "src/store/apps/config/ConfigSlice";
import { setBookings } from "src/store/apps/schedule/ScheduleSlice";
import { AppState, dispatch, useSelector } from "src/store/Store";

import generateEvent from '../helpers/generateEvent';

export enum EventView {
    Day = "day",
    Week = "week",
    Month = "month"
}

const ScheduleHook = () => {

    const [allowAutoUpdate, setAllowAutoUpdate] = useState(false)

    const stadium = useSelector((state: AppState) => state.configReducer.selectedStadium)
    const pitch = useSelector((state: AppState) => state.configReducer.pitch)
    const pitches = useSelector((state: AppState) => state.configReducer.pitches)
    const scheduleConfig = useSelector((state: AppState) => state.scheduleReducer.scheduleConfig)

    const [fetchSchedule, fetchScheduleResponse] = useFetchScheduleMutation();
    const [fetchDiscounts, fetchDiscountsResponse] = useFetchDiscountsMutation();
    const [fetchDaysoff, fetchDaysoffResponse] = useLazyFetchDaysoffQuery();

    useEffect(() => {
        if (stadium?.id && pitch?.id && scheduleConfig?.to_date && scheduleConfig?.from_date && allowAutoUpdate) {
            // .. fetch discounts
            fetchDiscounts({
                stadium_id: stadium?.id,
                end_date: scheduleConfig?.to_date,
                start_date: scheduleConfig?.from_date,
                pitch_id: pitch?.id,
            }).then((result) => {
                if ('data' in result) {
                    dispatch(setDiscounts(result.data))
                }
            })

            // .. fetch day off
            fetchDaysoff({
                stadium_id: stadium?.id,
            }).then((result) => {
                dispatch(setDaysOff(result.data?.data))
            })
        }
    }, [stadium, pitch, allowAutoUpdate])

    useEffect(() => {
        if (allowAutoUpdate) {
            dispatch(resetSchedule());
            fetchBookings()
        }
    }, [stadium, pitch, scheduleConfig, allowAutoUpdate])

    const fetchBookings = () => {
        if (stadium?.id && pitch?.id && scheduleConfig?.to_date && scheduleConfig?.from_date) {
            fetchSchedule({
                ...scheduleConfig,
                pitches: scheduleConfig.showAllPitches ? pitches.map(item => item.id) : [pitch?.id],
            }).then((data) => {
                if ('data' in data) {
                    const bookings = data.data?.data.map(booking => ({
                        ...generateEvent(booking),
                        resourceId: scheduleConfig.showAllPitches ? booking.pitch_id : undefined
                    }));
                    dispatch(setBookings(bookings));
                }
            });
        }
    }

    return {
        fetchScheduleResponse,
        fetchDiscountsResponse,
        fetchDaysoffResponse,
        fetchBookings,
        setAllowAutoUpdate
    }

}

export default ScheduleHook