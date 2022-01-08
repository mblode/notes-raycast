import { Detail, ActionPanel, OpenAction } from "@raycast/api";
import { Note } from "../utils/types";
import { NoteActions } from "./NoteActions";

export function NoteQuickLook(props: { note: Note }) {
  const note = props.note;

  return (
    <Detail
      navigationTitle={note.name}
      markdown={note.content}
      actions={
        <ActionPanel>
          <OpenAction
            title="Open in Code"
            icon={{ fileIcon: "/Applications/Visual Studio Code.app" }}
            target={note.filePath}
            application="Visual Studio Code"
            shortcut={{ modifiers: ["cmd"], key: "o" }}
          />

          <NoteActions note={note} />
        </ActionPanel>
      }
    />
  );
}
