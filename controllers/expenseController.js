const expenseModel = require("../models/expense");
const outstandingModel = require("../models/outstanding");
const memberModel = require("../models/member");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const createExpense = async (req, res) => {
  try {
    let payee;
    const requiredKeys = ["name", "totalAmount", "members", "paidBy"];
    if (validateKeys(req.body, requiredKeys) && req.body.members.length) {
      const { name, totalAmount, members, paidBy } = req.body;
      const groupId = req.groupId;

      if (req.memberId == paidBy) {
        payee = { memberId: memberId, memberName: nickName };
      } else {
        members.push({ memberId: memberId, memberName: nickName });
        payee = members.filter((item) => item.memberId == paidBy)[0];
        members.splice(members.indexOf(payee), 1);
      }

      const expense = await expenseModel.createExpenses({
        name,
        groupId,
        totalAmount,
        members,
        membersCount: members.length + 1,
        payee,
      });

      const amount = totalAmount / (members.length + 1);

      await outstandingModel.updateOutstandings(
        { payee: { $in: members }, payer: payee, groupId },
        { $dec: { amount } }
      );

      await outstandingModel.updateOutstandings(
        { amount: { $lt: 0 }, groupId },
        { $mul: { amount: -1 }, $rename: { payer: "payee", payee: "payer" } }
      );

      await outstandingModel.deleteOutstanding({ amount: 0 });

      await outstandingModel.updateOutstandings(
        { payee, payer: { $in: members }, groupId },
        { $inc: { amount } },
        { upsert: true }
      );

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Expense created successfully", expense);
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const addIntoExpense = async (req, res) => {
  try {
    const requiredKeys = ["expenseId", "memberId"];
    if (validateKeys(req.body, requiredKeys)) {
      const member = await memberModel.getGroupMember({
        _id: req.body.memberId,
        groupId: req.groupId,
      });

      if (!member) sendResponse(res, 400, "Member is not present in group", {});

      const expense = await expenseModel.updateExpense(
        { _id: req.body.expenseId },
        {
          $push: {
            payers: { memberId: member._id, memberName: member.nickName },
          },
        }
      );

      if (!expense) sendResponse(res, 400, "Invalid expenseId", {});

      const newAmount = expense.totalAmount / (expense.members.length + 2);
      const amountDifference =
        expense.totalAmount / (expense.members.length + 1) - newAmount;

      await outstandingModel.updateOutstandings(
        {
          payee: expense.payee,
          payer: { $in: expense.members },
          groupId: req.groupId,
        },
        { $dec: { amountDifference } }
      );

      await outstandingModel.updateOutstandings(
        {
          payee: { $in: expense.members },
          payer: expense.payee,
          groupId: req.groupId,
        },
        { $inc: { amountDifference } }
      );

      await outstandingModel.updateOutstandings(
        {
          payee: expense.payee,
          payer: { memberId: member._id, memberName: member.nickName },
          groupId: req.groupId,
        },
        { $inc: { newAmount } }
      );

      await outstandingModel.updateOutstandings(
        {
          payee: { memberId: member._id, memberName: member.nickName },
          payer: expense.payee,
          groupId: req.groupId,
        },
        { $dec: { newAmount } }, { upsert: true }
      );

      await outstandingModel.updateOutstandings(
        { amount: { $lt: 0 }, groupId: req.groupId },
        { $mul: { amount: -1 }, $rename: { payer: "payee", payee: "payer" } }
      );

      await outstandingModel.deleteOutstanding({ amount: 0 });

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Member is added to Expense successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};


const removeFromExpense = async (req, res) => {
  try {
    const requiredKeys = ["expenseId", "memberId"];
    if (validateKeys(req.body, requiredKeys)) {
      const expense = await expenseModel.updateExpense(
        { _id: req.body.expenseId, 'payers.memberId': req.body.memberId },
        { $pull: { payers: { memberId: req.body.memberId } } }
      );
      
      if (!expense) sendResponse(res, 400, "Invalid expenseId or memberId", {});

      const oldAmount = expense.totalAmount / (expense.members.length + 1) ;
      const amountDifference = expense.totalAmount / (expense.members.length) - oldAmount;
        

      await outstandingModel.updateOutstandings(
        {
          payee: expense.payee,
          payer: { $in: expense.members },
          groupId: req.groupId,
        },
        { $inc: { amountDifference } }
      );

      await outstandingModel.updateOutstandings(
        {
          payee: { $in: expense.members },
          payer: expense.payee,
          groupId: req.groupId,
        },
        { $dec: { amountDifference } }
      );

      await outstandingModel.updateOutstandings(
        {
          payee: expense.payee,
          'payer.memberId': memberId,
          groupId: req.groupId,
        },
        { $dec: { oldAmount } }
      );

      await outstandingModel.updateOutstandings(
        {
          'payee.memberId': memberId,
          payer: expense.payee,
          groupId: req.groupId,
        },
        { $inc: { oldAmount } }
      );

      await outstandingModel.updateOutstandings(
        { amount: { $lt: 0 }, groupId: req.groupId },
        { $mul: { amount: -1 }, $rename: { payer: "payee", payee: "payer" } }
      );

      await outstandingModel.deleteOutstanding({ amount: 0 });

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Member is removed from Expense successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const requiredKeys = ["expenseId"];
    if (validateKeys(req.body, requiredKeys)) {

      const expense = await expenseModel.deleteExpenses({ _id: req.body.expenseId});

      if (!expense) sendResponse(res, 400, "Invalid expenseId", {});

      const amount = expense.totalAmount / (expense.members.length + 1) ;        

      await outstandingModel.updateOutstandings(
        {
          payee: expense.payee,
          payer: { $in: expense.members },
          groupId: req.groupId,
        },
        { $dec: { amount } }
      );

      await outstandingModel.updateOutstandings(
        {
          payee: { $in: expense.members },
          payer: expense.payee,
          groupId: req.groupId,
        },
        { $inc: { amount } }
      );

      await outstandingModel.updateOutstandings(
        { amount: { $lt: 0 }, groupId: req.groupId },
        { $mul: { amount: -1 }, $rename: { payer: "payee", payee: "payer" } }
      );

      await outstandingModel.deleteOutstanding({ amount: 0 });

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Expense deleted successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const getExpenseInfo = async (req, res) => {
  try {
    const requiredKeys = ["expenseId"];
    if (validateKeys(req.body, requiredKeys)) {

      const expense = await expenseModel.getExpense({ _id: req.body.expenseId});

      if (!expense) sendResponse(res, 400, "Invalid expenseId", {});
      else sendResponse(res, 200, "Expense fetched successfully", expense);
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = {
  createExpense,
  addIntoExpense,
  removeFromExpense,
  getExpenseInfo,
  deleteExpense,
};
