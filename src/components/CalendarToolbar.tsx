import React, { useContext, useMemo } from 'react'
import { CalendarContext } from '../common/CalendarContext'
import clsx from 'clsx'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { injectIntl } from 'react-intl'
import { i18nPreviousLabel, i18nNextLabel } from '../common/i18nLabels'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from "@material-ui/icons/Menu"
import TodayIcon from '@material-ui/icons/Today'
import ViewWeekIcon from '@material-ui/icons/ViewWeek'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'
import ViewModuleIcon from '@material-ui/icons/ViewModule'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Select from 'react-select'
// import Select from "react-select"
import format from 'date-fns/format'
import getWeekDays from '../common/getWeekDays'
import getSelectedWeekIndex from '../common/getSelectedWeekIndex'

const drawerWidth = 260
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            position: 'fixed',
            backgroundColor: theme.palette.background.paper,
            width: '100%',
            borderBottom: '1px solid #E0E0E0',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            paddingLeft: theme.spacing(1),
            fontWeight: 400,
            fontSize: theme.spacing(3),
            textTransform: 'capitalize',
        },
        button: {
            paddingRight: theme.spacing(1),
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        hide: {
            display: 'none',
        },
        tooltip: {
            marginTop: 2,
        },
        select: {
            width: theme.spacing(15),
        },
    }),
)

const languageOptions = [
    {
        value: 'en-US',
        label: 'English',
    },
    {
        value: 'pt-BR',
        label: 'Português',
    },
]

function CalendarToolbar(props: any) {
    const classes = useStyles()
    const {
        // open,
        // handleDrawerOpen,
        // handleDrawerClose,
        changeLanguage,
        goToToday,
        next,
        previous,
        intl,
        // match,
    } = props

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const { selectedDate, locale, i18nLocale, layout } = stateCalendar

    return useMemo(() => {
        const setLayout = (props: any) => {
            const { option } = props
            setStateCalendar({ ...stateCalendar, layout: option })
        }

        const weeks = getWeekDays(selectedDate, 7)
        const selectedWeekIndex = getSelectedWeekIndex(selectedDate, weeks, 0)
        const selectedWeek = weeks[selectedWeekIndex]

        const firstDayOfWeekMonth = format(selectedWeek[0], 'MMM', { locale: locale })
        const lastDayOfWeekMonth = format(selectedWeek[6], 'MMM', { locale: locale })
        const firstDayOfWeekYear = format(selectedWeek[0], 'YYYY', { locale: locale })
        const lastDayOfWeekYear = format(selectedWeek[6], 'YYYY', { locale: locale })

        const showMonthsAndYears =
            layout === 'week' &&
            (firstDayOfWeekMonth !== lastDayOfWeekMonth && firstDayOfWeekYear !== lastDayOfWeekYear)
                ? `${firstDayOfWeekMonth} ${firstDayOfWeekYear} - ${lastDayOfWeekMonth} ${lastDayOfWeekYear}`
                : false
        const showMonthsAndYear =
            !showMonthsAndYears && layout === 'week' && firstDayOfWeekMonth !== lastDayOfWeekMonth
                ? `${firstDayOfWeekMonth} - ${lastDayOfWeekMonth} ${firstDayOfWeekYear}`
                : false
        const showMonthAndYear = !showMonthsAndYear
            ? format(selectedDate, 'MMMM YYYY', { locale: locale })
            : false

        return (
            <div
                // position='fixed'
                className={clsx(classes.root, classes.appBar)}
                // className={clsx(classes.root, classes.appBar, {
                //     [classes.appBarShift]: open,
                // })}
                // color='default'
            >
                <Toolbar>
                    {/* <IconButton
                        color='inherit'
                        aria-label='Open drawer'
                        onClick={open ? handleDrawerClose : handleDrawerOpen}
                        edge='start'
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton> */}

                    <Tooltip
                        title={`${format(new Date(), 'dddd, D MMMM', { locale: locale })}`}
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <IconButton
                            color='inherit'
                            aria-label='Today'
                            onClick={goToToday}
                            edge='start'
                            className={classes.menuButton}
                        >
                            <TodayIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={intl.formatMessage({ id: i18nPreviousLabel(layout) })}
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <IconButton onClick={previous}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={intl.formatMessage({ id: i18nNextLabel(layout) })}
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <IconButton onClick={next}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Tooltip>

                    <Typography className={classes.title}>
                        {showMonthsAndYears || showMonthsAndYear || showMonthAndYear}
                    </Typography>

                    <Tooltip
                        title={intl.formatMessage({ id: 'navigation.day' })}
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <IconButton
                            color='inherit'
                            aria-label='Day View'
                            onClick={e => setLayout({ e, option: 'day' })}
                            edge='start'
                            className={classes.menuButton}
                        >
                            <CalendarViewDayIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={intl.formatMessage({ id: 'navigation.week' })}
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <IconButton
                            color='inherit'
                            aria-label='Week View'
                            onClick={e => setLayout({ e, option: 'week' })}
                            edge='start'
                            className={classes.menuButton}
                        >
                            <ViewWeekIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={intl.formatMessage({ id: 'navigation.month' })}
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <IconButton
                            color='inherit'
                            aria-label='Month View'
                            onClick={e => setLayout({ e, option: 'month' })}
                            edge='start'
                            className={classes.menuButton}
                        >
                            <ViewModuleIcon />
                        </IconButton>
                    </Tooltip>

                    <Select
                        options={languageOptions}
                        defaultValue={languageOptions.find((option: any) => {
                            return option.value === i18nLocale
                        })}
                        className={classes.select}
                        onChange={changeLanguage}
                    />
                </Toolbar>
            </div>
        )
        // ....
        // for stateCalendar and setStateCalendar
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        classes,
        selectedDate,
        layout,
        intl,
        locale,
        i18nLocale,
        goToToday,
        next,
        previous,
        changeLanguage,
    ])
}

export default injectIntl(CalendarToolbar)
