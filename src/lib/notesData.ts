
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
  folder: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
}

export const initialFolders: Folder[] = [
  { id: "all", name: "All Notes", icon: "book-open" },
  { id: "personal", name: "Personal", icon: "book" },
  { id: "work", name: "Work", icon: "file-text" },
  { id: "archived", name: "Archived", icon: "archive" },
];

export const initialNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to NotesApp",
    content: "This is your personal notes management application. You can create, edit, and organize your notes here. Click on a note to view or edit it.",
    tags: ["welcome", "tutorial"],
    color: "note-purple",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folder: "personal",
  },
  {
    id: "2",
    title: "Meeting Notes - Project Kickoff",
    content: "Discussed project timeline and deliverables. Action items:\n- Set up development environment\n- Complete wireframes\n- Schedule follow-up meeting",
    tags: ["meeting", "project"],
    color: "note-green",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    folder: "work",
  },
  {
    id: "3",
    title: "Shopping List",
    content: "- Milk\n- Bread\n- Eggs\n- Vegetables\n- Fruit",
    tags: ["shopping", "personal"],
    color: "note-yellow",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    folder: "personal",
  },
  {
    id: "4",
    title: "Book Recommendations",
    content: "1. Atomic Habits\n2. Deep Work\n3. The Psychology of Money\n4. Thinking, Fast and Slow",
    tags: ["books", "reading"],
    color: "note-orange",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    folder: "personal",
  },
  {
    id: "5",
    title: "Weekly Goals",
    content: "- Complete project proposal\n- Exercise 3 times\n- Read 2 chapters\n- Call family",
    tags: ["goals", "planning"],
    color: "note-pink",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
    folder: "personal",
  },
  {
    id: "6",
    title: "API Documentation Notes",
    content: "Endpoint: /api/users\nMethod: GET\nParameters:\n- page (optional)\n- limit (optional)\nReturns: List of users with pagination metadata",
    tags: ["development", "api"],
    color: "note-blue",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
    folder: "work",
  },
];

export const notesColorOptions = [
  { name: "Purple", value: "note-purple" },
  { name: "Light Purple", value: "note-lightPurple" },
  { name: "Green", value: "note-green" },
  { name: "Yellow", value: "note-yellow" },
  { name: "Orange", value: "note-orange" },
  { name: "Pink", value: "note-pink" },
  { name: "Blue", value: "note-blue" },
];
