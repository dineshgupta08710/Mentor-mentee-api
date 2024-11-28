const mongoose = require('mongoose');

// Schema of blog
const doubtSchema = new mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    mentorEmail:{
        type:String,
        required:true,
    },
    menteeId:{
        type:String,
        required:true,
    },
    menteeName: {
        type:String,
        required:true,
    },
    doubt: {
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

// creating model of schema
const doubt = mongoose.model('doubt',doubtSchema);

module.exports = doubt;