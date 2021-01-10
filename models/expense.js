const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let expenseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  membersCount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true
  },
  payee:{
    memberId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "member",
      required: true
    },
    memberName:{
      type: String,
      default: '',
    },
  },
  payers:[
    {
      memberId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "member",
        required: true
      },
      memberName:{
        type: String,
        default: '',
      },
    }
  ],
  status: {
    type: String,
    enum: ['Inactive','Active'],
    default: 'Active' 
  },
  createdOn :{
    type:Date,
    default: Date.now
  }
})

expenseSchema.statics.createExpenses = function (data) {
  return this.create(data);
};

module.exports = mongoose.model("expense", expenseSchema);