const mongoose = require('mongoose');

// Schema of blog
const menteeSchema = new mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    mentorId:{
        type:String,
        required:true,
    },
    mentorName: {
        type:String,
        required:true,
    },
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
   
});

// creating model of schema
const Mentee = mongoose.model('Mentee', menteeSchema);

module.exports = Mentee;