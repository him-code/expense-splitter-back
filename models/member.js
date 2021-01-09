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
  takeFrom: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "member",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  giveTo: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "member",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
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

module.exports = mongoose.model("member", memberSchema);
