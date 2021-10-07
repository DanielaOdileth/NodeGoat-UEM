const { getRegextoValidate } = require('./regex');

const validateNumberParams = (params, requiredParams) => {
    const errors = [];
    Object.keys(params).map(keyParam => {
        const value = params[keyParam];
        const keyErrors = [];
        requiredParams && validateRequiredParams(requiredParams, keyParam, value, keyErrors);
        if (isNaN(value)) {
            keyErrors.push(`${keyParam} should be a number`);
        } else if (Number(value) < 0) {
            keyErrors.push(`${keyParam} should be greater than or equal to zero`)
        }
        keyErrors.length && errors.push(keyErrors);

    });
    return { isValid: errors.length === 0, errors }
}

const validateRequiredParams = (requireParams, keyParam, value, errors) => {
    if (requireParams) {
        if (requireParams.includes(keyParam) && !value) {
            errors.push(`${keyParam} is required`);
        }
    }
}

const validateUserParams = (params, isFromProfile = false) => {
    const errors = {}
    const regexParams = getRegextoValidate(isFromProfile)
    Object.keys(params).map(key => {
        const value = params[key];
        const rules = regexParams[key];

        if ((rules.required && !value) || (!rules.regex.test(value) && !(!value && !rules.required))) {
            errors[`${key}Error`] = rules.errorMessage
        }
    })

    return { isValid: Object.keys(errors).length === 0, errors }
}

const validateMardown = (value) => {
    const regex = /(?:__|[*#])|\[(.*?)\]\(.*?\)/;
    if (!regex.test(value)) {
        return { isValid: false, error: 'Please enter a valid markdown' }
    }
    return { isValid: true }
}

const validateSymbol = (value) => {
    const regex = /^[a-zA-Z]{1,5}$/;
    if (!regex.test(value)) {
        return { isValid: false, error: 'Please enter a valid symbol' }
    }
    return { isValid: true }
}
module.exports = {
    validateNumberParams,
    validateUserParams,
    validateMardown,
    validateSymbol
}