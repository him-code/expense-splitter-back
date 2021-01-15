const userModel = require("../models/user");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const signup = async (req, res) => {
  try {
    const requiredKeys = [
      "firstName",
      "lastName",
      "password",
      "nickName",
      "email",
      "mobileNumber",
    ];
    if (validateKeys(req.body, requiredKeys)) {
      const user = await userModel.createUsers(req.body);
      const header = { xauth: user._id };

      sendResponse(res, 200, "User created successfully", user, header);
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in Signup api (userController)", err);
    if ((err.code = "11000"))
      sendResponse(res, 200, "This email or nickName is already registered", {});
    else sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const login = async (req, res) => {
  try {
    const requiredKeys = ["password", "email", "mobileNumber"];
    if (validateKeys(req.body, requiredKeys)) {
      const creds = { password: req.body.password };

      if (req.body.email) creds.email = req.body.email;
      else creds.mobileNumber = req.body.mobileNumber;

      const user = await userModel.getUserDetail(creds);

      if (user) sendResponse(res, 200, "Login successful", user);
      else sendResponse(res, 400, "Login credentials are incorrect", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in Login api (userController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const requiredKeys = ["email", "mobileNumber"];
    if (validateKeys(req.body, requiredKeys)) {
      const creds = {};

      if (req.body.mobileNumber) creds.mobileNumber = req.body.mobileNumber;
      else creds.email = req.body.email;

      const user = await userModel.getUserDetail(creds);

      if (user && user.email) {

        const recepient = user.email;
        const subject = "Forgot Password?";
        const text = "Please click on the link to change password";
        const body = `Hello ${user.name},<br>Please Click on the link
         to change your password.<br><a href="${frontendBaseURl}/resetPassword
         /${user._id}">Click Here</a><br><br>If you don’t use this link within 
         1 hour , it will expire. To get a new password reset link, 
         visit this <a href="${frontendBaseURl}/resetPassword">link</a><br>
        Thank You,<br>
        Team Expense Splitter`;
        
        const send = await sendEmailPromise(recepient, subject, text, body);

        if (send["status"])
          console.log(`Credentials email sent to ${status.envelope.to[0]}`);

        sendResponse(res, 200, "This email or nickName is already registered", {});
      } else sendResponse(res, 400, "Login credentials are incorrect", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in ForgotPassword api (userController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const changePassword = async (req, res) => {
  try {
    const requiredKeys = ["password"];
    if (validateKeys(req.body, requiredKeys)) {
      const user = await userModel.updateUser({ _id: req.user._id },
        { password: req.body.password }
      );
    
      sendResponse(res, 200, "Password changed Successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getUsers api (userController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const getUsers = async (req, res) => {
  try {
    const requiredKeys = ["email"];
    if (validateKeys(req.params, requiredKeys)) {
      const users = await userModel.getUsers(
        {email: { $regex: '^' + req.params.email + '.*' }, _id: { $ne: req.user._id }},
        { firstName: 1, lastName: 1, email: 1, nickName: 1 }
      );

      if (users) sendResponse(res, 200, "List of users", users);
      else sendResponse(res, 200, "No such user present", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getUsers api (userController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const checkNickNames = async (req, res) => {
  try {
    if (req.params.nickName) {
      const user = await userModel.getUserDetail({ nickName: req.params.nickName });
      if(!user)
        sendResponse(res, 200, "nickName available", {});
      else
        sendResponse(res, 200, "nickName unavailable", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in checkNickNames api (userController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = { signup, login, forgetPassword, changePassword, getUsers, checkNickNames };
