const { BenefitsDAO } = require("../data/benefits-dao");
const {
    environmentalScripts
} = require("../../config/config");

function BenefitsHandler() {
    "use strict";

    const benefits = new BenefitsDAO();

    this.displayBenefits = async (req, res, next) => {
        try {
            const users = await benefits.getAllNonAdminUsers();
            return res.render("benefits", {
                users,
                user: {
                    isAdmin: true
                },
                environmentalScripts
            });
        } catch (error) {
            console.log('there was an error to displayBenefits', error);
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

        try {
            await benefits.updateBenefits(userId, benefitStartDate);


            const nonAdminUsers = await benefits.getAllNonAdminUsers();

            const data = {
                users: nonAdminUsers,
                user: {
                    isAdmin: true
                },
                updateSuccess: true,
                environmentalScripts
            };

            return res.render("benefits", data);

        } catch (error) {
            console.log('There was an error to updateBenefits', error);
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
