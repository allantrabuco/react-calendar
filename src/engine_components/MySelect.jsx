import React from 'react'
import Select, { createFilter } from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()
// const timeRefExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')

export default function MySelect(props) {
    const {
        isClearable = true,
        showDropDownIndicator = true,
        allowMulti = false,
        allowSearch = true,
        placeholder = 'Please select',
        required = true,
        options = null,
        defaultOptions = null,
        // length = 5,
        matchFrom = 'start', // 'start' || 'any'
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
    }

    const styles = {
        menuPortal: base => ({ ...base, zIndex: 9999 }),

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
            <Select
                components={animatedComponents}
                isClearable={isClearable}
                isMulti={allowMulti}
                isSearchable={allowSearch}
                styles={styles}
                menuPortalTarget={document.body}
                menuPlacement={'auto'}
                required={required}
                placeholder={placeholder}
                options={options}
                defaultValue={defaultOptions}
                onChange={handleChange}
                onInputChange={handleInputChange}
                filterOption={createFilter({ matchFrom: matchFrom })}
            />
        </>
    )
}
