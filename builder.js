// Script Builder Manager
class ScriptBuilder {
    constructor() {
        this.options = [];
        this.nextId = 1;
        this.currentEditingOption = null;
        this.loadConfig();
        this.init();
    }

    init() {
        // Load default options if no config exists
        if (this.options.length === 0) {
            this.options = APP_CONFIG.DEFAULT_OPTIONS.map(opt => ({ ...opt }));
            this.nextId = Math.max(...this.options.map(o => o.id)) + 1;
        }

        this.setupEventListeners();
        this.renderOptions();
        this.updateOutput();
    }

    setupEventListeners() {
        // Save config button
        document.getElementById('save-config-btn').addEventListener('click', () => {
            this.saveConfig();
            showNotification('Config Saved', 'Your configuration has been saved locally', 'success');
        });

        // Load config button
        document.getElementById('load-config-btn').addEventListener('click', () => {
            this.loadConfig();
            this.renderOptions();
            this.updateOutput();
            showNotification('Config Loaded', 'Configuration loaded successfully', 'success');
        });

        // Clear config button
        document.getElementById('clear-config-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all options? This cannot be undone.')) {
                this.options = [];
                this.renderOptions();
                this.updateOutput();
                this.saveConfig();
                showNotification('Config Cleared', 'All options have been cleared', 'success');
            }
        });

        // Add option button
        document.getElementById('add-option-btn').addEventListener('click', () => {
            this.addNewOption();
        });

        // Modal handlers
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancel-code-btn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('save-code-btn').addEventListener('click', () => {
            this.saveCustomCode();
        });

        // Close modal on background click
        document.getElementById('code-modal').addEventListener('click', (e) => {
            if (e.target.id === 'code-modal') {
                this.closeModal();
            }
        });
    }

    addNewOption() {
        const name = prompt('Enter option name:');
        if (!name) return;

        const newOption = {
            id: this.nextId++,
            name: name,
            enabled: false,
            mode: 'Option 1',
            customCode: `-- ${name} code here`
        };

        this.options.push(newOption);
        this.renderOptions();
        this.updateOutput();
        this.saveConfig();
        showNotification('Option Added', `${name} has been added`, 'success');
    }

    renderOptions() {
        const grid = document.getElementById('options-grid');
        grid.innerHTML = '';

        this.options.forEach(option => {
            const card = this.createOptionCard(option);
            grid.appendChild(card);
        });
    }

    createOptionCard(option) {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.setAttribute('data-option-id', option.id);

        // Get dropdown options for this type
        const dropdownOptions = APP_CONFIG.DROPDOWN_OPTIONS[option.name] || APP_CONFIG.DROPDOWN_OPTIONS['Default'];

        card.innerHTML = `
            <div class="option-header">
                <span class="option-name">${option.name}</span>
                <div class="option-toggle ${option.enabled ? 'active' : ''}" data-option-id="${option.id}">
                    <div class="toggle-slider"></div>
                </div>
            </div>
            <div class="option-body">
                <label class="option-label">Mode Selection</label>
                <select class="option-dropdown" data-option-id="${option.id}">
                    ${dropdownOptions.map(opt => `
                        <option value="${opt}" ${opt === option.mode ? 'selected' : ''}>${opt}</option>
                    `).join('')}
                </select>
            </div>
            <div class="option-actions">
                <button class="action-btn edit-code-btn" data-option-id="${option.id}">📝 Edit Code</button>
                <button class="action-btn" data-option-id="${option.id}" data-action="add">➕ Add to Project</button>
                <button class="action-btn delete-btn" data-option-id="${option.id}">🗑️ Delete</button>
            </div>
        `;

        // Add event listeners
        const toggle = card.querySelector('.option-toggle');
        toggle.addEventListener('click', () => this.toggleOption(option.id));

        const dropdown = card.querySelector('.option-dropdown');
        dropdown.addEventListener('change', (e) => this.updateOptionMode(option.id, e.target.value));

        const editBtn = card.querySelector('.edit-code-btn');
        editBtn.addEventListener('click', () => this.openCodeEditor(option.id));

        const addBtn = card.querySelector('[data-action="add"]');
        addBtn.addEventListener('click', () => this.addToProject(option.id));

        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteOption(option.id));

        return card;
    }

    toggleOption(optionId) {
        const option = this.options.find(o => o.id === optionId);
        if (option) {
            option.enabled = !option.enabled;
            this.renderOptions();
            this.updateOutput();
            this.saveConfig();
        }
    }

    updateOptionMode(optionId, mode) {
        const option = this.options.find(o => o.id === optionId);
        if (option) {
            option.mode = mode;
            this.updateOutput();
            this.saveConfig();
            showNotification('Mode Updated', `${option.name} mode set to ${mode}`, 'success');
        }
    }

    openCodeEditor(optionId) {
        const option = this.options.find(o => o.id === optionId);
        if (option) {
            this.currentEditingOption = option;
            document.getElementById('modal-title').textContent = `Edit Code - ${option.name}`;
            document.getElementById('custom-code-input').value = option.customCode || '';
            document.getElementById('code-modal').classList.add('active');
        }
    }

    closeModal() {
        document.getElementById('code-modal').classList.remove('active');
        this.currentEditingOption = null;
    }

    saveCustomCode() {
        if (this.currentEditingOption) {
            const code = document.getElementById('custom-code-input').value;
            this.currentEditingOption.customCode = code;
            this.updateOutput();
            this.saveConfig();
            this.closeModal();
            showNotification('Code Saved', `Custom code for ${this.currentEditingOption.name} has been saved`, 'success');
        }
    }

    addToProject(optionId) {
        const option = this.options.find(o => o.id === optionId);
        if (option) {
            option.enabled = true;
            this.renderOptions();
            this.updateOutput();
            this.saveConfig();
            showNotification('Added to Project', `${option.name} has been added to your project`, 'success');
        }
    }

    deleteOption(optionId) {
        if (confirm('Are you sure you want to delete this option?')) {
            this.options = this.options.filter(o => o.id !== optionId);
            this.renderOptions();
            this.updateOutput();
            this.saveConfig();
            showNotification('Option Deleted', 'Option has been removed', 'success');
        }
    }

    saveConfig() {
        localStorage.setItem(APP_CONFIG.CONFIG_STORAGE_KEY, JSON.stringify(this.options));
    }

    loadConfig() {
        const saved = localStorage.getItem(APP_CONFIG.CONFIG_STORAGE_KEY);
        if (saved) {
            try {
                this.options = JSON.parse(saved);
                this.nextId = Math.max(...this.options.map(o => o.id), 0) + 1;
            } catch (error) {
                console.error('Failed to load config:', error);
                this.options = [];
            }
        }
    }

    updateOutput() {
        if (window.outputGenerator) {
            window.outputGenerator.generate(this.options);
        }
    }

    getOptions() {
        return this.options;
    }
}

// Initialize script builder when DOM is ready
let scriptBuilder = null;

document.addEventListener('DOMContentLoaded', () => {
    scriptBuilder = new ScriptBuilder();
    window.scriptBuilder = scriptBuilder;
});
