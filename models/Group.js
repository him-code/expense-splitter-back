const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let groupSchema = new Schema({
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


mongoose.model('Group', groupSchema);
