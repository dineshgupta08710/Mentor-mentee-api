const mongoose = require("mongoose");

// Schema of user
const mentorSchema = new mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim: true,
        validate:{
            validator:(value)=>{
                // regular ecpression (regex) to verify email
                const re =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            // when validator was false then message will be executed
            message:'Please enter valid email !!'
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value)=>{
                return value.length > 6;
            },
            message: "Please enter a password with more than 6 characters."
        }
    },
    experience:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


// creating model of schema
const Mentor = mongoose.model('Mentor',mentorSchema);

module.exports = Mentor;