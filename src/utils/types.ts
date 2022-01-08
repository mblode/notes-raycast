export interface File {
  filePath: string;
  modifiedTime: Date;
}

export interface Note {
  name: string;
  key: number;
  filePath: string;
  content: string;
  modifiedTime: Date;
}

export interface Directory {
  name: string;
  key: string;
}

export interface Preferences {
  notesDirectories: string;
  excludedFolders: string;
  removeYAML: boolean;
  removeLinks: boolean;
}

export interface FormValue {
  content: string;
}