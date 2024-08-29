import moment from "moment";
import { AppState, useSelector } from "src/store/Store";

const useHelpers = () => {

    const femaleFriendly = useSelector((state: AppState) => state.configReducer.femaleFriendly)
    const daysOff = useSelector((state: AppState) => state.configReducer.daysOff)
    const discounts = useSelector((state: AppState) => state.configReducer.discounts)

    const renderSlot = (date: Date, resourceId?: string | number, isDayView?: boolean) => {
        if (!resourceId && isDayView) {
            return "time-label"; // Return a specific class for time labels
        }


        let className = "default";

        const newDate = moment(date).startOf('day').format('YYYY-MM-DD')
        const defaultFormat = "YYYY-MM-DD HH:mm"


        // female friendly
        femaleFriendly?.forEach(element => {
            let dayOfSlot = moment(newDate).day()
            dayOfSlot === 0 ? dayOfSlot = 6 : dayOfSlot = dayOfSlot - 1

            if (element.day === dayOfSlot && (!resourceId || element.pitch_id === resourceId)) {

                const startDateOfSlot = moment(`${newDate} ${element.valid_from}`, defaultFormat).toDate()
                const endDateOFSlot = moment(`${newDate} ${element.valid_to}`, defaultFormat).toDate()
                const checkOfSlot = moment(date).isBetween(startDateOfSlot, endDateOFSlot, null, '[]')

                if (checkOfSlot) {
                    className = 'female-slot'
                }
            }
        });


        // .. days off
        daysOff?.forEach(element => {
            const slotDate = moment(newDate);
            const startDate = moment(element.start_at);
            const endDate = moment(element.end_at);

            if (slotDate.isBetween(startDate, endDate, 'day', '[]') &&
                (!resourceId || element.pitch_ids.includes(String(resourceId)))) {

                const startDateOfSlot = moment(`${newDate} ${element.start_time_at}`, defaultFormat).toDate();
                const endDateOfSlot = moment(`${newDate} ${element.end_time_at}`, defaultFormat).toDate();
                const checkOfSlot = moment(date).isBetween(startDateOfSlot, endDateOfSlot, null, '[]');

                if (checkOfSlot) {
                    className = 'day-off-slot';
                }
            }
        });

        const newTime = moment(date).format('HH:mm:ss')

        // .. discounts
        const discountedDays = discounts[newDate]

        discountedDays?.forEach((item) => {
            item?.time_intervals?.forEach((element) => {
                if (element === newTime) {
                    className = "discount"
                }
            })
        })

        return className;
    }



    return {
        renderSlot
    }
}

export default useHelpers