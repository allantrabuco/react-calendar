import React from 'react'

import CreatableSelect from 'react-select/creatable'
import { createFilter } from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()
const timeRefExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')

export default function MyEditableSelect(props) {
    const {
        isClearable = true,
        showDropDownIndicator = true,
        allowMulti = false,
        allowSearch = true,
        placeholder = 'Please select',
        required = true,
        options = null,
        defaultOptions = null,
        length = 5,
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

    // const handleNewOptionValidate = () => {}
    const handleNewOptionValidate = inputValue => {
        // console.group('New option Validate')
        // console.log(`[${inputValue}]`)
        // console.log(options)
        // console.groupEnd()
        return timeRefExp.test(inputValue) && !options.find(cTime => cTime.value === inputValue)
            ? true
            : false
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
            <CreatableSelect
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
                // filterOption={filterOptions}
                onChange={handleChange}
                onInputChange={handleInputChange}
                formatCreateLabel={formatCreateLabel}
                isValidNewOption={handleNewOptionValidate}
                filterOption={createFilter({ matchFrom: matchFrom })}
            />
        </>
    )
}
