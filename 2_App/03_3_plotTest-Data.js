import { lettuceState, cabbageState, tankData, pumpsData } from "./03_2_fetchTest-Data.js";

// Botão para plot dos dados
const dataBtn = document.getElementById('fetch-Data');
const hist_dataSelect = document.getElementById('select-var_choice');

const lettuceBlock = document.getElementById('lettuce-block');
const cabbageBlock = document.getElementById('cabbage-block');

// Diseassed Plants variables
const diseasedPlants = [
    { type: "lettuce", location: "Ramo 1, Posição 1" },
    { type: "lettuce", location: "Ramo 1, Posição 2" },
    { type: "lettuce", location: "Ramo 1, Posição 3" }
];

// Sample historical data (replace with your actual data)
const historicalData = {
    'choice-1': [7.2, 7.1, 7.3, 7.0, 7.4, 7.2, 7.1], // PH data
    'choice-2': [22.5, 23.1, 22.8, 23.5, 22.9, 23.2, 22.7], // Temperature
    'choice-3': [1.2, 1.3, 1.1, 1.4, 1.2, 1.3, 1.1], // Conductivity
    'choice-4': [450, 480, 420, 460, 440, 470, 430] // Luminosity
};


function updatePlantDisplay(data){
    let lettuceCount = 0;
    let cabbageCount = 0;

    const lettuceList = document.getElementById("lettuce-locations");
    const cabbageList = document.getElementById("cabbage-locations");

    lettuceList.innerHTML = "";
    cabbageList.innerHTML = "";

    data.forEach(p => {
        if(p.type === "lettuce"){
            lettuceCount++;
            lettuceList.innerHTML += `<li>${p.location}</li>`;
        }
        if(p.type === "cabbage"){
            cabbageCount++;
            cabbageList.innerHTML += `<li>${p.location}</li>`;
        }
    });

    document.getElementById("lettuce-info").innerText = `Alfaces doentes: ${lettuceCount}`;
    document.getElementById("cabbage-info").innerText = `Couves doentes: ${cabbageCount}`;

    if (lettuceCount >= "1") {
        lettuceBlock.style.backgroundColor = "#229c576a";
    } else {
        lettuceBlock.style.backgroundColor = "#94229c56";
    }
    if (cabbageCount >= "1") {
        cabbageBlock.style.backgroundColor = "#659c225e";
    } else {
        cabbageBlock.style.backgroundColor = "#94229c56";
    }
}

function createChartJS(selectedParameter) {
    const chartElement = document.getElementById('historical-chart');
    const data = historicalData[selectedParameter];
    const labels = ['6h', '7h', '8h', '9h', '10h', '11h', '12h'];

    chartElement.innerHTML = `<canvas id="myChart"></canvas>`;

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: getParameterName(selectedParameter),
                data: data,
                borderColor: 'rgb(34, 116, 156)',
                backgroundColor: 'rgba(34, 116, 156, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: getParameterName(selectedParameter) + ' - Histórico'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function getParameterName(selectedParameter) {
    const names = {
        'choice-1': 'Nível de PH',
        'choice-2': 'Temperatura (°C)',
        'choice-3': 'Condutividade (mS/cm)',
        'choice-4': 'Luminosidade (lux)'
    };
    return names[selectedParameter];
}


function plotHistoricalData(selectedParameter) {
    // createSimpleChart(selectedParameter);
    createChartJS(selectedParameter);
}
;
function plotData() {
    // // --- Existing code for plant data ---
    // document.getElementById("lettuce-info").textContent = `🟢 Alface`;
    // document.getElementById("cabbage-info").textContent = `🟠 Repolho`;

    // Dados do tanque
    const tankElement = document.getElementById('tank-data');
    if (Array.isArray(tankData) && tankData.length > 0) {
        const data = tankData[0];

        tankElement.classList.add("data-block", "tank");
        tankElement.innerHTML = `
            <h2>Informações do Tanque de Água</h2>
            <img style="width: 80px; height: auto;" src="images/tank-icon.png" alt="Tank Icon" id="tank-name">
           
            <table class="tank-info_table">
                <tr>
                    <td class="tank-icon_cell">
                        <img style="width: 40px; height: auto; padding-bottom: 0px; margin-bottom: 0px;" src="images/ph_level-icon.png" alt="PH Icon" id="PH_icon-name">
                    </td>
                    <td>Nível de PH:</td>
                    <td>${data.sensorPH ?? "?"}</td>
                </tr>
                <tr>
                    <td class="tank-icon_cell">
                        <img style="width: 40px; height: auto; padding-bottom: 0px; margin-bottom: 0px;" src="images/temperature-icon.png" alt="Temperature Icon" id="Temp_icon-name">
                    </td>
                    <td>Temperatura:</td>
                    <td>${data.sensorTemp ?? "?"} °C</td>
                </tr>
                <tr>
                    <td class="tank-icon_cell">
                        <img style="width: 40px; height: auto; padding-bottom: 0px; margin-bottom: 0px;" src="images/condElect-icon.png" alt="Conductivity Icon" id="Cond_icon-name">
                    </td>
                    <td>Condutividade:</td>
                    <td>${data.sensorEleCond ?? "?"} mS/cm</td>
                </tr>
                <tr>
                    <td class="tank-icon_cell">
                        <img style="width: 40px; height: auto; padding-bottom: 0px; margin-bottom: 0px;" src="images/lamp-icon.png" alt="Luminosity Icon" id="Lum_icon-name">
                    </td>
                    <td>Luminosidade:</td>
                    <td>${data.sensorLDRressis ?? "?"} lux</td>
                </tr>
            </table>

            <h3>Histórico dos parâmetros do Tanque</h3>
            <div class="historicData_Section">
              <label for="select-var_choice">Ver Histórico:</label>
              <div id="tankVar-selector">
                <select name="select-var_choice" id="select-var_choice">
                  <option value="choice-1">💧 Nível de PH</option>
                  <option value="choice-2">🌡️ Temperatura [°C]</option>
                  <option value="choice-3">⚡ Condutividade [mS/cm]</option>
                  <option value="choice-4">💡 Luminosidade [lux]</option>
                </select>
              </div>
            </div>
            <div class="historicalData_Plot">
                <div class="chart" id="historical-chart">
                    <p>Selecione um parâmetro acima para visualizar o histórico</p>
                </div>
            </div>      
        `;
        
        // Add event listener for the select element
        const selectElement = document.getElementById('select-var_choice');
        if (selectElement) {
            selectElement.addEventListener('change', (event) => {
                plotHistoricalData(event.target.value);
            });
            // Plot initial chart
            plotHistoricalData(selectElement.value);
        }
        
    } else {
        tankElement.innerHTML = `<p id="tank-info">Dados do tanque indisponíveis!!</p>`;
    }

    // Dados das bombas de água
    var pump1Warn = "transparent"
    var pump2Warn = "transparent"
    var pump3Warn = "transparent"
    var pump4Warn = "transparent"
    const pumpsElement = document.getElementById('pumps-data');
    // Verifica se há dados e se é um array
    if (Array.isArray(pumpsData) && pumpsData.length > 0) {
        const data = pumpsData[0]; // pega o primeiro objeto do array
        
        if (data.pump1WaterVolum <= 100) {
            pump1Warn = "rgba(188, 35, 35, 0.56)"
        } else {
            console.log("🧪 Solução protegidas!")
        }
        if (data.pump2WaterVolum <= 100) {
            pump2Warn = "rgba(188, 35, 35, 0.56)"
        } else {
            console.log("🧪 Solução protegidas!")
        }
        if (data.pump3WaterVolum <= 100) {
            pump3Warn = "rgba(188, 35, 35, 0.56)"
        } else {
            console.log("🧪 Solução protegidas!")
        }
        if (data.pump4WaterVolum == 100) {
            pump4Warn = "rgba(188, 35, 35, 0.56)"
        } else {
            console.log("🧪 Solução protegidas!")
        }

        pumpsElement.classList.add("data-block", "pumps");
        pumpsElement.innerHTML = `
            <h2>Volume de solução das bombas</h2>
           
            <div class="pumps-info_grid">
                <div class="pump-item" style="border-color: ${pump1Warn};">
                    <div class="pump-icon">💧1</div>
                    <div class="pump-label">Bomba 1</div>
                    <div class="pump-value">${data.pump1WaterVolum ?? "?"} ml</div>
                </div>
                <div class="pump-item" style="border-color: ${pump2Warn};">
                    <div class="pump-icon">💧2</div>
                    <div class="pump-label">Bomba 2</div>
                    <div class="pump-value">${data.pump2WaterVolum ?? "?"} ml</div>
                </div>
                <div class="pump-item" style="border-color: ${pump3Warn};">
                    <div class="pump-icon">💧3</div>
                    <div class="pump-label">Bomba 3</div>
                    <div class="pump-value">${data.pump3WaterVolum ?? "?"} ml</div>
                </div>
                <div class="pump-item" style="border-color: ${pump4Warn}; background=${pump4Warn};">
                    <div class="pump-icon">💧4</div>
                    <div class="pump-label">Bomba 4</div>
                    <div class="pump-value">${data.pump4WaterVolum ?? "?"} ml</div>
                </div>
            </div>
        `;
    } else {
        // Caso o array esteja vazio ou inválido
        pumpsElement.innerHTML = `
            <p id="tank-info">Dados das bombas indisponíveis!!</p>
        `;
    }
}

// Event listeners
dataBtn.addEventListener('click', () => {
    plotData();
    updatePlantDisplay(diseasedPlants);
});