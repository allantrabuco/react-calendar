import { getYear, getMonth, getDate } from 'date-fns'

function getDayGrid(selectedDate: Date, startTime: number, endTime: number) {
    const _year = getYear(selectedDate)
    const _month = getMonth(selectedDate)
    const _day = getDate(selectedDate)

    const minutesInterval = 60 // minutes

    let dayGrid = []
    for (let iHour = startTime; iHour < endTime; iHour++) {
        for (let iMinute = 0; iMinute < 60; iMinute = iMinute + minutesInterval) {
            dayGrid.push(new Date(_year, _month, _day, iHour, iMinute, 0))
        }
    }
    return dayGrid
}

export default getDayGrid
