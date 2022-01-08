import { getPreferenceValues } from "@raycast/api";
import fs from "fs";
import path from "path";
import { File, Note, Preferences } from "./types";

export function prefDirectories() {
  const pref: Preferences = getPreferenceValues();
  const directoryString = pref.notesDirectories;
  return directoryString
    .split(",")
    .map((directory) => ({ name: directory.trim(), key: directory.trim() }))
    .filter((directory) => !!directory);
}

export function getFiles(notesDirectories: string) {
  const exFolders = prefExcludedFolders();
  const files = getFilesHelp(notesDirectories.toString(), exFolders, []);

  // Sort by date modified
  files.sort(function (a, b) {
    return b.modifiedTime.getTime() - a.modifiedTime.getTime();
  });

  return files;
}

function prefExcludedFolders() {
  const pref: Preferences = getPreferenceValues();
  const foldersString = pref.excludedFolders;
  if (foldersString) {
    const folders = foldersString.split(",");
    for (let i = 0; i < folders.length; i++) {
      folders[i] = folders[i].trim();
    }
    return folders;
  } else {
    return [];
  }
}

const getFilesHelp = function (dirPath: string, exFolders: Array<string>, arrayOfFiles: File[]) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file: string) {
    const next = fs.statSync(dirPath + "/" + file);

    if (next.isDirectory()) {
      arrayOfFiles = getFilesHelp(dirPath + "/" + file, exFolders, arrayOfFiles);
    } else {
      if (
        ((file.endsWith(".md") && file !== ".md") || (file.endsWith(".txt") && file !== ".txt")) &&
        !dirPath.includes(".Trash") && !dirPath.includes("Cabinet") &&
        isValidFile(dirPath, exFolders)
      ) {
        arrayOfFiles.push({
          filePath: path.join(dirPath, "/", file),
          modifiedTime: next.mtime,
        });
      }
    }
  });

  return arrayOfFiles;
};

function isValidFile(file: string, exFolders: Array<string>) {
  for (const folder of exFolders) {
    if (file.includes(folder)) {
      return false;
    }
  }
  return true;
}

export function loadNotes(files: File[]) {
  const notes: Note[] = [];

  let key = 0;

  for (const file of files) {
    const comp = file.filePath.split("/");
    const fileName = comp.pop();
    let name = "default";

    if (fileName) {
      name = fileName.split(".").slice(0, -1).join(".");
    }

    const content = getNoteContent(file.filePath);

    const note = {
      key: ++key,
      name,
      content,
      filePath: file.filePath,
      modifiedTime: file.modifiedTime,
    };

    notes.push(note);
  }
  return notes;
}

function getNoteContent(filePath: string) {
  const pref: Preferences = getPreferenceValues();

  let content = fs.readFileSync(filePath, "utf8") as string;

  if (pref.removeYAML) {
    const yamlHeader = content.match(/---(.|\n)*?---/gm);

    if (yamlHeader) {
      content = content.replace(yamlHeader[0], "");
    }
  }

  if (pref.removeLinks) {
    content = content.replaceAll("[[", "");
    content = content.replaceAll("]]", "");
  }

  return content;
}

export function stripMarkdown(md: string) {
  let options: any = {};
  options.listUnicodeChar = options.hasOwnProperty('listUnicodeChar') ? options.listUnicodeChar : false;
  options.stripListLeaders = options.hasOwnProperty('stripListLeaders') ? options.stripListLeaders : true;
  options.gfm = options.hasOwnProperty('gfm') ? options.gfm : true;
  options.useImgAltText = options.hasOwnProperty('useImgAltText') ? options.useImgAltText : true;

  var output = md || '';

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '');

  try {
    if (options.stripListLeaders) {
      if (options.listUnicodeChar)
        output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, options.listUnicodeChar + ' $1');
      else
        output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, '$1');
    }
    if (options.gfm) {
      output = output
        // Header
        .replace(/\n={2,}/g, '\n')
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, '')
        // Strikethrough
        .replace(/~~/g, '')
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, '');
    }
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? '$1' : '')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, '$1$2$3')
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      .replace(/\n{2,}/g, '\n\n');
  } catch(e) {
    console.error(e);
    return md;
  }
  return output;
};