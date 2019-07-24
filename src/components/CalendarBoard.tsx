import React, { useState, useEffect, useContext, useMemo } from "react"
import { CalendarContext } from "../common/CalendarContext"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { format, differenceInMinutes, addMinutes } from "date-fns"
import Grid from "@material-ui/core/Grid"
import { useDrop } from "react-dnd"
import LineDivisor from "./LineDivisor"
import createEditEvent from "./createEditEvent"
import EventMark from "./EventMark"

type event = {
    id: string | number
    title: string
    description: string
    begin: string
    end: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        board: {
            minWidth: "100%",
            height: "100%",
            flex: "none",
            verticalAlign: "top",
            overflow: "hidden",
            position: "relative",
        },
        columnDivisor: {
            height: "100%",
            paddingLeft: 8,
            borderRight: "1px solid #dadce0",
        },
        dayContainer: {
            // backgroundColor: lightBlue[50],
            borderRight: "1px solid #dadce0",
            position: "relative",
            paddingRight: 12,
            flex: "1 1 auto",
            height: "100%",
        },
        eventsContainer: {
            backgroundColor: "transparent",
            position: "relative",
            height: "100%",
            width: "100%",
        },
        currentTimeDot: {
            background: "rgb(226, 57, 43)",
            borderRadius: "50%",
            content: "''",
            position: "absolute",
            height: 12,
            width: 12,
            zIndex: 52,
            marginTop: -1000,
            marginLeft: -6.5,
        },
        currentTimeLine: {
            position: "absolute",
            zIndex: 51,
            borderColor: "rgb(226, 57, 43)",
            borderTop: "2px solid",
            left: 0,
            right: -1,
        },
    }),
)

function CalendarBoard(props: any) {
    const classes = useStyles()

    const { selectedWeekIndex, selectedWeek } = props

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const { selectedDate, layout, defaultEventDuration, draggingEventId } = stateCalendar

    const [currentTimePosition, setCurrentTimePosition] = useState()

    useEffect(() => {
        setInterval(() => {
            const now = new Date()
            const initTime = new Date(format(now, "YYYY/MM/DD 0:0:0"))
            const position = differenceInMinutes(now, initTime)
            setCurrentTimePosition(position)
        }, 1000)
    }, [])

    const viewLayout = Array.from(Array(layout === "week" ? 7 : layout === "day" ? 1 : 0).keys())

    const localStorageMarkers = window.localStorage.getItem("markers")
    const getEventData = (day: Date) => {
        console.log("getting events...")
        const monthEvents =
            (localStorageMarkers &&
                JSON.parse(localStorageMarkers).sort((a: event, b: event) => {
                    return new Date(a.begin).getTime() - new Date(b.begin).getTime()
                })) ||
            []

        // const weekBegin = new Date(format(day, "YYYY/MM/DD 00:00"))
        // const weekEnd = new Date(format(day, "YYYY/MM/DD 24:00"))
        // const monthEvents = fakeEvents(weekBegin, weekEnd)

        const dayEvents = monthEvents.filter(
            (event: any) => format(new Date(event.begin), "YYYYMMDD") === format(day, "YYYYMMDD"),
        )

        // console.log("dayEvents", dayEvents)

        const dayHoursEvents = dayEvents
            .map((event: any) => new Date(event.begin).getHours())
            .sort((numberA: number, numberB: number) => numberA - numberB)
        // console.log("dayHoursEvents", dayHoursEvents)

        const eventsByHour = dayHoursEvents.reduce((acc: any[], hour: number) => {
            const len = dayHoursEvents.filter((eventHour: number) => eventHour === hour).length
            !acc.some((accItem: any) => accItem.hour === hour) && acc.push({ hour, len })
            return acc
        }, [])

        // console.log("eventsByHour", eventsByHour)

        const markers = eventsByHour.map((evHour: any) => {
            return dayEvents
                .filter((event: any) => new Date(event.begin).getHours() === evHour.hour)
                .map((event: any, index: number) => (
                    <EventMark key={`event-${event.id}`} calendarEvent={event} sq={index} len={evHour.len} />
                ))
        })
        return markers
    }

    // }, [localStorageMarkers])

    const CurrentTimeMark = (props: any) => {
        const { marginTop = -1000 } = props
        return (
            <>
                <div className={classes.currentTimeDot} style={{ marginTop: marginTop - 5 }} />
                <div className={classes.currentTimeLine} style={{ marginTop: marginTop }} />
            </>
        )
    }

    const onDrop = (eventEl: any) => {
        const eventID = draggingEventId

        const eventMarkGhost: any = document.querySelector("[data-ghost]")
        if (!eventMarkGhost) return false

        const eventBeginDate = new Date(eventMarkGhost.dataset.date)
        if (!eventBeginDate) return

        const localStorageMarkers = window.localStorage.getItem("markers")
        const markers = (localStorageMarkers && JSON.parse(localStorageMarkers)) || []

        const draggedEvent = markers.find((markEvent: any) => markEvent.id === eventID)

        const duration = differenceInMinutes(new Date(draggedEvent.end), new Date(draggedEvent.begin))

        const marker = {
            ...draggedEvent,
            begin: format(eventBeginDate, "YYYY/MM/DD HH:mm"),
            end: format(addMinutes(eventBeginDate, duration), "YYYY/MM/DD HH:mm"),
        }

        window.localStorage.setItem(
            "markers",
            JSON.stringify([...markers.filter((markEvent: any) => markEvent.id !== eventID), marker]),
        )

        setStateCalendar({ ...stateCalendar, draggingEventId: -1 })
    }

    const [, drop] = useDrop({
        accept: "box",
        drop(item: any, monitor: any) {
            return undefined
        },
    })

    const viewLayoutEl = useMemo(() => {
        return viewLayout.map(index => {
            const day = layout === "week" ? selectedWeek[index] : selectedDate
            const isToday = format(day, "DDMMYYYY") === format(new Date(), "DDMMYYYY")
            const eventsOfDay = getEventData(day)

            return (
                <Grid
                    item
                    xs
                    id={`day${index + 1}`}
                    data-group='day-column'
                    data-date={day}
                    className={classes.dayContainer}
                    key={`board-day-column-${layout}-${selectedWeekIndex}-${day}-${index}`}
                    onClick={(eventEl: any) =>
                        createEditEvent({
                            eventEl,
                            defaultEventDuration,
                            stateCalendar,
                            setStateCalendar,
                        })
                    }
                >
                    {isToday && <CurrentTimeMark marginTop={currentTimePosition} />}

                    {eventsOfDay && eventsOfDay.length > 0 && (
                        <div className={classes.eventsContainer} data-date={day}>
                            {eventsOfDay}
                        </div>
                    )}
                </Grid>
            )
        })
        // ....
        // ....
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        classes,
        // currentTimePosition,
        defaultEventDuration,
        getEventData,
        layout,
        selectedDate,
        selectedWeek,
        selectedWeekIndex,
        viewLayout,
        localStorageMarkers,
    ])

    return (
        <Grid
            ref={drop}
            onDrop={onDrop}
            container
            spacing={0}
            direction='row'
            justify='center'
            alignItems='flex-start'
            className={classes.board}
        >
            <LineDivisor />
            <div className={classes.columnDivisor} />

            {viewLayoutEl}
        </Grid>
    )
}

export default CalendarBoard
