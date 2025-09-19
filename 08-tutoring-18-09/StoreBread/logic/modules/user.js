/**
 * Módulo de gestión de usuarios (Users)
 * Maneja la funcionalidad CRUD para los usuarios del sistema
 */
class UserModule {
    constructor() {
        this.initializeModule();
        this.bindEvents();
        this.loadData();
    }

    initializeModule() {
        // Inicialización de variables y configuración
        this.currentId = null;
        this.isEditMode = false;
        this.users = this.loadFromLocalStorage();
    }

    bindEvents() {
        // Bind del formulario
        const form = document.getElementById('userForm');
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
        // Validación de username único
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => this.validateUsername());
            usernameInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '');
            });
        }

        // Validación de email único
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
        }

        // Validación de contraseña
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword());
        }

        // Validación de confirmación de contraseña
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', () => this.validatePasswordConfirmation());
        }
    }

    validateUsername() {
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        
        if (!username) return;

        // Verificar longitud mínima
        if (username.length < 3) {
            this.showFieldError(usernameInput, 'El username debe tener al menos 3 caracteres');
            return false;
        }

        // Verificar que el username no exista
        const exists = this.users.some(u => 
            u.username === username && u.id !== this.currentId
        );

        if (exists) {
            this.showFieldError(usernameInput, 'Este nombre de usuario ya existe');
            return false;
        } else {
            this.clearFieldError(usernameInput);
            return true;
        }
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        
        if (!email) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showFieldError(emailInput, 'Formato de email inválido');
            return false;
        }

        // Verificar que el email no exista
        const exists = this.users.some(u => 
            u.email === email && u.id !== this.currentId
        );

        if (exists) {
            this.showFieldError(emailInput, 'Este email ya está registrado');
            return false;
        } else {
            this.clearFieldError(emailInput);
            return true;
        }
    }

    validatePassword() {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;
        
        if (!password && !this.isEditMode) {
            this.showFieldError(passwordInput, 'La contraseña es requerida');
            return false;
        }

        if (password && password.length < 8) {
            this.showFieldError(passwordInput, 'La contraseña debe tener al menos 8 caracteres');
            return false;
        }

        // Validar complejidad
        if (password) {
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            
            if (!hasUpper || !hasLower || !hasNumber) {
                this.showFieldError(passwordInput, 'La contraseña debe incluir mayúsculas, minúsculas y números');
                return false;
            }
        }

        this.clearFieldError(passwordInput);
        return true;
    }

    validatePasswordConfirmation() {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password !== confirmPassword) {
            this.showFieldError(confirmPasswordInput, 'Las contraseñas no coinciden');
            return false;
        } else {
            this.clearFieldError(confirmPasswordInput);
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
            this.updateUser(this.currentId, formData);
        } else {
            this.createUser(formData);
        }
    }

    validateForm() {
        let isValid = true;
        
        // Limpiar errores previos
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        
        // Validar campos requeridos
        const requiredFields = [
            { id: 'personId', name: 'Persona' },
            { id: 'roleId', name: 'Rol' },
            { id: 'username', name: 'Nombre de usuario' },
            { id: 'email', name: 'Email' }
        ];

        // Si no es modo edición, la contraseña es requerida
        if (!this.isEditMode) {
            requiredFields.push({ id: 'password', name: 'Contraseña' });
            requiredFields.push({ id: 'confirmPassword', name: 'Confirmación de contraseña' });
        }
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input.value.trim()) {
                this.showFieldError(input, `${field.name} es requerido`);
                isValid = false;
            }
        });

        // Validaciones específicas
        if (!this.validateUsername()) isValid = false;
        if (!this.validateEmail()) isValid = false;
        if (!this.validatePassword()) isValid = false;
        if (!this.validatePasswordConfirmation()) isValid = false;

        return isValid;
    }

    getFormData() {
        const data = {
            person_id: document.getElementById('personId').value,
            role_id: document.getElementById('roleId').value,
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            last_login: document.getElementById('lastLogin').value || null,
            login_attempts: parseInt(document.getElementById('loginAttempts').value) || 0,
            must_change_password: document.getElementById('mustChangePassword').checked,
            is_locked: document.getElementById('isLocked').checked,
            is_active: document.getElementById('isActive').checked
        };

        // Solo incluir contraseña si se proporcionó
        const password = document.getElementById('password').value;
        if (password) {
            data.password_hash = this.hashPassword(password);
        }

        return data;
    }

    hashPassword(password) {
        // En un entorno real, esto sería un hash seguro como bcrypt
        // Para este ejemplo, usamos un hash simple
        return btoa(password);
    }

    createUser(data) {
        const newId = this.getNextId();
        const user = {
            id: newId,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.users.push(user);
        this.saveToLocalStorage();
        this.refreshTable();
        this.clearForm();
        this.showMessage('Usuario creado exitosamente', 'success');
    }

    updateUser(id, data) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            // Si no se proporciona nueva contraseña, mantener la actual
            if (!data.password_hash) {
                delete data.password_hash;
            }
            
            this.users[index] = {
                ...this.users[index],
                ...data,
                updated_at: new Date().toISOString()
            };
            
            this.saveToLocalStorage();
            this.refreshTable();
            this.clearForm();
            this.showMessage('Usuario actualizado exitosamente', 'success');
        }
    }

    deleteUser(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveToLocalStorage();
            this.refreshTable();
            this.showMessage('Usuario eliminado exitosamente', 'success');
        }
    }

    loadUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.populateForm(user);
            this.currentId = id;
            this.isEditMode = true;
            
            // Scroll al formulario
            document.querySelector('.form-container').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    populateForm(user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('personId').value = user.person_id;
        document.getElementById('roleId').value = user.role_id;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('lastLogin').value = user.last_login || '';
        document.getElementById('loginAttempts').value = user.login_attempts || 0;
        document.getElementById('mustChangePassword').checked = user.must_change_password || false;
        document.getElementById('isLocked').checked = user.is_locked || false;
        document.getElementById('isActive').checked = user.is_active;

        // Limpiar campos de contraseña en modo edición
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    clearForm() {
        document.getElementById('userForm').reset();
        document.getElementById('isActive').checked = true; // Default activo
        document.getElementById('loginAttempts').value = 0;
        this.currentId = null;
        this.isEditMode = false;
        
        // Limpiar errores
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    refreshTable() {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = this.createTableRow(user);
            tbody.appendChild(row);
        });
    }

    createTableRow(user) {
        const row = document.createElement('tr');
        
        // Obtener nombres de persona y rol
        const personName = this.getPersonName(user.person_id);
        const roleName = this.getRoleName(user.role_id);
        
        // Formatear último acceso
        const lastLogin = user.last_login ? 
            new Date(user.last_login).toLocaleString() : 
            'Nunca';
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${personName}</td>
            <td>${roleName}</td>
            <td>${user.email}</td>
            <td>${lastLogin}</td>
            <td>
                <span class="status-badge ${user.is_active ? 'active' : 'inactive'}">
                    ${user.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action edit" onclick="loadUser(${user.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" onclick="confirmDelete(${user.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    getPersonName(personId) {
        const persons = {
            '1': 'Juan Carlos Pérez',
            '2': 'María Elena Rodríguez',
            '3': 'Carlos Alberto Sánchez',
            '4': 'Ana Patricia González',
            '5': 'Luis Fernando Martínez',
            '6': 'Carmen Rosa Jiménez',
            '7': 'Roberto Antonio Díaz',
            '8': 'Patricia Lucía Torres',
            '9': 'Jorge Enrique Moreno',
            '10': 'Claudia Esperanza Ruiz'
        };
        return persons[personId] || 'N/A';
    }

    getRoleName(roleId) {
        const roles = {
            '1': 'Super Administrador',
            '2': 'Administrador',
            '3': 'Supervisor',
            '4': 'Vendedor',
            '5': 'Cajero',
            '6': 'Contador',
            '7': 'Jefe de Producción',
            '8': 'Operario',
            '9': 'Auxiliar Contable',
            '10': 'Cliente Premium'
        };
        return roles[roleId] || 'N/A';
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#usersTable tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    resetUserPassword(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            // Generar contraseña temporal
            const tempPassword = this.generateTempPassword();
            
            // Actualizar usuario
            const index = this.users.findIndex(u => u.id === id);
            this.users[index] = {
                ...this.users[index],
                password_hash: this.hashPassword(tempPassword),
                must_change_password: true,
                updated_at: new Date().toISOString()
            };
            
            this.saveToLocalStorage();
            this.showMessage(`Contraseña reseteada. Nueva contraseña temporal: ${tempPassword}`, 'success');
        }
    }

    generateTempPassword() {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    getNextId() {
        return this.users.length > 0 
            ? Math.max(...this.users.map(u => u.id)) + 1 
            : 1;
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : this.getInitialData();
    }

    saveToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    getInitialData() {
        return [
            {
                id: 1,
                person_id: '1',
                role_id: '1',
                username: 'admin',
                email: 'admin@panypan.com',
                password_hash: btoa('Admin123'),
                last_login: '2024-01-25T14:30:00Z',
                login_attempts: 0,
                must_change_password: false,
                is_locked: false,
                is_active: true,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-25T14:30:00Z'
            },
            {
                id: 2,
                person_id: '2',
                role_id: '2',
                username: 'maria.rodriguez',
                email: 'maria.rodriguez@panypan.com',
                password_hash: btoa('Maria123'),
                last_login: '2024-01-25T10:15:00Z',
                login_attempts: 0,
                must_change_password: false,
                is_locked: false,
                is_active: true,
                created_at: '2024-01-20T14:30:00Z',
                updated_at: '2024-01-25T10:15:00Z'
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
function newUser() {
    userModule.clearForm();
    document.querySelector('.form-container').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function loadUser(id) {
    userModule.loadUser(id);
}

function editUser() {
    if (userModule.currentId) {
        userModule.loadUser(userModule.currentId);
    } else {
        userModule.showMessage('Selecciona un usuario para editar', 'error');
    }
}

function deleteUser() {
    if (userModule.currentId) {
        confirmDelete(userModule.currentId);
    } else {
        userModule.showMessage('Selecciona un usuario para eliminar', 'error');
    }
}

function confirmDelete(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        userModule.deleteUser(id);
    }
}

function cancelForm() {
    userModule.clearForm();
}

function resetPassword() {
    if (userModule.currentId) {
        if (confirm('¿Estás seguro de que deseas resetear la contraseña de este usuario?')) {
            userModule.resetUserPassword(userModule.currentId);
        }
    } else {
        userModule.showMessage('Selecciona un usuario para resetear la contraseña', 'error');
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const eyeIcon = document.getElementById(fieldId + 'Eye');
    
    if (field.type === 'password') {
        field.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

// Inicializar módulo cuando se carga la página
let userModule;
document.addEventListener('DOMContentLoaded', () => {
    userModule = new UserModule();
});
