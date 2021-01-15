const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
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

expenseSchema.statics.getExpense = function (condition, options) {
  return this.findOne(condition, options || {});
};

expenseSchema.statics.updateExpense = function (condition, update, options) {
  return this.findOneAndUpdate(condition, update, options || {});
};

expenseSchema.statics.deleteExpenses = function (condition, options) {
  return this.deleteMany(condition, options || {});
};

module.exports = mongoose.model("expense", expenseSchema);