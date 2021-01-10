const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

var authSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    nickName:{
        type: String,
        required: true,
    },
    time:{
        type: Date,
        expires: '60d',
        required: true
    }
});

// authSchema.statics.generateAuthToken = async function() {
//     try{
//         const authEntry = {
//             user_id: this['user_id'], 
//             email: this['email'], 
//             time:this['time'],
//         };
//         var access = 'auth';
//         var token = await jwt.sign({authEntry : authEntry, access}, config.RC.auth['secret'], { expiresIn : config.RC.auth['expire_time']}).toString(); //token will expire in 60 days
//         return token;
//     }
//     catch(err){
//         return modelErrorHandler(err, 'Error occured while executing generateAuthToken!');
//     }
// }

// authSchema.statics.setAuthEntry = async function(authEntry) {
//     try{
//         console.log('Executing model/auth/setAuthEntry');
//         var authEntry = await authModel.create(authEntry);
        
//         if(!authEntry)
//             throw {error: 'Error creating authEntry', code:400};
//         return authEntry;
//     }catch(err){
//         return modelErrorHandler(err, 'Error while executing setAuthEntry!');
//     }
// }

// authSchema.statics.getAuthEntry = async function(decoded){
//     try{
//         console.log('Executing model/auth/getAuthEntry');

//         var authEntry = await authModel.findOne(decoded['authEntry']);
//         if(!authEntry)
//             throw {error: 'Token is invalid or expired!', code:401};;
//         return authEntry;
//     }catch(err){
//         return modelErrorHandler(err, 'Error while executing setAuthEntry!');
//     }
// }

// verifyAuthToken = async (token) => {
//     try{
//         console.log('Executing model/auth/verifyAuthToken');
//         return await jwt.verify(token.toString(), config.RC.auth['secret']);
//     }
//     catch(err){
//         console.log(`Error while executing verifyAuthToken!`);
//         return modelErrorHandler(err, 'Error occurred while executing verifyAuthToken')
//     }
// }

// var authModel = mongoose.model('auth', authSchema);
// module.exports = { authModel, verifyAuthToken };


module.exports = mongoose.model("auth", authSchema);