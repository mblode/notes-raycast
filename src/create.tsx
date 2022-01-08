import { ActionPanel, Form, SubmitFormAction, useNavigation, showToast, ToastStyle } from "@raycast/api";
import fs from "fs";
import open from "open";
import { DirectoryList } from "./components/DirectoryList";
import { Directory, FormValue } from "./utils/types";
import { prefDirectories, stripMarkdown } from "./utils/utils";

function CreateNoteForm(props: { directory: Directory }) {
  const directory = props.directory;
  const { pop } = useNavigation();

  function addTextToNote(text: FormValue) {
    const fileName = stripMarkdown(text.content.split("\n")[0]);
    const filePath = `${directory.name}/${fileName}.md`;
    fs.writeFileSync(filePath, text.content);
    open(filePath, { app: { name: "/Applications/Visual Studio Code.app" } });
    showToast(ToastStyle.Success, `Created note: ${fileName}`);
    pop();
  }

  return (
    <Form
      navigationTitle={"Create Note"}
      actions={
        <ActionPanel>
          <SubmitFormAction title="Submit" onSubmit={addTextToNote} />
        </ActionPanel>
      }
    >
      <Form.TextArea title={"Content:\n"} id="content" placeholder={"Write your note here..."} />
    </Form>
  );
}

export default function Command() {
  const directories = prefDirectories();

  if (directories.length > 1) {
    return <DirectoryList directories={directories} />;
  } else if (directories.length == 1) {
    return <CreateNoteForm directory={directories[0]} />;
  } else {
    showToast(ToastStyle.Failure, "Path Error", "Something went wrong with your directory path.");
  }
}
