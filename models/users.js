// make course model
const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true, 'Please add a name']
    },
    email: {
        type:String,
        required:[true,'Please add an email']
    },
    role:{
        type:String,
        required:[true,'Please add a role']
    },
    password:{
        type:String,
        required:[true,'Please add a password']
    }
});

module.exports = mongoose.model('users',UsersSchema);