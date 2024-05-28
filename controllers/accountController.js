const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    // let pattern = "^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:<>?])[A-Za-z\d[!@#$%^&*()_+{}:<>?]{12,}$"
    // const view = utilities.buildLoginView(pattern)
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      // view,
    })
  }
  async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    // const view = utilities.buildRegistrationView()
    res.render("account/registration", {
      title: "Register",
      nav,
      errors: null,
      // view,
    })
  }
/* ****************************************
*  Process Registration
* *************************************** */
async function loginAccount(req, res) {
  const { account_email, account_password } = req.body
  res.status(200).send('login process')


}
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    // const view = utilities.buildLoginView();
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      // view,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    // const view = utilities.buildRegistrationView();
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      // view,
    })
  }
}
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  // const view = utilities.buildRegistrationView();
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
    // view,
  })
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}
//unit 5
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  // const view = utilities.buildRegistrationView();
  res.render("account/accountmanagement", {
    title: "Account Management",
    nav,
    errors: null,
    // view,
  })
}
//buildLogin buildRegister accountLogin registerAccount         // buildManagement buildRegistration loginAccount
module.exports = { buildLogin, buildRegistration, registerAccount, buildRegister, loginAccount, accountLogin, buildManagement }