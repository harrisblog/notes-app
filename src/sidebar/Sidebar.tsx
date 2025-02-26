import { memo, useCallback } from "react";
import { Props } from "../App";
import useNotes from "../hooks/useNotes";
import { Note } from "../types";

const MAX_BODY_LENGTH = 60;

type ListItemProps = Note & {
  activeNote: Note | null;
  setActiveNote: (note: Note) => void;
};

const ListItem = memo(
  ({ id, title, body, updated, activeNote, setActiveNote }) => (
    <div
      className={`notes__list-item ${
        activeNote?.id === id ? "notes__list-item--selected" : ""
      }`}
      onClick={() => setActiveNote({ id, title, body, updated })}
      data-note-id={id}
    >
      <div className="notes__small-title">{title || "未命名"}</div>

      <div className="notes__small-body">
        {!body && "（空）"}
        {body.substring(0, MAX_BODY_LENGTH)}
        {body.length > MAX_BODY_LENGTH ? "..." : ""}
      </div>

      <div className="notes__small-updated">
        {new Date(updated).toLocaleString("zh-CN")}
      </div>
    </div>
  )
) as React.NamedExoticComponent<ListItemProps>;

const Sidebar = ({ notes, activeNote, setActiveNote, refreshNotes }: Props) => {
  const { addNote } = useNotes();

  const onAddNote = useCallback(() => {
    // timestamp
    const id = new Date().getTime();
    addNote(id, setActiveNote);
    refreshNotes();
  }, [addNote, refreshNotes, setActiveNote]);

  return (
    <div className="notes__sidebar">
      <button className="notes__add" type="button" onClick={onAddNote}>
        添加新的笔记 📒
      </button>

      <div className="notes__list">
        {notes.map((note: Note) => (
          <ListItem key={note.id} {...{ ...note, activeNote, setActiveNote }} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
