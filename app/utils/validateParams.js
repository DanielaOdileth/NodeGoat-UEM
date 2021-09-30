
const validateNumberParams = (params, requiredParams) => {
    const errors = [];
    Object.keys(params).map(keyParam => {
        const value = params[keyParam];
        const keyErrors = [];
        requiredParams && validateRequiredParams(requiredParams, keyParam, value, keyErrors);
        if (isNaN(value)) {
            keyErrors.push(`${keyParam} should be a number`);
        } else if (Number(value) < 0) {
            keyErrors.push(`${keyParam} should be greater than or equal to cero`)
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

const validateCreateUserParams = (params) => {
    const errors = {}
    const regexParams = {
        userName: {
            regex: /^[a-zA-Z0-9-._]{3,10}$/,
            errorMessage: 'Please enter a valid userame, valid characters: numbers, letters, underscore (_), dot(.), dash(-)',
            required: true,
        },
        firstName: {
            regex: /^([a-zA-ZÀ-ÿ][a-zA-zÀ-ÿ ']{0,20}$)/,
            errorMessage: 'Please enter a valid name, valid characters: accent mark, spaces and letters',
            required: true
        },
        lastName: {
            regex: /^([a-zA-ZÀ-ÿ][a-zA-zÀ-ÿ ']{0,20}$)/,
            errorMessage: 'Please enter a valid last name, valid characters: accent mark, spaces and letters',
            required: true
        },
        password: {
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            errorMessage: 'Please enter a valid password, at least 8 characters with numbers and both lowercase and uppercase letters.',
            required: true
        },
        verify: {
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            errorMessage: 'Please enter a valid password, at least 8 characters with numbers and both lowercase and uppercase letters.',
            required: true
        },
        email: {
            regex: /^[\S]+@[\S]+\.[\S]+$/,
            errorMessage: 'Please enter a valid email',
            required: false
        }
    }
    Object.keys(params).map(key => {
        const value = params[key];
        const rules = regexParams[key];
        if ((rules.required && !value) || !rules.regex.test(value)) {
            errors[`${key}Error`] = rules.errorMessage
        }
    })

    return { isValid: Object.keys(errors).length === 0, errors }
}
module.exports = { validateNumberParams, validateCreateUserParams }