import { memo } from "react";
import { Props } from "../App";
import useNotes from "../hooks/useNotes";
import { Note } from "../types";

const MAX_BODY_LENGTH = 60;

const ListItem: React.FC<
  Note & {
    activeNoteID: number | null;
    setActiveNoteID: (id: number | null) => void;
  }
> = memo(({ id, title, body, updated, activeNoteID, setActiveNoteID }) => (
  <div
    className={`notes__list-item ${
      activeNoteID === id ? "notes__list-item--selected" : ""
    }`}
    onClick={() => setActiveNoteID(id)}
    data-note-id={id}
  >
    <div className="notes__small-title">{title || "未命名"}</div>

    <div className="notes__small-body">
      {!body && "（空）"}
      {body.substring(0, MAX_BODY_LENGTH)}
      {body.length > MAX_BODY_LENGTH ? "..." : ""}
    </div>

    <div className="notes__small-updated">
      {new Date(updated).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      })}
    </div>
  </div>
));

const Sidebar = ({
  notes,
  activeNoteID,
  setActiveNoteID,
  refreshNotes,
}: Props) => {
  const { addNote } = useNotes();

  const onAddNote = () => {
    // timestamp
    const id = new Date().getTime();
    addNote(id);
    setActiveNoteID(id);
    refreshNotes();
  };

  return (
    <div className="notes__sidebar">
      <button className="notes__add" type="button" onClick={onAddNote}>
        添加新的笔记 📒
      </button>

      <div className="notes__list">
        {notes.map((note: Note) => (
          <ListItem
            key={note.id}
            {...{ ...note, activeNoteID, setActiveNoteID }}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
