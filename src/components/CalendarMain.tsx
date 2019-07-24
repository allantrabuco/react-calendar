import React, { useContext } from "react"
import { CalendarContext } from "../common/CalendarContext"
import { makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import withWidth from "@material-ui/core/withWidth"
import getWeekDays from "../common/getWeekDays"
import getSelectedWeekIndex from "../common/getSelectedWeekIndex"
import CalendarLayoutMonth from "./CalendarLayoutMonth"
import CalendarLayoutDayWeek from "./CalendarLayoutDayWeek"

const drawerWidth = 260
const useStyles = makeStyles((theme: Theme) => ({
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        ...theme.mixins.toolbar,
        justifyContent: "flex-center",
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(0),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        height: "100%",
        width: "100%",
        minWidth: 1000,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}))

function CalendarMain(props: any) {
    const classes = useStyles()
    const { stateCalendar } = useContext(CalendarContext)
    const { selectedDate, locale, layout } = stateCalendar

    const { open, runAnimation } = props
    // const theme = useTheme()

    const weeks = getWeekDays(selectedDate, 7)
    const selectedWeekIndex = getSelectedWeekIndex(selectedDate, weeks, 0)
    const selectedWeek = weeks[selectedWeekIndex]

    return (
        <div
            className={clsx(classes.content, {
                [classes.contentShift]: open,
            })}
        >
            <div className={classes.drawerHeader} />

            {layout === "month" && <CalendarLayoutMonth weeks={weeks} runAnimation={runAnimation} locale={locale} />}

            {(layout === "week" || layout === "day") && (
                <CalendarLayoutDayWeek selectedWeekIndex={selectedWeekIndex} selectedWeek={selectedWeek} />
            )}
        </div>
    )
}

export default withWidth()(CalendarMain)
