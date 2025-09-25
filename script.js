// ====================================================================================
// PASO 1: IMPORTACIONES (Sin cambios)
// ====================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ====================================================================================
// PASO 2: CONFIGURACIÓN (Sin cambios)
// ====================================================================================
const firebaseConfig = {
    apiKey: "AIzaSyD_SCyO4s-fZZS2qBTKEqAFiWP3IPD97Uo",
    authDomain: "plataforma-escala.firebaseapp.com",
    projectId: "plataforma-escala",
    storageBucket: "plataforma-escala.appspot.com",
    messagingSenderId: "917193676993",
    appId: "1:917193676993:web:da3a51e59246bd917c1c40"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ====================================================================================
// PASO 3: SCRIPT "GUARDIÁN" CON LOGS DE DEPURACIÓN 🕵️‍♂️
// ====================================================================================
(function() {
    console.log("🚀 Script Guardián INICIADO a las " + new Date().toLocaleTimeString());
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        console.log("✅ Token encontrado en la URL:", token.substring(0, 30) + "...");
        console.log("⏳ Intentando iniciar sesión con signInWithCustomToken...");

        signInWithCustomToken(auth, token)
            .then((userCredential) => {
                console.log("👍 ÉXITO: signInWithCustomToken funcionó. El usuario es:", userCredential.user.uid);
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: newUrl }, '', newUrl);
            })
            .catch((error) => {
                // ESTE ES EL LOG MÁS IMPORTANTE
                console.error("🔥 ERROR: signInWithCustomToken falló. Detalles del error:", error);
                console.error("Código de Error:", error.code);
                console.error("Mensaje de Error:", error.message);
                
                console.log(" Redirecting to https://elprofecaicedo.com due to error.");
                // Descomenta la siguiente línea si quieres que la redirección funcione
                // window.location.href = 'https://elprofecaicedo.com';
            });
    } else {
        console.log("🟡 No se encontró ningún token en la URL.");
    }
})();


// ====================================================================================
// PASO 5: LISTENER PRINCIPAL DEL ESTADO DE AUTENTICACIÓN CON LOGS
// ====================================================================================
console.log("🚦 Configurando listener onAuthStateChanged...");
onAuthStateChanged(auth, user => {
    console.log("🔄 onAuthStateChanged se disparó a las " + new Date().toLocaleTimeString());
    if (user) {
        console.log("✅ ESTADO: Usuario autenticado. UID:", user.uid);
        // El resto de tu lógica de UI va aquí
        // updateUI(user);
    } else {
        console.log("❌ ESTADO: No hay usuario.");
        if (!window.location.search.includes('token')) {
            console.log(" Redirecting to https://elprofecaicedo.com because there is no user and no token.");
            // Descomenta la siguiente línea si quieres que la redirección funcione
            // window.location.href = 'https://elprofecaicedo.com';
        }
    }
});

// Aquí iría el resto de tu código para la UI (DOMContentLoaded, updateUI, etc.)
// Por ahora, lo más importante son los logs del guardián.
// ...