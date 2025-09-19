// ================================================
// PanyPan Dashboard - JavaScript Functionality
// Navegación, autenticación y gestión de módulos
// ================================================

/**
 * Clase principal para manejar el dashboard
 */
class DashboardManager {
    constructor() {
        this.currentModule = null;
        this.sidebarCollapsed = false;
        this.mobileMenuOpen = false;
        
        this.initializeAuthentication();
        this.initializeEventListeners();
        this.initializeUI();
    }

    /**
     * Verifica la autenticación del usuario
     */
    initializeAuthentication() {
        const authData = this.getAuthData();
        
        if (!authData) {
            // No hay sesión válida, redirigir al login
            window.location.href = '../index.html';
            return;
        }

        // Actualizar información del usuario en la UI
        this.updateUserInfo(authData.user);
    }

    /**
     * Obtiene los datos de autenticación
     * @returns {object|null} - Datos de autenticación o null
     */
    getAuthData() {
        try {
            const authData = localStorage.getItem('panyPanAuth');
            const sessionData = sessionStorage.getItem('panyPanSession');
            
            if (!authData || !sessionData) {
                return null;
            }

            const auth = JSON.parse(authData);
            return auth.isAuthenticated ? auth : null;
        } catch (error) {
            console.error('Error al obtener datos de autenticación:', error);
            return null;
        }
    }

    /**
     * Actualiza la información del usuario en la interfaz
     * @param {object} user - Datos del usuario
     */
    updateUserInfo(user) {
        // Actualizar sidebar
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        
        if (userName) userName.textContent = user.name || 'Usuario';
        if (userRole) userRole.textContent = user.email || '';

        // Actualizar header
        const headerUserName = document.getElementById('headerUserName');
        if (headerUserName) headerUserName.textContent = user.name || 'Usuario';
    }

    /**
     * Inicializa todos los event listeners
     */
    initializeEventListeners() {
        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Responsive - redimensionar ventana
        window.addEventListener('resize', () => this.handleWindowResize());
        
        // Prevenir navegación con F5 en producción
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                e.preventDefault();
                this.showMessage('Usa la navegación del sistema para actualizar el contenido', 'info');
            }
        });
    }

    /**
     * Inicializa elementos de la UI
     */
    initializeUI() {
        // Activar primer módulo si hay elementos en el menú
        const firstNavItem = document.querySelector('.nav-item');
        if (firstNavItem) {
            // Auto-expandir primera sección
            const firstSection = document.querySelector('.nav-section');
            if (firstSection) {
                firstSection.classList.add('active');
            }
        }

        // Configurar tooltips para sidebar colapsado
        this.setupTooltips();
        
        // Inicializar notificaciones
        this.updateNotificationCount();
    }

    /**
     * Maneja clics fuera de dropdowns para cerrarlos
     */
    handleOutsideClick(event) {
        // Cerrar dropdown de notificaciones
        if (!event.target.closest('.notifications')) {
            this.closeNotifications();
        }
        
        // Cerrar dropdown de usuario
        if (!event.target.closest('.user-menu')) {
            this.closeUserMenu();
        }
    }

    /**
     * Maneja el redimensionamiento de la ventana
     */
    handleWindowResize() {
        if (window.innerWidth > 1024 && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Configurar tooltips para sidebar colapsado
     */
    setupTooltips() {
        // Implementar tooltips personalizados si es necesario
    }

    /**
     * Actualiza el contador de notificaciones
     */
    updateNotificationCount() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.getElementById('notificationCount');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }
}

// ================================================
// FUNCIONES GLOBALES PARA EL DASHBOARD
// ================================================

/**
 * Alternar sección del menú lateral
 * @param {string} sectionId - ID de la sección
 */
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId).closest('.nav-section');
    const isActive = section.classList.contains('active');
    
    // Cerrar otras secciones (opcional - comentar para permitir múltiples abiertas)
    document.querySelectorAll('.nav-section.active').forEach(s => {
        if (s !== section) s.classList.remove('active');
    });
    
    // Alternar sección actual
    section.classList.toggle('active', !isActive);
}

/**
 * Cargar módulo en el workspace
 * @param {string} moduleId - ID del módulo
 */
function loadModule(moduleId) {
    const moduleRoutes = {
        // Módulos de Ubicación
        'compania': './ubication/company.html',
        'sede': './ubication/headquarter.html',
        
        // Módulos de Parámetros
        'persona': './parameter/person.html',
        'usuario': './parameter/user.html',
        'rol': './parameter/role.html',
        'metodo-pago': './parameter/payment-method.html',
        
        // Módulos de Facturación (por implementar)
        'factura': './billing/billing.html',
        'detalle-factura': './billing/billing-detail.html',
        
        // Módulos de Proveedores (por implementar)
        'proveedor': './supply-chain/supplier.html'
    };

    const moduleNames = {
        'compania': 'Gestión de Compañías',
        'sede': 'Gestión de Sedes',
        'persona': 'Gestión de Personas',
        'usuario': 'Gestión de Usuarios',
        'rol': 'Gestión de Roles',
        'metodo-pago': 'Métodos de Pago',
        'factura': 'Facturación',
        'detalle-factura': 'Detalle de Facturas',
        'proveedor': 'Gestión de Proveedores'
    };

    if (moduleRoutes[moduleId]) {
        // Actualizar breadcrumb
        updateBreadcrumb(moduleNames[moduleId] || moduleId);
        
        // Marcar elemento activo en navegación
        if (event && event.target) {
            updateActiveNavItem(event.target);
        }
        
        // Cargar contenido del módulo
        loadModuleContent(moduleRoutes[moduleId]);
        
        // Cerrar menú móvil si está abierto
        if (window.innerWidth <= 1024) {
            closeMobileMenu();
        }
    } else {
        console.error('Módulo no encontrado:', moduleId);
        showNotification('Módulo no disponible', 'error');
    }
}

/**
 * Actualizar breadcrumb
 * @param {string} moduleId - ID del módulo
 */
function updateBreadcrumb(moduleId) {
    const moduleNames = {
        'factura': { module: 'Facturación', sub: 'Factura' },
        'detalle-factura': { module: 'Facturación', sub: 'Detalle Factura' },
        'persona': { module: 'Parametrización', sub: 'Persona' },
        'usuario': { module: 'Parametrización', sub: 'Usuario' },
        'rol': { module: 'Parametrización', sub: 'Rol' },
        'metodo-pago': { module: 'Método de Pago', sub: 'Método de Pago' },
        'proveedor': { module: 'Proveedores', sub: 'Proveedor' },
        'compania': { module: 'Ubicación', sub: 'Compañía' },
        'sede': { module: 'Ubicación', sub: 'Sede' }
    };
    
    const moduleInfo = moduleNames[moduleId] || { module: 'Dashboard', sub: 'Módulo' };
    
    const currentModule = document.getElementById('currentModule');
    const currentSubmodule = document.getElementById('currentSubmodule');
    
    if (currentModule) currentModule.textContent = moduleInfo.module;
    if (currentSubmodule) currentSubmodule.textContent = moduleInfo.sub;
}

/**
 * Actualizar elemento activo en navegación
 * @param {HTMLElement} clickedElement - Elemento clickeado
 */
function updateActiveNavItem(clickedElement) {
    // Remover clase active de todos los elementos
    document.querySelectorAll('.nav-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al elemento clickeado
    const navItem = clickedElement.closest('.nav-item');
    if (navItem) {
        navItem.classList.add('active');
    }
}

/**
 * Cargar contenido del módulo en el workspace
 * @param {string} moduleId - ID del módulo
 */
function loadModuleContent(moduleId) {
    const workspaceTitle = document.getElementById('workspaceTitle');
    const workspaceDescription = document.getElementById('workspaceDescription');
    const workspaceContent = document.getElementById('workspaceContent');
    
    // Mapeo de módulos
    const moduleData = {
        'factura': {
            title: 'Gestión de Facturas',
            description: 'Administra y genera facturas de venta',
            icon: 'fa-receipt'
        },
        'detalle-factura': {
            title: 'Detalles de Factura',
            description: 'Visualiza y edita los detalles de las facturas',
            icon: 'fa-list-alt'
        },
        'persona': {
            title: 'Gestión de Personas',
            description: 'Administra la información de personas en el sistema',
            icon: 'fa-user'
        },
        'usuario': {
            title: 'Gestión de Usuarios',
            description: 'Administra usuarios y sus permisos',
            icon: 'fa-users'
        },
        'rol': {
            title: 'Gestión de Roles',
            description: 'Define y administra roles del sistema',
            icon: 'fa-user-tag'
        },
        'metodo-pago': {
            title: 'Métodos de Pago',
            description: 'Configura los métodos de pago disponibles',
            icon: 'fa-money-check-alt'
        },
        'proveedor': {
            title: 'Gestión de Proveedores',
            description: 'Administra la información de proveedores',
            icon: 'fa-handshake'
        },
        'compania': {
            title: 'Gestión de Compañías',
            description: 'Administra la información de compañías',
            icon: 'fa-building'
        },
        'sede': {
            title: 'Gestión de Sedes',
            description: 'Administra las sedes de la empresa',
            icon: 'fa-store'
        }
    };
    
    const module = moduleData[moduleId];
    
    if (module) {
        // Actualizar título y descripción
        if (workspaceTitle) workspaceTitle.textContent = module.title;
        if (workspaceDescription) workspaceDescription.textContent = module.description;
        
        // Crear contenido placeholder
        if (workspaceContent) {
            workspaceContent.innerHTML = `
                <div class="module-placeholder">
                    <i class="fas ${module.icon}"></i>
                    <h2>${module.title}</h2>
                    <p>${module.description}</p>
                    <div class="construction-badge">
                        <i class="fas fa-tools"></i>
                        Módulo en construcción
                    </div>
                </div>
            `;
        }
    }
    
    // Agregar efecto de carga suave
    if (workspaceContent) {
        workspaceContent.style.opacity = '0';
        setTimeout(() => {
            workspaceContent.style.transition = 'opacity 0.3s ease';
            workspaceContent.style.opacity = '1';
        }, 100);
    }
}

/**
 * Alternar sidebar (colapsar/expandir)
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    
    if (window.innerWidth <= 1024) {
        // Modo móvil - mostrar/ocultar menú
        toggleMobileMenu();
    } else {
        // Modo desktop - colapsar/expandir
        sidebar.classList.toggle('collapsed');
    }
}

/**
 * Alternar menú móvil
 */
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    sidebar.classList.toggle('mobile-open');
    
    // Agregar/remover overlay
    let overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar.classList.contains('mobile-open')) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.onclick = closeMobileMenu;
            body.appendChild(overlay);
        }
        setTimeout(() => overlay.classList.add('active'), 10);
    } else {
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

/**
 * Cerrar menú móvil
 */
function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.remove('mobile-open');
    
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

/**
 * Alternar dropdown de notificaciones
 */
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Cerrar otros dropdowns
    closeUserMenu();
    
    dropdown.classList.toggle('active', !isActive);
}

/**
 * Cerrar dropdown de notificaciones
 */
function closeNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.remove('active');
}

/**
 * Marcar todas las notificaciones como leídas
 */
function markAllAsRead() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    
    // Actualizar contador
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.style.display = 'none';
    }
    
    showMessage('Todas las notificaciones marcadas como leídas', 'success');
}

/**
 * Alternar menú de usuario
 */
function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Cerrar otros dropdowns
    closeNotifications();
    
    userMenu.classList.toggle('active', !isActive);
    dropdown.classList.toggle('active', !isActive);
}

/**
 * Cerrar menú de usuario
 */
function closeUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    userMenu.classList.remove('active');
    dropdown.classList.remove('active');
}

/**
 * Cerrar sesión del usuario
 */
function logout() {
    // Mostrar confirmación
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar datos de autenticación
        localStorage.removeItem('panyPanAuth');
        sessionStorage.removeItem('panyPanSession');
        
        // Mostrar mensaje y redirigir
        showMessage('Sesión cerrada correctamente', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }
}

/**
 * Mostrar mensaje del sistema
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (success, error, info, warning)
 */
function showMessage(message, type = 'info') {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.dashboard-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `dashboard-message dashboard-message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#dashboard-message-styles')) {
        const style = document.createElement('style');
        style.id = 'dashboard-message-styles';
        style.textContent = `
            .dashboard-message {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 1001;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                backdrop-filter: blur(10px);
            }
            
            .dashboard-message-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }
            
            .dashboard-message-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }
            
            .dashboard-message-info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
            }
            
            .dashboard-message-warning {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
            }
            
            .dashboard-message .message-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .dashboard-message .message-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.8;
                transition: opacity 0.3s ease;
                padding: 4px;
                border-radius: 4px;
            }
            
            .dashboard-message .message-close:hover {
                opacity: 1;
                background: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar mensaje al DOM
    document.body.appendChild(messageDiv);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 4000);
}

/**
 * Obtiene el icono según el tipo de mensaje
 * @param {string} type - Tipo de mensaje
 * @returns {string} - Clase del icono
 */
function getMessageIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// ================================================
// INICIALIZACIÓN
// ================================================

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Funciones disponibles globalmente
window.DashboardUtils = {
    showMessage,
    logout,
    toggleSidebar,
    loadModule
};
