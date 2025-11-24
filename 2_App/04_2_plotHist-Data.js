import { lettuceState, cabbageState, tankData, pumpsData } from "./03_2_fetchTest-Data.js";

// Botão para plot dos dados
const hist_dataBtn = document.getElementById('Plot-HistData');



function plotHistoricalData() {
    console.log('_plotHistoricalData_ called');

    // --- Exibe os dados no HTML ---
    const histDataElement = document.getElementById('historicalData_Plot');
    console.log('histDataElement:', histDataElement);

    // Check if element exists
    if (!histDataElement) {
        console.error('❌ historicalData_Plot element not found!');
        return;
    }

    // Check if we have data
    let data = null;
    if (Array.isArray(tankData) && tankData.length > 0) {
        data = tankData[0];
        console.log('First data object:', data);
    } else {
        console.log('tankData is empty or invalid');
        histDataElement.innerHTML = `
            <p id="tank-info">Dados do tanque indisponíveis!!</p>
        `;
        return;
    }


    histDataElement.classList.add("data-block", "tank");
    histDataElement.innerHTML = `
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
        <button id="Plot-HistData">Plotar histórico!</button>
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
        <div id="historicalData_Plot"></div>      
    `;
    console.log('✅ Carousel created successfully');
}

// Add event listener only if button exists
if (hist_dataBtn) {
    hist_dataBtn.addEventListener('click', () => {
        plotHistoricalData();
    });
    console.log('✅ Event listener added to button');
} else {
    console.error('❌ Plot-HistData button not found!');
}

dataBtn.addEventListener('click', () => {
    plotHistoricalData();
});





















import { lettuceState, cabbageState, tankData, pumpsData } from "./03_2_fetchTest-Data.js";

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the button element
    const hist_dataBtn = document.getElementById('Plot-HistData');

    // Debug: Check if element exists
    console.log('📈 Button element:', hist_dataBtn);
    console.log('Initial tankData:', tankData);

    function plotHistoricalData() {
        console.log('_plotHistoricalData_ called');

        // --- Exibe os dados no HTML ---
        const histDataElement = document.getElementById('historicalData_Plot');
        console.log('histDataElement:', histDataElement);
        
        // Check if element exists
        if (!histDataElement) {
            console.error('❌ historicalData_Plot element not found!');
            return;
        }

        // Check if we have data
        let data = null;
        if (Array.isArray(tankData) && tankData.length > 0) {
            data = tankData[0];
            console.log('First data object:', data);
        } else {
            console.log('tankData is empty or invalid');
            histDataElement.innerHTML = `
                <p id="tank-info">Dados do tanque indisponíveis!!</p>
            `;
            return;
        }

        histDataElement.classList.add("hist_data-block", "tank");
        histDataElement.innerHTML = `
            <section class="carousel" aria-label="Gallery">
                <ol class="carousel__viewport">
                    <li id="carousel__slide1"
                        tabindex="0"
                        class="carousel__slide">
                        <div class="carousel__snapper">
                            <h4>Histórico de PH</h4>
                            <p>Valor atual: ${data.sensorPH ?? "N/A"}</p>
                            <p>Dados de PH serão plotados aqui</p>
                            <a href="#carousel__slide4"
                            class="carousel__prev">Slide anterior</a>
                            <a href="#carousel__slide2"
                            class="carousel__next">Próximo slide</a>
                        </div>
                    </li>
                    <li id="carousel__slide2"
                        tabindex="0"
                        class="carousel__slide">
                        <div class="carousel__snapper">
                            <h4>Histórico de Temperatura</h4>
                            <p>Valor atual: ${data.sensorTemp ?? "N/A"} °C</p>
                            <p>Dados de temperatura serão plotados aqui</p>
                        </div>
                        <a href="#carousel__slide1"
                            class="carousel__prev">Slide anterior</a>
                        <a href="#carousel__slide3"
                            class="carousel__next">Próximo slide</a>
                    </li>
                    <li id="carousel__slide3"
                        tabindex="0"
                        class="carousel__slide">
                        <div class="carousel__snapper">
                            <h4>Histórico de Condutividade</h4>
                            <p>Valor atual: ${data.sensorEleCond ?? "N/A"} mS/cm</p>
                            <p>Dados de condutividade serão plotados aqui</p>
                        </div>
                        <a href="#carousel__slide2"
                            class="carousel__prev">Slide anterior</a>
                        <a href="#carousel__slide4"
                            class="carousel__next">Próximo slide</a>
                    </li>
                    <li id="carousel__slide4"
                        tabindex="0"
                        class="carousel__slide">
                        <div class="carousel__snapper">
                            <h4>Histórico de Luminosidade</h4>
                            <p>Valor atual: ${data.sensorLDRressis ?? "N/A"} lux</p>
                            <p>Dados de luminosidade serão plotados aqui</p>
                        </div>
                        <a href="#carousel__slide3"
                            class="carousel__prev">Slide anterior</a>
                        <a href="#carousel__slide1"
                            class="carousel__next">Primeiro slide</a>
                    </li>
                </ol>
                <aside class="carousel__navigation">
                    <ol class="carousel__navigation-list">
                        <li class="carousel__navigation-item">
                            <a href="#carousel__slide1"
                            class="carousel__navigation-button">PH</a>
                        </li>
                        <li class="carousel__navigation-item">
                            <a href="#carousel__slide2"
                            class="carousel__navigation-button">Temperatura</a>
                        </li>
                        <li class="carousel__navigation-item">
                            <a href="#carousel__slide3"
                            class="carousel__navigation-button">Condutividade</a>
                        </li>
                        <li class="carousel__navigation-item">
                            <a href="#carousel__slide4"
                            class="carousel__navigation-button">Luminosidade</a>
                        </li>
                    </ol>
                </aside>
            </section>
        `;

        console.log('✅ Carousel created successfully');
    }

    // Add event listener only if button exists
    if (hist_dataBtn) {
        hist_dataBtn.addEventListener('click', () => {
            plotHistoricalData();
        });
        console.log('✅ Event listener added to button');
    } else {
        console.error('❌ Plot-HistData button not found!');
    }
});