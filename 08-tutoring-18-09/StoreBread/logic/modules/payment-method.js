class PaymentMethodModule {
    constructor() {
        this.currentId = null;
        this.isEditMode = false;
        this.paymentMethods = this.loadFromLocalStorage();
        this.bindEvents();
        this.loadData();
    }

    bindEvents() {
        document.getElementById('paymentMethodForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
    }

    handleSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData();
        
        if (this.isEditMode && this.currentId) {
            this.updatePaymentMethod(this.currentId, formData);
        } else {
            this.createPaymentMethod(formData);
        }
    }

    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            description: document.getElementById('description').value.trim() || null,
            is_active: document.getElementById('isActive').checked
        };
    }

    createPaymentMethod(data) {
        const newId = this.getNextId();
        const paymentMethod = { id: newId, ...data, created_at: new Date().toISOString() };
        this.paymentMethods.push(paymentMethod);
        this.saveToLocalStorage();
        this.refreshTable();
        this.clearForm();
        this.showMessage('Método de pago creado exitosamente', 'success');
    }

    updatePaymentMethod(id, data) {
        const index = this.paymentMethods.findIndex(p => p.id === id);
        if (index !== -1) {
            this.paymentMethods[index] = { ...this.paymentMethods[index], ...data };
            this.saveToLocalStorage();
            this.refreshTable();
            this.clearForm();
            this.showMessage('Método de pago actualizado exitosamente', 'success');
        }
    }

    deletePaymentMethod(id) {
        const index = this.paymentMethods.findIndex(p => p.id === id);
        if (index !== -1) {
            this.paymentMethods.splice(index, 1);
            this.saveToLocalStorage();
            this.refreshTable();
            this.showMessage('Método de pago eliminado exitosamente', 'success');
        }
    }

    loadPaymentMethod(id) {
        const paymentMethod = this.paymentMethods.find(p => p.id === id);
        if (paymentMethod) {
            this.populateForm(paymentMethod);
            this.currentId = id;
            this.isEditMode = true;
        }
    }

    populateForm(paymentMethod) {
        document.getElementById('paymentMethodId').value = paymentMethod.id;
        document.getElementById('name').value = paymentMethod.name;
        document.getElementById('description').value = paymentMethod.description || '';
        document.getElementById('isActive').checked = paymentMethod.is_active;
    }

    clearForm() {
        document.getElementById('paymentMethodForm').reset();
        document.getElementById('isActive').checked = true;
        this.currentId = null;
        this.isEditMode = false;
    }

    refreshTable() {
        const tbody = document.querySelector('#paymentMethodsTable tbody');
        tbody.innerHTML = '';
        this.paymentMethods.forEach(pm => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pm.id}</td>
                <td>${pm.name}</td>
                <td>${pm.description || '-'}</td>
                <td><span class="status-badge ${pm.is_active ? 'active' : 'inactive'}">${pm.is_active ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" onclick="loadPaymentMethod(${pm.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-action delete" onclick="confirmDelete(${pm.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#paymentMethodsTable tbody tr');
        const term = searchTerm.toLowerCase();
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    getNextId() {
        return this.paymentMethods.length > 0 ? Math.max(...this.paymentMethods.map(p => p.id)) + 1 : 1;
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('paymentMethods');
        return stored ? JSON.parse(stored) : [
            { id: 1, name: 'Efectivo', description: 'Pago en efectivo', is_active: true },
            { id: 2, name: 'Tarjeta de Crédito', description: 'Pago con tarjeta de crédito', is_active: true },
            { id: 3, name: 'Transferencia', description: 'Transferencia bancaria', is_active: true }
        ];
    }

    saveToLocalStorage() {
        localStorage.setItem('paymentMethods', JSON.stringify(this.paymentMethods));
    }

    loadData() {
        this.refreshTable();
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        const container = document.querySelector('.module-container');
        container.insertBefore(messageDiv, container.firstChild);
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

function newPaymentMethod() {
    paymentMethodModule.clearForm();
}

function loadPaymentMethod(id) {
    paymentMethodModule.loadPaymentMethod(id);
}

function confirmDelete(id) {
    if (confirm('¿Eliminar este método de pago?')) {
        paymentMethodModule.deletePaymentMethod(id);
    }
}

function cancelForm() {
    paymentMethodModule.clearForm();
}

let paymentMethodModule;
document.addEventListener('DOMContentLoaded', () => {
    paymentMethodModule = new PaymentMethodModule();
});
