
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
module.exports = { validateNumberParams }