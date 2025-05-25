// Users data stays the same
const users = [
    { id: 1, username: 'john_doe', displayName: 'John Doe', avatar: 'placeholder-avatar.png' },
    { id: 2, username: 'jane_smith', displayName: 'Jane Smith', avatar: 'placeholder-avatar.png' },
    { id: 3, username: 'bob_brown', displayName: 'Bob Brown', avatar: 'placeholder-avatar.png' },
    { id: 4, username: 'alice_johnson', displayName: 'Alice Johnson', avatar: 'placeholder-avatar.png' },
    { id: 5, username: 'charlie_davis', displayName: 'Charlie Davis', avatar: 'placeholder-avatar.png' }
];

// Current user starts as before
let currentUser = users[0];

// DOM elements
const todoList = document.querySelector('.todo-list');
const addTodoBtn = document.getElementById('add-todo-btn');
const exportBtn = document.getElementById('export-btn');
const userSwitcherBtn = document.querySelector('.user-switcher-btn');
const userDropdownItems = document.querySelectorAll('.user-dropdown-item');
const currentUsername = document.querySelector('.current-username');
const usernameDisplay = document.querySelector('.username');

const API_BASE = 'http://localhost:5000/api/todos/';

/**
 * Switch current user
 */
function switchUser(username) {
    const user = users.find(u => u.username === username);
    if (user) {
        currentUser = user;
        updateUIForCurrentUser();
        loadTodosForCurrentUser();
    }
}

/**
 * Update UI for current user
 */
function updateUIForCurrentUser() {
    currentUsername.textContent = currentUser.displayName;
    usernameDisplay.textContent = currentUser.displayName;
    document.querySelector('.avatar').src = currentUser.avatar;
    console.log(`Switched to user: ${currentUser.displayName}`);
}

/**
 * Load todos for current user from backend API
 */
async function loadTodosForCurrentUser() {
    try {
        const res = await fetch(`${API_BASE}?user=${currentUser.username}`);;
        if (!res.ok) throw new Error(`Error loading todos: ${res.statusText}`);
        const todos = await res.json();
        const userTodos = todos.filter(todo =>
            (todo.users || []).includes(`@${currentUser.username}`)
        );
        renderTodos(userTodos);
    } catch (err) {
        console.error(err);
        todoList.innerHTML = '<div class="no-todos">Failed to load todos.</div>';
    }
}
/**
 * Render todos in the UI
 */
function renderTodos(todosToRender) {
    todoList.innerHTML = '';
    if (!todosToRender.length) {
        todoList.innerHTML = '<div class="no-todos">No todos found. Add a new one!</div>';
        return;
    }

    todosToRender.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.dataset.id = todo.id;

        todoItem.innerHTML = `
            <div class="todo-checkbox">
                <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}>
                <label for="todo-${todo.id}"></label>
            </div>
            <div class="todo-content">
                <h3 class="todo-title">${todo.title}</h3>
                <div class="todo-meta">
                    <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                    <div class="todo-tags">
                        ${(todo.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                   <div class="todo-users">
                ${(todo.assignedUsers || []).map(username => {
               const matchedUser = users.find(u => u.username === username);
           return `<span class="user-tag">${matchedUser ? matchedUser.displayName : username}</span>`;
           }).join('')}
             </div>
                </div>
            </div>
            <div class="todo-actions">
                <button class="todo-note-btn" title="Add note">
                    <i class="fas fa-sticky-note"></i>
                </button>
                <button class="todo-edit-btn" title="Edit todo">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo-delete-btn" title="Delete todo">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Event listeners for actions
        todoItem.querySelector('.todo-content').addEventListener('click', () => showTodoDetails(todo.id));
        todoItem.querySelector('.todo-note-btn').addEventListener('click', e => {
            e.stopPropagation();
            showNoteModal(todo.id);
        });
        todoItem.querySelector('.todo-edit-btn').addEventListener('click', e => {
            e.stopPropagation();
            showEditTodoModal(todo.id);
        });
        todoItem.querySelector('.todo-delete-btn').addEventListener('click', e => {
            e.stopPropagation();
            confirmDeleteTodo(todo.id);
        });

        // Checkbox to toggle completed
        todoItem.querySelector('input[type="checkbox"]').addEventListener('change', async (e) => {
            const completed = e.target.checked;
            await updateTodo(todo.id, { completed });
        });

        todoList.appendChild(todoItem);
    });
}

/**
 * Add a new todo via API
 */
async function addTodo(todoData) {
    try {
        // Add current user to assignedUsers
        const payload = {
            ...todoData,
            assignedUsers: [currentUser.username],
            completed: false,
            priority: todoData.priority || 'medium'
        };
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to add todo: ${res.statusText}`);
        await loadTodosForCurrentUser();
    } catch (err) {
        console.error(err);
        alert('Error adding todo.');
    }
}


/**
 * Update an existing todo via API
 */
async function updateTodo(id, todoData) {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData),
        });
        if (!res.ok) throw new Error(`Failed to update todo: ${res.statusText}`);
        await loadTodosForCurrentUser();
    } catch (err) {
        console.error(err);
        alert('Error updating todo.');
    }
}

/**
 * Delete a todo via API
 */
async function deleteTodo(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`Failed to delete todo: ${res.statusText}`);
        await loadTodosForCurrentUser();
    } catch (err) {
        console.error(err);
        alert('Error deleting todo.');
    }
}

/**
 * Add a note to a todo via API
 */
async function addNote(todoId, noteContent) {
    try {
        const payload = { content: noteContent };
        const res = await fetch(`${API_BASE}/${todoId}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to add note: ${res.statusText}`);
        await loadTodosForCurrentUser();
    } catch (err) {
        console.error(err);
        alert('Error adding note.');
    }
}

/**
 * Show todo details (simple alert for now)
 */
function showTodoDetails(todoId) {
    alert(`Loading details for todo ID: ${todoId}\n(You can implement a modal here)`);
}

/**
 * Show note modal (simple alert for now)
 */
function showNoteModal(todoId) {
    const noteContent = prompt('Enter note content:');
    if (noteContent) {
        addNote(todoId, noteContent);
    }
}

/**
 * Show edit todo modal (simple prompt for now)
 */
async function showEditTodoModal(todoId) {
    // Fetch current todo details to pre-fill
    try {
        const res = await fetch(`${API_BASE}/${todoId}`);
        if (!res.ok) throw new Error('Failed to fetch todo for editing');
        const todo = await res.json();

        const newTitle = prompt('Edit todo title:', todo.title);
        const newPriority = prompt('Edit priority (low, medium, high):', todo.priority);

        if (newTitle !== null && newPriority !== null) {
            await updateTodo(todoId, { title: newTitle, priority: newPriority });
        }
    } catch (err) {
        console.error(err);
        alert('Error loading todo for edit.');
    }
}

/**
 * Confirm and delete todo
 */
function confirmDeleteTodo(todoId) {
    const confirmed = confirm('Are you sure you want to delete this todo?');
    if (confirmed) {
        deleteTodo(todoId);
    }
}

/**
 * Event listeners for user switcher buttons
 */
userDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const username = e.target.dataset.username;
        switchUser(username);
    });
});

/**
 * Event listener for Add Todo button
 * For demo: prompt for title only
 */
addTodoBtn.addEventListener('click', () => {
    const title = prompt('Enter todo title:');
    if (title && title.trim()) {
        addTodo({ title: title.trim() });
    }
});

/**
 * Export button (dummy, you can implement real export)
 */
exportBtn.addEventListener('click', () => {
    alert('Export feature not implemented yet.');
});

/**
 * Initial setup
 */
updateUIForCurrentUser();
loadTodosForCurrentUser();
