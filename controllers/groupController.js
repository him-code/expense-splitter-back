const groupModel = require("../models/group");
const memberModel = require("../models/member");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const createGroup = async (req, res) => {
  try {
    const requiredKeys = ["name", "members"];
    if (validateKeys(req.body, requiredKeys) && req.body.members.length) {
      req.body.members.push(req.user._id);

      const group = await groupModel.createGroups({
        name: req.body.name,
        membersCount: req.body.members.length,
        createdBy: req.user.nickName,
      });

      const members = req.body.members.map((id) => {
        return { groupName: group.name, groupId: group.id, userId: id };
      });
      await memberModel.createMembers(members);

      sendResponse(res, 200, "Group created successfully", {
        groupName: group.name,
        groupId: group.id,
        notification: 0,
        updatedOn: new Date().toISOString(),
      });
    } else {
      sendResponse(res, 400, "Missing required fields in the request", {});
    }
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = { createGroup };
