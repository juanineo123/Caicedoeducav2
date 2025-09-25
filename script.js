// ====================================================================================
// SCRIPT DE DEPURACIÓN TOTAL
// ====================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

console.log("--- INICIO DE DEPURACIÓN ---");
console.log("Hora de inicio:", new Date().toISOString());

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyD_SCyO4s-fZZS2qBTKEqAFiWP3IPD97Uo",
    authDomain: "plataforma-escala.firebaseapp.com",
    projectId: "plataforma-escala",
    storageBucket: "plataforma-escala.firebasestorage.app", // Versión que coincide con el dashboard
    messagingSenderId: "917193676993",
    appId: "1:917193676993:web:da3a51e59246bd917c1c40"
};

// ====================================================================================
// ESTE ES EL LOG MÁS IMPORTANTE: Imprime la configuración que realmente se está usando
// ====================================================================================
console.log("🔵 PASO 1: CONFIGURACIÓN DE FIREBASE DETECTADA EN ESTA PÁGINA:", firebaseConfig);

try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log("🟢 PASO 2: Firebase inicializado correctamente.");

    // --- SCRIPT GUARDIÁN CON LOGS ---
    (function() {
        console.log("🟡 PASO 3: Ejecutando script guardián...");
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            console.log("  - Token encontrado en la URL. Longitud:", token.length);
            console.log("  - Intentando autenticar con signInWithCustomToken...");

            signInWithCustomToken(auth, token)
                .then((userCredential) => {
                    console.log("✅ ÉXITO: signInWithCustomToken completado. UID:", userCredential.user.uid);
                    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({ path: newUrl }, '', newUrl);
                })
                .catch((error) => {
                    console.error("🔴 FALLO CRÍTICO: signInWithCustomToken ha fallado.");
                    console.error("  - Código de Error:", error.code);
                    console.error("  - Mensaje de Error:", error.message);
                    console.error("  - Objeto de error completo:", error);
                });
        } else {
            console.log("  - No se encontró token en la URL.");
        }
    })();

    // --- LISTENER DE ESTADO DE AUTENTICACIÓN CON LOGS ---
    console.log("🔵 PASO 4: Configurando listener onAuthStateChanged...");
    onAuthStateChanged(auth, user => {
        console.log("🔄 Evento onAuthStateChanged detectado.");
        if (user) {
            console.log("  - ✅ ESTADO: Usuario autenticado. UID:", user.uid);
        } else {
            console.log("  - ❌ ESTADO: No hay usuario.");
        }
    });

} catch (e) {
    console.error("🔴 ERROR FATAL: No se pudo inicializar Firebase. Comprueba la configuración.", e);
}

console.log("--- FIN DE DEPURACIÓN ---");

// El resto de tu código de UI (updateUI, etc.) iría aquí.
// Por ahora, está comentado para enfocarnos solo en la autenticación.