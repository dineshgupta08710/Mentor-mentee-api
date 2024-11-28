const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const mentor = require("../models/mentor");
const mentee = require("../models/mentee");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth')


// Mentor Signup
router.post('/signup',async(req,res)=> {
    console.log("Mentor signup post req..");
    console.log(req.body);

    // Checking that user is already exists or not
    const existingMentor = await mentor.findOne({email:req.body.email}); // await to return some value
    if(existingMentor){
        return res.status(400).json({
            msg:"User with same email is alredy exists!"
        });
    }

    // Converting password into hashcode
    const hashedPassword = await bcryptjs.hash(req.body.password,8);

    const newMentor = new mentor({
        _id: new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        experience:req.body.experience
    });
    newMentor.save()
    .then(result=>{
        res.status(200).json({
            newMentor:result
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


// Mentor login
router.post('/login',(req,res)=>{
    console.log(req.body);

    mentor.find({email:req.body.email})
    .then(mentorResult=>{
        console.log(mentorResult);
        // if email does not exist in DB
        if(mentorResult.length<1){
            console.log("User does not exist !!!")
            return res.status(401).json({
                msg:"User does not exist!!"
            })
        }

        // Checking password
        bcryptjs.compare(req.body.password,mentorResult[0].password,(err,isMatch)=>{
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
                    name: mentorResult[0].name,
                    mentorId: mentorResult[0]._id, 
                    email: mentorResult[0].email,
                    experience:mentorResult[0].experience,
                }, // Payload
                'nkjdkfj', // Secret key
                { expiresIn: '365d'} // Expiry time
            );

            res.status(200).json({
                name:mentorResult[0].name,
                mentorId: mentorResult[0]._id,
                email:mentorResult[0].email,
                experience:mentorResult[0].experience,
                token:token
            });

        })
    })
    .catch((err)=>{
        console.log(err);
    })
});

// Mentor add new mentee
router.post('/addNewMentee',checkAuth, async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    const mentorExists = await mentor.findOne({ _id: verify.mentorId });
        
    if (!mentorExists) {
        return res.status(403).json({
            msg: 'Mentor does not exist. Only mentors can add mentees.',
        });
    }

    // Converting password into hashcode
    const hashedPassword = await bcryptjs.hash(req.body.password,8);

    const newMentee = new mentee({
        _id: new mongoose.Types.ObjectId,
        mentorId: verify.mentorId,
        mentorName:verify.name,
        name: req.body.name,
        email:req.body.email,
        password: hashedPassword,
    });

    newMentee.save()
    .then((result)=>{
        res.status(200).json({
            newMentee:result,
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

// Get own mentees
router.get('/getAllMentees',checkAuth,(req,res)=>{

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token,'nkjdkfj');

    mentee.find({mentorId : verify.mentorId})
    .select("_id mentorId mentorName name email")
    .then(result=>{
        res.status(200).json({
            menteeList: result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


module.exports = router;