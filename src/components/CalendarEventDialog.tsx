import React, { useContext, useState, useMemo, useRef, useEffect } from "react"
import { CalendarContext } from "../common/CalendarContext"
import { makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import Slide from "@material-ui/core/Slide"
import { TransitionProps } from "@material-ui/core/transitions"
// import red from "@material-ui/core/colors/red"
import grey from "@material-ui/core/colors/grey"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControl from "@material-ui/core/FormControl"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import CloseIcon from "@material-ui/icons/Close"
import AccessTimeIcon from "@material-ui/icons/AccessTime"
import SubjectIcon from "@material-ui/icons/Subject"
import { format, getTime } from "date-fns"
import TimeSelect from "../engine_components/TimeSelect"
import Datepicker from "../engine_components/Datepicker"

// maxWidth: xs, sm, md, lg, xl

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction='down' ref={ref} {...props} />
})

const useStyles = makeStyles((theme: Theme) => ({
    divTitleButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
    fullScreenButton: {
        color: theme.palette.grey[900],
    },
    closeButton: {
        // color: theme.palette.grey[900],
        // color: theme.palette.secondary.light,
        // color: red[500],
        // "&:hover": {
        // backgroundColor: red[100],
        // },
    },
    cancelButton: {
        // color: red[500],
        // "&:hover": {
        //     backgroundColor: red[100],
        // },
    },
    form: {
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        // marginTop: -30,
        // width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        // minWidth: 120,
    },
    formControlFlex: {
        display: "inline-flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    title: {
        marginTop: 0,
    },
    descriptionIcon: {
        // marginTop: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
    betweenDates: {
        textAlign: "center",
        fontSize: 16,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    datepicker: {
        width: 130,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        "&:hover": {
            backgroundColor: grey[100],
        },
    },
    dayOfWeek: {
        marginLeft: theme.spacing(1),
        color: grey[500],
    },
}))

// const firstTime = "8:00"
const interval = 30
const timeOptions = Array.from(Array(24).keys()).reduce((time: any[], hour: number) => {
    Array.from(Array(60 / interval).keys()).map(i => {
        const timeItem = (+(hour + "." + i * interval)).toFixed(2).replace(".", ":")
        time.push({ value: timeItem, label: timeItem })
        return null
    })
    return time
}, [])

function CalendarEventDialog(props: any) {
    const classes = useStyles()

    // const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const {
        modal = false,
        eventDialogMaxWidth = "md",
        fullscreen = false,
        allowFullScreen = false,
        withCloseIcon = true,
        eventID = 0,
        title,
        description,
        openDialog,
        eventBeginDate,
        eventBeginTime,
        eventEndDate,
        eventEndTime,
        // minutes,
        locale,
    } = stateCalendar

    const handleCloseDialog = () => {
        setStateCalendar({ ...stateCalendar, openDialog: false, openViewDialog: false })
    }

    const [fullScreen, setFullScreen] = useState(false)

    // useEffect(() => {
    //     console.log("useEffect for eventBeginDate", eventBeginDate)
    //     console.log("useEffect for eventEndDate", eventEndDate)
    // }, [eventBeginDate, eventEndDate])

    // useEffect(() => {
    //     console.log("useEffect for eventBeginDate", eventBeginDate)
    //     console.log("useEffect for eventEndDate", eventEndDate)
    // }, [eventBeginDate, eventEndDate])

    const textFieldTitle: React.RefObject<HTMLInputElement> = useRef(null)
    const [titleTF, setTitleTF] = useState(title)
    const [descriptionTF, setDescriptionTF] = useState(description)

    useEffect(() => {
        setTitleTF(title)
    }, [title])

    useEffect(() => {
        setDescriptionTF(description)
    }, [description])

    return useMemo(() => {
        // console.group('CalendarEventDialog')
        // console.log('memo?!')
        // console.groupEnd()

        const onExited = () => {
            setFullScreen(false)
            setDescriptionTF("")
            setTitleTF("")
        }

        const handleOnClose = () => {
            !modal && handleClose()
        }

        const handleClose = () => {
            handleCloseDialog()
        }

        const handleFullScreen = () => {
            setFullScreen(!fullScreen)
        }

        const handleOk = () => {
            const localStorageMarckers = window.localStorage.getItem("markers")
            const markers = (localStorageMarckers && JSON.parse(localStorageMarckers)) || []
            const marker = {
                id: eventID > 0 ? eventID : getTime(new Date()),
                title: titleTF,
                begin: format(formatDateTime(eventBeginDate, eventBeginTime.value), "YYYY/MM/DD HH:mm:ss"),
                end: format(formatDateTime(eventEndDate, eventEndTime.value), "YYYY/MM/DD HH:mm:ss"),
                description: descriptionTF,
            }

            console.log({ eventID })
            window.localStorage.setItem(
                "markers",
                JSON.stringify([...markers.filter((markEvent: any) => markEvent.id !== eventID), marker]),
            )

            handleClose()
        }

        // function handleCancel() {
        //     handleClose()
        // }

        const formatDateTime = (newDate: Date, newTime: string) => {
            // console.log("formatDateTime: newDate", newDate)
            // console.log("formatDateTime: newTime", newTime)
            const dateTxt = format(newDate, "YYYY/MM/DD")
            return new Date(dateTxt + " " + newTime)
        }

        const onChangeBeginDate = (newDate: Date) => {
            setStateCalendar({
                ...stateCalendar,
                eventBeginDate: newDate,
                eventEndDate: new Date(format(newDate, "YYYY/MM/DD ") + format(eventEndDate, "HH:mm")),
            })
        }
        const onChangeEndDate = (newDate: Date) => {
            setStateCalendar({ ...stateCalendar, eventEndDate: newDate })
        }

        const onChangeBeginTime = (newValue: any) => {
            setStateCalendar({ ...stateCalendar, eventBeginTime: newValue })
        }

        const onChangeEndTime = (newValue: any) => {
            setStateCalendar({ ...stateCalendar, eventEndTime: newValue })
        }

        const dateFormat = "DD/MM/YYYY"

        // const buttonDisabled = titleTF.length <= 0 || eventBeginDate > eventEndDate
        const buttonDisabled =
            eventBeginTime && eventEndTime
                ? formatDateTime(eventBeginDate, eventBeginTime.value) >
                  formatDateTime(eventEndDate, eventEndTime.value)
                : false

        return (
            <Dialog
                onEntered={() => {
                    setTitleTF(title)
                    setDescriptionTF(description)
                    textFieldTitle.current !== null && textFieldTitle.current!.focus()
                }}
                onExited={onExited}
                fullScreen={fullscreen || fullScreen}
                fullWidth={true}
                maxWidth={eventDialogMaxWidth}
                open={openDialog}
                onClose={handleOnClose}
                aria-labelledby='max-width-dialog-title'
                TransitionComponent={Transition}
                keepMounted={false}
            >
                <DialogTitle>
                    {title}
                    <div className={classes.divTitleButton}>
                        {allowFullScreen ? (
                            <IconButton
                                aria-label='Close'
                                className={classes.fullScreenButton}
                                onClick={handleFullScreen}
                            >
                                {!fullScreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
                            </IconButton>
                        ) : null}
                        {withCloseIcon ? (
                            <IconButton aria-label='Close' className={classes.closeButton} onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        ) : null}
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form className={classes.form} noValidate>
                        <FormControl className={classes.formControl}>
                            <TextField
                                inputRef={textFieldTitle}
                                className={classes.title}
                                fullWidth={true}
                                placeholder='Title'
                                name='title'
                                value={titleTF}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setTitleTF(event.target.value)
                                }}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (event.key === "Enter" && !buttonDisabled) {
                                        handleOk()
                                        handleClose()
                                    }
                                }}
                                margin='normal'
                                required={true}
                            />
                        </FormControl>
                        <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
                            <AccessTimeIcon />
                            <Datepicker
                                styleCls={classes.datepicker}
                                dateFormat={dateFormat}
                                originalValue={new Date(eventBeginDate)}
                                onChange={onChangeBeginDate}
                            />
                            <TimeSelect
                                placeholder={""}
                                options={timeOptions}
                                originalValue={{
                                    value: eventBeginTime.value,
                                    label: eventBeginTime.label,
                                }}
                                onChange={onChangeBeginTime}
                            />
                            <Typography className={classes.dayOfWeek}>
                                {format(eventBeginDate, "dddd", { locale: locale })}
                            </Typography>
                        </FormControl>
                        <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
                            <AccessTimeIcon />
                            <Datepicker
                                styleCls={classes.datepicker}
                                dateFormat={dateFormat}
                                originalValue={eventEndDate}
                                onChange={onChangeEndDate}
                            />
                            <TimeSelect
                                placeholder={""}
                                options={timeOptions}
                                originalValue={{
                                    value: eventEndTime.value,
                                    label: eventEndTime.label,
                                }}
                                onChange={onChangeEndTime}
                            />
                            <Typography className={classes.dayOfWeek}>
                                {format(eventEndDate, "dddd", { locale: locale })}
                            </Typography>
                        </FormControl>
                        <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
                            <SubjectIcon className={classes.descriptionIcon} />
                            <TextField
                                fullWidth={true}
                                placeholder='Description'
                                multiline
                                // className={classes.textField}
                                // margin='normal'
                                onChange={(event: any) => {
                                    setDescriptionTF(event.target.value)
                                }}
                                value={descriptionTF}
                            />
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOk} color='primary' disabled={buttonDisabled}>
                        save
                    </Button>
                    {/* <Button onClick={handleCancel} className={classes.cancelButton}> */}
                    {/* cancel */}
                    {/* </Button> */}
                </DialogActions>
            </Dialog>
        )
        // ....
        // ....
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        openDialog,
        titleTF,
        descriptionTF,
        eventBeginDate,
        eventBeginTime,
        eventEndDate,
        eventEndTime,
        allowFullScreen,
        classes,
        eventDialogMaxWidth,
        eventID,
        fullScreen,
        fullscreen,
        handleCloseDialog,
        locale,
        modal,
        title,
        description,
        withCloseIcon,
    ])
}

export default CalendarEventDialog
