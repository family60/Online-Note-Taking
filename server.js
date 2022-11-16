const express = require("express");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");

const app = express();

const notes = require("./Develop/db/db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//function for creating new note
function createNote(body, notesList) {
    const newNote = body;
    if (!Array.isArray(notesList)){
        notesArray = [];
    }

    if (notesList.length === 0){
        notesList.push(0);
        console.log("Notes List is = 0");
    }

    body.id = notesList[0];
    notesList[0]++;

    notesList.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesList, null, 2)
    );
    return newNote;
}

//function for deleting notes
function deleteNote(id, notesList) {
    for (let i = 0; i < notesList.length; i++) {
        let note = notesList[i];

        if (note.id == id) {
            notesList.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesList, null, 2)
            );
            console.log("Successfully deleted note");
            break;
        }
    }
}

//Make it clear that the server is running successfully 
app.listen(PORT, () =>{
    console.log(`App is running on http://localhost:${PORT}`);
});
//GET default page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

//GET /api/notes (data)
app.get("/api/notes", (req, res) =>{
    res.json(notes.slice(1));
});
//GET /notes (page)
app.get("/notes", (req, res) =>{
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});
//POST /api/notes (data)
app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, notes);
    res.json(newNote);
});
//DELETE (data)
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

