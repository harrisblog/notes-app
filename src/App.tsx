import { useState, useEffect, useCallback } from "react";
import Sidebar from "./sidebar/Sidebar";
import EditPanel from "./editPanel/EditPanel";
import useNotes from "./hooks/useNotes";
import { Note } from "./types";

export interface Props {
  notes: Note[];
  activeNoteID: number | null;
  setActiveNoteID: (id: number | null) => void;
  refreshNotes: () => void;
}

const App = () => {
  const { getAllNotes } = useNotes();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteID, setActiveNoteID] = useState<number | null>(
    notes[0]?.id || null
  );

  const refreshNotes = useCallback(() => {
    const notes = getAllNotes();
    setNotes(notes);
    setActiveNoteID(notes[0]?.id || null);
  }, []);

  const props: Props = {
    notes,
    activeNoteID,
    setActiveNoteID,
    refreshNotes,
  };

  useEffect(() => {
    refreshNotes();
  }, []);

  return (
    <div className="notes">
      <Sidebar {...props} />
      <EditPanel {...props} />
    </div>
  );
};

export default App;
