import React, { useState } from "react"
// import { makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import { makeStyles, Theme } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { addLocaleData, IntlProvider } from "react-intl"
import en from "react-intl/locale-data/en"
import pt from "react-intl/locale-data/pt"
import { flattenMessages } from "../common/utils"
import dictionary from "../common/dictionary"
import { addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from "date-fns"
import * as dateFnsPT from "date-fns/locale/pt" // <<<< I18N   (DO NOT REMOVE!!!)
// import { withRouter } from "react-router-dom"
import { CalendarContext } from "../common/CalendarContext"
import CalendarToolbar from "./CalendarToolbar"
import CalendarDrawer from "./CalendarDrawer"
import CalendarMain from "./CalendarMain"
import CalendarEventDialog from "./CalendarEventDialog"
import CalendarEventViewDialog from "./CalendarEventViewDialog"

// drawerWidth = 260
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        height: "100%",
        width: "100%",
        // overflow: "scro",
        // backgroundColor: cyan[100],
    },
}))

const layout = "week"

let _locale =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    // navigator.userLanguage ||
    "en-US"
_locale = !!~Object.keys(dictionary).indexOf(_locale) ? _locale : "en-US"
// _locale = "pt-BR"

let locale = _locale === "pt-BR" ? dateFnsPT : null

const openDialog = false
const openViewDialog = false
const selectedDate = new Date()
const defaultEventDuration = 60 // in minutes

function Calendar(props: any) {
    // const { history, match } = props
    const classes = useStyles()
    // const theme = useTheme()

    addLocaleData([...en, ...pt])
    const i18nLocale = _locale
    const locale_dictionary: any = flattenMessages(dictionary[i18nLocale])

    const changeLanguage = (newLang: any) => {
        const i18nLocale = newLang.value
        const newDateFnLocale = i18nLocale === "pt-BR" ? dateFnsPT : null

        console.group("changeLanguage")
        console.log("locale: ", newDateFnLocale)
        console.groupEnd()
        setStateCalendar({ ...stateCalendar, locale: newDateFnLocale, i18nLocale })
    }

    // const handleCloseDialog = () => {
    //     console.group('on handleCloseDialog')
    //     console.log({ stateCalendar })
    //     console.groupEnd()
    //     // const {open} = props
    //     setStateCalendar({ ...stateCalendar, openDialog: false })
    // }

    // const handleCloseViewDialog = () => {
    //     console.group('on handleCloseViewDialog')
    //     console.log({ stateCalendar })
    //     console.groupEnd()

    //     // const {open} = props
    //     setStateCalendar({ ...stateCalendar, openViewDialog: false })
    // }

    const [stateCalendar, setStateCalendar] = useState({
        selectedDate,
        locale,
        i18nLocale,
        layout,
        openDialog,
        openViewDialog,
        eventBeginDate: null,
        eventBeginTime: { value: null, label: null },
        eventEndDate: null,
        eventEndTime: { value: null, label: null },
        defaultEventDuration,
        modal: false,
        eventDialogMaxWidth: "md",
        fullscreen: false,
        allowFullScreen: false,
        withCloseIcon: true,
        title: "",
        content: "",
        actions: "",
        calendarEvent: {},
        draggingEventId: -1,
        startDragging: false,
        ghostProperties: { width: 0, height: 0, date: new Date() },
        // handleCloseDialog,
        // handleCloseViewDialog,
    })

    const [open, setOpen] = useState(true)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const [runAnimation, setRunAnimation] = useState(true)

    // const applyLink = (newDate: Date) => {
    //     history.push(`/d/${layout}/${format(newDate, "YYYY/MM/DD")}`)
    // }

    const goToToday = () => {
        setRunAnimation(false)
        const newDate = new Date()
        setStateCalendar({ ...stateCalendar, selectedDate: newDate })
        // applyLink(newDate)
    }

    const handleLayoutChange = (args: any) => {
        const { value } = args
        setStateCalendar({ ...stateCalendar, layout: value })
        // history.push(`/d/${value}/${format(selectedDate, "YYYY/MM/DD")}`)
    }

    const next = () => {
        setRunAnimation(false)
        let newDate

        switch (stateCalendar.layout) {
            case "week":
                newDate = addWeeks(stateCalendar.selectedDate, 1)
                break

            case "day":
                newDate = addDays(stateCalendar.selectedDate, 1)
                break

            default:
                // month
                newDate = addMonths(stateCalendar.selectedDate, 1)
                break
        }
        setStateCalendar({ ...stateCalendar, selectedDate: newDate })
        // applyLink(newDate)
    }

    const previous = () => {
        setRunAnimation(false)
        let newDate

        switch (stateCalendar.layout) {
            case "week":
                newDate = subWeeks(stateCalendar.selectedDate, 1)
                break

            case "day":
                newDate = subDays(stateCalendar.selectedDate, 1)
                break

            default:
                // month
                newDate = subMonths(stateCalendar.selectedDate, 1)
                break
        }
        setStateCalendar({ ...stateCalendar, selectedDate: newDate })
        // applyLink(newDate)
    }

    // useEffect(() => {
    //     // selectedDate !== null && applyLink(selectedDate)
    //     setTimeout(() => {
    //         setRunAnimation(true)
    //     }, 1)
    // }, [selectedDate])

    return (
        <CalendarContext.Provider value={{ stateCalendar, setStateCalendar }}>
            <IntlProvider locale={i18nLocale} messages={locale_dictionary}>
                <div className={classes.root}>
                    <CssBaseline />

                    <CalendarToolbar
                        goToToday={goToToday}
                        next={next}
                        previous={previous}
                        open={open}
                        handleDrawerOpen={handleDrawerOpen}
                        handleDrawerClose={handleDrawerClose}
                        handleLayoutChange={handleLayoutChange}
                        changeLanguage={changeLanguage}
                    />

                    <CalendarDrawer
                        selectedDate={selectedDate}
                        next={next}
                        previous={previous}
                        open={open}
                        handleDrawerClose={handleDrawerClose}
                        layout={"month"}
                        locale={locale}
                    />

                    <CalendarMain
                        // selectedDate={selectedDate}
                        open={open}
                        // layout={layout}
                        runAnimation={runAnimation}
                    />

                    <CalendarEventDialog />
                    <CalendarEventViewDialog />
                </div>
            </IntlProvider>
        </CalendarContext.Provider>
    )
}

// export default withRouter(Calendar)
export default Calendar
