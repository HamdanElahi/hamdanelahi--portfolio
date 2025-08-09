// Modern To-Do List Application - JavaScript
// Full-featured task management with local storage

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.sortOrder = 'newest';
        this.taskIdCounter = 1;
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
        this.updateStats();
        this.showWelcomeMessage();
    }
    
    setupEventListeners() {
        // Task input
        const taskInput = document.getElementById('taskInput');
        const addTaskBtn = document.getElementById('addTaskBtn');
        
        addTaskBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
        
        // Sort button
        const sortBtn = document.getElementById('sortBtn');
        sortBtn.addEventListener('click', () => this.toggleSort());
        
        // Clear all button
        const clearAllBtn = document.getElementById('clearAllBtn');
        clearAllBtn.addEventListener('click', () => this.clearAllTasks());
        
        // Export/Import buttons
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const fileInput = document.getElementById('fileInput');
        
        exportBtn.addEventListener('click', () => this.exportTasks());
        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.importTasks(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const prioritySelect = document.getElementById('prioritySelect');
        const taskText = taskInput.value.trim();
        
        if (!taskText) {
            this.showToast('Please enter a task', 'warning');
            taskInput.focus();
            return;
        }
        
        if (taskText.length > 100) {
            this.showToast('Task is too long (max 100 characters)', 'error');
            return;
        }
        
        const task = {
            id: this.taskIdCounter++,
            text: taskText,
            completed: false,
            priority: prioritySelect.value,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        this.tasks.unshift(task);
        this.saveToStorage();
        this.render();
        this.updateStats();
        
        // Clear input and reset priority
        taskInput.value = '';
        prioritySelect.value = 'medium';
        taskInput.focus();
        
        this.showToast('Task added successfully!', 'success');
        this.animateTaskAdd();
    }
    
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        const task = this.tasks[taskIndex];
        
        // Animate task removal
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                this.tasks.splice(taskIndex, 1);
                this.saveToStorage();
                this.render();
                this.updateStats();
                this.showToast('Task deleted', 'success');
            }, 300);
        }
    }
    
    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) return;
        
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        
        this.saveToStorage();
        this.render();
        this.updateStats();
        
        const message = task.completed ? 'Task completed! 🎉' : 'Task marked as pending';
        this.showToast(message, 'success');
    }
    
    editTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) return;
        
        const newText = prompt('Edit task:', task.text);
        if (newText === null) return; // User cancelled
        
        const trimmedText = newText.trim();
        if (!trimmedText) {
            this.showToast('Task cannot be empty', 'error');
            return;
        }
        
        if (trimmedText.length > 100) {
            this.showToast('Task is too long (max 100 characters)', 'error');
            return;
        }
        
        task.text = trimmedText;
        this.saveToStorage();
        this.render();
        this.showToast('Task updated successfully!', 'success');
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }
    
    toggleSort() {
        this.sortOrder = this.sortOrder === 'newest' ? 'oldest' : 
                        this.sortOrder === 'oldest' ? 'priority' : 
                        this.sortOrder === 'priority' ? 'alphabetical' : 'newest';
        
        const sortBtn = document.getElementById('sortBtn');
        const sortLabels = {
            newest: 'Sort: Newest',
            oldest: 'Sort: Oldest',
            priority: 'Sort: Priority',
            alphabetical: 'Sort: A-Z'
        };
        
        sortBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 18H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${sortLabels[this.sortOrder]}
        `;
        
        this.render();
    }
    
    clearAllTasks() {
        if (this.tasks.length === 0) {
            this.showToast('No tasks to clear', 'warning');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete all ${this.tasks.length} tasks? This action cannot be undone.`);
        if (!confirmed) return;
        
        this.tasks = [];
        this.saveToStorage();
        this.render();
        this.updateStats();
        this.showToast('All tasks cleared', 'success');
    }
    
    getFilteredTasks() {
        let filteredTasks = [...this.tasks];
        
        // Apply filter
        switch (this.currentFilter) {
            case 'pending':
                filteredTasks = filteredTasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            // 'all' shows all tasks
        }
        
        // Apply sort
        switch (this.sortOrder) {
            case 'oldest':
                filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'alphabetical':
                filteredTasks.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
                break;
            case 'newest':
            default:
                filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
        
        return filteredTasks;
    }
    
    render() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '';
            emptyState.classList.remove('hidden');
            
            // Update empty state message based on filter
            const emptyMessages = {
                all: 'No tasks yet',
                pending: 'No pending tasks',
                completed: 'No completed tasks'
            };
            
            const emptyDescriptions = {
                all: 'Add your first task to get started with your productivity journey!',
                pending: 'Great job! All your tasks are completed.',
                completed: 'Complete some tasks to see them here.'
            };
            
            emptyState.querySelector('h3').textContent = emptyMessages[this.currentFilter];
            emptyState.querySelector('p').textContent = emptyDescriptions[this.currentFilter];
        } else {
            emptyState.classList.add('hidden');
            tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
            
            // Add event listeners to task elements
            this.attachTaskEventListeners();
        }
    }
    
    createTaskHTML(task) {
        const createdDate = new Date(task.createdAt);
        const timeAgo = this.getTimeAgo(createdDate);
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="todoApp.toggleTask(${task.id})"></div>
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                        <span class="task-time">${timeAgo}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit" onclick="todoApp.editTask(${task.id})" title="Edit task">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="task-action-btn delete" onclick="todoApp.deleteTask(${task.id})" title="Delete task">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    attachTaskEventListeners() {
        // Event listeners are handled via onclick attributes in the HTML
        // This method can be used for additional event listeners if needed
    }
    
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        
        // Animate stats update
        this.animateStats();
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            stat.style.transform = 'scale(1.1)';
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    animateTaskAdd() {
        const firstTask = document.querySelector('.task-item');
        if (firstTask) {
            firstTask.style.animation = 'slideIn 0.3s ease-out';
        }
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('todoApp_tasks', JSON.stringify(this.tasks));
            localStorage.setItem('todoApp_taskIdCounter', this.taskIdCounter.toString());
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            this.showToast('Failed to save tasks', 'error');
        }
    }
    
    loadFromStorage() {
        try {
            const savedTasks = localStorage.getItem('todoApp_tasks');
            const savedCounter = localStorage.getItem('todoApp_taskIdCounter');
            
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }
            
            if (savedCounter) {
                this.taskIdCounter = parseInt(savedCounter, 10);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            this.showToast('Failed to load saved tasks', 'error');
        }
    }
    
    exportTasks() {
        if (this.tasks.length === 0) {
            this.showToast('No tasks to export', 'warning');
            return;
        }
        
        const exportData = {
            tasks: this.tasks,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showToast('Tasks exported successfully!', 'success');
    }
    
    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (!importData.tasks || !Array.isArray(importData.tasks)) {
                    throw new Error('Invalid file format');
                }
                
                const confirmed = confirm(`Import ${importData.tasks.length} tasks? This will replace your current tasks.`);
                if (!confirmed) return;
                
                this.tasks = importData.tasks;
                this.taskIdCounter = Math.max(...this.tasks.map(t => t.id), 0) + 1;
                
                this.saveToStorage();
                this.render();
                this.updateStats();
                this.showToast('Tasks imported successfully!', 'success');
                
            } catch (error) {
                console.error('Import error:', error);
                this.showToast('Failed to import tasks. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }
    
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + Enter: Add task
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            this.addTask();
        }
        
        // Ctrl/Cmd + A: Focus on input
        if ((event.ctrlKey || event.metaKey) && event.key === 'a' && event.target.tagName !== 'INPUT') {
            event.preventDefault();
            document.getElementById('taskInput').focus();
        }
        
        // Escape: Clear input
        if (event.key === 'Escape') {
            const taskInput = document.getElementById('taskInput');
            if (taskInput === document.activeElement) {
                taskInput.value = '';
                taskInput.blur();
            }
        }
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    showWelcomeMessage() {
        if (this.tasks.length === 0) {
            setTimeout(() => {
                this.showToast('Welcome to TaskFlow! Add your first task to get started.', 'success');
            }, 1000);
        }
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
    console.log('TaskFlow To-Do App initialized successfully!');
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added later for offline functionality
    });
}

