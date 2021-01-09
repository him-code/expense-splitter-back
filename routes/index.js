const {
  signup,
  login,
  forgetPassword,
  getUsers,
  checkNickNames
} = require("../controllers/userController");
const { getGroupsData, searchGroupMembers, getGroupMembers } = require("../controllers/memberController");
const { createGroup } = require("../controllers/groupController");
const { createExpense } = require("../controllers/expenseController");
const { authenticate } = require("../middlewares/authenticate");
const { isGroupMember } = require("../middlewares/isGroupMember");


module.exports = function (app) {
  // user routes
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/forgetpassword", forgetPassword);
  app.get("/check-names", checkNickNames);
  app.get("/search-users", authenticate, getUsers);

  // member apis
  app.get("/get-my-groups", authenticate, getGroupsData);
  app.get("/search-group-members", authenticate, isGroupMember, searchGroupMembers);
  app.get("/get-group-members", authenticate, isGroupMember, getGroupMembers);

  // create group api
  app.post("/create-group", authenticate, createGroup);
  // app.post("/add-in-group", authenticate, isGroupMember, addIntoGroup)
  // app.get("/group", authenticate, isGroupMember, getGroupInfo)

  // create expense api
  app.post("/create-expense", authenticate, isGroupMember, createExpense);
  // app.post("/add-in-expense", authenticate, isGroupMember, addIntoExpense)
  // app.post("/remove-from-expense", authenticate, isGroupMember, removeFromExpense)
  // app.get("/expense", authenticate, isGroupMember, getExpenseInfo)
  // app.delete("/expense", authenticate, isGroupMember, getExpenseInfo)

  //inside group listing api
  //inside expense updates api

};
