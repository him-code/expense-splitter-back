const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let expenseSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  membersCount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  payee:{
    memberId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    memberName:{
      type: String,
      default: '',
    },
    memberEmail:{
      type: String,
      default: '',
    }
  },
  payers:[
    {
      memberId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
      },
      memberName:{
        type: String,
        default: '',
      },
      memberEmail:{
        type: String,
        default: '',
      }
    }
  ],
  status: {
    type: String,
    enum: ['Inactive','Active'],
    default: 'Active' 
  },
  createdBy :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true
  },
  createdOn :{
    type:Date,
    default: Date.now
  }
})


mongoose.model('Expense', expenseSchema);