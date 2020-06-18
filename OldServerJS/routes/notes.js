const express = require('express');
const router= express.Router();
const Note = require('../models/Note');

router.get('/',async (req,res)=>{
    try{
        const notes=await Note.find();
        res.json(notes);
    }
    catch(err){
        res.json(err);
    }

})
router.post('/',async (req,res)=> {
    const note = new Note(req.body)
    note.id=req.body.id,
    note.noteName=req.body.noteName,
    note.todos=req.body.todos,
    note.dateCreated=req.body.dateCreated,
    note.lastUpdated=req.body.lastUpdated
    console.log("before")
    try{
        const savedNote = await note.save();
        console.log("good")
        res.json(savedNote);
    }
    catch(err){
        console.log(err)
        res.json(err);
    }
});

router.get('/:noteId', (req,res)=>{
    try{
        const note = Note.findById(req.params.noteId);
        res.json(note);
    }
    catch(err){
        res.json(err);
    }
})


router.delete('/:noteId', async(req,res)=>{
    try{
        const removeNote= await Note.remove({_id: req.params.noteId});
        res.json(removeNote);
    }
    catch(err){
        res.json(err);
    }
})


router.patch('/:noteId', async (req,res)=>{
    try{
     const updatedTodo=await Note.updateOne({_id: req.params.noteId} ,{$set: {todos: req.body.todos}});
     res.json(updatedTodo);
    }
    catch(err){
        res.json(err);
    }
});
module.exports = router;