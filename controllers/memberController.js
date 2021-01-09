const memberModel = require("../models/member");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const getGroupsData = async (req, res) => {
  try {
    const groups = await memberModel.getGroupMembers(
      { userId: req.user._id },
      { groupName: 1, groupId: 1, notification: 1, updatedOn: 1 }
    );
    sendResponse(res, 200, "Groups fetched successfully", { user:req.user, groups });
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const searchGroupMembers = async (req, res) => {
  try {
    const requiredKeys = ["nickName"];
    if (validateKeys(req.body, requiredKeys)) {
      const users = await memberModel.getGroupMembers(
        {nickName: `/^${req.body.nickName}/`, _id: { $ne: req.memberId }},
        { nickName: 1}
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

const getGroupMembers = async (req, res) => {
  try {
    const requiredKeys = ["groupId"];
    if (validateKeys(req.body, requiredKeys)) {
      const users = await memberModel.getGroupMembers(
        {groupId: req.body.groupId, _id: { $ne: req.memberId }},
        { nickName: 1 }
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

module.exports = { getGroupsData , searchGroupMembers, getGroupMembers};
