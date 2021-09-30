const UserDAO = require("../data/user-dao").UserDAO;
const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");
const { validateUserParams } = require("../utils/validateParams");

/* The SessionHandler must be constructed with a connected db */
function SessionHandler() {
    "use strict";

    const userDAO = new UserDAO();
    const allocationsDAO = new AllocationsDAO();

    const prepareUserData = (user, next) => {
        // Generate random allocations
        const stocks = Math.floor((Math.random() * 40) + 1);
        const funds = Math.floor((Math.random() * 40) + 1);
        const bonds = 100 - (stocks + funds);

        return allocationsDAO.update(user.userId, stocks, funds, bonds);
    };

    this.isAdminUserMiddleware = (req, res, next) => {
        if (req.session.userId) {
            return userDAO.getUserById(req.session.userId, (err, user) => user && user.isAdmin ? next() : res.redirect("/login"));
        }
        console.log("redirecting to login");
        return res.redirect("/login");

    };

    this.isLoggedInMiddleware = (req, res, next) => {
        if (req.session.userId) {
            return next();
        }
        console.log("redirecting to login");
        return res.redirect("/login");
    };

    this.displayLoginPage = (req, res, next) => {
        return res.render("login", {
            userName: "",
            password: "",
            loginError: "",
            csrftoken: res.locals.csrfToken,
            environmentalScripts
        });
    };

    this.handleLoginRequest = async (req, res, next) => {
        const {
            userName,
            password
        } = req.body

        const { isValid } = validateUserParams({
            userName,
            password
        });

        if (!isValid) {
            console.log("user login not validate");
            return res.render("login", {
                userName: userName,
                password: "",
                loginError: "Please provide valid data",
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
        try {
            const user = await userDAO.validateLogin(userName, password);
            if (!user) {
                const errorMessage = "Invalid username and/or password";
                return res.render("login", {
                    userName: userName,
                    password: "",
                    loginError: errorMessage,
                    csrftoken: res.locals.csrfToken,
                    environmentalScripts
                });
            }
            req.session.regenerate(() => { })
            req.session.userId = user.userId;
            return res.redirect(user.isAdmin ? "/benefits" : "/dashboard")
        } catch (error) {
            return res.render("login", {
                userName: userName,
                password: "",
                loginError: error.errorMessage,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
        /** TODO: REMOVE ERROR MESSAGES */
        /* const invalidUserNameErrorMessage = "Invalid username";
        const invalidPasswordErrorMessage = "Invalid password";
        if (err) {
            if (err.noSuchUser) {
                console.log('Error: attempt to login with invalid user: ', userName);

                // Fix for A1 - 3 Log Injection - encode/sanitize input for CRLF Injection
                // that could result in log forging:
                // - Step 1: Require a module that supports encoding
                // const ESAPI = require('node-esapi');
                // - Step 2: Encode the user input that will be logged in the correct context
                // following are a few examples:
                // console.log('Error: attempt to login with invalid user: %s', ESAPI.encoder().encodeForHTML(userName));
                // console.log('Error: attempt to login with invalid user: %s', ESAPI.encoder().encodeForJavaScript(userName));
                // console.log('Error: attempt to login with invalid user: %s', ESAPI.encoder().encodeForURL(userName));
                // or if you know that this is a CRLF vulnerability you can target this specifically as follows:
                // console.log('Error: attempt to login with invalid user: %s', userName.replace(/(\r\n|\r|\n)/g, '_'));

                return res.render("login", {
                    userName: userName,
                    password: "",
                    loginError: invalidUserNameErrorMessage,
                    //Fix for A2-2 Broken Auth - Uses identical error for both username, password error
                    // loginError: errorMessage
                    environmentalScripts
                });
            } else if (err.invalidPassword) {
                return res.render("login", {
                    userName: userName,
                    password: "",
                    loginError: invalidPasswordErrorMessage,
                    //Fix for A2-2 Broken Auth - Uses identical error for both username, password error
                    // loginError: errorMessage
                    environmentalScripts
                });
            } else {
                return next(err);
            }
        } */

        // A2-Broken Authentication and Session Management
        // Upon login, a security best practice with regards to cookies session management
        // would be to regenerate the session id so that if an id was already created for
        // a user on an insecure medium (i.e: non-HTTPS website or otherwise), or if an
        // attacker was able to get their hands on the cookie id before the user logged-in,
        // then the old session id will render useless as the logged-in user with new privileges
        // holds a new session id now.

        // Fix the problem by regenerating a session in each login
        // by wrapping the below code as a function callback for the method req.session.regenerate()
        // i.e:
        // `req.session.regenerate(() => {})`
        /** TODO: USE REQ.SESSION.REGENERATE? */
        /* req.session.userId = user._id;
        return res.redirect(user.isAdmin ? "/benefits" : "/dashboard") */
        /* }); */
    };

    this.displayLogoutPage = (req, res) => {
        req.session.destroy(() => res.redirect("/"));
    };

    this.displaySignupPage = (req, res) => {
        res.render("signup", {
            userNameError: "",
            password: "",
            passwordError: "",
            email: "",
            userNameError: "",
            emailError: "",
            verifyError: "",
            csrftoken: res.locals.csrfToken,
            environmentalScripts
        });
    };

    this.handleSignup = async (req, res, next) => {

        const {
            email,
            userName,
            firstName,
            lastName,
            password,
            verify
        } = req.body;

        const { isValid, errors } = validateUserParams({
            email,
            userName,
            firstName,
            lastName,
            password,
            verify
        });

        if (!isValid) {
            console.log("user did not validate");
            return res.render("signup", {
                ...errors,
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
        try {
            const isTheUserExists = await userDAO.getUserByUserName(userName);
            if (isTheUserExists) {
                errors.userNameError = "User name already in use. Please choose another";
                return res.render("signup", {
                    ...errors,
                    csrftoken: res.locals.csrfToken,
                    environmentalScripts
                });
            }

            if(password !== verify) {
                return res.render("signup", {
                    passwordError: 'verify password and password does not match',
                    csrftoken: res.locals.csrfToken,
                    environmentalScripts
                });
            }

            const savedUser = await userDAO.addUser(userName, firstName, lastName, password, email);
            const { firstName: newFirstName, lastName: newLastName, userId } = savedUser;

            await prepareUserData(savedUser, next);

            req.session.regenerate(() => {
                req.session.userId = savedUser.userId;
                return res.render("dashboard", {
                    firstName: newFirstName,
                    lastName: newLastName,
                    userId,
                    csrftoken: res.locals.csrfToken,
                    environmentalScripts
                });
            });
        } catch (error) {
            console.log('there was an error to sing up', error);
            return res.render("signup", {
                userNameError: 'There was an error to sing up',
                csrftoken: res.locals.csrfToken,
                environmentalScripts
            });
        }
    };

    this.displayWelcomePage = async (req, res, next) => {
        const { userId } = req.session;
        if (!userId) {
            console.log("welcome: Unable to identify user...redirecting to login");
            return res.redirect("/login");
        }
        try {
            const user = await userDAO.getUserById(userId);
            if (user) {
                return res.render("dashboard", {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userId: user.userId,
                    environmentalScripts
                });
            }

        } catch (error) {
            console.log('There was an error to displayWelcomePage', error);
        }
    };
}

module.exports = SessionHandler;
