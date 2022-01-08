import { showToast, ToastStyle } from "@raycast/api";
import { prefDirectories } from "./utils/utils";
import { DirectoryList } from "./components/DirectoryList";
import { NoteList } from "./components/NoteList";

export default function Command() {
  const directories = prefDirectories();

  if (directories.length > 1) {
    return <DirectoryList directories={directories} />;
  } else if (directories.length == 1) {
    return <NoteList directory={directories[0]} />;
  } else {
    showToast(ToastStyle.Failure, "Path Error", "Something went wrong with your directory path.");
  }
}
