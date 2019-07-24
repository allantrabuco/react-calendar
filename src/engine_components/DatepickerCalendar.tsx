import React from "react"
import { createPortal } from "react-dom"
import { makeStyles, Theme } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Collapse from "@material-ui/core/Collapse"
import CalendarSmall from "./CalendarSmall"

const useStyles = makeStyles((theme: Theme) => ({
    collapseCalendar: {
        position: "absolute",
        zIndex: 1600,
    },
    paper: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        // marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        maxWidth: 272,
    },
}))

function DatepickerCalendar(props: any) {
    const classes = useStyles()

    const {
        datepickerValue = new Date(),
        calendarPosition = { top: 0, left: 0 },
        openCalendar,
        handleClickAway,
        handleChangeDateCalendar,
    } = props

    const popupCalendar = (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Collapse
                in={openCalendar}
                className={classes.collapseCalendar}
                style={{ top: calendarPosition.top, left: calendarPosition.left }}
                // style={{ top: 200, left: 400 }}
            >
                <Paper className={classes.paper}>
                    <CalendarSmall
                        isDatepicker={true}
                        datepickerOnChange={handleChangeDateCalendar}
                        datepickerValue={datepickerValue}
                    />
                </Paper>
            </Collapse>
        </ClickAwayListener>
    )

    const appRoot = document.body
    return createPortal(popupCalendar, appRoot)
}

export default DatepickerCalendar
