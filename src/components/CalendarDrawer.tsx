import React from 'react'
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CalendarSmall from '../engine_components/CalendarSmall'

const drawerWidth = 260
const useStyles = makeStyles((theme: Theme) => ({
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    calendarSmall: {
        marginTop: theme.spacing(4),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(4),
        marginLeft: theme.spacing(1),
        minHeight: 265,
        minWidth: 240,
        background: theme.palette.background.paper,
    },
}))

function CalendarDrawer(props: any) {
    const { open, handleDrawerClose } = props
    const classes = useStyles()
    const theme = useTheme()

    return (
        <Drawer
            className={classes.drawer}
            variant='persistent'
            anchor='left'
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <div className={classes.calendarSmall}>
                <CalendarSmall />
            </div>
            <Divider />
            {/* {"{info/notes}"} */}
        </Drawer>
    )
}

export default CalendarDrawer
