/**
 * Módulo de gestión de roles (Roles)
 * Maneja la funcionalidad CRUD para los roles del sistema
 */
class RoleModule {
    constructor() {
        this.initializeModule();
        this.bindEvents();
        this.loadData();
    }

    initializeModule() {
        // Inicialización de variables y configuración
        this.currentId = null;
        this.isEditMode = false;
        this.roles = this.loadFromLocalStorage();
        
        // Permisos disponibles en el sistema
        this.availablePermissions = [
            'company_read', 'company_write',
            'headquarters_read', 'headquarters_write',
            'persons_read', 'persons_write',
            'users_read', 'users_write',
            'roles_read', 'roles_write',
            'billing_read', 'billing_write',
            'payment_methods_read', 'payment_methods_write',
            'suppliers_read', 'suppliers_write'
        ];
    }

    bindEvents() {
        // Bind del formulario
        const form = document.getElementById('roleForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Validación en tiempo real
        this.setupRealTimeValidation();

        // Búsqueda en tabla
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterTable(e.target.value));
        }
    }

    setupRealTimeValidation() {
        // Validación de nombre único
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('blur', () => this.validateName());
            nameInput.addEventListener('input', (e) => {
                // Capitalizar primera letra
                e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
            });
        }
    }

    validateName() {
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) return;

        // Verificar que el nombre no exista
        const exists = this.roles.some(r => 
            r.name.toLowerCase() === name.toLowerCase() && r.id !== this.currentId
        );

        if (exists) {
            this.showFieldError(nameInput, 'Este nombre de rol ya existe');
            return false;
        } else {
            this.clearFieldError(nameInput);
            return true;
        }
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showMessage('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        const formData = this.getFormData();
        
        if (this.isEditMode && this.currentId) {
            this.updateRole(this.currentId, formData);
        } else {
            this.createRole(formData);
        }
    }

    validateForm() {
        let isValid = true;
        
        // Limpiar errores previos
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        
        // Validar campos requeridos
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            this.showFieldError(nameInput, 'El nombre del rol es requerido');
            isValid = false;
        }

        // Validaciones específicas
        if (!this.validateName()) isValid = false;

        return isValid;
    }

    getFormData() {
        // Obtener permisos seleccionados
        const selectedPermissions = Array.from(
            document.querySelectorAll('input[name="permissions"]:checked')
        ).map(input => input.value);

        return {
            name: document.getElementById('name').value.trim(),
            description: document.getElementById('description').value.trim() || null,
            permissions: selectedPermissions,
            is_active: document.getElementById('isActive').checked
        };
    }

    createRole(data) {
        const newId = this.getNextId();
        const role = {
            id: newId,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.roles.push(role);
        this.saveToLocalStorage();
        this.refreshTable();
        this.clearForm();
        this.showMessage('Rol creado exitosamente', 'success');
    }

    updateRole(id, data) {
        const index = this.roles.findIndex(r => r.id === id);
        if (index !== -1) {
            this.roles[index] = {
                ...this.roles[index],
                ...data,
                updated_at: new Date().toISOString()
            };
            
            this.saveToLocalStorage();
            this.refreshTable();
            this.clearForm();
            this.showMessage('Rol actualizado exitosamente', 'success');
        }
    }

    deleteRole(id) {
        const index = this.roles.findIndex(r => r.id === id);
        if (index !== -1) {
            this.roles.splice(index, 1);
            this.saveToLocalStorage();
            this.refreshTable();
            this.showMessage('Rol eliminado exitosamente', 'success');
        }
    }

    loadRole(id) {
        const role = this.roles.find(r => r.id === id);
        if (role) {
            this.populateForm(role);
            this.currentId = id;
            this.isEditMode = true;
            
            // Scroll al formulario
            document.querySelector('.form-container').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    populateForm(role) {
        document.getElementById('roleId').value = role.id;
        document.getElementById('name').value = role.name;
        document.getElementById('description').value = role.description || '';
        document.getElementById('isActive').checked = role.is_active;

        // Limpiar permisos actuales
        document.querySelectorAll('input[name="permissions"]').forEach(input => {
            input.checked = false;
        });

        // Marcar permisos del rol
        if (role.permissions) {
            role.permissions.forEach(permission => {
                const input = document.querySelector(`input[name="permissions"][value="${permission}"]`);
                if (input) {
                    input.checked = true;
                }
            });
        }
    }

    clearForm() {
        document.getElementById('roleForm').reset();
        document.getElementById('isActive').checked = true; // Default activo
        this.currentId = null;
        this.isEditMode = false;
        
        // Limpiar errores
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    refreshTable() {
        const tbody = document.querySelector('#rolesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.roles.forEach(role => {
            const row = this.createTableRow(role);
            tbody.appendChild(row);
        });
    }

    createTableRow(role) {
        const row = document.createElement('tr');
        
        // Contar permisos
        const permissionsCount = role.permissions ? role.permissions.length : 0;
        const permissionsText = permissionsCount === 1 ? '1 permiso' : `${permissionsCount} permisos`;
        
        row.innerHTML = `
            <td>${role.id}</td>
            <td>${role.name}</td>
            <td>${role.description || '-'}</td>
            <td><span class="permissions-count">${permissionsText}</span></td>
            <td>
                <span class="status-badge ${role.is_active ? 'active' : 'inactive'}">
                    ${role.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action edit" onclick="loadRole(${role.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" onclick="confirmDelete(${role.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#rolesTable tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    getNextId() {
        return this.roles.length > 0 
            ? Math.max(...this.roles.map(r => r.id)) + 1 
            : 1;
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('roles');
        return stored ? JSON.parse(stored) : this.getInitialData();
    }

    saveToLocalStorage() {
        localStorage.setItem('roles', JSON.stringify(this.roles));
    }

    getInitialData() {
        return [
            {
                id: 1,
                name: 'Super Administrador',
                description: 'Acceso completo a todo el sistema',
                permissions: this.availablePermissions.slice(), // Todos los permisos
                is_active: true,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 2,
                name: 'Administrador',
                description: 'Gestión de operaciones principales',
                permissions: [
                    'company_read', 'company_write',
                    'headquarters_read', 'headquarters_write',
                    'persons_read', 'persons_write',
                    'billing_read', 'billing_write'
                ],
                is_active: true,
                created_at: '2024-01-20T14:30:00Z',
                updated_at: '2024-01-20T14:30:00Z'
            },
            {
                id: 3,
                name: 'Supervisor',
                description: 'Supervisión de procesos y personal',
                permissions: [
                    'company_read',
                    'headquarters_read',
                    'persons_read', 'persons_write',
                    'billing_read',
                    'suppliers_read'
                ],
                is_active: true,
                created_at: '2024-01-22T09:15:00Z',
                updated_at: '2024-01-22T09:15:00Z'
            }
        ];
    }

    loadData() {
        this.refreshTable();
    }

    showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          'fa-info-circle'}"></i>
            ${message}
        `;

        // Insertar en el DOM
        const container = document.querySelector('.module-container');
        container.insertBefore(messageDiv, container.firstChild);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}

// Funciones globales para la interfaz
function newRole() {
    roleModule.clearForm();
    document.querySelector('.form-container').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function loadRole(id) {
    roleModule.loadRole(id);
}

function editRole() {
    if (roleModule.currentId) {
        roleModule.loadRole(roleModule.currentId);
    } else {
        roleModule.showMessage('Selecciona un rol para editar', 'error');
    }
}

function deleteRole() {
    if (roleModule.currentId) {
        confirmDelete(roleModule.currentId);
    } else {
        roleModule.showMessage('Selecciona un rol para eliminar', 'error');
    }
}

function confirmDelete(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este rol?')) {
        roleModule.deleteRole(id);
    }
}

function cancelForm() {
    roleModule.clearForm();
}

function selectAllPermissions() {
    document.querySelectorAll('input[name="permissions"]').forEach(input => {
        input.checked = true;
    });
}

function clearAllPermissions() {
    document.querySelectorAll('input[name="permissions"]').forEach(input => {
        input.checked = false;
    });
}

// Inicializar módulo cuando se carga la página
let roleModule;
document.addEventListener('DOMContentLoaded', () => {
    roleModule = new RoleModule();
});
