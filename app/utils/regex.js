const getRegextoValidate = (isFromProfile) => {
    return {
        userName: {
            regex: /^[a-zA-Z0-9-._]{3,10}$/,
            errorMessage: 'Please enter a valid userame, valid characters: numbers, letters, underscore (_), dot(.), dash(-)',
            required: !isFromProfile,
        },
        firstName: {
            regex: /^([a-zA-ZÀ-ÿ][a-zA-zÀ-ÿ ']{0,20}$)/,
            errorMessage: 'Please enter a valid name, valid characters: accent mark, spaces and letters',
            required: !isFromProfile
        },
        lastName: {
            regex: /^([a-zA-ZÀ-ÿ][a-zA-zÀ-ÿ ']{0,20}$)/,
            errorMessage: 'Please enter a valid last name, valid characters: accent mark, spaces and letters',
            required: !isFromProfile
        },
        password: {
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            errorMessage: 'Please enter a valid password, at least 8 characters with numbers and both lowercase and uppercase letters.',
            required: !isFromProfile
        },
        verify: {
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            errorMessage: 'Please enter a valid password, at least 8 characters with numbers and both lowercase and uppercase letters.',
            required: !isFromProfile
        },
        email: {
            regex: /^[\S]+@[\S]+\.[\S]+$/,
            errorMessage: 'Please enter a valid email',
            required: false
        },
        ssn: {
            regex: /^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/,
            errorMessage: 'Please enter a valid SSN. Format: XXX-XX-XXXX',
            required: false
        },
        dob: {
            regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
            errorMessage: 'Please enter a valid date. Format: dd/mm/yyyy',
            required: false
        },
        benefitStartDate: {
            regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
            errorMessage: 'Please enter a valid date. Format: dd/mm/yyyy',
            required: false
        },
        bankAcc: {
            regex: /^[0-9]{2}(?:[0-9]{9}|-[0-9]{3}-[0-9]{6})$/,
            errorMessage: 'Please enter a valid bank account. Format: XX-XXX-XXXXXX',
            required: false
        },
        bankRouting: {
            regex: /^[0-9]{2}(?:[0-9]{9}|-[0-9]{3}-[0-9]{6}[#])$/,
            errorMessage: 'Please enter a bank routing. Format: XX-XXX-XXXXXX#',
            required: false
        },
        address: {
            regex: /^[#.0-9a-zA-Z\s,-]+$/,
            errorMessage: 'Please enter a valid adress. characters accepted numbers, letters, #, comma and dots',
            required: false
        },
        website: {
            regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
            errorMessage: 'Please enter a valid website.',
            required: false
        }
    }
}

module.exports = {
    getRegextoValidate
}