import React from "react"
import clsx from "clsx"
import Select from "react-select"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import NoSsr from "@material-ui/core/NoSsr"
import TextField from "@material-ui/core/TextField"
import Paper from "@material-ui/core/Paper"
import Chip from "@material-ui/core/Chip"
import MenuItem from "@material-ui/core/MenuItem"
import CancelIcon from "@material-ui/icons/Cancel"
import { emphasize } from "@material-ui/core/styles/colorManipulator"
import PropTypes from "prop-types"
import { createFilter } from "react-select"
import makeAnimated from "react-select/animated"

const animatedComponents = makeAnimated()
const timeRefExp = new RegExp("^([01]?[0-9]|2[0-3]):[0-5][0-9]$")

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    input: {
        display: "flex",
        padding: 0,
        paddingLeft: 1,
        height: "auto",
    },
    valueContainer: {
        display: "flex",
        flexWrap: "wrap",
        flex: 1,
        alignItems: "center",
        overflow: "hidden",
    },
    chip: {
        margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: theme.spacing(1, 2),
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: "absolute",
        left: 4,
        // bottom: 6,
        // fontSize: 16,
    },
    paper: {
        position: "absolute",
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing(2),
    },
}))

function NoOptionsMessage(props) {
    return (
        <Typography color='textSecondary' className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
            {props.children}
        </Typography>
    )
}

// NoOptionsMessage.propTypes = {
//     children: PropTypes.node,
//     innerProps: PropTypes.object,
//     selectProps: PropTypes.object.isRequired,
// }

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />
}

// inputComponent.propTypes = {
//     inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
// }

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.TextFieldProps}
        />
    )
}

// Control.propTypes = {
//     children: PropTypes.node,
//     innerProps: PropTypes.object,
//     innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
//     selectProps: PropTypes.object.isRequired,
// }

function Option(props) {
    return (
        <MenuItem
            ref={props.innerRef}
            selected={props.isFocused}
            component='div'
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    )
}

Option.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
}

function Placeholder(props) {
    return (
        <Typography color='textSecondary' className={props.selectProps.classes.placeholder} {...props.innerProps}>
            {props.children}
        </Typography>
    )
}

Placeholder.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
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

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={clsx(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    )
}

MultiValue.propTypes = {
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    removeProps: PropTypes.object.isRequired,
    selectProps: PropTypes.object.isRequired,
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    )
}

Menu.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object,
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
    animatedComponents,
}

function MuiSelect(props) {
    const classes = useStyles()
    const theme = useTheme()

    const {
        isClearable = true,
        showDropDownIndicator = true,
        allowMulti = false,
        allowSearch = true,
        placeholder = "Please select",
        required = true,
        options = null,
        defaultOptions = null,
        length = 5,
        matchFrom = "start", // 'start' || 'any'
    } = props

    const handleChange = (newValue, actionMeta) => {
        // console.group('Value Changed')
        // console.log(newValue)
        // console.log(JSON.stringify(newValue))
        // console.log(actionMeta)
        // console.log(JSON.stringify(actionMeta))
        // console.log(`action: ${actionMeta.action}`)
        // console.groupEnd()
    }
    const handleInputChange = (inputValue, actionMeta) => {
        // console.group('Input Changed')
        // console.log(inputValue)
        // console.log(`action: ${actionMeta.action}`)
        // console.groupEnd()

        if (inputValue.length > length) {
            return inputValue.substr(0, 5)
        }

        if (
            (isNaN(inputValue) && Array.from(inputValue).find(char => isNaN(char) && char !== ":")) ||
            Array.from(inputValue).filter(char => char === ":").length > 1
        ) {
            const newInputValue = Array.from(inputValue)
                .filter(value => !isNaN(value))
                .join("")
            return newInputValue
        }
    }
    const formatCreateLabel = inputValue => {
        return inputValue
    }
    const handleNewOptionValidate = inputValue => {
        // console.group('New option Validate')
        // console.log(`[${inputValue}]`)
        // console.log(options)
        // console.groupEnd()
        return timeRefExp.test(inputValue) && !options.find(cTime => cTime.value === inputValue) ? true : false
    }

    const selectStyles = {
        input: base => ({
            ...base,
            color: theme.palette.text.primary,
            "& input": {
                font: "inherit",
            },
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),

        dropdownIndicator: base => ({
            ...base,
            display: showDropDownIndicator ? "initial" : "none",
        }),

        indicatorSeparator: base => ({
            ...base,
            display: showDropDownIndicator ? "initial" : "none",
        }),
    }

    return (
        <div className={classes.root}>
            <NoSsr>
                <Select
                    classes={classes}
                    styles={selectStyles}
                    components={components}
                    className={classes.select}
                    isClearable={isClearable}
                    isMulti={allowMulti}
                    isSearchable={allowSearch}
                    menuPortalTarget={document.body}
                    menuPlacement={"auto"}
                    required={required}
                    placeholder={placeholder}
                    options={options}
                    defaultValue={defaultOptions}
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    formatCreateLabel={formatCreateLabel}
                    isValidNewOption={handleNewOptionValidate}
                    filterOption={createFilter({ matchFrom: matchFrom })}
                />
            </NoSsr>
        </div>
    )
}

export default MuiSelect
