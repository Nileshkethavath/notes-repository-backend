const { Note } = require('../utils/Note');

const { rtdb } = require('../config/firebaseConfig');
const { ref, set, get: getDb, update: updateDb, remove: removeDb } = require("firebase/database");


const get = async (url) => {

    let obj = {
        isNoteExist: false,
        note: null,
    }

    try {
        const snapshot = await getDb(ref(rtdb, `/${url}`));
        if (snapshot.exists()) {
            obj.isNoteExist = true;
            obj.note = snapshot.val();
        } else {
            obj.isNoteExist = false;
        }
    } catch (error) {
        console.error("Failed to get the Data", error);
    }

    return obj;
}

const create = async (url, note = null) => {
    const newNote = note || new Note({createdAt: new Date().toISOString(), url, noteTitle: '', note: '', password:''});
    try {
        await set(ref(rtdb, `/${url}`), newNote);

    } catch (error) {
        console.error("Error creating data", error);
    }

};

const update = async (url, note = {}) => {

        try{
            // const obj = await get(url);
            // if(obj.isNoteExist){
                await updateDb(ref(rtdb,`/${url}`), {...note});
            // }
        }
        catch(error){
            console.error('Error updating data', error)
        }
}

const remove = async (url) => {

    try{
        const note = await get(url);
        if(note.isNoteExist){
            removeDb(ref(rtdb, `/${url}`));
        }
    }catch(error){
        console.error("Error removing data", error);
    }
}

const updateKey = async (oldUrl, newUrl) => {
  
    try{
        const { isNoteExist, note } = await get(oldUrl);
        if(isNoteExist){
            note.url = newUrl;
            create(newUrl, note);
            remove(oldUrl)
        }
    }catch(error){
        console.error("Error updating new note url", error);
    }

} 


const checkForPassword = async (url) => {

    const { isNoteExist, note } = await get(url)
    
    if(isNoteExist && note.password){
        return true;
    }

    return false;
} 


const patchData = () => { }

module.exports = {
    get,
    create,
    update,
    remove,
    updateKey
}