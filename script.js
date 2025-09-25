document.addEventListener('DOMContentLoaded', () => {

    // --- INICIO DEL SCRIPT GUARDIÁN ---
    // Esta función se ejecuta de inmediato para proteger la página.
    (function() {
        // Obtenemos una referencia al servicio de autenticación de Firebase.
        const auth = window.firebaseAuth.auth;
        
        // 1. Buscamos el token en la URL.
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            // 2. Si hay un token, intentamos iniciar sesión con él.
            auth.signInWithCustomToken(token)
                .then(() => {
                    // ¡Éxito! El usuario está autenticado.
                    console.log("Autenticación con token personalizado exitosa.");
                    // Limpiamos la URL para que el token no quede visible ni se reutilice.
                    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({ path: newUrl }, '', newUrl);
                })
                .catch((error) => {
                    // 3. Si el token es inválido, redirigimos al portal principal.
                    console.error("Error al autenticar con token:", error);
                    window.location.href = 'https://elprofecaicedo.com'; // O la URL de tu login principal
                });
        }
        // Si no hay token, el listener onAuthStateChanged se encargará del resto.
    })();
    // --- FIN DEL SCRIPT GUARDIÁN ---


    // ===== ELEMENTOS DEL DOM (Sin cambios) =====
    const navbar = document.getElementById('navbar');
    const authButtonsContainer = document.getElementById('auth-buttons-container');
    const mobileAuthButtonsContainer = document.getElementById('mobile-auth-buttons-container');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    // El modal de login ya no es necesario, pero lo dejamos por si quieres reutilizarlo para otra cosa.
    const loginModal = document.getElementById('login-modal');
    const toolsSubtitle = document.getElementById('tools-subtitle');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const generatorGridContainer = document.getElementById('generator-grid-container');
    const generatorModal = document.getElementById('generator-modal');
    const closeGeneratorBtn = document.getElementById('close-generator-btn');
    const generatorIframe = document.getElementById('generator-iframe');
    const logoutToast = document.getElementById('logout-toast');

    // ===== DATOS DE LOS GENERADORES (Sin cambios) =====
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
    const categoryColors = {
        'Planificación': 'blue',
        'Recursos': 'green',
        'Gestión': 'purple'
    };

    // ===== FUNCIONES (Con cambios clave) =====
    function updateUI(user) {
        authButtonsContainer.innerHTML = '';
        mobileAuthButtonsContainer.innerHTML = '';
        if (user) {
            // **COMPORTAMIENTO SI EL USUARIO ESTÁ AUTENTICADO (Correcto)**
            toolsSubtitle.textContent = `Bienvenido/a, docente. Selecciona una herramienta para empezar.`; // Nombre de usuario se gestiona en el portal
            const logoutButtonHTML = `<button class="auth-button border-red-500 text-red-500 hover:bg-red-500 hover:text-white js-logout-button">Cerrar Sesión</button>`;
            authButtonsContainer.innerHTML = logoutButtonHTML;
            mobileAuthButtonsContainer.innerHTML = logoutButtonHTML;
            document.querySelectorAll('.js-logout-button').forEach(button => {
                button.addEventListener('click', async () => {
                    if (logoutToast) logoutToast.classList.remove('hidden');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    try {
                        await window.firebaseAuth.signOut(window.firebaseAuth.auth);
                        // AL CERRAR SESIÓN, REDIRIGIMOS AL PORTAL PRINCIPAL
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
            // **COMPORTAMIENTO SI NO HAY USUARIO (Cambio clave)**
            // En lugar de mostrar botones de login, redirigimos inmediatamente.
            console.log("Usuario no autenticado. Redirigiendo al portal de inicio de sesión...");
            window.location.href = 'https://elprofecaicedo.com'; // O la URL de tu login principal
        }
    }

    // El resto de funciones (renderFilters, renderGenerators, etc.) no necesitan cambios.
    // ... (El resto de tus funciones como renderFilters, renderGenerators, openGenerator, etc. van aquí sin cambios) ...

    function renderFilters() {
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-button';
            button.textContent = category;
            if (category === 'Todos') {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderGenerators(category);
            });
            categoryFiltersContainer.appendChild(button);
        });
    }

    function renderGenerators(filter) {
        generatorGridContainer.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
        const filteredGenerators = filter === 'Todos' ? generators : generators.filter(g => g.category === filter);
        filteredGenerators.forEach(gen => {
            const color = categoryColors[gen.category] || 'gray';
            const card = document.createElement('div');
            card.className = 'generator-card';
            card.innerHTML = `
                <div class="generator-card-header">
                    <div class="generator-icon bg-${color}-100 text-${color}-600">
                        <i data-lucide="${gen.icon}"></i>
                    </div>
                    <div>
                        <h3 class="generator-title">${gen.title}</h3>
                        <p class="generator-description">${gen.description}</p>
                    </div>
                </div>
                <div class="generator-card-footer">
                    <span>Abrir Herramienta &rarr;</span>
                </div>
            `;
            // Ya no es necesario añadir '?autorizado=true', el guardián protege la app entera.
            card.addEventListener('click', () => openGenerator(gen.url));
            grid.appendChild(card);
        });
        generatorGridContainer.appendChild(grid);
        lucide.createIcons();
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

    // ===== LÓGICA DE FIREBASE (Simplificada) =====
    const { auth, onAuthStateChanged } = window.firebaseAuth;

    // Este listener es el corazón de la app ahora.
    // Reacciona al inicio de sesión (hecho por el guardián) o a la ausencia de sesión.
    onAuthStateChanged(auth, user => {
        updateUI(user);
        if (authButtonsContainer && mobileAuthButtonsContainer) {
            authButtonsContainer.classList.remove('hidden');
            mobileAuthButtonsContainer.classList.remove('hidden');
        }
    });

    // ===== EVENT LISTENERS ADICIONALES (Sin cambios, pero los de login ya no se usan) =====
    closeGeneratorBtn.addEventListener('click', closeGenerator);
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    closeMobileMenuBtn.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});