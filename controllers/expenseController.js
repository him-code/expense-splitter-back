const expenseModel = require("../models/expense");
const outstandingModel = require("../models/outstanding");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const createExpense = async (req, res) => {
  try {
    let payee;
    const requiredKeys = [
      "name",
      "groupId",
      "totalAmount",
      "members",
      "paidBy",
    ];
    if (validateKeys(req.body, requiredKeys) && req.body.members.length) {
      const { name, groupId, totalAmount, members, paidBy } = req.body;
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

      const amount = totalAmount/ members.length + 1;

      await outstandingModel.updateOutstandings(
        { payee: { $in: members }, payer: payee, groupId },
        { $dec: { amount } }
      );

      await outstandingModel.updateOutstandings(
        { amount: { $lt: 0 } },
        { $mul: { amount: -1 }, $rename: { 'payer': 'payee', 'payee': 'payer' } }
      );

      await outstandingModel.deleteOutstanding({ amount: 0 },);

      await outstandingModel.updateOutstandings(
        { payee, payer: { $in: members }, groupId },
        { $inc: { amount } }, { upsert: true }
      );      

      //UPDATE new expense created By req.user.nickName
      //UPDATE you are added to "name" expense { name, totalAmount, membersCount: members.length + 1, members, payee, createdOn: new Date().toISOString() }

      sendResponse(res, 200, "Expense created successfully", {
        name,
        totalAmount,
        membersCount: members.length + 1,
        members,
        payee,
        createdOn: new Date().toISOString(),
      });
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = { createExpense };
