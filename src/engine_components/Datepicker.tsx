import React, { useState, useRef, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { format, isValid } from 'date-fns'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TodayIcon from '@material-ui/icons/Today'
import DatepickerCalendar from './DatepickerCalendar'

const useStyles = makeStyles((theme: Theme) => ({
    collapseCalendar: {
        position: 'absolute',
    },
    textField: {
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    todayButton: {
        marginRight: 2,
    },
    todayIcon: {
        fontSize: '1.5rem',
        padding: 2,
    },
}))

function Datepicker(props: any) {
    const classes = useStyles()

    const {
        // id,
        styleCls = null,
        withIcon = true,
        label = '',
        dateFormat = 'DD/MM/YYYY',
        originalValue = new Date(),
        locale,
        onChange = () => {},
    } = props

    const applyDateFormat = useCallback(
        (date: Date) => {
            return format(date, dateFormat, { locale: locale })
        },
        [dateFormat, locale],
    )

    const datepickerRef = useRef()
    const [openCalendar, setOpenCalendar] = useState(false)
    const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 })

    const [dateTextValue, setDateTextValue] = useState(applyDateFormat(originalValue))
    const [dateValue, setDateValue] = useState()
    // const [dataOriginalDate, setDataOriginalDate] = useState(originalValue)

    const handleClickAway = () => {
        setOpenCalendar(false)
    }

    const handleOpenCalendar = (event: any) => {
        // console.group("handleOpenCalendar")
        // console.log(event.target)
        // console.log(datepickerRef.current)
        // console.groupEnd()

        const datepickerRefCurrent: any = datepickerRef.current!

        const { x, y } = datepickerRefCurrent && datepickerRefCurrent.getBoundingClientRect()

        setCalendarPosition({
            top: y + 40,
            left: document.body.offsetWidth - x < 300 ? x - 100 : x,
        })

        setOpenCalendar(!openCalendar)
    }

    const inputProps = {
        endAdornment: withIcon ? (
            <InputAdornment position='end'>
                <IconButton
                    size='medium'
                    edge='end'
                    aria-label='Toggle calendar visibility'
                    // onClick={() => }
                    onClick={handleOpenCalendar}
                >
                    <TodayIcon className={classes.todayIcon} />
                </IconButton>
            </InputAdornment>
        ) : null,
    }

    const handleChangeDateCalendar = (value: Date) => {
        // console.group("Datepicker : handleChangeDateCalendar")
        // console.log(value)
        // console.log(format(value, dateFormat, { locale: locale }))
        // console.groupEnd()
        setDateTextValue(format(value, dateFormat, { locale: locale }))
        setOpenCalendar(false)
        setDateValue(value)
        onChange(value)
    }

    const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.group('Datepicker: handleChangeTextField')
        // console.log(event.target.value)
        // console.groupEnd()
        setDateTextValue(event.target.value)
    }

    const dateValidation = (value: string) => {
        let dateReceived: any = value.replace(/-/g, '/').replace(/\./g, '/')
        const dateA = dateReceived.split('/')

        const validDateFormat = new RegExp(
            /^((\d{1,2})[-|.|/](\d{1,2})[-|.|/](\d{2,4}))|((\d{2,4})[-|.|/](\d{1,2})[-|.|/](\d{1,2}))$/,
        )
        const validDateFormatYf = new RegExp(/^(\d{2,4})[-|.|/](\d{1,2})[-|.|/](\d{1,2})$/)

        const isDateOK = validDateFormat.test(dateReceived)

        if (!isDateOK) {
            return new Date(originalValue)
        }

        const hasYearFirst = validDateFormatYf.test(dateReceived)

        const year = (hasYearFirst && dateA[0]) || dateA[2]
        const month = dateA[1] > 12 ? (!hasYearFirst ? dateA[0] : 99) : dateA[1]
        const day = hasYearFirst ? dateA[2] : dateA[0]

        dateReceived = new Date(year, month - 1, day)

        // console.group('dateValidation')
        // console.log(dateReceived)
        // console.log(`year: ${year}`)
        // console.log(`month: ${month}`)
        // console.log(`day: ${day}`)
        // console.groupEnd()

        return dateReceived
    }

    const handleBlurTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = event.target.value

        // console.group("Datepicker: handleBlurTextField")
        // console.log(dateValue)
        // console.groupEnd()

        if (dateValue.length <= 0) {
            return false
        }

        const validatedDate = dateValidation(dateValue)
        const correctDate = isValid(validatedDate) ? validatedDate : originalValue
        setDateTextValue(applyDateFormat(correctDate))
        setDateValue(correctDate)

        // console.group("Datepicker: handleBlurTextField (correctDate)")
        // console.log(correctDate)
        // console.groupEnd()

        onChange(correctDate)
    }

    useEffect(() => {
        // console.group("useEffect - originalValue")
        // console.log(originalValue, openCalendar)
        // console.log(format(originalValue, dateFormat, { locale: locale }))
        // console.groupEnd()
        setDateValue(originalValue)
        setDateTextValue(applyDateFormat(originalValue))

        if (format(originalValue, 'YYYY/MM/DD') === '1970/01/01') {
            setOpenCalendar(false)
        }
    }, [originalValue, applyDateFormat])

    // useEffect(() => {
    //     console.group('useEffect - originalValue')
    //     console.log(dateValue)
    //     console.groupEnd()

    //     setDateValue(originalValue)
    // }, [dateValue])

    return (
        <>
            <TextField
                inputRef={datepickerRef}
                className={clsx(classes.textField, styleCls)}
                variant='standard'
                fullWidth
                type={'text'}
                label={label}
                value={dateTextValue}
                onChange={handleChangeTextField}
                onBlur={handleBlurTextField}
                InputProps={inputProps}
            />
            {openCalendar && (
                <DatepickerCalendar
                    datepickerValue={dateValue}
                    calendarPosition={calendarPosition}
                    openCalendar={openCalendar}
                    handleClickAway={handleClickAway}
                    handleChangeDateCalendar={handleChangeDateCalendar}
                />
            )}
        </>
    )
}

export default Datepicker
