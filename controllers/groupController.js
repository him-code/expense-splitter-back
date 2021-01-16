const groupModel = require("../models/group");
const memberModel = require("../models/member");
const outstandingModel = require("../models/outstanding");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const createGroup = async (req, res) => {
  try {
    const requiredKeys = ["name", "members"];
    if (validateKeys(req.body, requiredKeys) && req.body.members.length) {
      req.body.members.push({ id: req.user._id, nickName: req.user.nickName });

      const group = await groupModel.createGroups({
        name: req.body.name,
        membersCount: req.body.members.length,
      });

      const members = req.body.members.map((item) => {
        return {
          groupName: group.name,
          groupId: group.id,
          userId: item.id,
          nickName: item.nickName,
        };
      });
      await memberModel.createMembers(members);

      //UPDATE: you are added to "group.name" group { groupName: group.name, groupId: group.id, notification:1, updatedOn: new Date().toISOString() }

      sendResponse(res, 200, "Group created successfully", {
        groupName: group.name,
        groupId: group.id,
        notification: 1,
        updatedOn: new Date().toISOString(),
      });
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (groupController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

const getGroupInfo = async (req, res) => {
  try {
    const group = await groupModel.getUserDetail(
      { _id: req.groupId },
      { __v: 0 }
    );

    await memberModel.updateMember(
      { groupId: req.groupId, userId: req.user._id },
      { notification: 0 }
    );

    const toPay = await outstandingModel.getTotalToPay(req.memberId, req.groupId);

    const toReceive = await outstandingModel.getTotalToReceive(req.memberId, req.groupId);

    sendResponse(res, 200, "Group fetched successfully", { group, toPay, toReceive });
  } catch (err) {
    console.log("ERROR in getGroupInfo api (groupController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = { createGroup, getGroupInfo };
