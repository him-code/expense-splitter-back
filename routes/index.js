const { authenticate } = require("../middlewares/authenticate");
const { isGroupMember } = require("../middlewares/isGroupMember");
const {
  signup,
  login,
  forgetPassword,
  getUsers,
  checkNickNames,
} = require("../controllers/userController");
const {
  getGroupsData,
  searchGroupMembers,
  getGroupMembers,
  addIntoGroup,
} = require("../controllers/memberController");
const {
  createGroup,
  getGroupInfo,
} = require("../controllers/groupController");
const { createExpense } = require("../controllers/expenseController");

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
  app.post("/add-in-group", authenticate, isGroupMember, addIntoGroup)
  // create group api
  app.post("/create-group", authenticate, createGroup);
  app.get("/group", authenticate, isGroupMember, getGroupInfo)
  // create expense api
  app.post("/create-expense", authenticate, isGroupMember, createExpense);
  // app.post("/add-in-expense", authenticate, isGroupMember, addIntoExpense)
  // app.post("/remove-from-expense", authenticate, isGroupMember, removeFromExpense)
  // app.get("/expense", authenticate, isGroupMember, getExpenseInfo)
  // app.delete("/expense", authenticate, isGroupMember, getExpenseInfo)
  // updtes apis
  //inside group listing api
  //inside expense updates api
};
