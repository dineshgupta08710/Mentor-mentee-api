const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')


const cors = require('cors');
app.use(cors());

const corsConfig = {
  origin:"*",
  Credential: true,
  methods:["GET","POST","PUT","DELETE"]
}

app.options("",cors(corsConfig));


// connecting to database
// '#' char in url =>  %23
mongoose.connect('mongodb+srv://dineshgupta:dinesh%237068@cluster0.gf0ft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
   console.log("Database connectesd successfuly");
}).catch((err)=>{
   console.log(err);
});

app.use(bodyParser.json());


//## Importing  files from another folder
const mentorRoute = require('./routes/mentor');
const menteeRoute = require('./routes/mentee');


app.use('/mentor',mentorRoute);
app.use('/mentee',menteeRoute);


app.use("*",(req,res)=>{
   res.status(404).json({
      msg:"Bad request !!!"
   })
});


module.exports = app;