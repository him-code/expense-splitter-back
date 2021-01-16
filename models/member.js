const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    default: "",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true,
  },
  notification: {
    type: Number,
    default: 1,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

memberSchema.statics.createMembers = function (data) {
  return this.create(data);
};

memberSchema.statics.getGroupMembers = function (condition, options) {
  return this.find(condition, options || {});
};

memberSchema.statics.getGroupMember = function (condition, options) {
  return this.findOne(condition, options || {});
};

memberSchema.statics.updateMember = function (condition, update, options) {
  return this.findOneAndUpdate(condition, update, options || {}).exec();
};

memberSchema.statics.updateMembers = function (condition, update, options) {
  return this.updateMany(condition, update, options || {}).exec();
};

module.exports = mongoose.model("member", memberSchema);
