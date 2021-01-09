const expenseModel = require("../models/exoense");
const memberModel = require("../models/member");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const createExpense = async (req, res) => {
  try {
    let payee;
    const requiredKeys = ["name", "groupId", "totalAmount", "members", "paidBy"];
    if (validateKeys(req.body, requiredKeys) && req.body.members.length) {

      const { name, groupId, totalAmount, members, paidBy } = req.body;
      if(req.memberId == paidBy){
        payee = { memberId: memberId, memberName: nickName }
      }else{
        members.push({ memberId: memberId, memberName: nickName });
        payee = members.filter((item) => item.memberId == paidBy)[0];
        members.splice(members.indexOf(payee),1)
      }
      
      const expense = await expenseModel.createExpenses({
        name,
        groupId,
        totalAmount,
        members,
        membersCount: members.length + 1,
        payee,
      });

    //   get member if noentry push 
    //   else entry 
    //         if entry in takeFrom giveTo

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
