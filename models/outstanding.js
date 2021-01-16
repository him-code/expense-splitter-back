const mongoose = require("mongoose");

const outstandingSchema = mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true,
  },
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "expense",
    required: true,
  },
  payee: {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
      required: true,
    },
    memberName: {
      type: String,
      required: true,
    },
  },
  payer: {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
      required: true,
    },
    memberName: {
      type: String,
      required: true,
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

outstandingSchema.statics.createOutstandings = function (data) {
  return this.create(data);
};

outstandingSchema.statics.updateOutstandings = function (
  condition,
  update,
  options
) {
  return this.updateMany(condition, update, options || {}).exec();
};

outstandingSchema.statics.getTotalToPay = function (payerId, groupId) {
  return this.aggregate([
    { $match: { "payer.memberId": payerId, groupId } },
    {
      $group: {
        _id: "$payee",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]).exec();
};

outstandingSchema.statics.getTotalToReceive = function (payeeId, groupId) {
  return this.aggregate([
    { $match: { "payee.memberId": payeeId, groupId } },
    {
      $group: {
        _id: "$payer",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]).exec();
};

outstandingSchema.statics.deleteOutstandings = function (condition, options) {
  return this.deleteMany(condition, options || {});
};

const outstandingModel = mongoose.model("outstanding", outstandingSchema);
module.exports = outstandingModel;
