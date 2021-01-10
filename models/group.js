const mongoose = require("mongoose");

let groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  membersCount: {
    type: Number,
    default: 0,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

groupSchema.statics.createGroups = function (data) {
  return this.create(data);
};

groupSchema.statics.getUserDetail = function (condition, options) {
  return this.findOne(condition, options || filterObj);
};

groupSchema.statics.updateMembersCount = function (id) {
  return this.findOneAndUpdate(
    { _id: id },
    { $inc: { membersCount: 1 } }
  ).exec();
};

module.exports = mongoose.model("group", groupSchema);
