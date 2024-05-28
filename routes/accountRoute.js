//needed resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

const regValidate = require('../utilities/account-validation')
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  
  utilities.handleErrors(accountController.accountLogin)
)

//router.post("/login", regValidate.loginRules(), regValidate.checkRegDataAccountManagement, utilities.handleErrors(accountController.accountLogin))

/* ****************************************
 * deliver account management view
 * unit 5 jwt authorization activity
 * ************************************ */
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))


module.exports = router;