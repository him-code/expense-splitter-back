const { sendResponse } = require("../utils/responseHandler");
const memberModel = require("../models/member");

const isGroupMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) return sendResponse(res, 400, "Missing GroupId", {});

    const member = await memberModel.getGroupMember({
      groupId: groupId,
      userId: req.user._id,
    });
    if (!member) return sendResponse(res, 400, "Not a Group Member", {});

    req.memberId = member._id;
    req.groupId = member.groupId;
    req.groupName = member.groupName;

    next();
  } catch (err) {
    console.log(`Error while authenticating user!`);
    return sendResponse(res, 400, "Request cannot be completed!", {});
  }
};

module.exports = { isGroupMember };
