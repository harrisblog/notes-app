import { useState, useEffect } from "react";
import { Note } from "../types";
import useNotes from "../hooks/useNotes";
import { Props } from "../App";
import { exportCSV, exportXML } from "../utils/export";
import { importCSV, importXML } from "../utils/import";

const EditPanel = ({
  notes,
  activeNote,
  setActiveNote,
  refreshNotes,
}: Props) => {
  const { getAllNotes, updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState<string>(activeNote?.title || "");
  const [body, setBody] = useState<string>(activeNote?.body || "");
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const [lastNote, setLastNote] = useState<Note | null>(null);

  const onImportNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let importedNotes: Note[] = [];

      if (file.name.endsWith(".csv")) {
        importedNotes = importCSV(content);
      } else if (file.name.endsWith(".xml")) {
        importedNotes = importXML(content);
      } else {
        alert("不支持的文件格式");
        return;
      }

      // Merge new notes with existing notes
      const existingNotes = getAllNotes();
      importedNotes.forEach((note) => {
        const existingNote = existingNotes.find((n: Note) => n.id === note.id);
        if (existingNote) {
          existingNote.updated = note.updated;
          existingNote.title = note.title;
          existingNote.body = note.body;
        } else {
          existingNotes.push(note);
        }
      });

      localStorage.setItem("notesapp-notes", JSON.stringify(existingNotes));
      refreshNotes();
    };

    reader.readAsText(file);
  };

  const onExportNote = () => {
    const format = prompt("请选择下载格式 (输入 csv 或 xml):");
    if (format === null) return;
    if (!["csv", "xml"].includes(format.toLowerCase())) {
      alert("请输入有效的格式: csv 或 xml");
      return;
    }

    const data = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    const fileName = `notes_${new Date().toISOString().slice(0, 10)}`;

    if (format.toLowerCase() === "csv") {
      exportCSV(data, `${fileName}.csv`);
    } else {
      exportXML(data, `${fileName}.xml`);
    }
  };

  const onDeleteNote = () => {
    if (!activeNote) return;
    const doDelete = confirm("确认要删除该笔记吗?");
    if (doDelete) {
      deleteNote(activeNote.id);
      setActiveNote(notes[0] || null);
      refreshNotes();
    }
  };

  useEffect(() => {
    setTitle(activeNote?.title || "");
    setBody(activeNote?.body || "");
  }, [activeNote]);

  useEffect(() => {
    if (!activeNote) return;
    // Don't update when open a new note
    if (lastNote?.id !== activeNote.id) {
      setLastNote(activeNote);
      return;
    }
    const timer = setTimeout(() => {
      updateNote({
        id: activeNote.id,
        title,
        body,
        updated: new Date().toISOString(),
      });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
      refreshNotes(activeNote);
    }, 800);

    return () => clearTimeout(timer);
  }, [title, body]);

  const NoteHeader = () => (
    <div className="notes__header">
      <div className="notes__saved">{showSaved && "自动已保存 ✅"}</div>

      <div className="notes__header-btns">
        <label htmlFor="file-import" className="notes__import notes__button">
          批量导入 ⬆️
        </label>
        <input
          id="file-import"
          type="file"
          accept=".csv,.xml"
          style={{ display: "none" }}
          onChange={onImportNote}
        />

        <button
          className="notes__export notes__button"
          type="button"
          onClick={onExportNote}
        >
          全部导出 ⬇️
        </button>

        <button
          className="notes__delete notes__button"
          type="button"
          onClick={onDeleteNote}
        >
          删除笔记 📒
        </button>
      </div>
    </div>
  );

  return (
    <div className="notes__preview">
      {notes.length > 0 ? (
        <>
          <NoteHeader />

          <article>
            <input
              className="notes__title"
              type="text"
              placeholder="创建标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="notes__body"
              placeholder="开始记录..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </article>
        </>
      ) : (
        <div className="notes__empty-area">
          <p>请添加新的笔记</p>
          <p>或</p>
          <label htmlFor="file-import" className="notes__import notes__button">
            批量导入 ⬆️
          </label>
          <input
            id="file-import"
            type="file"
            accept=".csv,.xml"
            style={{ display: "none" }}
            onChange={onImportNote}
          />
        </div>
      )}
    </div>
  );
};

export default EditPanel;
