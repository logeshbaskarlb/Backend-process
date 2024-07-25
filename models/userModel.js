const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phone: {
        type: Number,
        required: true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})

const User = mongoose.model('Users',userSchema);
module.exports = User