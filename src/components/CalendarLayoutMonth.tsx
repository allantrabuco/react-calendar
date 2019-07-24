import React, { useContext } from "react"
import { CalendarContext } from "../common/CalendarContext"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import { makeStyles, Theme } from "@material-ui/core/styles"
import { lightBlue } from "@material-ui/core/colors"
import clsx from "clsx"
import format from "date-fns/format"
import createEditEvent from "./createEditEvent"
// import EventMark from './EventMark'

type event = {
    id: string | number
    title: string
    description: string
    begin: string
    end: string
}

const useStyles = makeStyles((theme: Theme) => ({
    paperHeader: {
        borderBottom: "1px solid #dadce0",
        borderRight: "1px solid #dadce0",
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
        minWidth: 64.38,
    },
    title: {
        textTransform: "capitalize",
    },

    paper: {
        borderBottom: "1px solid #dadce0",
        borderRight: "1px solid #dadce0",
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
        minWidth: 64.38,
        height: "100%",
    },
    paperWeekend: {
        backgroundColor: theme.palette.grey[100],
    },

    centerContent: {
        display: "flex",
        justifyContent: "center",
    },

    today: {
        color: theme.palette.background.paper,
        backgroundColor: lightBlue[700],
        borderRadius: "50%",
        padding: theme.spacing(1),
        cursor: "pointer",
        "&:hover": {
            backgroundColor: lightBlue[800],
        },
    },

    eventsContainer: {
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        textAlign: "left",
        backgroundColor: "transparent",
        position: "relative",
        height: "calc(100% - 25px)",
        width: "100%",
        marginTop: theme.spacing(1),
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
    monthMarker: {
        overflow: "hidden",
        minHeight: 23,
        border: "1px solid rgba(66, 165, 245, 0.8)",
        backgroundColor: "rgba(66, 165, 245, 0.8)",
        padding: "1px 3px",
        marginBottom: 2,
        borderRadius: 3,
        borderTopRightRadius: 3,
        cursor: "pointer",
        zIndex: 50,
        "&:hover": {
            zIndex: 53,
            backgroundColor: "rgba(66, 165, 245, 1)",
        },
    },
}))

function CalendarLayoutMonth(props: any) {
    const classes = useStyles()

    const { weeks } = props

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const { locale, defaultEventDuration } = stateCalendar

    const maxHeight = (weeks: any[]) => {
        const size = weeks.length

        if (size === 5) {
            return {
                height: "calc((100% / 5) - 21.2px)",
            }
        }

        return {
            height: "calc((100% / 6) - 17.5px)",
        }
    }

    const getEventData = (day: Date) => {
        const localStorageMarckers = window.localStorage.getItem("markers")
        const monthEvents =
            (localStorageMarckers &&
                JSON.parse(localStorageMarckers).sort((a: event, b: event) => {
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
                    <div
                        key={`event-${event.id}`}
                        className={classes.monthMarker}
                        // calendarEvent={event}
                        // sq={index}
                        // len={evHour.len}
                    >
                        test...
                    </div>
                ))
        })
        return markers

        // const markers = dayEvents.map((event: any, index: number) => {
        //     const hour = new Date(event.begin).getHours()
        //     const thisHoursHas = eventsByHour.find((evHour: any) => evHour.hour === hour)

        //     console.log(
        //         `key=event-${event.id}`,
        //         `calendarEvent=${event.begin}`,
        //         `sq=${index}`,
        //         `len=${thisHoursHas ? thisHoursHas.len : 0}`,
        //     )

        //     return (
        //         <EventMark
        //             key={`event-${event.id}`}
        //             calendarEvent={event}
        //             sq={index}
        //             len={thisHoursHas ? thisHoursHas.len : 0}
        //         />
        //     )
        // })
        // return markers
    }

    return (
        <>
            <Grid container spacing={0} direction='row' justify='center' alignItems='center' wrap='nowrap'>
                {weeks[0].map((weekDay: Date, index: number) => {
                    return (
                        <Grid item xs key={`calendar-column-header-label-${index}`}>
                            <div
                                className={clsx(classes.paperHeader, {
                                    [classes.paperWeekend]: index === 5 || index === 6,
                                })}
                            >
                                <Typography className={classes.title}>
                                    {format(weekDay, "ddd", { locale: locale })}
                                </Typography>
                            </div>
                        </Grid>
                    )
                })}
            </Grid>

            {weeks.map((week: any, weekIndex: number) => (
                <Grid
                    container
                    spacing={0}
                    direction='row'
                    justify='space-evenly'
                    alignItems='stretch'
                    wrap='nowrap'
                    key={`calendar-main-line-${weekIndex}`}
                    style={maxHeight(weeks)}
                >
                    {week.map((day: any, dayIndex: number) => {
                        const isToday = format(day, "DDMMYYYY") === format(new Date(), "DDMMYYYY")
                        const eventsOfDay = getEventData(day)

                        return (
                            <Grid item xs key={`calendar-main-line-${weekIndex}-column-${dayIndex}`}>
                                <div
                                    className={clsx(classes.paper, {
                                        [classes.paperWeekend]: dayIndex === 5 || dayIndex === 6,
                                    })}
                                >
                                    <Typography className={clsx(classes.title)}>
                                        <span className={clsx({ [classes.today]: isToday })}>{day.getDate()}</span>

                                        {day.getDate() === 1
                                            ? format(new Date(day), " MMM", {
                                                  locale: locale,
                                              })
                                            : null}
                                    </Typography>

                                    {eventsOfDay && eventsOfDay.length > 0 && (
                                        <div
                                            className={classes.eventsContainer}
                                            data-date={day}
                                            onClick={(eventEl: any) =>
                                                createEditEvent({
                                                    eventEl,
                                                    defaultEventDuration,
                                                    stateCalendar,
                                                    setStateCalendar,
                                                })
                                            }
                                        >
                                            {eventsOfDay}
                                        </div>
                                    )}

                                    {/* {false && (
                                        <div className={classes.centerContent}>
                                            <Typography className={clsx(classes.title)}>
                                                <span className={clsx({ [classes.today]: isToday })}>
                                                    {day.getDate()}
                                                </span>

                                                {day.getDate() === 1
                                                    ? format(new Date(day), " MMM", {
                                                          locale: locale,
                                                      })
                                                    : null}
                                            </Typography>
                                        </div>
                                    )} */}
                                </div>
                            </Grid>
                        )
                    })}
                </Grid>
            ))}
        </>
    )
}

export default CalendarLayoutMonth
