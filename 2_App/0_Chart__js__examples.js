import { lettuceState, cabbageState, tankData, pumpsData } from "./03_2_fetchTest-Data.js";

// Botão para plot dos dados
const dataBtn = document.getElementById('fetch-Data');
const hist_dataSelect = document.getElementById('select-var_choice');

const lettuceBlock = document.getElementById('lettuce-block');
const cabbageBlock = document.getElementById('cabbage-block');

// Sample historical data (replace with your actual data)
const historicalData = {
    'choice-1': [7.2, 7.1, 7.3, 7.0, 7.4, 7.2, 7.1], // PH data
    'choice-2': [22.5, 23.1, 22.8, 23.5, 22.9, 23.2, 22.7], // Temperature
    'choice-3': [1.2, 1.3, 1.1, 1.4, 1.2, 1.3, 1.1], // Conductivity
    'choice-4': [450, 480, 420, 460, 440, 470, 430] // Luminosity
};

function updateBackgroundColor() {
    if (lettuceState[0] === "1,0,0") {
        lettuceBlock.style.backgroundColor = "#229c576a";
    } else {
        lettuceBlock.style.backgroundColor = "#94229c56";
    }
    if (cabbageState[0] === "0,0,1") {
        cabbageBlock.style.backgroundColor = "#659c225e";
    } else {
        cabbageBlock.style.backgroundColor = "#94229c56";
    }
}

function createSimpleChart(selectedParameter) {
    const chartElement = document.getElementById('historical-chart');
    const data = historicalData[selectedParameter];
    const labels = ['6h', '7h', '8h', '9h', '10h', '11h', '12h'];
    
    const chartTitles = {
        'choice-1': 'Histórico de Nível de PH',
        'choice-2': 'Histórico de Temperatura',
        'choice-3': 'Histórico de Condutividade', 
        'choice-4': 'Histórico de Luminosidade'
    };
    
    chartElement.innerHTML = `
        <div class="chart-container">
            <h4>${chartTitles[selectedParameter]}</h4>
            <div class="chart-content">
                <div class="chart-bars">
                    ${data.map((value, index) => `
                        <div class="bar-container">
                            <div class="bar" style="height: ${(value / Math.max(...data)) * 80}%"></div>
                            <span class="bar-value">${value}</span>
                            <span class="bar-label">${labels[index]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="chart-stats">
                <div class="stat-item">
                    <span class="stat-label">Máximo:</span>
                    <span class="stat-value">${Math.max(...data)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mínimo:</span>
                    <span class="stat-value">${Math.min(...data)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Média:</span>
                    <span class="stat-value">${(data.reduce((a, b) => a + b) / data.length).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
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


function createGaugeChart(selectedParameter) {
    const chartElement = document.getElementById('historical-chart');
    const currentValue = historicalData[selectedParameter][historicalData[selectedParameter].length - 1];
    
    chartElement.innerHTML = `
        <div class="gauge-container">
            <h4>${getParameterName(selectedParameter)} - Valor Atual</h4>
            <div class="gauge">
                <div class="gauge__fill" style="transform: rotate(${(currentValue / 10) * 180}deg)"></div>
                <div class="gauge__cover">${currentValue}</div>
            </div>
            <div class="gauge-labels">
                <span>0</span>
                <span>5</span>
                <span>10</span>
            </div>
        </div>
    `;
}



function plotHistoricalData(selectedParameter) {
    // createSimpleChart(selectedParameter);
    createChartJS(selectedParameter);
    // createGaugeChart(selectedParameter);
}
;
function plotData() {
    // --- Existing code for plant data ---
    document.getElementById("lettuce-info").textContent = `🟢 Alface`;
    document.getElementById("cabbage-info").textContent = `🟠 Repolho`;

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

    // ... rest of your pumps data code
}

// Event listeners
dataBtn.addEventListener('click', () => {
    plotData();
    updateBackgroundColor();
});