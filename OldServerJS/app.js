const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config')
const app=express();
const bodyParse = require('body-parser')
const cors = require('cors')
const notesRoute = require('./routes/notes')

app.use(cors());

app.use(bodyParse.json());
app.use('/notes',notesRoute);

app.get('/',(req,res)=>{
    res.send('webpage');
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true } ,() => console.log("connected to db"));



app.listen(3010);