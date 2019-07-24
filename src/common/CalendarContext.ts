import { createContext } from "react"

type TypeCalendarContext = {
    stateCalendar: any
    setStateCalendar: Function
    // selectedDate: Date
}

export const CalendarContext = createContext<TypeCalendarContext>({
    stateCalendar: {},
    setStateCalendar: () => {},
    // selectedDate: new Date(),
})
