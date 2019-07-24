import React, { useContext, useMemo } from "react"
import { CalendarContext } from "../common/CalendarContext"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import { cyan } from "@material-ui/core/colors"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import CalendarHeader from "./CalendarHeader"
import CalendarBoard from "./CalendarBoard"
import CalendarBoardDragLayer from "./CalendarBoardDragLayer"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        hide: {
            display: "none",
        },
        show: {
            display: "initial",
        },
        root: {
            flexGrow: 1,
            height: "100%",
            // border: '1px solid darkred',
            overflow: "hidden",
            paddingTop: 1,
            backgroundColor: theme.palette.background.paper,
        },
        body: {
            height: "calc(100% - 150px)",
            overflowX: "scroll",
            overflow: "scroll",
            alignItems: "stretch",
            "&:before": {
                backgroundImage: "linear-gradient(to right,white,rgba(255,255,255,0))",
                content: "",
                height: 2,
                position: "absolute",
                width: 80,
                zIndex: 51,
            },
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
        boardContainer: {
            // borderRight: '1px solid #dadce0',
            overflowX: "auto",
            overflowY: "scroll",
            display: "flex",
            alignItems: "flex-start",
            // backgroundColor: 'rgba(245, 245, 220, 0.30)',
            // height: '100%',
        },
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
        dayContainerWeekend: {
            backgroundColor: "#F5F5F5",
        },
        currentTimeDot: {
            background: cyan[500],
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
            borderColor: cyan[500],
            borderTop: "2px solid",
            left: 0,
            right: -1,
        },
    }),
)

function CalendarLayoutDayWeek(props: any) {
    const classes = useStyles()

    const { selectedWeekIndex, selectedWeek } = props

    const { stateCalendar } = useContext(CalendarContext)
    const { selectedDate, locale, layout, defaultEventDuration } = stateCalendar

    return useMemo(() => {
        return (
            <div className={classes.root}>
                <CalendarHeader selectedWeekIndex={selectedWeekIndex} selectedWeek={selectedWeek} />

                <Grid
                    container
                    spacing={0}
                    direction='row'
                    justify='center'
                    alignItems='stretch'
                    className={clsx(classes.body)}
                >
                    <Grid item xs={1} className={classes.timeColumnContainer}>
                        <div className={classes.timeColumn}>
                            <div className={clsx(classes.timeColumnElement)} />
                            {Array.from(Array(23).keys()).map(index => {
                                return (
                                    <div className={clsx(classes.timeColumnElement)} key={`time-${index}`}>
                                        <span>{index + 1}</span>
                                    </div>
                                )
                            })}
                            <div className={clsx(classes.timeColumnElement)} />
                        </div>
                    </Grid>

                    <Grid item xs className={classes.boardContainer}>
                        <DndProvider backend={HTML5Backend}>
                            {/* <Container /> */}
                            <CalendarBoard selectedWeekIndex={selectedWeekIndex} selectedWeek={selectedWeek} />
                            <CalendarBoardDragLayer />
                        </DndProvider>
                    </Grid>
                </Grid>
            </div>
        )
        // ....
        // ....
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes, selectedDate, locale, layout, defaultEventDuration, selectedWeek, selectedWeekIndex])
}

export default CalendarLayoutDayWeek
