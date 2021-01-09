import mongoose from 'mongoose';

let userSchema =  mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },  
  firstName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  groupName: {
    type: String,
    default: ''
  },
  groupId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  }, 
  createdOn :{
    type:Date,
    default: Date.now,
  }
})


mongoose.model('User', userSchema);