import { Note } from "../types";

const useNotes = () => {
  const getAllNotes = () => {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

    return notes.sort((a: Note, b: Note) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  };

  const addNote = (id: number, setActiveNote: (note: Note) => void) => {
    const notes = getAllNotes();
    const newNote = {
      id,
      title: "",
      body: "",
      updated: new Date().toISOString(),
    };
    notes.push(newNote);
    setActiveNote(newNote);

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  };

  const updateNote = (currentNote: Note) => {
    const notes = getAllNotes();
    const currentNoteIndex = notes.findIndex(
      (note: Note) => note.id === currentNote.id
    );
    currentNote.updated = new Date().toISOString();
    notes.splice(currentNoteIndex, 1, currentNote);

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  };

  const deleteNote = (id: number) => {
    const notes = getAllNotes();
    const newNotes = notes.filter((note: Note) => note.id !== id);

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  };

  return { getAllNotes, addNote, updateNote, deleteNote };
};

export default useNotes;
