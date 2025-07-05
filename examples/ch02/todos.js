// const todos = ['Walk the dog', 'Water the plants', 'Sand the chairs'];

import {
  defineComponent,
  hFragment,
  h,
} from '../../packages/runtime/src/index.js';

// const addTodoInput = document.getElementById('todo-input');
// const addTodoButton = document.getElementById('add-todo-btn');
// const todosList = document.getElementById('todos-list');

// for (let todo of todos) {
//   todosList.append(renderTodoInReadMode(todo));
// }

// addTodoInput.addEventListener('input', () => {
//   addTodoButton.disabled = addTodoInput.value.length < 3;
// });

// addTodoInput.addEventListener('keydown', ({ key }) => {
//   if (key === 'Enter' && addTodoInput.value.length >= 3) {
//     addTodo();
//   }
// });

// addTodoButton.addEventListener('click', () => {
//   addTodo();
// });

// function renderTodoInReadMode(todo) {
//   const li = document.createElement('li');
//   const span = document.createElement('span');
//   span.textContent = todo;
//   span.addEventListener('dblclick', () => {
//     const idx = todos.indexOf(todo);

//     todosList.replaceChild(
//       renderTodoInEditMode(todo),
//       todosList.childNodes[idx]
//     );
//   });
//   li.append(span);

//   const button = document.createElement('button');
//   button.textContent = 'Done';
//   button.addEventListener('click', () => {
//     const idx = todos.indexOf(todo);
//     removeTodo(idx);
//   });
//   li.append(button);
//   return li;
// }

// function renderTodoInEditMode(todo) {
//   const li = document.createElement('li');

//   const input = document.createElement('input');
//   input.type = 'text';
//   input.value = todo;
//   li.append(input);
//   const saveBtn = document.createElement('button');
//   saveBtn.textContent = 'Save';
//   saveBtn.addEventListener('click', () => {
//     const idx = todos.indexOf(todo);
//     updateTodo(idx, input.value);
//   });
//   li.append(saveBtn);
//   const cancelBtn = document.createElement('button');
//   cancelBtn.textContent = 'Cancel';
//   cancelBtn.addEventListener('click', () => {
//     const idx = todos.indexOf(todo);
//     todosList.replaceChild(
//       renderTodoInReadMode(todo),
//       todosList.childNodes[idx]
//     );
//   });
//   li.append(cancelBtn);

//   return li;
// }

// function updateTodo(index, description) {
//   todos[index] = description;
//   const todo = renderTodoInReadMode(description);
//   todosList.replaceChild(todo, todosList.childNodes[index]);
// }

// function addTodo() {
//   const description = addTodoInput.value;
//   todos.push(description);
//   const todo = renderTodoInReadMode(description);
//   todosList.append(todo);
//   addTodoInput.value = '';
//   addTodoButton.disabled = true;
// }

// function removeTodo() {
//   todos.splice(index, 1);
//   todosList.childNodes[index].remove();
// }

// import { createApp, h, hFragment } from '../../packages/runtime/src/index';

// const state = {
//   currentTodo: '',
//   edit: {
//     idx: null,
//     original: null,
//     edited: null,
//   },
//   todos: ['Walk the dog', 'Water the plants'],
// };

// const reducers = {
//   'update-current-todo': (state, currentTodo) => ({
//
//     ...state,
//     currentTodo, // --2--
//   }),

//   'add-todo': (state) => ({
//     ...state,
//     currentTodo: '', // --3--
//     todos: [...state.todos, state.currentTodo], // --4--
//   }),

//   'start-editing-todo': (state, idx) => ({
//     // --5--
//     ...state,
//     edit: {
//       idx,
//       original: state.todos[idx], // --6--
//       edited: state.todos[idx], // --7--
//     },
//   }),

//   'edit-todo': (state, edited) => ({
//     // --8--
//     ...state,
//     edit: { ...state.edit, edited }, // --9--
//   }),

//   'save-edited-todo': (state) => {
//     const todos = [...state.todos]; // --10--
//     todos[state.edit.idx] = state.edit.edited; // --11--

//     return {
//       ...state,
//       edit: { idx: null, original: null, edited: null }, // --12--
//       todos,
//     };
//   },

//   'cancel-editing-todo': (state) => ({
//     ...state,
//     edit: { idx: null, original: null, edited: null }, // --13--
//   }),

//   'remove-todo': (state, idx) => ({
//     // --14--
//     ...state,
//     todos: state.todos.filter((_, i) => i !== idx), // --15--
//   }),
// };

//? global vdom
// function CreateTodo({ currentTodo }, emit) {
//   return h('div', {}, [
//     h('label', { for: 'todo-input' }, ['New TODO']),
//     h('input', {
//       type: 'text',
//       id: 'todo-input',
//       value: currentTodo,
//       on: {
//         input: ({ target }) => emit('update-current-todo', target.value),
//         keydown: ({ key }) => {
//           if (key === 'Enter' && currentTodo.length >= 3) {
//             emit('add-todo');
//           }
//         },
//       },
//     }),
//     h(
//       'button',
//       {
//         disabled: currentTodo.length < 3,
//         on: { click: () => emit('add-todo') },
//       },
//       ['Add']
//     ),
//   ]);
// }

// function TodoList({ todos, edit }, emit) {
//   return h(
//     'ul',
//     {},
//     todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
//   );
// }
// function TodoItem({ todo, i, edit }, emit) {
//   const isEditing = edit.idx === i;

//   return isEditing
//     ? h('li', {}, [
//         h('input', {
//           value: edit.edited,
//           on: {
//             input: ({ target }) => emit('edit-todo', target.value),
//           },
//         }),
//         h(
//           'button',
//           {
//             on: {
//               click: () => emit('save-edited-todo'),
//             },
//           },
//           ['Save']
//         ),
//         h(
//           'button',
//           {
//             on: {
//               click: () => emit('cancel-editing-todo'),
//             },
//           },
//           ['Cancel']
//         ),
//       ])
//     : h('li', {}, [
//         h(
//           'span',
//           {
//             on: {
//               dblclick: () => emit('start-editing-todo', i),
//             },
//           },
//           [todo]
//         ),
//         h(
//           'button',
//           {
//             on: {
//               click: () => emit('remove-todo', i),
//             },
//           },
//           ['Done']
//         ),
//       ]);
// }

// function App(state, emit) {
//   return hFragment([
//     h('h1', {}, ['My TODOs']),
//     CreateTodo(state, emit),
//     TodoList(state, emit),
//   ]);
// }

// createApp({ state, reducers, view: App }).mount(document.body);

//? stateful components

// const component = defineComponent({
//   state() {
//     return { count: 0 };
//   },

//   render() {
//     return hFragment([
//       h('h1', {}, ['Important news!']),
//       h('p', {}, ['I made myself coffee.']),
//       h('p', {}, [`Count: ${this.state.count}`]),

//       h(
//         'button',
//         {
//           on: {
//             click: () => {
//               this.updateState({ count: this.state.count + 1 });
//             },
//           },
//         },
//         ['Say congrats']
//       ),
//     ]);
//   },
// });

const SearchField = defineComponent({
  render() {
    return h('input', {
      on: {
        input: (event) => this.emit('search', event.target.value),
      },
    });
  },
});

const ParentComponent = defineComponent({
  state() {
    return { count: 0 };
  },

  render() {
    return hFragment([
      h('p', {}, [`Clicked ${this.state.count} times`]),
      h(SearchField, {
        search: () => {
          this.updateState({ count: this.state.count + 1 });
        },
      }),
    ]);
  },
});

const app = new ParentComponent();
app.mount(document.body);
