// ====================================================================================
// PASO 1: IMPORTACIONES DE FIREBASE (SINTAXIS MODERNA)
// Se importan TODAS las funciones necesarias de Firebase v9 desde el inicio.
// ====================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, onSnapshot, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ====================================================================================
// PASO 2: CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// Tus credenciales para conectar este sitio con tu proyecto de Firebase.
// ====================================================================================
// Pega este bloque en el script de caicedoeduca.com

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
const db = getFirestore(app);

// ====================================================================================
// PASO 3: SCRIPT "GUARDIÁN" DE AUTENTICACIÓN 🔑
// Se ejecuta de inmediato para proteger la página antes de que se muestre nada.
// ====================================================================================
// ====================================================================================
// PASO 3: SCRIPT "GUARDIÁN" DE AUTENTICACIÓN 🔑
// Se ejecuta de inmediato para proteger la página antes de que se muestre nada.
// ====================================================================================
(function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        // Si hay token en la URL, intenta iniciar sesión con él.
        signInWithCustomToken(auth, token)
            .then(async (userCredential) => { // <--- Hacemos la función async
                console.log("✅ Autenticación con token personalizado exitosa.");

                // ▼▼▼ INICIA CÓDIGO AÑADIDO ▼▼▼
                // Borra la marca de cierre de sesión anterior para evitar bucles.
                const user = userCredential.user;
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    try {
                        await updateDoc(userRef, {
                            sessionValidUntil: deleteField()
                        });
                        console.log("🧼 Marca de cierre de sesión anterior eliminada.");
                    } catch (error) {
                        console.error("⚠️ Error al limpiar la marca de sesión:", error);
                    }
                }
                // ▲▲▲ FIN CÓDIGO AÑADIDO ▲▲▲

                // Limpia la URL para que el token no quede visible.
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: newUrl }, '', newUrl);
            })
            .catch((error) => {
                // Si el token es inválido, redirige al portal principal.
                console.error("❌ Error al autenticar con token:", error);
                window.location.href = 'https://elprofecaicedo.com';
            });
    }
    // Si no hay token, onAuthStateChanged se encargará de redirigir.
})();

// ====================================================================================
// PASO 4: LÓGICA PRINCIPAL DE LA APLICACIÓN
// Se ejecuta una vez que el DOM está cargado.
// ====================================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const toolsSubtitle = document.getElementById('tools-subtitle');
    const authButtonsContainer = document.getElementById('auth-buttons-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const generatorGridContainer = document.getElementById('generator-grid-container');
    const generatorModal = document.getElementById('generator-modal');
    const closeGeneratorBtn = document.getElementById('close-generator-btn');
    const generatorIframe = document.getElementById('generator-iframe');
    const logoutToast = document.getElementById('logout-toast');

    // --- DATOS DE LOS GENERADORES ---
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

    // --- FUNCIÓN PARA ACTUALIZAR LA INTERFAZ ---
    function updateUI(user) {
        if (user) {
            // SI HAY USUARIO: Muestra contenido y botón de salir.
            toolsSubtitle.textContent = `Bienvenido/a. Selecciona una herramienta para empezar.`;
            const logoutButtonHTML = `<button class="auth-button border-red-500 text-red-500 hover:bg-red-500 hover:text-white js-logout-button">Cerrar Sesión</button>`;
            authButtonsContainer.innerHTML = logoutButtonHTML;

            document.querySelector('.js-logout-button').addEventListener('click', async () => {
                if (logoutToast) logoutToast.classList.remove('hidden');
                await new Promise(resolve => setTimeout(resolve, 1500));
                await signOut(auth); // Cierra sesión en Firebase.
                window.location.href = 'https://elprofecaicedo.com'; // Redirige al portal.
            });

            renderFilters();
            renderGenerators('Todos'); // <-- AQUÍ SE MUESTRAN LAS TARJETAS
        } else {
            // SI NO HAY USUARIO: Muestra mensaje y redirige.
            toolsSubtitle.textContent = 'Inicia sesión para acceder a un ecosistema de soluciones a tu medida.';
            generatorGridContainer.innerHTML = `<p class="text-center col-span-3 text-gray-500 mt-8">Inicia sesión desde el portal principal para ver las herramientas.</p>`;
        }
    }

    // --- FUNCIONES PARA RENDERIZAR FILTROS Y TARJETAS ---
    function renderFilters() {
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-button'; // Asegúrate de tener estilos para esta clase
            button.textContent = category;
            if (category === 'Todos') button.classList.add('active'); // Clase para el filtro activo
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
            // Usando las clases de tu script original para mantener el estilo
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
            card.addEventListener('click', () => openGenerator(gen.url));
            grid.appendChild(card);
        });
        generatorGridContainer.appendChild(grid);
        // Si usas la librería de íconos Lucide, necesitas llamarla para que se rendericen.
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function openGenerator(url) {
        generatorIframe.src = url + '?autorizado=true';
        generatorModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeGeneratorBtn.addEventListener('click', () => {
        generatorModal.classList.add('hidden');
        generatorIframe.src = 'about:blank';
        document.body.style.overflow = 'auto';
    });

    // ====================================================================================
    // PASO 5: LISTENER PRINCIPAL DEL ESTADO DE AUTENTICACIÓN
    // Es el "corazón" que reacciona a los cambios de sesión.
    // ====================================================================================
    onAuthStateChanged(auth, user => {
        // 1. Llama a la función que actualiza la interfaz (botones, mensajes, etc.).
        updateUI(user);

        // 2. Comprueba si hay un usuario conectado.
        if (user) {
            // SI HAY USUARIO: Activa el "escucha" para el cierre de sesión global.
            const db = getFirestore(app);
            const userRef = doc(db, "users", user.uid);

            onSnapshot(userRef, (docSnapshot) => {
                console.log("3. Receptor: onSnapshot se ejecutó. Verificando datos...");
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    if (userData.sessionValidUntil) {
                        console.log("Señal de cierre de sesión global recibida. Cerrando sesión localmente.");
                        signOut(auth);
                    }
                }
            });

        } else {
            // SI NO HAY USUARIO: Comprueba si debe redirigir.
            if (!window.location.search.includes('token')) {
                console.log("🚫 No hay sesión. Redirigiendo al login principal.");
                setTimeout(() => {
                    window.location.href = 'https://elprofecaicedo.com';
                }, 1500);
            }
        }
    });

}); // Fin de DOMContentLoaded
