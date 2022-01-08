import { showToast, ToastStyle, List, ActionPanel } from "@raycast/api";
import { useState, useEffect } from "react";
import { Directory, Note } from "../utils/types";

import fs from "fs";
import { getFiles, loadNotes } from "../utils/utils";
import { NoteActions } from "./NoteActions";
import { OpenNoteActions } from "./OpenNoteActions";

export function NoteList(props: { directory: Directory }) {
  const directory = props.directory;
  const [notes, setNotes] = useState<Note[]>();

  useEffect(() => {
    async function fetch() {
      try {
        await fs.promises.access(directory.name);
        const files = getFiles(directory.name);
        const _notes = loadNotes(files);
        setNotes(_notes);
      } catch (error) {
        console.error(error);
        showToast(ToastStyle.Failure, "The path set in preferences does not exist.");
      }
    }
    fetch();
  }, []);

  return (
    <List searchBarPlaceholder="Search Notes..." isLoading={notes === undefined}>
      {notes?.map((note) => (
        <List.Item
          title={note.name}
          subtitle={note.content}
          accessoryTitle={note.modifiedTime.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          key={note.key}
          actions={
            <ActionPanel>
              <OpenNoteActions note={note} />
              <NoteActions note={note} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
