// Importa a conexão com o Firebase e as funções necessárias
import { database } from "./firebase.js";
import { ref, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Define os arrays para armazenar os dados
var lettuceState = [];
var cabbageState = [];
var tankData = [];

// Função para buscar dados do Realtime Database
function fetchTestData() {
    // Referência ao nó "testData"
    const testDataRef = ref(database, 'testData/newTestData');

    // Faz leitura única (pode trocar por onValue() se quiser ouvir em tempo real)
    get(testDataRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                // --- Lê e armazena os dados nos arrays ---
                if (data.lettuceState) {
                    lettuceState.push(data.lettuceState.dados);
                }
                if (data.cabbageState) {
                    cabbageState.push(data.cabbageState.dados);
                }
                if (data.tank) {
                    tankData.push(data.tank);
                }

                console.log("✅ Dados coletados com sucesso!");
                alert("✅ Dados coletados com sucesso!");
                console.log("Alface:", lettuceState);
                console.log("Repolho:", cabbageState);
                console.log("Tanque:", tankData);

            } else {
                console.log("⚠️ Nenhum dado encontrado no nó 'testData/newTestData'");
                alert("⚠️ Nenhum dado encontrado no nó 'testData/newTestData'");
            }
        })
        .catch((error) => {
            console.error("❌ Erro ao buscar dados:", error);
            alert("❌ Erro ao buscar dados");
        });
}

// Executa a busca ao carregar o script
fetchTestData();

// Exporta os arrays (para uso em outro script ou HTML)
export { lettuceState, cabbageState, tankData };