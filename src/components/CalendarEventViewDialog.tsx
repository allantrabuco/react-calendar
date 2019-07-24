import React, { useContext, useMemo } from "react"
import { CalendarContext } from "../common/CalendarContext"
import { makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import format from "date-fns/format"
import FormControl from "@material-ui/core/FormControl"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import AccessTimeIcon from "@material-ui/icons/AccessTime"
import EditIcon from "@material-ui/icons/EditOutlined"
import DeleteIcon from "@material-ui/icons/DeleteOutline"
import Tooltip from "@material-ui/core/Tooltip"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import Slide from "@material-ui/core/Slide"
import { TransitionProps } from "@material-ui/core/transitions"
import createEditEvent from "./createEditEvent"

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction='down' ref={ref} {...props} />
})

const useStyles = makeStyles((theme: Theme) => ({
    divTitleButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
    closeButton: {
        // color: theme.palette.grey[900],
        // color: theme.palette.secondary.light,
        // color: red[500],
        // "&:hover": {
        // backgroundColor: red[100],
        // },
    },
    dialogContent: {
        display: "flex",
        flexDirection: "column",
        // margin: "auto",
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
    icon: {
        marginRight: theme.spacing(1),
    },
    optionsBar: {
        marginTop: theme.spacing(-1),
        display: "inline-flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
}))

function CalendarEventViewDialog(props: any) {
    const classes = useStyles()

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext)
    const { openViewDialog, locale, calendarEvent } = stateCalendar

    return useMemo(() => {
        // console.group('CalendarEventViewDialog')
        // console.log(calendarEvent)
        // console.groupEnd()

        const handleCloseViewDialog = () => {
            setStateCalendar({ ...stateCalendar, openViewDialog: false })
        }

        return (
            <Dialog
                // onEntered={() => {
                //     console.log(textFieldTitle)
                //     textFieldTitle.current !== null && textFieldTitle.current!.focus()
                // }}
                // onExited={onExited}
                fullScreen={false}
                fullWidth={true}
                maxWidth='sm'
                open={openViewDialog}
                onClose={handleCloseViewDialog}
                aria-labelledby='max-width-dialog-title'
                TransitionComponent={Transition}
                keepMounted={false}
            >
                <DialogTitle>
                    {calendarEvent.title || ""}
                    <div className={classes.divTitleButton}>
                        <IconButton aria-label='Close' className={classes.closeButton} onClick={handleCloseViewDialog}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <FormControl className={classes.optionsBar}>
                        <Tooltip title='Edit'>
                            <IconButton
                                size='medium'
                                aria-label='Edit event'
                                // onClick={() => }
                                onClick={(eventEl: any) => {
                                    createEditEvent({
                                        eventEl,
                                        // defaultEventDuration,
                                        stateCalendar,
                                        setStateCalendar,
                                        calendarEvent,
                                    })
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                            <IconButton
                                size='medium'
                                edge='end'
                                aria-label='Delete event'
                                // onClick={() => }
                                onClick={() => {
                                    console.log("DELETE!!!!")
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </FormControl>
                    <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
                        <AccessTimeIcon className={classes.icon} />
                        <Typography>
                            {format(new Date(calendarEvent.begin), "dddd, D MMMM YYYY ⋅ HH:mm -", {
                                locale: locale,
                            })}{" "}
                            {format(new Date(calendarEvent.end), "HH:mm", { locale: locale })}
                        </Typography>
                    </FormControl>
                </DialogContent>
                <DialogActions />
            </Dialog>
        )
        // ....
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarEvent, classes, locale, openViewDialog])
}

export default CalendarEventViewDialog
