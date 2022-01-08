import { PushAction, Icon, CopyToClipboardAction, PasteAction } from "@raycast/api";
import React from "react";
import { Note } from "../utils/types";
import { NoteForm } from "./NoteForm";

export function NoteActions(props: { note: Note }) {
  const note = props.note;
  return (
    <React.Fragment>
      <PushAction
        title="Append to note"
        target={<NoteForm note={note} />}
        shortcut={{ modifiers: ["cmd"], key: "a" }}
        icon={Icon.Pencil}
      />

      <CopyToClipboardAction
        title="Copy note content"
        content={note.content}
        shortcut={{ modifiers: ["opt"], key: "c" }}
      />

      <PasteAction title="Paste note content" content={note.content} shortcut={{ modifiers: ["opt"], key: "v" }} />
    </React.Fragment>
  );
}
