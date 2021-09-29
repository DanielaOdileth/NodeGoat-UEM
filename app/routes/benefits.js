const { BenefitsDAO } = require("../data/benefits-dao");
const { ProfileDAO } = require("../data/profile-dao");
const {
    environmentalScripts
} = require("../../config/config");

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
            console.log('there was an error to displayBenefits', error);
            const data = {
                updateError: 'There was an error to get users benefits',
                environmentalScripts
            };
            return res.render("benefits", { updateError: true, data });
        }

        /* benefitsDAO.getAllNonAdminUsers((error, users) => {

            if (error) return next(error);

            return res.render("benefits", {
                users,
                user: {
                    isAdmin: true
                },
                environmentalScripts
            });
        }); */
    };

    this.updateBenefits = async (req, res, next) => {
        const {
            userId,
            benefitStartDate
        } = req.body;

        const { userId: adminUserId } = req.session;

        try {
            const userProfile = await profile.getByUserId(adminUserId);
            await benefits.updateBenefits(userId, benefitStartDate);


            const nonAdminUsers = await benefits.getAllNonAdminUsers();

            const data = {
                users: nonAdminUsers,
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
            console.log('There was an error to updateBenefits', error);
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

        /* benefitsDAO.updateBenefits(userId, benefitStartDate, (error) => {

            if (error) return next(error);

            benefitsDAO.getAllNonAdminUsers((error, users) => {
                if (error) return next(error);

                const data = {
                    users,
                    user: {
                        isAdmin: true
                    },
                    updateSuccess: true,
                    environmentalScripts
                };

                return res.render("benefits", data);
            });
        }); */
    };
}

module.exports = BenefitsHandler;
