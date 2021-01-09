const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const filterObj = {
  __v: 0,
  password: 0,
};

userSchema.statics.createUser = function (data) {
  return this.create(data);
};

userSchema.statics.getUserDetail = function (condition, options) {
  return this.findOne(condition, options || filterObj);
};

module.exports = mongoose.model("user", userSchema);
