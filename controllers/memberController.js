const memberModel = require("../models/member");
const { validateKeys } = require("../utils/validators");
const { sendResponse } = require("../utils/responseHandler");

const getGroupsData = async (req, res) => {
  try {
    const groups = await memberModel.getGroupMembers(
      { userId: req.user._id },
      { groupName: 1, groupId: 1, notification: 1 }
    );
    sendResponse(res, 200, "Groups fetched successfully", { user:req.user, groups });
  } catch (err) {
    console.log("ERROR in getGroupsData api (memberController)", err);
    sendResponse(res, 400, "Something seems fishy in the request", err);
  }
};

module.exports = { getGroupsData };
