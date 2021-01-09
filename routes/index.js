const {
  signup,
  login,
  forgetPassword,
  getUsers,
} = require("../controllers/userController");
const { getGroupsData } = require("../controllers/memberController");
const { createGroup } = require("../controllers/groupController");
const { authenticate } = require("../middlewares/authenticate");

module.exports = function (app) {
  // open routes
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/forgetpassword", forgetPassword);

  // authenticated user
  app.get("/dashboard", authenticate, getGroupsData);

  //user searching api
  app.get("/dashboard", authenticate, getUsers);

  // create group api
  app.post("/dashboard", authenticate, createGroup);
};
