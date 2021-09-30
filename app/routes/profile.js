const { ProfileDAO } = require("../data/profile-dao");
const ESAPI = require('node-esapi')
const {
    environmentalScripts
} = require("../../config/config");
const { validateUserParams } = require("../utils/validateParams");

/* The ProfileHandler must be constructed with a connected db */
function ProfileHandler() {
    "use strict";

    const profile = new ProfileDAO();

    this.displayProfile = async (req, res, next) => {
        const { userId } = req.session;

        /* profile.getByUserId(parseInt(userId), (err, doc) => { */
        try {
            const userProfile = await profile.getByUserId(userId);
            /* if (err) return next(err);
            doc.userId = userId; */

            // @TODO @FIXME
            // while the developer intentions were correct in encoding the user supplied input so it
            // doesn't end up as an XSS attack, the context is incorrect as it is encoding the firstname for HTML
            // while this same variable is also used in the context of a URL link element
            userProfile.website = ESAPI.encoder().encodeForURL(userProfile.website)
            // fix it by replacing the above with another template variable that is used for 
            // the context of a URL in a link header
            // doc.website = ESAPI.encoder().encodeForURL(doc.website)
            const {
                firstName,
                lastName,
                ssn,
                dob,
                bankAcc,
                bankRouting,
                address,
                website
            } = userProfile
            return res.render("profile", {
                /* ...userProfile, */
                firstName,
                lastName,
                ssn,
                dob,
                bankAcc,
                bankRouting,
                address,
                website,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        } catch (error) {
            console.log('There was an error to display profile', error);
            return res.render("profile", {
                updateError: 'There was an error to get the user info',
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
        /* }); */
    };

    this.handleProfileUpdate = async (req, res, next) => {

        const {
            firstName,
            lastName,
            ssn,
            dob,
            address,
            bankAcc,
            bankRouting,
            website
        } = req.body;

        // Fix for Section: ReDoS attack
        // The following regexPattern that is used to validate the bankRouting number is insecure and vulnerable to
        // catastrophic backtracking which means that specific type of input may cause it to consume all CPU resources
        // with an exponential time until it completes
        // --
        // The Fix: Instead of using greedy quantifiers the same regex will work if we omit the second quantifier +
        /* const regexPattern = /([0-9]+)\#/;
        // const regexPattern = /([0-9]+)+\#/;
        // Allow only numbers with a suffix of the letter #, for example: 'XXXXXX#'
        const testComplyWithRequirements = regexPattern.test(bankRouting);
        // if the regex test fails we do not allow saving
        if (testComplyWithRequirements !== true) {
            const firstNameSafeString = firstName
            return res.render("profile", {
                updateError: "Bank Routing number does not comply with requirements for format specified",
                firstNameSafeString,
                lastName,
                ssn,
                dob,
                address,
                bankAcc,
                bankRouting,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        } */

        const { isValid, errors } = validateUserParams({
            firstName,
            lastName,
            ssn,
            dob,
            address,
            bankAcc,
            bankRouting,
            website
        }, true);

        if (!isValid) {
            console.log("user did not validate");
            console.log('errors --> ', errors);
            return res.render("profile", {
                updateError: 'Please provide validate data',
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }

        const { userId } = req.session;

        try {
            const userupdated = await profile.updateUser(
                userId,
                firstName,
                lastName,
                ssn,
                dob,
                address,
                bankAcc,
                bankRouting,
                website);

            /*  if (err) return next(err); */

            // WARN: Applying any sting specific methods here w/o checking type of inputs could lead to DoS by HPP
            //firstName = firstName.trim();
            /* user.updateSuccess = true;
            user.userId = userId; */

            if (userupdated) {
                userupdated.updateSuccess = true;
            }

            return res.render("profile", {
                firstName,
                lastName,
                ssn,
                dob,
                address,
                bankAcc,
                bankRouting,
                website,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        } catch (error) {
            console.log('There was an error to handleProfileUpdate', error);
            return res.render("profile", {
                updateError: 'There was an error to update user',
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }

    };

}

module.exports = ProfileHandler;
