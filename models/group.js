const mongoose = require("mongoose");

let groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  membersCount: {
    type: Number,
    default: 0
  },
  createdBy :{
    type: String,
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

