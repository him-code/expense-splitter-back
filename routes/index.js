const {
  signup,
  login,
  forgetPassword,
  getUsers,
} = require("../controllers/userController");
const { getGroupsData } = require("../controllers/memberController");
const { createGroup } = require("../controllers/groupController");
const { createExpense } = require("../middlewares/expenseController");
const { authenticate } = require("../middlewares/authenticate");

module.exports = function (app) {
  // open routes
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/forgetpassword", forgetPassword);

  // authenticated user
  app.get("/dashboard", authenticate, getGroupsData);

  //user searching api
  app.get("/search-users", authenticate, getUsers);

  // create group api
  app.post("/create-group", authenticate, createGroup);

  // create expense api
  app.post("/create-expense", authenticate, createExpense);
};
