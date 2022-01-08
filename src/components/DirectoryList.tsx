import { List, ActionPanel, PushAction } from "@raycast/api";
import { Directory } from "../utils/types";
import { NoteList } from "./NoteList";

export function DirectoryList(props: { directories: Directory[] }) {
  const directories = props.directories;

  return (
    <List searchBarPlaceholder="Search Directories...">
      {directories?.map((directory) => (
        <List.Item
          title={directory.name}
          key={directory.key}
          actions={
            <ActionPanel>
              <PushAction title="Select Directory" target={<NoteList directory={directory} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
