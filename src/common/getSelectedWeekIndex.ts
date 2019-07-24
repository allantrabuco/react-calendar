import { getYear, getMonth, getDate, getTime } from "date-fns"

function getSelectedWeekIndex(selectedDate: Date, weeks: any, startTime: number) {
    const _year = getYear(selectedDate)
    const _month = getMonth(selectedDate)
    const _day = getDate(selectedDate)

    return weeks.reduce(
        (position: number, week: any, index: number) =>
            week.find((day: Date) => getTime(day) === getTime(new Date(_year, _month, _day, startTime, 0, 0)))
                ? (position = index)
                : position,
        0,
    )
}
export default getSelectedWeekIndex
