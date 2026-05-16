// Состояние
let tasks = [];
let filter = 'all';

// Чистые функции
const createTask = (text) => ({ 
    id: Date.now(), 
    text: text.trim(), 
    completed: false 
});

const addTask = (tasks, task) => [...tasks, task];
const toggleTask = (tasks, id) => 
    tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
const deleteTask = (tasks, id) => 
    tasks.filter(t => t.id !== id);

const filterTasks = (tasks, filter) => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
};

// Рендер
const render = () => {
    const filtered = filterTasks(tasks, filter);
    const list = document.getElementById('taskList');
    
    if (filtered.length === 0) {
        list.innerHTML = '<li style="text-align:center;color:#999;">Нет задач</li>';
        return;
    }
    
    list.innerHTML = filtered.map(task => `
        <li>
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
            <button data-id="${task.id}" class="delete">Удалить</button>
        </li>
    `).join('');
};

// Экранирование HTML
const escapeHtml = (str) => {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
};

// Обновление состояния
const update = (newTasks) => {
    tasks = newTasks;
    render();
};

// Обработчики
document.getElementById('addBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    if (input.value.trim()) {
        update(addTask(tasks, createTask(input.value)));
        input.value = '';
    }
};

document.getElementById('taskList').onclick = (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.type === 'checkbox') {
        update(toggleTask(tasks, id));
    }
    if (e.target.classList.contains('delete')) {
        update(deleteTask(tasks, id));
    }
};

// Фильтры
document.getElementById('filterAll').onclick = () => {
    filter = 'all';
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('filterAll').classList.add('active');
    render();
};

document.getElementById('filterActive').onclick = () => {
    filter = 'active';
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('filterActive').classList.add('active');
    render();
};

document.getElementById('filterCompleted').onclick = () => {
    filter = 'completed';
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('filterCompleted').classList.add('active');
    render();
};

// Запуск
render();