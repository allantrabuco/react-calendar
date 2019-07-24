import React, { useState, useEffect, useMemo, useRef } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import NoSsr from '@material-ui/core/NoSsr'
import TextField from '@material-ui/core/TextField'
// import Paper from "@material-ui/core/Paper"
// import MenuItem from "@material-ui/core/MenuItem"
import PropTypes from 'prop-types'
import { createFilter } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import makeAnimated from 'react-select/animated'
// import Select from "react-select"

const animatedComponents = makeAnimated()
const timeRefExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')

const useStyles = makeStyles(theme => ({
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    select: {
        maxWidth: 60,
        minWidth: 60,
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    // noOptionsMessage: {
    //     padding: theme.spacing(1, 2),
    // },
    // placeholder: {
    //     position: 'absolute',
    //     left: 2,
    //     bottom: 6,
    //     fontSize: 16,
    // },
    // paper: {
    //     position: 'absolute',
    //     zIndex: 1,
    //     marginTop: theme.spacing(1),
    //     left: 0,
    //     right: 0,
    // },
}))

// function NoOptionsMessage(props) {
//     return (
//         <Typography color='textSecondary' className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
//             {props.children}
//         </Typography>
//     )
// }

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />
}

function Control(props) {
    // debugger
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.TextFieldProps}
        />
    )
}

Control.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectProps: PropTypes.object.isRequired,
}

// function Option(props) {
//     const isFocused = props.children === props.selectProps.value.value

//     return (
//         <MenuItem
//             ref={props.innerRef}
//             selected={isFocused}
//             component='div'
//             style={{
//                 fontWeight: props.isSelected ? 500 : 400,
//             }}
//             {...props.innerProps}
//         >
//             {props.children}
//         </MenuItem>
//     )
// }

// Option.propTypes = {
//     children: PropTypes.node,
//     innerProps: PropTypes.object,
//     innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
//     isFocused: PropTypes.bool,
//     isSelected: PropTypes.bool,
// }

// function Placeholder(props) {
//     return (
//         <Typography color='textSecondary' className={props.selectProps.classes.placeholder} {...props.innerProps}>
//             {props.children}
//         </Typography>
//     )
// }

// Placeholder.propTypes = {
//     children: PropTypes.node,
//     innerProps: PropTypes.object,
//     selectProps: PropTypes.object.isRequired,
// }

function SingleValue(props) {
    return (
        <Typography style={{ lineHeight: 'initial' }} {...props.innerProps}>
            {props.children}
        </Typography>
    )
}

SingleValue.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
}

ValueContainer.propTypes = {
    children: PropTypes.node,
    selectProps: PropTypes.object.isRequired,
}

// function Menu(props) {
//     return (
//         <Paper
//             square
//             className={props.selectProps.classes.paper}
//             {...props.innerProps}
//             id={`menu-${props.selectProps.id}`}
//         >
//             {props.children}
//         </Paper>
//     )
// }

// Menu.propTypes = {
//     children: PropTypes.node,
//     innerProps: PropTypes.object,
//     selectProps: PropTypes.object,
// }

const components = {
    Control,
    // Menu,
    // NoOptionsMessage,
    // Option,
    // Placeholder,
    SingleValue,
    ValueContainer,
    animatedComponents,
}

function TimeSelect(props) {
    const classes = useStyles()
    const theme = useTheme()

    const {
        isClearable = false,
        showDropDownIndicator = false,
        allowMulti = false,
        allowSearch = true,
        placeholder = 'Please select',
        required = true,
        options = null,
        originalValue = null,
        length = 5,
        matchFrom = 'start', // 'start' || 'any'
        onChange = () => {},
    } = props

    const [timeValue, setTimeValue] = useState(originalValue || 0)
    const [findElement, setFindElement] = useState(false)

    useEffect(() => {
        if (findElement) {
            const firstTimeElement = document.querySelector(
                '#' + refMenu.current.select.select.inputRef.id.replace('input', 'option-0'),
            )
            const selected =
                firstTimeElement &&
                [...firstTimeElement.parentElement.children].find(
                    el => el.innerHTML === timeValue.value,
                )

            // selected && selected.
            // console.log("selected", { selected })

            selected && selected.scrollIntoView()
            setFindElement(false)
        }
        // ....
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [findElement])

    useEffect(() => {
        // console.group("TimeSelect: useEffect (originalValue)")
        // console.log(originalValue)
        // console.groupEnd()
        setTimeValue(originalValue)
    }, [originalValue])
    // console.groupEnd()

    useEffect(() => {
        // console.group("TimeSelect: useEffect (timeValue)")
        // console.log(originalValue)
        // console.groupEnd()
        // console.log(options[options.findIndex(option => option.value === timeValue.value)])
    }, [timeValue])

    const refMenu = useRef()

    return useMemo(() => {
        console.log('memo!!!')
        const handleChange = (newValue, actionMeta) => {
            setTimeValue(newValue)
            onChange(newValue)
        }
        const handleInputChange = (inputValue, actionMeta) => {
            // console.log("handleInputChange")
            // console.log(refMenu)
            if (inputValue.length > length) {
                return inputValue.substr(0, 5)
            }

            if (
                (isNaN(inputValue) &&
                    Array.from(inputValue).find(char => isNaN(char) && char !== ':')) ||
                Array.from(inputValue).filter(char => char === ':').length > 1
            ) {
                const newInputValue = Array.from(inputValue)
                    .filter(value => !isNaN(value))
                    .join('')
                return newInputValue
            }
        }
        const formatCreateLabel = inputValue => {
            return inputValue
        }
        const handleNewOptionValidate = inputValue => {
            const isNew =
                timeRefExp.test(inputValue) && !options.find(cTime => cTime.value === inputValue)
                    ? true
                    : false
            return isNew
        }

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
                '& input': {
                    font: 'inherit',
                },
            }),
            menuPortal: base => ({ ...base, zIndex: 9999, minWidth: 80 }),

            dropdownIndicator: base => ({
                ...base,
                display: showDropDownIndicator ? 'initial' : 'none',
            }),

            indicatorSeparator: base => ({
                ...base,
                display: showDropDownIndicator ? 'initial' : 'none',
            }),
        }

        return (
            <>
                <NoSsr>
                    <CreatableSelect
                        ref={refMenu}
                        classes={classes}
                        className={classes.select}
                        styles={selectStyles}
                        components={components}
                        options={options}
                        defaultValue={originalValue}
                        value={timeValue}
                        isClearable={isClearable}
                        isMulti={allowMulti}
                        isSearchable={allowSearch}
                        menuPortalTarget={document.body}
                        menuPlacement={'auto'}
                        required={required}
                        placeholder={placeholder}
                        onChange={handleChange}
                        onInputChange={handleInputChange}
                        formatCreateLabel={formatCreateLabel}
                        isValidNewOption={handleNewOptionValidate}
                        filterOption={createFilter({ matchFrom: matchFrom })}
                        onMenuOpen={() => {
                            setFindElement(true)
                        }}
                    />
                </NoSsr>
            </>
        )
    }, [
        originalValue,
        timeValue,
        allowMulti,
        allowSearch,
        classes,
        isClearable,
        length,
        matchFrom,
        onChange,
        options,
        placeholder,
        required,
        showDropDownIndicator,
        theme,
    ])
}

export default TimeSelect
