interface Todo {
	text: string;
	status: boolean;
}

export default class TodoList {
	list: HTMLElement;
	input: HTMLInputElement;
	addButton: HTMLElement;
	todos: Todo[];

	constructor(listId: string, inputId: string, buttonId: string) {
		this.list = document.getElementById(listId)!;
		this.input = document.getElementById(inputId) as HTMLInputElement;
		this.addButton = document.getElementById(buttonId)!;
		this.todos = [];
		this.init();
	}

	createTodoItem(text: string, index: number): HTMLElement {
		const item = document.createElement("li");
		item.className = "todo-item";
		item.dataset.index = index.toString();
		item.innerHTML = `
        <input type="checkbox" class="todo-checkbox" id="todo-${index}">
        <label for="todo-${index}" class="todo-text">${text}</label>
        <button class="delete-button">Delete</button>
    `;
		return item;
	}

	handleListClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		const item = target.closest(".todo-item");
		if (!item) return;
		const index = Number((item as HTMLElement).dataset.index);
		if (target.matches(".todo-checkbox")) {
			this.todos = this.todos.map((todo, i) =>
				i === index
					? { ...todo, status: (target as HTMLInputElement).checked }
					: todo
			);
			item.classList.toggle("checked", (target as HTMLInputElement).checked);
		} else if (target.matches(".delete-button")) {
			this.list.removeChild(item);
			this.todos = this.todos.filter((_, i) => i !== index);
		}

		this.saveTodos();
	}

	addTodo(): void {
		const text = this.input.value.trim();
		if (text) {
			const todo: Todo = { text, status: false };
			this.todos.push(todo);
			const item = this.createTodoItem(text, this.todos.length - 1);
			this.list.appendChild(item);
			this.input.value = "";
		}

		this.saveTodos();
	}

	saveTodos(): void {
		localStorage.setItem("todos", JSON.stringify(this.todos));
	}

	loadTodos(): void {
		const savedTodos = localStorage.getItem("todos");
		if (savedTodos) {
			this.todos = JSON.parse(savedTodos);
			this.todos.forEach((todo, index) => {
				const item = this.createTodoItem(todo.text, index);
				if (todo.status) {
					(item.querySelector(".todo-checkbox") as HTMLInputElement).checked =
						true;
					item.classList.add("checked");
				}
				this.list.appendChild(item);
			});
		}
	}

	init(): void {
		this.loadTodos();
		this.addButton.onclick = () => this.addTodo();
		this.list.onclick = event => this.handleListClick(event);
	}
}
