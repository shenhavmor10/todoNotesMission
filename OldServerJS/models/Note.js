const mongoose = require('mongoose');


let noteSchema = new mongoose.Schema({
    id:{
        type:Number,
    },
    noteName:{
        type:String,
        require:false
    },
    todos:{
        type:Array,
        require:false
    },
    dateCreated:{
        type:Date,
        default: Date.now,
        require:false
    },
    lastUpdated:{
        type: Date,
        default: Date.now,
        require:false
    }
});

module.exports = mongoose.model('Notes',noteSchema);