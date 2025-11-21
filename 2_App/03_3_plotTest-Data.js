import { lettuceState, cabbageState, tankData } from "./03_2_fetchTest-Data.js";

// Botão para plot dos dados
const dataBtn = document.getElementById('fetch-Data');

const lettuceBlock = document.getElementById('lettuce-block');
const cabbageBlock = document.getElementById('cabbage-block');


// Função para mudar cor de Background com base nos valores das variáveis
function updateBackgroundColor() {
    if (lettuceState[0] === "1,0,0") { // Supondo que "1,0,1" indica um estado específico
        lettuceBlock.style.backgroundColor = "#229c576a"; // Verde claro para saudável
    } else {
        lettuceBlock.style.backgroundColor = "#94229c56"; // Vermelho claro para doente
    }
    if (cabbageState[0] === "0,0,1") { // Supondo que "1,0,1" indica um estado específico
        cabbageBlock.style.backgroundColor = "#659c225e"; // Verde claro para saudável
    } else {
        cabbageBlock.style.backgroundColor = "#94229c56"; // Vermelho claro para doente
    }
}

function plotData() {
    // --- Exibe os dados no HTML ---
    // Dados das culturas
    document.getElementById("lettuce-info").textContent =
        // `🟢 Alface ${lettuceState}`;
        `🟢 Alface`;
    document.getElementById("cabbage-info").textContent =
        `🟠 Repolho`;

    // Dados do tanque
    const tankElement = document.getElementById('tank-data');

    // Verifica se há dados e se é um array
    if (Array.isArray(tankData) && tankData.length > 0) {
        const data = tankData[0]; // pega o primeiro objeto do array

        tankElement.classList.add("data-block", "tank");
        tankElement.innerHTML = `
            <h2>Informações do Tanque de Água</h2>
            <img style="width: 80px; height: auto;" src="images/tank-icon.png" alt="Tank Icon" id="tank-name">
            <p id="tank-info">
                💧 Nível de PH: ${data.sensorPH ?? "?"}<br>
                🌡️ Temperatura: ${data.sensorTemp ?? "?"} °C<br>
                ⚡ Condutividade: ${data.sensorEleCond ?? "?"} mS/cm<br>
                📦 Volume: ${data.sensorWaterVolum ?? "?"} cm³
            </p>
        `;
    } else {
        // Caso o array esteja vazio ou inválido
        tankElement.innerHTML = `
            <p id="tank-info">Dados do tanque indisponíveis!!</p>
        `;
    }
}

dataBtn.addEventListener('click', () => {
    plotData();
    updateBackgroundColor();
});