const express = require('express');
const router = express.Router();
const { checkNote, getOrCreateNote, createNote, updateNote } = require('../controllers/note-controller')

router.post('/note-check', checkNote);

router.post('/note/getOrCreateNote', getOrCreateNote);

router.post('/createNote', createNote);

// router.post('/updateNote', updateNote)

module.exports = router;
