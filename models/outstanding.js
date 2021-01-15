const mongoose = require("mongoose");

const outstandingSchema = mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
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

outstandingSchema.statics.getOutstandings = function (condition, options) {
  return this.find(condition, options || {});
};

outstandingSchema.statics.getOutstanding = function (condition, options) {
  return this.findOne(condition, options || {});
};

outstandingSchema.statics.updateOutstanding = function (condition, update, options) {
  return this.findOneAndUpdate(condition, update, options || {});
};

outstandingSchema.statics.updateOutstandings = function (condition, update, options) {
  return this.updateMany(condition, update, options || {});
};

outstandingSchema.statics.deleteOutstanding = function (condition, options) {
  return this.deleteMany(condition, options || {});
};

module.exports = mongoose.model("oustanding", outstandingSchema);
