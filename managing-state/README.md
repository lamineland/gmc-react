# My To-Do List — Managing State in React

A simple To-Do List application built with **React** (Create React App) that demonstrates
various aspects of **state management**: local state with `useState`, list state with
`useReducer`, derived state with `useMemo`, a custom hook for **persistence**, and one-way
data flow between components.

## Features

### Core requirements

- **Add tasks** — form with *Task name* and *Task description*, validated before anything is added.
- **View the list** — active and completed tasks are visually distinguished (strikethrough, muted colours, coloured border).
- **Edit tasks** — clicking a task (or the *Edit* button) opens the form pre-filled with the task details; *Save changes* updates it.
- **Delete tasks** — a confirmation prompt appears before a task is removed (cancel keeps the task).
- **Mark as completed** — checkbox toggles a task between active and completed.
- **Persistence** — tasks are saved to `localStorage` on every change and reloaded when the app starts.

### Optional extras (implemented)

- **Filtering** — All / Active / Completed, with live counters.
- **Sorting** — newest first, oldest first, due date, priority, or name (A–Z).
- **Due dates** — optional due date per task, with an *Overdue* badge for past dates.
- **Priority** — low / medium / high, shown as coloured badges and usable for sorting.

## Getting started

### Prerequisites

- Node.js (v16 or newer recommended) and npm.

### Install and run locally

```bash
npm install     # install the dependencies
npm start       # start the development server
```

Open [http://localhost:3000](http://localhost:3000) — the page reloads automatically when you edit the code.

### Run the tests

```bash
CI=true npm test -- --watchAll=false   # run the whole suite once
```

### Production build

```bash
npm run build   # optimised build in the `build` folder
```

## Project structure

```
src/
├── App.js                     # root component: wires all pieces together
├── App.css                    # app shell styles (header, layout, panel, footer)
├── index.js                   # React entry point
├── index.css                  # global styles + shared buttons/badges
├── App.test.js                # integration tests for the whole app
├── components/
│   ├── TaskForm.js / .css     # add & edit form, with inline validation
│   ├── TaskList.js / .css     # task list + empty-state messages
│   ├── TaskItem.js / .css     # single task: toggle, edit, delete actions
│   ├── TaskFilter.js / .css   # status filter + sorting controls
│   └── ConfirmDialog.js / .css# confirmation prompt shown before deleting
├── hooks/
│   └── useTasks.js            # task state + localStorage persistence
├── reducer/
│   ├── tasksReducer.js        # pure reducer (add / update / delete / toggle)
│   └── tasksReducer.test.js   # unit tests for the reducer
└── utils/
    ├── taskUtils.js           # create / filter / sort / format helpers
    ├── validation.js          # form validation rules
    └── storage.js             # defensive localStorage load/save layer
```

## How state is managed

| Concern | Tool | Where |
| --- | --- | --- |
| Task list (add/edit/delete/toggle) | `useReducer` + pure reducer | `reducer/tasksReducer.js`, `hooks/useTasks.js` |
| Persistence across sessions | `localStorage` + `useEffect` | `utils/storage.js`, `hooks/useTasks.js` |
| Form values & validation errors | `useState` | `components/TaskForm.js` |
| Editing / deleting / filter / sort | `useState` | `src/App.js` |
| Filtered + sorted list, counters | derived with `useMemo` | `src/App.js` |

Flow: a child component calls a callback prop (e.g. `onDelete`) → `App` / `useTasks` dispatch an
action → the reducer returns a new array → React re-renders → the `useEffect` in `useTasks`
writes the new list to `localStorage`.

## Validation rules

- **Task name** — required (trimmed), maximum 100 characters.
- **Task description** — required (trimmed), maximum 500 characters.
- **Due date / priority** — optional.

Errors are displayed inline under each field (`role="alert"`), invalid fields are outlined in
red, and an invalid form is never submitted.

## Persistence details

- Storage key: **`gmc-todo-tasks`** (`window.localStorage`).
- The list is loaded once on startup (lazy initialiser of `useReducer`) and saved on every change.
- Reads/writes are defensive: corrupted JSON or missing entries fall back to an empty list
  instead of crashing the app.

## Additional considerations

- `localStorage` is **per browser / per device** — tasks do not sync between machines, and
  clearing site data deletes them. Swap `utils/storage.js` for an API client to add a backend.
- Deleting always requires explicit confirmation (dialog with Escape / backdrop cancel support).
- Accessibility: labelled inputs, `aria-invalid` on errors, keyboard-accessible editing
  (Enter/Space on a task), `alertdialog` semantics for the confirmation prompt, and
  `prefers-reduced-motion` support.
- Sorting and filtering only touch a derived copy of the list — the stored state is never mutated.
