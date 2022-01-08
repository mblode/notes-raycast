import { ActionPanel, PushAction, Icon, OpenAction, ShowInFinderAction, CopyToClipboardAction } from "@raycast/api";
import { Note } from "../utils/types";
import { NoteQuickLook } from "./NoteQuickLook";

export function OpenNoteActions(props: { note: Note }) {
  const note = props.note;

  return (
    <>
      <ActionPanel.Section>
        <PushAction title="Quick Look" target={<NoteQuickLook note={note} />} icon={Icon.Eye} />

        <OpenAction
          title="Open in Code"
          icon={{ fileIcon: "/Applications/Visual Studio Code.app" }}
          target={note.filePath}
          application="Visual Studio Code"
          shortcut={{ modifiers: ["cmd"], key: "o" }}
        />

        <ShowInFinderAction path={note.filePath} shortcut={{ modifiers: ["cmd"], key: "f" }} />
      </ActionPanel.Section>

      <ActionPanel.Section>
        <CopyToClipboardAction title="Copy Name" content={note.name} shortcut={{ modifiers: ["cmd"], key: "n" }} />

        <CopyToClipboardAction title="Copy Path" content={note.filePath} shortcut={{ modifiers: ["cmd"], key: "p" }} />
      </ActionPanel.Section>
    </>
  );
}
