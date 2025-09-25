// ========================================================================
// SCRIPT.JS FINAL Y DEFINITIVO PARA CAICEDOEDUCA.COM
// Versión con la sintaxis de Firebase v9+ corregida.
// ========================================================================

// ------------------------------------------------------------------------
// PARTE 1: EL GUARDIÁN DE SEGURIDAD
// ------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_SCyO4s-fZZS2qBTKEqAFiWP3IPD97Uo",
    authDomain: "plataforma-escala.firebaseapp.com",
    projectId: "plataforma-escala",
    storageBucket: "plataforma-escala.firebasestorage.app",
    messagingSenderId: "917193676993",
    appId: "1:917193676993:web:da3a51e59246bd917c1c40"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ------------------------------------------------------------------------
// PARTE 2: TU LÓGICA ORIGINAL DE LA PÁGINA
// ------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    // ===== ELEMENTOS DEL DOM (Limpiado) =====
    const navbar = document.getElementById('navbar');
    const authButtonsContainer = document.getElementById('auth-buttons-container');
    const mobileAuthButtonsContainer = document.getElementById('mobile-auth-buttons-container');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const toolsSubtitle = document.getElementById('tools-subtitle');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const generatorGridContainer = document.getElementById('generator-grid-container');
    const generatorModal = document.getElementById('generator-modal');
    const closeGeneratorBtn = document.getElementById('close-generator-btn');
    const generatorIframe = document.getElementById('generator-iframe');
    const logoutToast = document.getElementById('logout-toast');

    // ===== DATOS DE LOS GENERADORES (COMPLETO) =====
    const generators = [
        { title: 'Generador de Sesiones V-2.0', description: 'Crea tu sesión eligiendo una sola Competencia (incluye TUTORÍA).', url: 'https://glistening-starlight-1588bf.netlify.app/', icon: 'book-open-check', category: 'Planificación' },
        { title: 'Generador de Sesiones V-3.0', description: 'Crea sesiones complejas con múltiples Competencias (NO incluye TUTORÍA).', url: 'https://academic-works-443822-r8.web.app/', icon: 'library-big', category: 'Planificación' },
        { title: 'Generador de Unidades V-2.0', description: 'Diseña unidades de aprendizaje listas para implementar.', url: 'https://unidades2.netlify.app/', icon: 'layers-3', category: 'Planificación' },
        { title: 'Programación Anual', description: 'Genera tu programación curricular anual de forma sencilla.', url: 'https://unrivaled-unicorn-fe7373.netlify.app/', icon: 'calendar-days', category: 'Planificación' },
        { title: 'Fichas y Exámenes', description: 'Genera material de trabajo y evaluaciones al instante.', url: 'https://jazzy-moxie-e34a66.netlify.app/', icon: 'file-spreadsheet', category: 'Recursos' },
        { title: 'Registros Auxiliares', description: 'Gestiona y crea registros de notas de forma automática.', url: 'https://stalwart-buttercream-8c9f0d.netlify.app/', icon: 'notebook-pen', category: 'Recursos' },
        { title: 'Carpetas de Recuperación', description: 'Crea planes y materiales para el periodo de recuperación.', url: 'https://carpetasderecuperacion.netlify.app/', icon: 'folder-sync', category: 'Recursos' },
        { title: 'Generador de Solicitudes', description: 'Redacta documentos administrativos de forma automática.', url: 'https://fancy-profiterole-01445b.netlify.app/', icon: 'file-signature', category: 'Gestión' },
        { title: 'Solucionador de Conflictos', description: 'Guía para actuar en situaciones de conflicto según normativas.', url: 'https://elegant-duckanoo-d702fe.netlify.app/', icon: 'shield-check', category: 'Gestión' },
        { title: 'Proyectos Integrados', description: 'Desarrolla proyectos basados en problemas reales.', url: 'https://jocular-concha-e30cbd.netlify.app/', icon: 'puzzle', category: 'Gestión' },
    ];
    const categories = ['Todos', ...new Set(generators.map(g => g.category))];
    const categoryColors = { 'Planificación': 'blue', 'Recursos': 'green', 'Gestión': 'purple' };

    // ===== FUNCIONES (Tu código original, integrado) =====
    function updateUI(user) {
        authButtonsContainer.innerHTML = '';
        mobileAuthButtonsContainer.innerHTML = '';
        if (user) {
            toolsSubtitle.textContent = `Bienvenido/a, ${user.displayName || 'docente'}. Selecciona una herramienta para empezar.`;
            const logoutButtonHTML = `<button class="auth-button border-red-500 text-red-500 hover:bg-red-500 hover:text-white js-logout-button">Cerrar Sesión</button>`;
            authButtonsContainer.innerHTML = logoutButtonHTML;
            mobileAuthButtonsContainer.innerHTML = logoutButtonHTML;
            
            document.querySelectorAll('.js-logout-button').forEach(button => {
                button.addEventListener('click', async () => {
                    if (logoutToast) logoutToast.classList.remove('hidden');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    try {
                        await signOut(auth);
                        window.location.href = 'https://elprofecaicedo.com';
                    } catch (error) {
                        console.error("Error al cerrar sesión:", error);
                        if (logoutToast) logoutToast.classList.add('hidden');
                    }
                });
            });
            renderFilters();
            renderGenerators('Todos');
        } else {
            toolsSubtitle.textContent = 'Inicia sesión para acceder a un ecosistema de soluciones a tu medida.';
            renderLockedGenerators();
        }
    }

    function renderFilters() {
        if (!categoryFiltersContainer) return;
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-button';
            button.textContent = category;
            if (category === 'Todos') button.classList.add('active');
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderGenerators(category);
            });
            categoryFiltersContainer.appendChild(button);
        });
    }

    function renderGenerators(filter) {
        if (!generatorGridContainer) return;
        generatorGridContainer.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
        const filteredGenerators = filter === 'Todos' ? generators : generators.filter(g => g.category === filter);
        filteredGenerators.forEach(gen => {
            const color = categoryColors[gen.category] || 'gray';
            const card = document.createElement('div');
            card.className = 'generator-card';
            card.innerHTML = `<div class="generator-card-header"><div class="generator-icon bg-${color}-100 text-${color}-600"><i data-lucide="${gen.icon}"></i></div><div><h3 class="generator-title">${gen.title}</h3><p class="generator-description">${gen.description}</p></div></div><div class="generator-card-footer"><span>Abrir Herramienta &rarr;</span></div>`;
            card.addEventListener('click', () => openGenerator(gen.url + '?autorizado=true'));
            grid.appendChild(card);
        });
        generatorGridContainer.appendChild(grid);
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function renderLockedGenerators() {
        if (categoryFiltersContainer) categoryFiltersContainer.innerHTML = '';
        if (generatorGridContainer) {
            generatorGridContainer.innerHTML = `<div class="mt-12 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center col-span-1 md:col-span-2 lg:col-span-3"><i data-lucide="lock" class="mx-auto text-gray-400 h-12 w-12"></i><p class="mt-4 text-gray-600 font-semibold">El contenido está bloqueado.</p><p class="text-gray-500">Por favor, inicia sesión para ver las herramientas.</p></div>`;
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }

    function openGenerator(url) {
        generatorIframe.src = url;
        generatorModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeGenerator() {
        generatorModal.classList.add('hidden');
        generatorIframe.src = 'about:blank';
        document.body.style.overflow = 'auto';
    }

    // ===== EVENT LISTENERS ADICIONALES (Tu código original) =====
    closeGeneratorBtn.addEventListener('click', closeGenerator);
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    closeMobileMenuBtn.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', () => mobileMenu.classList.add('hidden')));
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // ------------------------------------------------------------------------
    // PARTE 3: EL CORAZÓN DE LA INTEGRACIÓN (SINTAXIS CORREGIDA)
    // ------------------------------------------------------------------------
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        // Usamos la sintaxis moderna: signInWithCustomToken(auth, token)
        signInWithCustomToken(auth, token).catch((error) => {
            console.error("Token de acceso inválido:", error);
            window.location.href = 'https://elprofecaicedo.com';
        });
    }

    onAuthStateChanged(auth, user => {
        updateUI(user);
        if (!user && !token) {
            console.log("Acceso denegado. Redirigiendo al login.");
            window.location.href = 'https://elprofecaicedo.com';
        }
    });
});