import React, { memo, useContext } from "react"
import { format } from "date-fns"
import { CalendarContext } from "../common/CalendarContext"

const styles = {
    display: "inline-block",
    // transform: "rotate(-7deg)",
    // WebkitTransform: "rotate(-7deg)"
}
const backgroundColor = "rgba(66, 165, 245, 0.4)"

// const EventMarkGhost = memo(({ title, top, left }: { title: string; top: number; left: number }) => {
const EventMarkGhost = memo((props: any) => {
    const { dataDate, dataHour, dataMin } = props
    const { stateCalendar } = useContext(CalendarContext)
    const { ghostProperties, calendarEvent } = stateCalendar

    const newDate = new Date(format(dataDate, `YYYY/MM/DD ${dataHour}:${dataMin}:s`))

    // useEffect(() => {
    //     if (newDate !== ghostProperties.date) {
    //         setStateCalendar({ ...stateCalendar, ghostProperties: { ...ghostProperties, date: newDate } })
    //     }
    // }, [newDate, ghostProperties])

    const stylesBox = {
        backgroundColor: "drakgreen",
        // height: 31,
        lineHeight: "31px",
        // width: 128,
        cursor: "move",
        fontSize: 10,
        width: ghostProperties.width,
        height: ghostProperties.height,
    }
    const Ghost = () => {
        return (
            <div style={{ ...stylesBox, backgroundColor }} data-ghost data-date={newDate}>
                <p style={{ lineHeight: "8px" }}>{calendarEvent.title}</p>
                <p style={{ lineHeight: "8px" }}>[{format(newDate, `YYYY/MM/DD HH:mm:ss`)}]</p>
                {/* <p style={{ lineHeight: "8px" }}>[{y}]</p> */}
            </div>
        )
    }

    return (
        <div style={styles}>
            <Ghost />
        </div>
    )
})
export default EventMarkGhost
