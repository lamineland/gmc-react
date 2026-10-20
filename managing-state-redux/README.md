# My To-Do List — Managing State with Redux

A To-Do List application built with **React** (Create React App) that manages its **global
state with Redux**: one store, pure reducers, action creators, and the `react-redux` hooks
(`useSelector` / `useDispatch`).

## Features (checkpoint requirements)

- **Add a new todo** — the `Addtask` form dispatches `addTask(description)`.
- **Task attributes** — every task is exactly `{ id, description, isDone }`.
- **Mark as done / not done** — the checkbox in `Task` dispatches `toggleTask(id)`.
- **Filter the tasks by (done / not)** — the *All / Done / Not done* buttons dispatch
  `setFilter(...)`; `ListTask` renders only the matching tasks.
- **Edit a task** — the *Edit* button in `Task` opens an inline form; *Save* dispatches
  `editTask(id, description)`, *Cancel* discards the changes.

## Project structure

```
src/
├── index.js                   # React entry point: <Provider store={store}>
├── App.js                     # root component: composes Addtask, filter bar, ListTask
├── App.css                    # app shell styles (header, layout, panel, filter bar)
├── index.css                  # global styles + shared buttons / form fields
├── App.test.js                # integration tests (add, done, edit, filter)
├── redux/
│   ├── actions.js             # action types + action creators
│   ├── reducer.js             # pure reducers (tasks + filter) combined with combineReducers
│   ├── reducer.test.js        # unit tests for the reducers
│   └── store.js               # createStore(rootReducer) — the single store
├── components/
│   ├── Addtask.js / .css      # form that adds a new task
│   ├── ListTask.js / .css     # filtered task list read from the store
│   └── Task.js / .css         # one task: toggle done + inline edit
└── utils/
    └── taskUtils.js           # pure helpers: FILTERS, generateId, filterTasks, countTasks
```

## How Redux manages the state

The whole global state lives in the single store created in `src/redux/store.js`:

```js
{
  tasks:  [ { id: '...', description: 'Learn Redux', isDone: false }, ... ],
  filter: 'all' | 'done' | 'not'
}
```

| Concern | Redux piece | Where |
| --- | --- | --- |
| Add a task | `addTask(description)` → `tasks/add` | `redux/actions.js` |
| Edit a task | `editTask(id, description)` → `tasks/edit` | `redux/actions.js` |
| Mark done / not done | `toggleTask(id)` → `tasks/toggle` | `redux/actions.js` |
| Filter by done / not | `setFilter(filter)` → `filter/set` | `redux/actions.js` |
| Next state | pure `tasksReducer` / `filterReducer` | `redux/reducer.js` |
| Read state in components | `useSelector` | `App.js`, `ListTask.js` |
| Change state in components | `useDispatch` | `Addtask.js`, `Task.js`, `App.js` |

Flow — state always moves in one direction:

```
component → dispatch(action) → reducer → store → useSelector → UI
```

Reducers are pure: they never mutate the previous state, they always return a new array,
which makes every transition predictable and easy to unit-test.

## Getting started

### Prerequisites

- Node.js (v16 or newer recommended) and npm.

### Install and run locally

```bash
npm install     # install the dependencies (redux + react-redux included)
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

## Validation rules

- **Description** — required (a blank string is not a task), maximum 200 characters.
- The *Add task* / *Save* buttons stay disabled while the description is empty or blank.

## Additional considerations

- Each task gets a unique `id` from `generateId()` (`crypto.randomUUID()` with a fallback).
- Filtering only touches a **derived copy** of the list (`filterTasks`) — the stored state is
  never mutated.
- Accessibility: labelled inputs, keyboard-operable buttons and checkboxes, `aria-pressed`
  on the active filter, and `prefers-reduced-motion` support.
- Possible extensions: delete a task (`tasks/delete` action), persist the store in
  `localStorage` with `store.subscribe`, or sort the list.
