import { useNavigation, showToast, ToastStyle, Form, ActionPanel, SubmitFormAction } from "@raycast/api";
import { Note, FormValue } from "../utils/types";
import fs from "fs";

export function NoteForm(props: { note: Note }) {
  const note = props.note;
  const { pop } = useNavigation();

  function addTextToNote(text: FormValue) {
    fs.appendFileSync(note.filePath, "\n\n" + text.content);
    showToast(ToastStyle.Success, "Added text to note");
    pop();
  }

  return (
    <Form
      navigationTitle={"Add text to: " + note.name}
      actions={
        <ActionPanel>
          <SubmitFormAction title="Submit" onSubmit={addTextToNote} />
        </ActionPanel>
      }
    >
      <Form.TextArea title={"Add text to:\n" + note.name} id="content" placeholder={"Text"} />
    </Form>
  );
}
