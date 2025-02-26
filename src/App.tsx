import { useState, useEffect, useCallback } from "react";
import Sidebar from "./sidebar/Sidebar";
import EditPanel from "./editPanel/EditPanel";
import useNotes from "./hooks/useNotes";
import { Note } from "./types";

export interface Props {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note) => void;
  refreshNotes: (activeNote?: Note) => void;
}

const App = () => {
  const { getAllNotes } = useNotes();
  const [notes, setNotes] = useState<Note[]>(getAllNotes());
  const [activeNote, setActiveNote] = useState<Note | null>(notes[0] || null);

  const refreshNotes = useCallback((note?: Note) => {
    const notes = getAllNotes();
    setNotes(notes);
    setActiveNote(note || notes[0] || null);
  }, []);

  const props: Props = {
    notes,
    activeNote,
    setActiveNote,
    refreshNotes,
  };

  return (
    <div className="notes">
      <Sidebar {...props} />
      <EditPanel {...props} />
    </div>
  );
};

export default App;
