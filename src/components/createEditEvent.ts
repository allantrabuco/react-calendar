import { format, differenceInMinutes, getYear, getMonth, getDate, addMinutes } from "date-fns"

export default function createEditEvent(props: any) {
    const { eventEl, defaultEventDuration, stateCalendar, setStateCalendar, calendarEvent = null } = props

    let datasetDate
    let eventBeginDate
    let eventEndDate
    let minutes
    let beginTime
    let endTime

    let title = ""
    let description = ""

    if (calendarEvent !== null) {
        // datasetDate = new Date(calendarEvent.begin)

        eventBeginDate = new Date(calendarEvent.begin)
        eventEndDate = new Date(calendarEvent.end)
        minutes = differenceInMinutes(eventEndDate, eventBeginDate)
        beginTime = format(eventBeginDate, "H:mm")
        endTime = format(eventEndDate, "H:mm")
        title = calendarEvent.title
        description = calendarEvent.description
    } else {
        if (eventEl.target.dataset.date === undefined) return false

        datasetDate = new Date(eventEl.target.dataset.date)

        let position = eventEl.clientY - eventEl.target.getBoundingClientRect().top
        if (Object.keys(eventEl.target.dataset).length === 0) {
            position = eventEl.clientY - (eventEl.clientY - +eventEl.target.style.marginTop.replace("px", ""))
            // console.log(eventEl.target.parent.dataset.date)
            datasetDate = new Date(eventEl.target.parentElement.dataset)
        }

        const hour = Math.trunc(position / 60)
        const isHalfHour = Math.trunc(position / 30) % 2 === 0 ? false : true
        // const isQuarter = Math.trunc(position / 15) % 2 === 0 ? false : true

        // const minute =
        //     isHalfHour && isQuarter ? 45 : isHalfHour && !isQuarter ? 30 : !isHalfHour && isQuarter ? 15 : 0
        const minute = isHalfHour ? 30 : 0

        // console.log(hour + ":" + minute)
        eventBeginDate = new Date(
            getYear(datasetDate),
            getMonth(datasetDate),
            getDate(datasetDate),
            hour > 23 ? 23 : hour,
            hour > 23 ? 30 : minute,
        )
        eventEndDate = addMinutes(eventBeginDate, defaultEventDuration)
        // console.log("From", eventBeginDate, "To", eventEndDate)

        // console.log(Math.trunc(position / 60))
        // console.log(Math.trunc(position / 30))
        // console.log(Math.trunc(position / 15))
        minutes = differenceInMinutes(eventEndDate, eventBeginDate)

        beginTime = format(eventBeginDate, "H:mm")
        endTime = format(eventEndDate, "H:mm")
    }

    // if (eventEl.target.dataset.date === undefined || calendarEvent !== {}) return false

    setStateCalendar({
        ...stateCalendar,
        openDialog: true,
        eventBeginDate: eventBeginDate,
        eventBeginTime: { value: beginTime, label: beginTime },
        eventEndDate: eventEndDate,
        eventEndTime: { value: endTime, label: endTime },
        minutes: minutes,
        eventDialogMaxWidth: "sm",
        eventID: (calendarEvent && calendarEvent.id) || 0,
        title,
        description,
    })
}
