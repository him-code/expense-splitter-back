const memberModel = require("../models/member");
const groupModel = require("../models/group");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const getGroupsData = async (req, res) => {
  try {
    const groups = await memberModel.getGroupMembers(
      { userId: req.user._id },
      { groupName: 1, groupId: 1, notification: 1, updatedOn: 1 }
    );
    sendResponse(res, 200, "My Groups fetched successfully", { user:req.user, groups });
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const searchGroupMembers = async (req, res) => {
  try {
    const requiredKeys = ["nickName"];
    if (validateKeys(req.params, requiredKeys)) {
      const users = await memberModel.getGroupMembers(
        { nickName: { $regex: '^' + req.params.nickName + '.*' }, _id: { $ne: req.memberId } },
        { nickName: 1 }
      );

      if (users) sendResponse(res, 200, "List of members", users);
      else sendResponse(res, 200, "No such user present", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in searchGroupMembers api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const getGroupMembers = async (req, res) => {
  try {

    const users = await memberModel.getGroupMembers(
      { groupId: req.groupId, _id: { $ne: req.memberId } },
      { nickName: 1 }
    );

    if (users)
      sendResponse(res, 200, "Group Members fetched successfully", users);
    else sendResponse(res, 200, "No such user present", {});
  } catch (err) {
    console.log("ERROR in getGroupMembers api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const addIntoGroup = async (req, res) => {
  try {
    const requiredKeys = ["userId", "nickName"];
    if (validateKeys(req.body, requiredKeys)) {
      const member = await memberModel.createMembers({
        groupName: req.groupName,
        groupId: req.groupId,
        userId: req.body.userId,
        nickName: req.body.nickName,
      });
      await groupModel.updateMembersCount(member.groupId);

      //UPDATE: your are added to "member.groupName" group { groupName: member.groupName, groupId: member.groupId, notification:1, updatedOn: new Date().toISOString() }

      sendResponse(res, 200, "Member is added to the group Successfully", {});
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in addIntoGroup api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = {
  getGroupsData,
  searchGroupMembers,
  getGroupMembers,
  addIntoGroup,
};
