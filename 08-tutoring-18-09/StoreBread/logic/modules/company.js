// ================================================
// PanyPan Company Module - JavaScript
// Gestión de compañías con formularios y DataTable
// ================================================

/**
 * Clase para manejar el módulo de compañías
 */
class CompanyModule {
    constructor() {
        this.currentCompany = null;
        this.isEditing = false;
        this.companies = this.getMockData();
        
        this.initializeEventListeners();
        this.initializeForm();
    }

    /**
     * Inicializa los event listeners
     */
    initializeEventListeners() {
        // Formulario principal
        const form = document.getElementById('companyForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Búsqueda en tiempo real
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Validación en tiempo real de NIT
        const taxIdInput = document.getElementById('taxId');
        if (taxIdInput) {
            taxIdInput.addEventListener('input', (e) => this.validateTaxId(e.target.value));
        }

        // Validación de email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => this.validateEmail(e.target.value));
        }
    }

    /**
     * Inicializa el formulario
     */
    initializeForm() {
        this.clearForm();
        this.setFormMode('create');
    }

    /**
     * Datos mock para el DataTable
     */
    getMockData() {
        return [
            {
                id: 1,
                legal_name: "Panadería PanyPan S.A.S",
                trade_name: "PanyPan",
                tax_id: "900123456-7",
                email: "info@panypan.com",
                phone: "+57 1 234-5678",
                address: "Calle 123 #45-67",
                city: "Bogotá",
                state: "Cundinamarca",
                country: "Colombia",
                postal_code: "110111",
                is_active: true
            },
            {
                id: 2,
                legal_name: "Distribuidora de Harinas del Centro S.A.",
                trade_name: "Harinas Centro",
                tax_id: "800987654-3",
                email: "ventas@harinascentro.co",
                phone: "+57 1 987-6543",
                address: "Carrera 45 #78-90",
                city: "Medellín",
                state: "Antioquia",
                country: "Colombia",
                postal_code: "050001",
                is_active: true
            }
            // Más datos según sea necesario...
        ];
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.showLoading();

        try {
            const formData = this.getFormData();
            
            if (this.isEditing) {
                await this.updateCompany(formData);
                this.showMessage('Compañía actualizada exitosamente', 'success');
            } else {
                await this.createCompany(formData);
                this.showMessage('Compañía creada exitosamente', 'success');
            }

            this.clearForm();
            this.setFormMode('create');
            this.refreshTable();

        } catch (error) {
            console.error('Error al procesar compañía:', error);
            this.showMessage('Error al procesar la compañía', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Obtiene los datos del formulario
     */
    getFormData() {
        return {
            id: document.getElementById('companyId').value || null,
            legal_name: document.getElementById('legalName').value.trim(),
            trade_name: document.getElementById('tradeName').value.trim() || null,
            tax_id: document.getElementById('taxId').value.trim(),
            email: document.getElementById('email').value.trim() || null,
            phone: document.getElementById('phone').value.trim() || null,
            address: document.getElementById('address').value.trim() || null,
            city: document.getElementById('city').value.trim() || null,
            state: document.getElementById('state').value.trim() || null,
            country: document.getElementById('country').value.trim() || null,
            postal_code: document.getElementById('postalCode').value.trim() || null,
            is_active: document.getElementById('isActive').checked
        };
    }

    /**
     * Valida el formulario
     */
    validateForm() {
        let isValid = true;
        const errors = [];

        // Validar campos requeridos
        const legalName = document.getElementById('legalName').value.trim();
        if (!legalName) {
            errors.push('La razón social es requerida');
            this.markFieldError('legalName');
            isValid = false;
        } else {
            this.markFieldSuccess('legalName');
        }

        const taxId = document.getElementById('taxId').value.trim();
        if (!taxId) {
            errors.push('El NIT/RUT es requerido');
            this.markFieldError('taxId');
            isValid = false;
        } else if (!this.isValidTaxId(taxId)) {
            errors.push('Formato de NIT/RUT inválido (ej: 123456789-0)');
            this.markFieldError('taxId');
            isValid = false;
        } else {
            this.markFieldSuccess('taxId');
        }

        // Validar email si se proporciona
        const email = document.getElementById('email').value.trim();
        if (email && !this.isValidEmail(email)) {
            errors.push('Formato de email inválido');
            this.markFieldError('email');
            isValid = false;
        } else if (email) {
            this.markFieldSuccess('email');
        }

        if (!isValid) {
            this.showMessage(errors.join(', '), 'error');
        }

        return isValid;
    }

    /**
     * Valida formato de NIT/RUT
     */
    isValidTaxId(taxId) {
        const taxIdPattern = /^\d+-\d$/;
        return taxIdPattern.test(taxId);
    }

    /**
     * Valida formato de email
     */
    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    /**
     * Valida NIT en tiempo real
     */
    validateTaxId(value) {
        const field = document.getElementById('taxId');
        if (value && !this.isValidTaxId(value)) {
            this.markFieldError('taxId');
            this.showFieldHint('taxId', 'Formato: 123456789-0');
        } else if (value) {
            this.markFieldSuccess('taxId');
            this.hideFieldHint('taxId');
        } else {
            this.clearFieldValidation('taxId');
        }
    }

    /**
     * Valida email en tiempo real
     */
    validateEmail(value) {
        if (value && !this.isValidEmail(value)) {
            this.markFieldError('email');
            this.showFieldHint('email', 'Formato de email inválido');
        } else if (value) {
            this.markFieldSuccess('email');
            this.hideFieldHint('email');
        } else {
            this.clearFieldValidation('email');
        }
    }

    /**
     * Marca un campo como error
     */
    markFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = 'var(--form-error)';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }
    }

    /**
     * Marca un campo como exitoso
     */
    markFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = 'var(--form-success)';
            field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    }

    /**
     * Limpia validación de campo
     */
    clearFieldValidation(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }
    }

    /**
     * Muestra hint en campo
     */
    showFieldHint(fieldId, message) {
        // Implementar si se necesita mostrar hints dinámicos
    }

    /**
     * Oculta hint de campo
     */
    hideFieldHint(fieldId) {
        // Implementar si se necesita ocultar hints dinámicos
    }

    /**
     * Simula creación de compañía
     */
    async createCompany(data) {
        // Simular delay de API
        await this.delay(1000);
        
        // Simular ID generado
        data.id = Math.max(...this.companies.map(c => c.id), 0) + 1;
        
        // Agregar a datos mock
        this.companies.push(data);
        
        console.log('Compañía creada:', data);
    }

    /**
     * Simula actualización de compañía
     */
    async updateCompany(data) {
        // Simular delay de API
        await this.delay(1000);
        
        // Encontrar y actualizar en datos mock
        const index = this.companies.findIndex(c => c.id == data.id);
        if (index !== -1) {
            this.companies[index] = { ...this.companies[index], ...data };
        }
        
        console.log('Compañía actualizada:', data);
    }

    /**
     * Carga una compañía en el formulario
     */
    loadCompany(id) {
        const company = this.companies.find(c => c.id == id);
        if (!company) {
            this.showMessage('Compañía no encontrada', 'error');
            return;
        }

        // Llenar formulario
        document.getElementById('companyId').value = company.id;
        document.getElementById('legalName').value = company.legal_name || '';
        document.getElementById('tradeName').value = company.trade_name || '';
        document.getElementById('taxId').value = company.tax_id || '';
        document.getElementById('email').value = company.email || '';
        document.getElementById('phone').value = company.phone || '';
        document.getElementById('address').value = company.address || '';
        document.getElementById('city').value = company.city || '';
        document.getElementById('state').value = company.state || '';
        document.getElementById('country').value = company.country || '';
        document.getElementById('postalCode').value = company.postal_code || '';
        document.getElementById('isActive').checked = company.is_active || false;

        this.currentCompany = company;
        this.setFormMode('edit');
        
        // Scroll al formulario
        document.querySelector('.form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    /**
     * Establece el modo del formulario
     */
    setFormMode(mode) {
        this.isEditing = mode === 'edit';
        
        const submitBtn = document.querySelector('.btn-primary');
        if (submitBtn) {
            if (this.isEditing) {
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Compañía';
            } else {
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Compañía';
            }
        }
    }

    /**
     * Limpia el formulario
     */
    clearForm() {
        const form = document.getElementById('companyForm');
        if (form) {
            form.reset();
            
            // Limpiar validaciones visuales
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                this.clearFieldValidation(field.id);
            });
        }
        
        this.currentCompany = null;
        this.setFormMode('create');
    }

    /**
     * Maneja la búsqueda en la tabla
     */
    handleSearch(query) {
        // Implementar filtrado de tabla en tiempo real
        console.log('Buscando:', query);
        // Por ahora solo log, en producción filtrar la tabla
    }

    /**
     * Confirma eliminación de compañía
     */
    confirmDelete(id) {
        const company = this.companies.find(c => c.id == id);
        if (!company) return;

        if (confirm(`¿Estás seguro de eliminar la compañía "${company.legal_name}"?`)) {
            this.deleteCompany(id);
        }
    }

    /**
     * Elimina una compañía
     */
    async deleteCompany(id) {
        try {
            this.showLoading();
            
            // Simular delay de API
            await this.delay(800);
            
            // Remover de datos mock
            this.companies = this.companies.filter(c => c.id != id);
            
            this.showMessage('Compañía eliminada exitosamente', 'success');
            this.refreshTable();
            
        } catch (error) {
            console.error('Error al eliminar compañía:', error);
            this.showMessage('Error al eliminar la compañía', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Actualiza la tabla (placeholder)
     */
    refreshTable() {
        // En producción, recargar datos de la tabla
        console.log('Actualizando tabla...');
    }

    /**
     * Muestra loading en botones
     */
    showLoading() {
        const submitBtn = document.querySelector('.btn-primary');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        }
    }

    /**
     * Oculta loading
     */
    hideLoading() {
        const submitBtn = document.querySelector('.btn-primary');
        if (submitBtn) {
            submitBtn.disabled = false;
            this.setFormMode(this.isEditing ? 'edit' : 'create');
        }
    }

    /**
     * Muestra mensaje al usuario
     */
    showMessage(message, type = 'info') {
        // Remover mensaje anterior
        const existingMessage = document.querySelector('.module-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `module-message module-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${this.getMessageIcon(type)}"></i>
                <span>${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Insertar en el contenedor
        const container = document.querySelector('.module-container');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
        }

        // Agregar estilos si no existen
        this.ensureMessageStyles();

        // Auto-remover después de 4 segundos
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 4000);
    }

    /**
     * Obtiene icono según tipo de mensaje
     */
    getMessageIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Asegura que existan los estilos de mensajes
     */
    ensureMessageStyles() {
        if (document.querySelector('#module-message-styles')) return;

        const style = document.createElement('style');
        style.id = 'module-message-styles';
        style.textContent = `
            .module-message {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1002;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                backdrop-filter: blur(10px);
            }
            
            .module-message-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }
            
            .module-message-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }
            
            .module-message-info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
            }
            
            .module-message .message-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .module-message .message-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.8;
                padding: 4px;
                border-radius: 4px;
            }
            
            .module-message .message-close:hover {
                opacity: 1;
                background: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Simula delay asíncrono
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ================================================
// FUNCIONES GLOBALES PARA LA VISTA
// ================================================

/**
 * Carga una compañía en el formulario
 */
function loadCompany(id) {
    if (window.companyModule) {
        window.companyModule.loadCompany(id);
    }
}

/**
 * Edita la compañía actual
 */
function editCompany() {
    if (window.companyModule && window.companyModule.currentCompany) {
        window.companyModule.setFormMode('edit');
    } else {
        alert('Selecciona una compañía para editar');
    }
}

/**
 * Elimina una compañía
 */
function deleteCompany() {
    if (window.companyModule && window.companyModule.currentCompany) {
        window.companyModule.confirmDelete(window.companyModule.currentCompany.id);
    } else {
        alert('Selecciona una compañía para eliminar');
    }
}

/**
 * Confirma eliminación directa
 */
function confirmDelete(id) {
    if (window.companyModule) {
        window.companyModule.confirmDelete(id);
    }
}

/**
 * Cancela el formulario
 */
function cancelForm() {
    if (window.companyModule) {
        window.companyModule.clearForm();
    }
}

/**
 * Nueva compañía
 */
function newCompany() {
    if (window.companyModule) {
        window.companyModule.clearForm();
        window.companyModule.setFormMode('create');
        
        // Scroll al formulario
        document.querySelector('.form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// ================================================
// INICIALIZACIÓN
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    window.companyModule = new CompanyModule();
});
