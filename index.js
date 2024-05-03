export default class TodoList {
    constructor(listId, inputId, buttonId) {
        this.list = document.getElementById(listId);
        this.input = document.getElementById(inputId);
        this.addButton = document.getElementById(buttonId);
        this.todos = [];
        this.init();
    }

    createTodoItem(text, index) {
        const item = document.createElement('li');
        item.className = 'todo-item';
        item.dataset.index = index;
        item.innerHTML = `
            <input type="checkbox" class="todo-checkbox" id="todo-${index}">
            <label for="todo-${index}" class="todo-text">${text}</label>
            <button class="delete-button">Delete</button>
        `;
        return item;
    }

    handleListClick({ target }) {
        const item = target.closest('.todo-item');
        if (!item) return;
        const index = item.dataset.index;

        if (target.matches('.todo-checkbox')) {
            this.todos = this.todos.map((todo, i) => i === index ? { ...todo, status: target.checked } : todo);
            item.classList.toggle('checked', target.checked);
        } else if (target.matches('.delete-button')) {
            this.list.removeChild(item);
            this.todos = this.todos.filter((_, i) => i !== index);
        }

        this.saveTodos();
    }

    addTodo() {
        const { value: text = '' } = this.input || {};
        const trimmedText = text.trim();
        if (trimmedText) {
            const todo = { text: trimmedText, status: false };
            this.todos.push(todo);
            const item = this.createTodoItem(trimmedText, this.todos.length - 1);
            this.list.appendChild(item);
            this.input.value = '';
        }

        this.saveTodos();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
            this.todos.forEach((todo, index) => {
                const item = this.createTodoItem(todo.text, index);
                if (todo.status) {
                    item.querySelector('.todo-checkbox').checked = true;
                    item.classList.add('checked');
                }
                this.list.appendChild(item);
            });
        }
    }

    init() {
        this.loadTodos();
        this.addButton.onclick = () => this.addTodo();
        this.list.onclick = (event) => this.handleListClick(event);
    }
}