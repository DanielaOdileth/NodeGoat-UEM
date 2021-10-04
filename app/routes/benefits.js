const { BenefitsDAO } = require("../data/benefits-dao");
const { ProfileDAO } = require("../data/profile-dao");
const {
    environmentalScripts
} = require("../../config/config");
const { validateUserParams } = require("../utils/validateParams");
const logger = require('../utils/logger');

function BenefitsHandler() {
    "use strict";

    const benefits = new BenefitsDAO();
    const profile = new ProfileDAO();

    this.displayBenefits = async (req, res, next) => {
        try {
            const { userId } = req.session;
            const userProfile = await profile.getByUserId(userId);
            const users = await benefits.getAllNonAdminUsers();
            return res.render("benefits", {
                users,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                csrftoken: res.locals.csrfToken,
                user: {
                    isAdmin: true
                },
                environmentalScripts
            });
        } catch (error) {
            logger.error(`there was an error to displayBenefits. Error: ${error}`);
            const data = {
                updateError: 'There was an error to get users benefits',
                environmentalScripts
            };
            return res.render("benefits", { updateError: true, data });
        }
    };

    this.updateBenefits = async (req, res, next) => {
        const {
            userId,
            benefitStartDate
        } = req.body;

        const { userId: adminUserId } = req.session;
        try {
            const userProfile = await profile.getByUserId(adminUserId);
            const { isValid } = validateUserParams({ benefitStartDate }, true);

            if (!isValid) {
                logger.warn("benefitStartDate does not have the correct format");
                const data = {
                    updateError: 'benefitStartDate does not have the correct format',
                    environmentalScripts
                };
                const nonAdminUsers = await benefits.getAllNonAdminUsers();
                return res.render("benefits", {
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    csrftoken: res.locals.csrfToken,
                    updateError: true,
                    users: nonAdminUsers,
                    user: {
                        isAdmin: true
                    },
                    data
                });
            }

            await benefits.updateBenefits(userId, benefitStartDate);
            const nonAdminUsersUpdated = await benefits.getAllNonAdminUsers();
            const data = {
                users: nonAdminUsersUpdated,
                user: {
                    isAdmin: true
                },
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                updateSuccess: true,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            };

            return res.render("benefits", data);

        } catch (error) {
            logger.error(`There was an error to updateBenefits ${error}`);
            const data = {
                updateError: 'There was an error to update user benefits',
                environmentalScripts
            };
            return res.render("benefits", {
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                csrftoken: res.locals.csrfToken,
                updateError: true,
                data
            });
        }
    };
}

module.exports = BenefitsHandler;
