const { Server } = require('socket.io');
const dotenv = require('dotenv')
dotenv.config();

const { checkNote, getOrCreateNote, createNote, updateNote, getNote, updateNoteKey } = require('./controllers/note-controller');
const { get } = require('./model/notes-model');


const PORT = process.env.PORT || 5000;
const io = new Server(PORT, {
  cors: {
    origin: process.env.NODE_ENV,
  },
  maxHttpBufferSize: 5*1024*1024,
  maxPayload: 5*1024*1024
})

io.on('connection', (socket) => {
  console.log(`socket.io connected with id: ${socket.id}`);

  socket.on('checkNote', (noteId) => {
    checkNote(noteId, socket);
  })

  socket.on('getOrCreateNote', (noteId) => {
    getOrCreateNote(noteId, socket);
  })

  socket.on('createNote', (noteId) => {
    createNote(noteId, socket);
  })

  //for broadcasting the updated to all the clients.
  socket.on('updateNote', (noteId, data) => {
    updateNote("updateNote", noteId, data, socket);
  })

  socket.on('updateNoteTitle', (noteId, data) => {
    updateNote("updateNoteTitle", noteId, data, socket);
  })

  socket.on('updateNotePassword', (noteId, data) => {
    updateNote("updateNotePassword", noteId, data, socket);
  })

  socket.on('removeNotePassword', (noteId, data) => {
    updateNote("removeNotePassword", noteId, data, socket);
  })

  socket.on('updateNoteKey', (oldNoteId, newNoteId) => {
    updateNoteKey(oldNoteId, newNoteId, socket);
  })

  socket.on('getNote', (noteId) => {
    getNote(noteId, socket);
  })

  socket.on('joinRoom', (data) => {
    socket.join(data.roomId);
  })

  socket._onerror = (e) => {
    console.log("***",e,"***")
  }

  socket._onclose = (e) => {
    console.log("***",e,"***")
  }
})

const authNameSpace = io.of('/auth');

authNameSpace.on('connection', (socket) => {

  socket.on('getNote', async (noteId) => {
    const data = await get(noteId)
    socket.emit('getNoteResponse', data)
  })
})
