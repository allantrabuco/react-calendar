import { getYear, getMonth, getDate, format } from "date-fns"

const getPosition = (eventEl: any, id: string | number) => {
    // console.log("eventEl.target.dataset.date", eventEl.target.dataset.date)
    // if (eventEl.target.dataset.date === "undefined") return false
    // debugger
    let parentTarget = false

    // debugger
    let datasetDate = new Date(eventEl.target.dataset.date)
    if (datasetDate.toString() === "Invalid Date") {
        datasetDate = new Date(eventEl.target.parentElement.parentElement.dataset.date)
        if (datasetDate.toString() === "Invalid Date") return false
        parentTarget = true
    }
    // console.log(datasetDate)

    let position = eventEl.clientY - eventEl.target.getBoundingClientRect().top
    if (Object.keys(eventEl.target.dataset).length === 0) {
        if (parentTarget) {
            position =
                eventEl.clientY -
                (eventEl.clientY - +eventEl.target.parentElement.style.marginTop.replace("px", "")) +
                20
            datasetDate = new Date(eventEl.target.parentElement.parentElement.dataset.date)
        } else {
            position = eventEl.clientY - (eventEl.clientY - +eventEl.target.style.marginTop.replace("px", ""))
            // console.log(eventEl.target.parent.dataset.date)
            datasetDate = new Date(eventEl.target.parentElement.dataset)
        }
    }

    // console.log("position", position)
    const hour = Math.trunc(position / 60)

    const isHalfHour = Math.trunc(position / 30) % 2 === 0 ? false : true
    const isQuarter = Math.trunc(position / 15) % 2 === 0 ? false : true

    const minute = isHalfHour && isQuarter ? 45 : isHalfHour && !isQuarter ? 30 : !isHalfHour && isQuarter ? 15 : 0

    const eventBeginDate = new Date(
        getYear(datasetDate),
        getMonth(datasetDate),
        getDate(datasetDate),
        hour > 23 ? 23 : hour,
        hour > 23 ? 30 : minute,
    )
    // console.log("eventBeginDate", format(eventBeginDate, "YYYY/MM/DD H:mm"), id)

    return eventBeginDate
}

export default getPosition
