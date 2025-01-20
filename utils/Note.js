function Note(
    {
        url = '',
        note = '',
        noteTitle = '',
        createdAt = '',
        password = '',
    } = {}) {
    
    this.url = url;
    this.note = note;
    this.noteTitle = noteTitle;
    this.createdAt = createdAt;
    this.password = password;
}

module.exports = {Note}