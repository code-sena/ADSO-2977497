/**
 * Módulo de gestión de sedes (Headquarters)
 * Maneja la funcionalidad CRUD para las sedes de las empresas
 */
class HeadquarterModule {
    constructor() {
        this.initializeModule();
        this.bindEvents();
        this.loadData();
    }

    initializeModule() {
        // Inicialización de variables y configuración
        this.currentId = null;
        this.isEditMode = false;
        this.headquarters = this.loadFromLocalStorage();
        
        // Configurar capitalización automática
        this.setupAutoCapitalization();
    }

    bindEvents() {
        // Bind del formulario
        const form = document.getElementById('headquarterForm');
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

    setupAutoCapitalization() {
        // Auto capitalización para código
        const codeInput = document.getElementById('code');
        if (codeInput) {
            codeInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }
    }

    setupRealTimeValidation() {
        // Validación de código único
        const codeInput = document.getElementById('code');
        if (codeInput) {
            codeInput.addEventListener('blur', () => this.validateCode());
        }

        // Validación de email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
        }

        // Validación de teléfono
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => this.validatePhone());
        }
    }

    validateCode() {
        const codeInput = document.getElementById('code');
        const code = codeInput.value.trim();
        
        if (!code) return;

        // Verificar que el código no exista (excepto en modo edición)
        const exists = this.headquarters.some(h => 
            h.code === code && h.id !== this.currentId
        );

        if (exists) {
            this.showFieldError(codeInput, 'Este código ya existe');
            return false;
        } else {
            this.clearFieldError(codeInput);
            return true;
        }
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        
        if (!email) {
            this.clearFieldError(emailInput);
            return true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showFieldError(emailInput, 'Formato de email inválido');
            return false;
        } else {
            this.clearFieldError(emailInput);
            return true;
        }
    }

    validatePhone() {
        const phoneInput = document.getElementById('phone');
        const phone = phoneInput.value.trim();
        
        if (!phone) {
            this.clearFieldError(phoneInput);
            return true;
        }

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
            this.updateHeadquarter(this.currentId, formData);
        } else {
            this.createHeadquarter(formData);
        }
    }

    validateForm() {
        let isValid = true;
        
        // Validar campos requeridos
        const requiredFields = [
            { id: 'companyId', name: 'Compañía' },
            { id: 'code', name: 'Código' },
            { id: 'name', name: 'Nombre' }
        ];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input.value.trim()) {
                this.showFieldError(input, `${field.name} es requerido`);
                isValid = false;
            }
        });

        // Validaciones específicas
        if (!this.validateCode()) isValid = false;
        if (!this.validateEmail()) isValid = false;
        if (!this.validatePhone()) isValid = false;

        return isValid;
    }

    getFormData() {
        return {
            company_id: document.getElementById('companyId').value,
            code: document.getElementById('code').value.trim(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            country: document.getElementById('country').value.trim(),
            postal_code: document.getElementById('postalCode').value.trim(),
            is_active: document.getElementById('isActive').checked
        };
    }

    createHeadquarter(data) {
        const newId = this.getNextId();
        const headquarters = {
            id: newId,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.headquarters.push(headquarters);
        this.saveToLocalStorage();
        this.refreshTable();
        this.clearForm();
        this.showMessage('Sede creada exitosamente', 'success');
    }

    updateHeadquarter(id, data) {
        const index = this.headquarters.findIndex(h => h.id === id);
        if (index !== -1) {
            this.headquarters[index] = {
                ...this.headquarters[index],
                ...data,
                updated_at: new Date().toISOString()
            };
            
            this.saveToLocalStorage();
            this.refreshTable();
            this.clearForm();
            this.showMessage('Sede actualizada exitosamente', 'success');
        }
    }

    deleteHeadquarter(id) {
        const index = this.headquarters.findIndex(h => h.id === id);
        if (index !== -1) {
            this.headquarters.splice(index, 1);
            this.saveToLocalStorage();
            this.refreshTable();
            this.showMessage('Sede eliminada exitosamente', 'success');
        }
    }

    loadHeadquarter(id) {
        const headquarters = this.headquarters.find(h => h.id === id);
        if (headquarters) {
            this.populateForm(headquarters);
            this.currentId = id;
            this.isEditMode = true;
            
            // Scroll al formulario
            document.querySelector('.form-container').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    populateForm(headquarters) {
        document.getElementById('headquarterId').value = headquarters.id;
        document.getElementById('companyId').value = headquarters.company_id;
        document.getElementById('code').value = headquarters.code;
        document.getElementById('name').value = headquarters.name;
        document.getElementById('email').value = headquarters.email || '';
        document.getElementById('phone').value = headquarters.phone || '';
        document.getElementById('address').value = headquarters.address || '';
        document.getElementById('city').value = headquarters.city || '';
        document.getElementById('state').value = headquarters.state || '';
        document.getElementById('country').value = headquarters.country || '';
        document.getElementById('postalCode').value = headquarters.postal_code || '';
        document.getElementById('isActive').checked = headquarters.is_active;
    }

    clearForm() {
        document.getElementById('headquarterForm').reset();
        document.getElementById('isActive').checked = true; // Default activo
        this.currentId = null;
        this.isEditMode = false;
        
        // Limpiar errores
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    refreshTable() {
        const tbody = document.querySelector('#headquartersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.headquarters.forEach(headquarters => {
            const row = this.createTableRow(headquarters);
            tbody.appendChild(row);
        });
    }

    createTableRow(headquarters) {
        const row = document.createElement('tr');
        
        // Obtener nombre de la compañía
        const companyName = this.getCompanyName(headquarters.company_id);
        
        row.innerHTML = `
            <td>${headquarters.id}</td>
            <td>${companyName}</td>
            <td>${headquarters.code}</td>
            <td>${headquarters.name}</td>
            <td>${headquarters.email || '-'}</td>
            <td>${headquarters.phone || '-'}</td>
            <td>${headquarters.city || '-'}</td>
            <td>
                <span class="status-badge ${headquarters.is_active ? 'active' : 'inactive'}">
                    ${headquarters.is_active ? 'Activa' : 'Inactiva'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action edit" onclick="loadHeadquarter(${headquarters.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" onclick="confirmDelete(${headquarters.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    getCompanyName(companyId) {
        const companies = {
            '1': 'PanyPan',
            '2': 'Harinas Centro',
            '3': 'Premium Ingredientes',
            '4': 'Empaque Logística',
            '5': 'TecnoPan'
        };
        return companies[companyId] || 'N/A';
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#headquartersTable tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    getNextId() {
        return this.headquarters.length > 0 
            ? Math.max(...this.headquarters.map(h => h.id)) + 1 
            : 1;
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('headquarters');
        return stored ? JSON.parse(stored) : this.getInitialData();
    }

    saveToLocalStorage() {
        localStorage.setItem('headquarters', JSON.stringify(this.headquarters));
    }

    getInitialData() {
        return [
            {
                id: 1,
                company_id: '1',
                code: 'SEDE001',
                name: 'Sede Principal Bogotá',
                email: 'principal@panypan.com',
                phone: '+57 1 234-5678',
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
                company_id: '1',
                code: 'SEDE002',
                name: 'Sucursal Norte',
                email: 'norte@panypan.com',
                phone: '+57 1 345-6789',
                address: 'Carrera 45 #123-45',
                city: 'Bogotá',
                state: 'Cundinamarca',
                country: 'Colombia',
                postal_code: '110121',
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
function newHeadquarter() {
    headquarterModule.clearForm();
    document.querySelector('.form-container').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function loadHeadquarter(id) {
    headquarterModule.loadHeadquarter(id);
}

function editHeadquarter() {
    if (headquarterModule.currentId) {
        headquarterModule.loadHeadquarter(headquarterModule.currentId);
    } else {
        headquarterModule.showMessage('Selecciona una sede para editar', 'error');
    }
}

function deleteHeadquarter() {
    if (headquarterModule.currentId) {
        confirmDelete(headquarterModule.currentId);
    } else {
        headquarterModule.showMessage('Selecciona una sede para eliminar', 'error');
    }
}

function confirmDelete(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta sede?')) {
        headquarterModule.deleteHeadquarter(id);
    }
}

function cancelForm() {
    headquarterModule.clearForm();
}

// Inicializar módulo cuando se carga la página
let headquarterModule;
document.addEventListener('DOMContentLoaded', () => {
    headquarterModule = new HeadquarterModule();
});
