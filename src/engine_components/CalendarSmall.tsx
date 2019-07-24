import React, { useState, useContext, useEffect, useMemo } from "react"
import { CalendarContext } from "../common/CalendarContext"
import clsx from "clsx"
import { makeStyles, Theme } from "@material-ui/core/styles"
import { injectIntl } from "react-intl"
import { i18nPreviousLabel, i18nNextLabel } from "../common/i18nLabels"
import { format, getMonth, addMonths, subMonths } from "date-fns"
import Grid from "@material-ui/core/Grid"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import TodayOutlinedIcon from "@material-ui/icons/TodayOutlined"
import Typography from "@material-ui/core/Typography"
import { lightBlue } from "@material-ui/core/colors"
import getWeekDays from "../common/getWeekDays"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        minHeight: 264,
        minWidth: 240,
        background: theme.palette.background.paper,
    },
    title: {
        marginLeft: theme.spacing(1),
        textTransform: "capitalize",
    },

    dayHeader: {
        textAlign: "center",
        fontSize: 12,
        color: lightBlue[800],
        lineHeight: "26px",
        padding: theme.spacing(0.2),
        borderColor: theme.palette.background.paper,
        borderStyle: "solid",
        textTransform: "capitalize",
        background: theme.palette.background.paper,
        height: 34.3,
        width: 34.3,
    },
    day: {
        textAlign: "center",
        fontSize: 12,
        cursor: "pointer",
        borderRadius: "50%",
        borderWidth: theme.spacing(0.4),
        lineHeight: "26px",
        padding: theme.spacing(0.2),
        background: theme.palette.background.paper,
        height: 34.3,
        width: 34.3,
    },
    today: {
        color: theme.palette.background.paper,
        background: theme.palette.background.paper,
        borderColor: theme.palette.background.paper,
        borderStyle: "solid",
        backgroundColor: lightBlue[700],
        "&:hover": {
            backgroundColor: lightBlue[800],
        },
    },
    notToday: {
        background: theme.palette.background.paper,
        borderColor: theme.palette.background.paper,
        borderStyle: "solid",
        "&:hover": {
            backgroundColor: theme.palette.grey[100],
        },
    },
    selected: {
        color: "#ffffff",
        borderColor: theme.palette.background.paper,
        borderStyle: "solid",
        backgroundColor: lightBlue[500],
        "&:hover": {
            color: "#ffffff",
            backgroundColor: lightBlue[600],
        },
    },
    notCurrentMonth: {
        color: theme.palette.grey[500],
        background: theme.palette.background.paper,
    },
    navigation: {
        marginRight: theme.spacing(0.5),
    },
    tooltip: {
        marginTop: 2,
    },
    todayButton: {
        marginRight: 2,
    },
    todayIcon: {
        fontSize: "1.5rem",
        padding: 2,
    },
}))

function CalendarSmall(props: any) {
    const classes = useStyles()
    const { intl, isDatepicker = false, datepickerOnChange = () => {}, datepickerValue } = props
    const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const { selectedDate, locale } = stateCalendar

    const [internalDate, setInternalDate] = useState(isDatepicker ? datepickerValue : selectedDate)
    const [selectedInternalDate, setSelectedInternalDate] = useState(isDatepicker ? datepickerValue : null)

    useEffect(() => {
        // console.group("CalendarSmall : useEffect")
        // console.log(selectedDate)
        // console.log(selectedInternalDate)
        // console.groupEnd()
        setInternalDate(isDatepicker ? datepickerValue : selectedDate)
        !isDatepicker && selectedDate !== selectedInternalDate && setSelectedInternalDate("")
    }, [selectedDate, selectedInternalDate, isDatepicker, datepickerValue])

    return useMemo(() => {
        // console.log('small...')
        const weeks = getWeekDays(internalDate, 7)

        const findNewDate = (props: any) => {
            const { direction } = props
            setInternalDate(direction === "<" ? subMonths(internalDate, 1) : addMonths(internalDate, 1))
        }

        const selectDate = (props: any) => {
            const { newDate } = props

            if (!isDatepicker) {
                setStateCalendar({ ...stateCalendar, selectedDate: newDate })
                setSelectedInternalDate(newDate)
            } else {
                datepickerOnChange(newDate)
            }
        }

        return (
            <section className={classes.root}>
                <Grid container direction='row' justify='flex-end' alignItems='center' spacing={0} wrap='nowrap'>
                    <Grid item xs={8}>
                        <Typography className={classes.title}>
                            {format(internalDate, "MMMM YYYY", { locale: locale })}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={4}
                        container
                        direction='row'
                        justify='flex-end'
                        alignItems='center'
                        spacing={0}
                        wrap='nowrap'
                        className={classes.navigation}
                    >
                        {isDatepicker && (
                            <Tooltip
                                title={`${format(new Date(), "dddd, D MMMM", { locale: locale })}`}
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <IconButton
                                    size='small'
                                    aria-label='Today'
                                    onClick={() => {
                                        setInternalDate(new Date())
                                    }}
                                    className={classes.todayButton}
                                >
                                    <TodayOutlinedIcon className={classes.todayIcon} />
                                </IconButton>
                            </Tooltip>
                        )}{" "}
                        <Tooltip
                            title={intl.formatMessage({ id: i18nPreviousLabel("month") })}
                            classes={{ tooltip: classes.tooltip }}
                        >
                            <IconButton size='small' onClick={event => findNewDate({ event, direction: "<" })}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Tooltip>{" "}
                        <Tooltip
                            title={intl.formatMessage({ id: i18nNextLabel("month") })}
                            classes={{ tooltip: classes.tooltip }}
                        >
                            <IconButton size='small' onClick={event => findNewDate({ event, direction: ">" })}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Grid container spacing={0} direction='row' justify='center' alignItems='center' wrap='nowrap'>
                    {weeks[0].map((weekDay: Date, index: number) => {
                        return (
                            <Grid item xs key={`small-calendar-column-header-${index}`}>
                                <Typography className={classes.dayHeader}>
                                    {format(weekDay, "dd", { locale: locale }).substr(0, 1)}
                                </Typography>
                            </Grid>
                        )
                    })}
                </Grid>

                {weeks.map((week: any, weekIndex: number) => (
                    <Grid
                        container
                        spacing={0}
                        direction='row'
                        justify='center'
                        alignItems='center'
                        wrap='nowrap'
                        key={`small-calendar-line-${weekIndex}`}
                    >
                        {week.map((day: any, dayIndex: number) => {
                            const isToday = format(day, "DDMMYYYY") === format(new Date(), "DDMMYYYY")
                            const isSelected =
                                selectedInternalDate !== null &&
                                !isToday &&
                                format(day, "DDMMYYYY") === format(selectedInternalDate, "DDMMYYYY")

                            const isCurrentMonth = getMonth(internalDate) === getMonth(day)

                            return (
                                <Grid item xs key={`small-calendar-line-${weekIndex}-column-${dayIndex}`}>
                                    <Typography
                                        className={clsx(classes.day, {
                                            [classes.today]: isToday,
                                            [classes.notToday]: !isToday,
                                            [classes.selected]: !isToday && isSelected,
                                            [classes.notCurrentMonth]: !isCurrentMonth,
                                        })}
                                        onClick={() => selectDate({ newDate: day })}
                                    >
                                        {day.getDate()}
                                    </Typography>
                                </Grid>
                            )
                        })}
                    </Grid>
                ))}
            </section>
        )
        // eslint-disable-next-line
    }, [classes, internalDate, locale, selectedInternalDate])
}

export default injectIntl(CalendarSmall)
