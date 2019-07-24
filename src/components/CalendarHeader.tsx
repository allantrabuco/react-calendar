import React, { useState, useEffect, useContext, useMemo } from "react"
import { CalendarContext } from "../common/CalendarContext"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import { format, differenceInMinutes } from "date-fns"
import Grid from "@material-ui/core/Grid"
import { grey, lightBlue } from "@material-ui/core/colors"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            height: 100,
            "&:after": {
                content: "''",
                position: "absolute",
                top: 165,
                left: 300,
                height: 1,
                width: "calc(100% + 145px)",
                borderTop: "1px solid #dadce0",
            },
        },
        headerFirstColumn: {
            height: 15,
            marginTop: 85,
            paddingLeft: 8,
            borderRight: "1px solid #dadce0",
        },
        headerColumn: {
            borderRight: "1px solid #dadce0",
            position: "relative",
            paddingRight: 12,
            flex: "1 1 auto",
            height: 15,
            marginTop: 85,
        },
        headerColumnWeekend: {
            backgroundColor: "#F5F5F5",
        },
        headerLabelsFirst: {
            position: "absolute",
            top: -75,
            left: -1,
            height: 20,
            width: "100%",
            // border: '1px solid red',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#70757a",
            fontWeight: 500,
            textTransform: "uppercase",
        },
        headerLabelsSecond: {
            position: "absolute",
            top: -55,
            left: -1,
            height: 45,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#70757a",
        },
        headerLabelsThird: {
            position: "absolute",
            top: -7,
            left: -1,
            height: 20,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
        },
        headerLabelToday: {
            width: 45,
            height: 45,
            lineHeight: "45px",
            borderColor: lightBlue[700],
            backgroundColor: lightBlue[700],
            color: "#ffffff",
            border: "1px solid",
            borderRadius: "100%",
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
                borderColor: lightBlue[800],
                backgroundColor: lightBlue[800],
            },
        },
        headerLabelNotToday: {
            width: 45,
            height: 45,
            lineHeight: "45px",
            borderColor: "transparent",
            backgroundColor: theme.palette.background.paper,
            textAlign: "center",
            border: "1px solid",
            borderRadius: "100%",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: grey[200],
            },
        },
        headerLabelColumn: {
            borderRight: "1px solid green",
        },
        headerLabelText: {
            borderRight: "1px solid green",
        },
        timeColumnContainer: {
            color: theme.palette.text.secondary,
            backgroundColor: "transparent",
            height: "auto",
            overflowY: "hidden",
            flex: "none",
            display: "flex",
            alignItems: "flex-start",
            minWidth: 40,
            maxWidth: 40,
            marginTop: -8,
        },
        timeColumn: {
            position: "relative",
            webkitBoxSizing: "border-box",
            marginLeft: "auto",
        },
        timeColumnElement: {
            position: "relative",
            height: 60,
            paddingRight: 8,
            textAlign: "right",
            color: "#70757a",
            fontSize: 12,
        },
        board: {
            minWidth: "100%",
            height: "100%",
            flex: "none",
            verticalAlign: "top",
            overflow: "hidden",
            position: "relative",
        },
    }),
)

function CalendarHeader(props: any) {
    const classes = useStyles()

    const { selectedWeekIndex, selectedWeek } = props

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const { selectedDate, locale, layout, defaultEventDuration } = stateCalendar
    const [currentTimePosition, setCurrentTimePosition] = useState()

    useEffect(() => {
        setInterval(() => {
            const now = new Date()
            const initTime = new Date(format(now, "YYYY/MM/DD 0:0:0"))
            const position = differenceInMinutes(now, initTime)
            setCurrentTimePosition(position)
        }, 1000)
    }, [])

    return useMemo(() => {
        const viewLayout = Array.from(Array(layout === "week" ? 7 : layout === "day" ? 1 : 0).keys())

        const handleDayClick = (event: any) => {
            const gridParent = event.target.parentElement.parentElement
            setStateCalendar({
                ...stateCalendar,
                layout: "day",
                selectedDate: new Date(gridParent.dataset.day),
            })
            // handleOpenCloseDialog()
        }

        return (
            <Grid
                container
                spacing={0}
                direction='row'
                justify='center'
                alignItems='stretch'
                className={clsx(classes.headerContainer)}
            >
                <Grid item xs={1} className={clsx(classes.timeColumnContainer, classes.timeColumn)}>
                    {/* <div className={classes.timeColumn}> */}
                    <div className={clsx(classes.timeColumnElement)} />
                    {/* </div> */}
                </Grid>

                <Grid item xs>
                    <Grid
                        container
                        spacing={0}
                        direction='row'
                        justify='center'
                        alignItems='flex-start'
                        className={classes.board}
                    >
                        <div className={classes.headerFirstColumn} />

                        {viewLayout.map(index => {
                            const day = layout === "week" ? selectedWeek[index] : selectedDate
                            const isToday = format(day, "DDMMYYYY") === format(new Date(), "DDMMYYYY")

                            return (
                                <Grid
                                    item
                                    xs
                                    id={`headerDay${index}`}
                                    data-group='day-header'
                                    data-day={day}
                                    className={classes.headerColumn}
                                    key={`header-label-${layout}-${selectedWeekIndex}-${day}`}
                                >
                                    <div className={classes.headerLabelsFirst}>
                                        <span>{format(day, "ddd", { locale: locale })}</span>
                                    </div>
                                    <div className={classes.headerLabelsSecond}>
                                        <span
                                            onClick={handleDayClick}
                                            className={clsx({
                                                [classes.headerLabelNotToday]: !isToday,
                                                [classes.headerLabelToday]: isToday,
                                            })}
                                        >
                                            {format(day, "D", { locale: locale })}
                                        </span>
                                    </div>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
        )
        // ....
        // ....
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        classes,
        currentTimePosition,
        selectedDate,
        locale,
        layout,
        defaultEventDuration,
        selectedWeek,
        selectedWeekIndex,
    ])
}

export default CalendarHeader
