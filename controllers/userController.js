const userModel = require("../models/user");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const signup = async (req, res) => {
  try {
    const requiredKeys = [
      "firstName",
      "lastName",
      "password",
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
      sendResponse(res, 200, "This email is already registered", {});
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

      const user = await userModel.getDetailsByCreds(creds);

      if (user && user.email) {
        // sendChangePassowrdMail(user.email);
        sendResponse(res, 200, "change password link is sent to the registerd Email Id", {});
      } else sendResponse(res, 400, "Login credentials are incorrect", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in ForgotPassword api (userController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const getUsers = async (req, res) => {
  try {
    const requiredKeys = ["email"];
    if (validateKeys(req.body, requiredKeys)) {
      const users = await userModel.getUserDetail(
        {email: req.body.email},
        { firstName: 1, lastName: 1, email: 1 }
      );

      if (users) sendResponse(res, 200, "List of users", users);
      else sendResponse(res, 200, "No such user present", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in Login api (userController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = { signup, login, forgetPassword, getUsers };
