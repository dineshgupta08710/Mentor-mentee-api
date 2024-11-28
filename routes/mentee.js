const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const mentee = require("../models/mentee");
const mentor = require("../models/mentor");
const doubt = require("../models/doubt");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth')


// Mentee login

router.post('/login',(req,res)=>{
    console.log(req.body);

    mentee.find({email:req.body.email})
    .then(menteeResult=>{
        console.log(menteeResult);
        // if email does not exist in DB
        if(menteeResult.length<1){
            console.log("User does not exist !!!")
            return res.status(401).json({
                msg:"User does not exist!!"
            })
        }

        // Checking password
        bcryptjs.compare(req.body.password,menteeResult[0].password,(err,isMatch)=>{
            // If password not matched
            if(!isMatch){
                return res.status(401).json({
                    msg:'Invalid Password !!'
                })
            }

            // Password matched
            // Create token
            const token = jwt.sign(
                { 
                    name: menteeResult[0].name,
                    menteeId: menteeResult[0]._id, 
                    email: menteeResult[0].email,
                }, // Payload
                'nkjdkfj', // Secret key
                { expiresIn: '365d'} // Expiry time
            );

            res.status(200).json({
                name:menteeResult[0].name,
                menteeId: menteeResult[0]._id,
                email:menteeResult[0].email,
                token:token
            });

        })
    })
    .catch((err)=>{
        console.log(err);
    })
});


// Mentee asks doubt to his mentor
router.post('/askDoubt',checkAuth, async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    const mentorEmailExists = await mentor.findOne({ email: req.body.mentorEmail});
        
    if (!mentorEmailExists) {
        return res.status(403).json({
            msg: 'Mentor with given Email does not exist !!',
        });
    }

    const newDoubt = new doubt({
        _id: new mongoose.Types.ObjectId,
        mentorEmail: req.body.mentorEmail,
        menteeId:verify.menteeId,
        menteeName:verify.name,
        doubt:req.body.doubt
    });

    newDoubt.save()
    .then((result)=>{
        res.status(200).json({
            newDoubt:result,
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}
);

module.exports = router;