import { startOfMonth, endOfMonth, startOfWeek, lastDayOfWeek, addDays, eachDay, differenceInDays } from "date-fns"

function getWeekDays(selectedDate: any, size: number) {
    function getMonthWeeks(date: Date, { forceSixWeeks = false } = {}) {
        const monthFirstDate = startOfMonth(date)
        const monthLastDate = endOfMonth(date)

        const start = forceSixWeeks ? startOfWeek(monthFirstDate) : monthFirstDate
        let end = forceSixWeeks ? lastDayOfWeek(addDays(monthLastDate, 2)) : monthLastDate

        // check for 6 lines (weeks)
        const totalOfDays = differenceInDays(end, start)
        if (totalOfDays !== 41) {
            end = lastDayOfWeek(addDays(end, 2))
        }

        return eachDay(start, end)
    }

    const days = getMonthWeeks(selectedDate, { forceSixWeeks: true }).map((date: Date, index: number) => date)

    const weekly = (_month: any, _size: number) =>
        _month.reduce(
            (a: any[], b: any[], index: number, group: any[]) =>
                !(index % _size) ? a.concat([group.slice(index, index + _size)]) : a,
            [],
        )

    return weekly(days, size)
}

export default getWeekDays
