const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupName: {
    type: String,
    default: "",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  takeFrom: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
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
        ref: "Group",
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
    default: 0,
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

module.exports = mongoose.model("member", memberSchema);
