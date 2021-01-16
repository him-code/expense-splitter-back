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
        payee = { memberId: paidBy, memberName: req.user.nickName };
      } else {
        members.push({ memberId: paidBy, memberName: req.user.nickName });
        payee = members.filter((item) => item.memberId == paidBy)[0];
        members.splice(members.indexOf(payee), 1);
      }

      const expense = await expenseModel.createExpenses({
        name,
        groupId,
        totalAmount,
        payers: members,
        membersCount: members.length + 1,
        payee,
      });

      const amount = totalAmount / (members.length + 1);

      await outstandingModel.createOutstandings(
        members.map((i) => {
          return { payee, payer: i, amount, groupId, expenseId: expense._id };
        })
      );

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Expense created successfully", expense);
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in createExpense api (expenseController)", err);
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
        { _id: req.body.expenseId, "payers.memberId": { $ne: member._id } },
        {
          $push: {
            payers: { memberId: member._id, memberName: member.nickName },
          },
          $inc: { membersCount: 1 },
        }
      );

      if (!expense) sendResponse(res, 400, "Invalid expenseId", {});

      const amountDifference =
        expense.totalAmount /
        (expense.membersCount * (expense.membersCount + 1));

      await outstandingModel.updateOutstandings(
        {
          expenseId: expense._id,
          groupId: req.groupId,
        },
        { $inc: { amount: amountDifference * -1 } }
      );
      
      const amount = expense.totalAmount/(expense.membersCount + 1);

      await outstandingModel.createOutstandings({
        payee: expense.payee,
        payer: { memberId: member._id, memberName: member.nickName },
        amount,
        groupId: req.groupId,
        expenseId: expense._id,
      });

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Member is added to Expense successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in addIntoExpense api (expenseController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const removeFromExpense = async (req, res) => {
  try {
    const requiredKeys = ["expenseId", "memberId"];
    if (validateKeys(req.body, requiredKeys)) {
      const expense = await expenseModel.updateExpense(
        { _id: req.body.expenseId, "payers.memberId": req.body.memberId },
        {
          $pull: { payers: { memberId: req.body.memberId } },
          $inc: { membersCount: -1 },
        }
      );

      if (!expense) sendResponse(res, 400, "Invalid expenseId or memberId", {});

      const oldAmount = expense.totalAmount / expense.membersCount;
      const amountDifference =
        expense.totalAmount / (expense.membersCount - 1) - oldAmount;

      await outstandingModel.updateOutstandings(
        {
          expenseId: expense._id,
          groupId: req.groupId,
        },
        { $inc: { amount: amountDifference } }
      );

      await outstandingModel.deleteOutstandings({
        expenseId: expense._id,
        "payer.memberId": req.body.memberId,
      });

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Member is removed from Expense successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in removeFromExpense api (expenseController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const requiredKeys = ["expenseId"];
    if (validateKeys(req.params, requiredKeys)) {
      const expense = await expenseModel.deleteExpenses({
        _id: req.params.expenseId,
      });

      if (!expense) sendResponse(res, 400, "Invalid expenseId", {});

      await outstandingModel.deleteOutstandings({ expenseId: req.params.expenseId });

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Expense deleted successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in deleteExpense api (expenseController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const getExpenseInfo = async (req, res) => {
  try {
    const requiredKeys = ["expenseId"];
    if (validateKeys(req.params, requiredKeys)) {
      const expense = await expenseModel.getExpense({
        _id: req.params.expenseId,
      });

      if (!expense) sendResponse(res, 400, "Invalid expenseId", {});
      else sendResponse(res, 200, "Expense fetched successfully", expense);
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getExpenseInfo api (expenseController)", err);
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
