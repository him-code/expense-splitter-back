const mongoose = require("mongoose");

let groupSchema = mongoose.Schema({
  name: {
    type: String,
    default: 'Group',
  },
  membersCount: {
    type: Number,
    default: 0
  },
  createdBy :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdOn :{
    type:Date,
    default: Date.now
  }
})

memberSchema.statics.createGroups = function (data) {
  return this.create(data);
};

module.exports = mongoose.model("group", groupSchema);

