const { get, create, update, updateKey } = require('../model/notes-model');
const { Note } = require('../utils/Note');


const checkNote = async ( noteId, socket ) => {
    
    const noteDetails = await get(noteId);
    const resData = {
        isNoteExist : false,
        hasPassword : false
    }
    if(noteDetails.isNoteExist){
        resData.isNoteExist = true;
    }

    if(noteDetails.note && noteDetails.note.password){
        resData.hasPassword = true;
    }

    socket.emit('checkNoteResponse',resData)
}

const getOrCreateNote = async (noteId, socket) => {

    const response = {
        isNoteCreated: false,
        note: null,
    }

    const note = await get(noteId);
    if(note.isNoteExist){
        response.note = note.note;
    }else{
        await create(noteId);
        response.isNoteCreated = true;
    }

    socket.emit('getOrCreateNoteResponse', response);
}

const createNote = async (noteId, socket) => { 
    await create(noteId);
    socket.emit('createNoteResponse');
}

const updateNote = async (type, noteId, data, socket) => {
    await update(noteId, data);
    
    if((type === "updateNotePassword") || (type === "removeNotePassword")){
        socket.emit(`${type}Response`, data);
    }else{
        socket.broadcast.to(noteId).emit(`${type}Response`, data);
    }
}

const getNote = async (noteId, socket) => {
    const noteObject = await get(noteId);
    socket.emit('getNoteResponse', noteObject)
}

const updateNoteKey = async (oldNoteId, newNoteId, socket) => {
    await updateKey(oldNoteId, newNoteId);
    socket.emit('updateNoteKeyResponse');
}

module.exports = {
    checkNote,
    getOrCreateNote,
    createNote,
    updateNote,
    getNote,
    updateNoteKey
}