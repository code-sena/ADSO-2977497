/**
 * Módulo de gestión de personas (Persons)
 * Maneja la funcionalidad CRUD para las personas del sistema
 */
class PersonModule {
    constructor() {
        this.initializeModule();
        this.bindEvents();
        this.loadData();
    }

    initializeModule() {
        // Inicialización de variables y configuración
        this.currentId = null;
        this.isEditMode = false;
        this.persons = this.loadFromLocalStorage();
    }

    bindEvents() {
        // Bind del formulario
        const form = document.getElementById('personForm');
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
        // Validación de documento único
        const documentNumberInput = document.getElementById('documentNumber');
        if (documentNumberInput) {
            documentNumberInput.addEventListener('blur', () => this.validateDocument());
        }

        // Validación de email único
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
        }

        // Validación de teléfono
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => this.validatePhone());
        }

        // Formatear documento (solo números)
        documentNumberInput?.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9A-Za-z]/g, '');
        });

        // Formatear nombres (capitalizar)
        const nameFields = ['firstName', 'lastName'];
        nameFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', (e) => {
                    e.target.value = this.capitalizeWords(e.target.value);
                });
            }
        });
    }

    capitalizeWords(str) {
        return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }

    validateDocument() {
        const documentTypeInput = document.getElementById('documentType');
        const documentNumberInput = document.getElementById('documentNumber');
        const documentType = documentTypeInput.value;
        const documentNumber = documentNumberInput.value.trim();
        
        if (!documentType || !documentNumber) return;

        // Verificar que la combinación tipo + número no exista
        const exists = this.persons.some(p => 
            p.document_type === documentType && 
            p.document_number === documentNumber && 
            p.id !== this.currentId
        );

        if (exists) {
            this.showFieldError(documentNumberInput, 'Esta combinación de documento ya existe');
            return false;
        } else {
            this.clearFieldError(documentNumberInput);
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
        const exists = this.persons.some(p => 
            p.email === email && p.id !== this.currentId
        );

        if (exists) {
            this.showFieldError(emailInput, 'Este email ya está registrado');
            return false;
        } else {
            this.clearFieldError(emailInput);
            return true;
        }
    }

    validatePhone() {
        const phoneInput = document.getElementById('phone');
        const phone = phoneInput.value.trim();
        
        if (!phone) return;

        // Validar formato básico de teléfono
        const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
        
        if (!phoneRegex.test(phone) || phone.length < 7) {
            this.showFieldError(phoneInput, 'Formato de teléfono inválido');
            return false;
        } else {
            this.clearFieldError(phoneInput);
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
            this.updatePerson(this.currentId, formData);
        } else {
            this.createPerson(formData);
        }
    }

    validateForm() {
        let isValid = true;
        
        // Limpiar errores previos
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        
        // Validar campos requeridos
        const requiredFields = [
            { id: 'documentType', name: 'Tipo de documento' },
            { id: 'documentNumber', name: 'Número de documento' },
            { id: 'firstName', name: 'Nombres' },
            { id: 'lastName', name: 'Apellidos' },
            { id: 'email', name: 'Email' },
            { id: 'phone', name: 'Teléfono' }
        ];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input.value.trim()) {
                this.showFieldError(input, `${field.name} es requerido`);
                isValid = false;
            }
        });

        // Validaciones específicas
        if (!this.validateDocument()) isValid = false;
        if (!this.validateEmail()) isValid = false;
        if (!this.validatePhone()) isValid = false;

        return isValid;
    }

    getFormData() {
        return {
            document_type: document.getElementById('documentType').value,
            document_number: document.getElementById('documentNumber').value.trim(),
            first_name: document.getElementById('firstName').value.trim(),
            last_name: document.getElementById('lastName').value.trim(),
            birth_date: document.getElementById('birthDate').value || null,
            gender: document.getElementById('gender').value || null,
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            alternate_phone: document.getElementById('alternatePhone').value.trim() || null,
            emergency_contact: document.getElementById('emergencyContact').value.trim() || null,
            address: document.getElementById('address').value.trim() || null,
            city: document.getElementById('city').value.trim() || null,
            state: document.getElementById('state').value.trim() || null,
            country: document.getElementById('country').value.trim() || null,
            postal_code: document.getElementById('postalCode').value.trim() || null,
            is_active: document.getElementById('isActive').checked
        };
    }

    createPerson(data) {
        const newId = this.getNextId();
        const person = {
            id: newId,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.persons.push(person);
        this.saveToLocalStorage();
        this.refreshTable();
        this.clearForm();
        this.showMessage('Persona creada exitosamente', 'success');
    }

    updatePerson(id, data) {
        const index = this.persons.findIndex(p => p.id === id);
        if (index !== -1) {
            this.persons[index] = {
                ...this.persons[index],
                ...data,
                updated_at: new Date().toISOString()
            };
            
            this.saveToLocalStorage();
            this.refreshTable();
            this.clearForm();
            this.showMessage('Persona actualizada exitosamente', 'success');
        }
    }

    deletePerson(id) {
        const index = this.persons.findIndex(p => p.id === id);
        if (index !== -1) {
            this.persons.splice(index, 1);
            this.saveToLocalStorage();
            this.refreshTable();
            this.showMessage('Persona eliminada exitosamente', 'success');
        }
    }

    loadPerson(id) {
        const person = this.persons.find(p => p.id === id);
        if (person) {
            this.populateForm(person);
            this.currentId = id;
            this.isEditMode = true;
            
            // Scroll al formulario
            document.querySelector('.form-container').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    populateForm(person) {
        document.getElementById('personId').value = person.id;
        document.getElementById('documentType').value = person.document_type;
        document.getElementById('documentNumber').value = person.document_number;
        document.getElementById('firstName').value = person.first_name;
        document.getElementById('lastName').value = person.last_name;
        document.getElementById('birthDate').value = person.birth_date || '';
        document.getElementById('gender').value = person.gender || '';
        document.getElementById('email').value = person.email;
        document.getElementById('phone').value = person.phone;
        document.getElementById('alternatePhone').value = person.alternate_phone || '';
        document.getElementById('emergencyContact').value = person.emergency_contact || '';
        document.getElementById('address').value = person.address || '';
        document.getElementById('city').value = person.city || '';
        document.getElementById('state').value = person.state || '';
        document.getElementById('country').value = person.country || '';
        document.getElementById('postalCode').value = person.postal_code || '';
        document.getElementById('isActive').checked = person.is_active;
    }

    clearForm() {
        document.getElementById('personForm').reset();
        document.getElementById('isActive').checked = true; // Default activo
        this.currentId = null;
        this.isEditMode = false;
        
        // Limpiar errores
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    refreshTable() {
        const tbody = document.querySelector('#personsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.persons.forEach(person => {
            const row = this.createTableRow(person);
            tbody.appendChild(row);
        });
    }

    createTableRow(person) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${person.id}</td>
            <td>${person.document_type} ${person.document_number}</td>
            <td>${person.first_name}</td>
            <td>${person.last_name}</td>
            <td>${person.email}</td>
            <td>${person.phone}</td>
            <td>${person.city || '-'}</td>
            <td>
                <span class="status-badge ${person.is_active ? 'active' : 'inactive'}">
                    ${person.is_active ? 'Activa' : 'Inactiva'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action edit" onclick="loadPerson(${person.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" onclick="confirmDelete(${person.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#personsTable tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    getNextId() {
        return this.persons.length > 0 
            ? Math.max(...this.persons.map(p => p.id)) + 1 
            : 1;
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('persons');
        return stored ? JSON.parse(stored) : this.getInitialData();
    }

    saveToLocalStorage() {
        localStorage.setItem('persons', JSON.stringify(this.persons));
    }

    getInitialData() {
        return [
            {
                id: 1,
                document_type: 'CC',
                document_number: '12345678',
                first_name: 'Juan Carlos',
                last_name: 'Pérez García',
                birth_date: '1985-03-15',
                gender: 'M',
                email: 'juan.perez@email.com',
                phone: '+57 300 123-4567',
                alternate_phone: '+57 1 234-5678',
                emergency_contact: 'María Pérez - +57 300 987-6543',
                address: 'Calle 123 #45-67',
                city: 'Bogotá',
                state: 'Cundinamarca',
                country: 'Colombia',
                postal_code: '110111',
                is_active: true,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 2,
                document_type: 'CC',
                document_number: '87654321',
                first_name: 'María Elena',
                last_name: 'Rodríguez López',
                birth_date: '1990-07-22',
                gender: 'F',
                email: 'maria.rodriguez@email.com',
                phone: '+57 301 987-6543',
                alternate_phone: null,
                emergency_contact: 'Carlos Rodríguez - +57 301 456-7890',
                address: 'Carrera 45 #123-45',
                city: 'Medellín',
                state: 'Antioquia',
                country: 'Colombia',
                postal_code: '050001',
                is_active: true,
                created_at: '2024-01-20T14:30:00Z',
                updated_at: '2024-01-20T14:30:00Z'
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
function newPerson() {
    personModule.clearForm();
    document.querySelector('.form-container').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function loadPerson(id) {
    personModule.loadPerson(id);
}

function editPerson() {
    if (personModule.currentId) {
        personModule.loadPerson(personModule.currentId);
    } else {
        personModule.showMessage('Selecciona una persona para editar', 'error');
    }
}

function deletePerson() {
    if (personModule.currentId) {
        confirmDelete(personModule.currentId);
    } else {
        personModule.showMessage('Selecciona una persona para eliminar', 'error');
    }
}

function confirmDelete(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta persona?')) {
        personModule.deletePerson(id);
    }
}

function cancelForm() {
    personModule.clearForm();
}

// Inicializar módulo cuando se carga la página
let personModule;
document.addEventListener('DOMContentLoaded', () => {
    personModule = new PersonModule();
});
