import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

// Criação de uma função anônima para que as configurações da Firebase não sejam expostas
const app = (function () {
    // Configurações do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCoR7fYhActNGjbPCKHzGvMji7OCJtrYQU",
        authDomain: "lince-esc2025-database.firebaseapp.com",
        databaseURL: "https://lince-esc2025-database-default-rtdb.firebaseio.com",
        projectId: "lince-esc2025-database",
        storageBucket: "lince-esc2025-database.firebasestorage.app",
        messagingSenderId: "77958312699",
        appId: "1:77958312699:web:057b29965a1026b0a4365e",
        measurementId: "G-GX2ZWTTFW5"
    };

    // Inicializa o Firebase
    return initializeApp(firebaseConfig);
})()

// Inicializa o Realtime Database
const database = getDatabase(app);

// Verificação da conexão com o Realtime Database
const connectedRef = ref(database, ".info/connected");
onValue(connectedRef, (snapshot) => {
    const connected = snapshot.val();
    if (connected) {
        console.log("Conectado ao Realtime Database com sucesso!");
        alert("Conexão estabelecida com o Realtime Database!");
    } else {
        console.log("Desconectado do Realtime Database.");
        //alert("Conexão com o Realtime Database perdida!!");
    }
});

export { database };