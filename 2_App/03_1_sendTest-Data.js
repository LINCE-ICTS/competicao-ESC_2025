// Import da conexão criada com o Realtime Database por meio do "01_index.js"
import { database } from "./02_firebase.js";
import { ref, set, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Função para configurar os a estrutura de nós de teste
function newTestDataArch() {
    // Referência ao nó "testData" do Realtime Database
    const testDataRef = ref(database, 'testData');
    
    // Cria um novo nó filho com um ID único
    const newTestDataRef = ref(database, 'testData/newTestData');
    // Cria novos nós característicos dentro do novo nó filho
    const lettuceStateRef = ref(database, `testData/${newTestDataRef.key}/lettuceState`);
    const cabbageStateRef = ref(database, `testData/${newTestDataRef.key}/cabbageState`);
    const tankRef = ref(database, `testData/${newTestDataRef.key}/tank`);
    const pumpsRef = ref(database, `testData/${newTestDataRef.key}/pumps`);

    return { newTestDataRef, lettuceStateRef, cabbageStateRef, tankRef, pumpsRef };
}

const { newTestDataRef, lettuceStateRef, cabbageStateRef, tankRef, pumpsRef } = newTestDataArch();

// Função para enviar dados de teste ao Realtime Database
function sendTestData(newTestDataRef, lettuceStateRef, cabbageStateRef, tankRef, pumpsRef) {
    // ---* Dados de teste a serem enviados *---
    const newlettuceData = {
        dados: "1,0,1",
    };
    
    const newcabbageData = {
        dados: "0,0,1",
    };

    const tankData = {
        sensorPH: 7.5, // [ph]
        sensorEleCond: 460, // [mS/cm]
        sensorTemp: 22.0, // [°C]
        sensorLDRressis: 42.0, // [cm^3]
    };

    const pumpsData = {
        pump1WaterVolum: 510.0, // [cm^3]
        pump2WaterVolum: 430.0, // [cm^3]
        pump3WaterVolum: 275.0, // [cm^3]
        pump4WaterVolum: 100.0, // [cm^3]
    };

    // Envia os dados de teste para o Realtime Database
    set(lettuceStateRef, newlettuceData)
        .then(() => {
            console.log("✅ Dados de alface enviados com sucesso!");
            alert("✅ Dados de alface enviados com sucesso!");
        })
        .catch((error) => {
            console.error("❌ Erro ao enviar dados de alface:", error);
            alert("❌ Erro ao enviar dados de alface:");
        });

    set(cabbageStateRef, newcabbageData)
        .then(() => {
            console.log("✅ Dados de repolho enviados com sucesso!");
            alert("✅ Dados de repolho enviados com sucesso!");
        })
        .catch((error) => {
            console.error("❌ Erro ao enviar dados de repolho:", error);
            alert("❌ Erro ao enviar dados de repolho:");
        });
    
    set(tankRef, tankData)
        .then(() => {
            console.log("✅ Dados do tanque enviados com sucesso!");
            alert("✅ Dados do tanque enviados com sucesso!");
        })
        .catch((error) => {
            console.error("❌ Erro ao enviar dados do tanque:", error);
            alert("❌ Erro ao enviar dados do tanque:");
        });

    set(pumpsRef, pumpsData)
        .then(() => {
            console.log("✅ Dados das bombas enviados com sucesso!");
            alert("✅ Dados das bombas enviados com sucesso!");
        })
        .catch((error) => {
            console.error("❌ Erro ao enviar dados das bombas:", error);
            alert("❌ Erro ao enviar dados das bombas:");
        });
}

// Chama a função para enviar os dados de teste
sendTestData(newTestDataRef, lettuceStateRef, cabbageStateRef, tankRef, pumpsRef);