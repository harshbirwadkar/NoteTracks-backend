const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// ROUTE1 : get notes of user using GET: http://localhost:5000/api/notes/getallnotes , login required
router.get('/getallnotes', fetchuser, async (req, res) => {
    // this finds all the notes with the specified user id 
    let note = await Note.find({ user: req.user.id })
    res.json(note)
})

// ROUTE2 : save notes of user using POST: http://localhost:5000/api/notes/addnotes , login required
router.post('/addnotes', fetchuser, [
    body('title', 'Enter title with more than or equal to three characters').isLength({ min: 3 }),
    body('description', 'Enter description with more than or equal to five characters').isLength({ min: 5 })
], async (req, res) => {
    // destructing the req.body 
    const { title, description, tag , color} = req.body
    // checking for validation errors if exists then sending bad request and error 
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ err: err.message })
    }
    try {
        // saving the notes in the database with user id as well
        let note = new Note({
            user: req.user.id, title, description, tag : tag || "General" , color
        })
        let savedNote = await note.save()
        res.json(savedNote)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ err: err.message })
    }

})

// ROUTE3 : update notes of user using PUT: http://localhost:5000/api/notes/updatenote/:id , login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    // destructing the req.body 
    const { title, description, tag } = req.body
    try {


        // creating a object to update the data 
        let newNote = {}
        // the following checks whether the title, description ,tag are present or not , if present then it updates the newNote object which is used for updatation in database 
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }
        // checks whether the note is present in database or not 
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        // checks whether the note  present in database belongs to the same user which is updating or not 
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not authorized")
        }
        // Notes are updated based on user id 
        note = await Note.findByIdAndUpdate(req.params.id, newNote, { new: true })
        res.json({ note })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ err: err.message })
    }
})


// ROUTE4 : delete notes of user using DELETE: http://localhost:5000/api/notes/deletenote/:id , login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {


        // checks whether the note is present in database or not 
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        // checks whether the note  present in database belongs to the same user which is updating or not 
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not authorized")
        }
        // Notes are updated based on user id 
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "note has been deleted", note: note })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ err: err.message })
    }
})
module.exports = router

// ROUTE5 : update the color of notes of user using PUT: http://localhost:5000/api/notes/updatenotecolor/:id , login required
router.put('/updatenotecolor/:id', fetchuser, async (req, res) => {
    // destructing the req.body 
    const { color } = req.body
    try {
        // creating a object to update the data 
        let newNote = {}
        // the following checks whether the title, description ,tag are present or not , if present then it updates the newNote object which is used for updatation in database 
        if (color) {
            newNote.color = color
        }
        // checks whether the note is present in database or not 
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not found")
        }
        // checks whether the note  present in database belongs to the same user which is updating or not 
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not authorized")
        }
        // Notes are updated based on user id 
        note = await Note.findByIdAndUpdate(req.params.id, newNote, { new: true })
        res.json({ note })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ err: err.message })
    }
})