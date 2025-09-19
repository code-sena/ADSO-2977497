// ================================================
// PanyPan - Login Logic
// Validación y autenticación de usuarios
// ================================================

/**
 * Configuración de credenciales válidas
 */
const VALID_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: '1234'
};

/**
 * Clase para manejar la lógica de login
 */
class LoginManager {
    constructor() {
        this.isAuthenticated = this.checkAuthStatus();
        this.initializeEventListeners();
    }

    /**
     * Inicializa los event listeners del formulario
     */
    initializeEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Auto-completar para testing (solo en desarrollo)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.addDevelopmentFeatures();
        }
    }

    /**
     * Maneja el proceso de login
     * @param {Event} event - Evento del formulario
     */
    async handleLogin(event) {
        event.preventDefault();

        const email = this.getInputValue('username'); // El campo se llama username pero validamos como email
        const password = this.getInputValue('password');

        // Validaciones básicas
        if (!this.validateInput(email, password)) {
            return;
        }

        // Mostrar estado de carga
        this.showLoadingState();

        try {
            // Simular delay de red
            await this.delay(1500);

            // Validar credenciales
            if (this.validateCredentials(email, password)) {
                this.onLoginSuccess(email);
            } else {
                this.onLoginError();
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            this.showErrorMessage('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Obtiene el valor de un input y lo limpia
     * @param {string} inputId - ID del input
     * @returns {string} - Valor limpio del input
     */
    getInputValue(inputId) {
        const input = document.getElementById(inputId);
        return input ? input.value.trim() : '';
    }

    /**
     * Valida que los campos no estén vacíos y tengan formato correcto
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {boolean} - True si la validación es exitosa
     */
    validateInput(email, password) {
        if (!email) {
            this.showErrorMessage('Por favor ingresa tu email');
            this.focusInput('username');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showErrorMessage('Por favor ingresa un email válido');
            this.focusInput('username');
            return false;
        }

        if (!password) {
            this.showErrorMessage('Por favor ingresa tu contraseña');
            this.focusInput('password');
            return false;
        }

        return true;
    }

    /**
     * Valida el formato del email
     * @param {string} email - Email a validar
     * @returns {boolean} - True si el email es válido
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida las credenciales contra los datos configurados
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {boolean} - True si las credenciales son válidas
     */
    validateCredentials(email, password) {
        return email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password;
    }

    /**
     * Maneja el login exitoso
     * @param {string} email - Email del usuario autenticado
     */
    onLoginSuccess(email) {
        // Guardar estado de autenticación
        this.saveAuthState(email);

        // Mostrar mensaje de éxito
        this.showSuccessMessage('¡Bienvenido a PanyPan!');

        // Redirigir al dashboard
        setTimeout(() => {
            this.redirectToDashboard();
        }, 1500);
    }

    /**
     * Maneja el login fallido
     */
    onLoginError() {
        this.showErrorMessage('Email o contraseña incorrectos. Verifica tus datos.');
        this.clearPasswordField();
        this.focusInput('username');
    }

    /**
     * Guarda el estado de autenticación
     * @param {string} email - Email del usuario autenticado
     */
    saveAuthState(email) {
        const authData = {
            isAuthenticated: true,
            user: {
                email: email,
                name: 'Administrador',
                role: 'admin'
            },
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };

        localStorage.setItem('panyPanAuth', JSON.stringify(authData));
        sessionStorage.setItem('panyPanSession', 'active');
    }

    /**
     * Verifica el estado de autenticación
     * @returns {boolean} - True si está autenticado
     */
    checkAuthStatus() {
        const authData = localStorage.getItem('panyPanAuth');
        const sessionData = sessionStorage.getItem('panyPanSession');
        
        if (!authData || !sessionData) {
            return false;
        }

        try {
            const auth = JSON.parse(authData);
            return auth.isAuthenticated === true;
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            return false;
        }
    }

    /**
     * Redirige al dashboard
     */
    redirectToDashboard() {
        window.location.href = 'view/dashboard.html';
    }

    /**
     * Genera un ID de sesión único
     * @returns {string} - ID de sesión
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Muestra el estado de carga en el botón
     */
    showLoadingState() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando credenciales...';
            loginBtn.classList.add('loading');
        }
    }

    /**
     * Oculta el estado de carga
     */
    hideLoadingState() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
            loginBtn.classList.remove('loading');
        }
    }

    /**
     * Enfoca un input específico
     * @param {string} inputId - ID del input a enfocar
     */
    focusInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.focus();
            input.select();
        }
    }

    /**
     * Limpia el campo de contraseña
     */
    clearPasswordField() {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.value = '';
        }
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     */
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Muestra un mensaje de éxito
     * @param {string} message - Mensaje de éxito
     */
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Muestra un mensaje general
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje (success, error, info)
     */
    showMessage(message, type = 'info') {
        // Remover mensaje anterior si existe
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message login-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${this.getMessageIcon(type)}"></i>
                <span>${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Insertar mensaje en el formulario
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.insertBefore(messageDiv, loginForm.firstChild);
        }

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.classList.add('fade-out');
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }

    /**
     * Obtiene el icono según el tipo de mensaje
     * @param {string} type - Tipo de mensaje
     * @returns {string} - Clase del icono
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
     * Agrega características de desarrollo
     */
    addDevelopmentFeatures() {
        // Botón de auto-login para desarrollo
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer) {
            const devButton = document.createElement('button');
            devButton.className = 'dev-autofill-btn';
            devButton.innerHTML = '<i class="fas fa-magic"></i> Auto-rellenar (Dev)';
            devButton.type = 'button';
            devButton.onclick = () => this.autoFillCredentials();
            
            // Insertar después del formulario
            const loginForm = document.querySelector('.login-form');
            if (loginForm) {
                loginForm.insertAdjacentElement('afterend', devButton);
            }
        }
    }

    /**
     * Auto-rellena las credenciales para desarrollo
     */
    autoFillCredentials() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (usernameInput) usernameInput.value = VALID_CREDENTIALS.email;
        if (passwordInput) passwordInput.value = VALID_CREDENTIALS.password;

        this.showMessage('Credenciales auto-rellenadas', 'info');
    }

    /**
     * Simula delay asíncrono
     * @param {number} ms - Milisegundos de delay
     * @returns {Promise} - Promise que se resuelve después del delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Función de limpieza de sesión
 */
function clearAuthSession() {
    localStorage.removeItem('panyPanAuth');
    sessionStorage.removeItem('panyPanSession');
}

/**
 * Función para verificar autenticación desde otras páginas
 * @returns {object|null} - Datos de autenticación o null
 */
function getAuthData() {
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
 * Función para cerrar sesión
 */
function logout() {
    clearAuthSession();
    window.location.href = '../index.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si estamos en la página de login
    if (document.getElementById('loginForm')) {
        window.loginManager = new LoginManager();
    }
});

// Exportar funciones para uso global
window.PanyPanAuth = {
    getAuthData,
    logout,
    clearAuthSession
};
