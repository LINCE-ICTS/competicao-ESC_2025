let myChart = null; // Variável global para armazenar a instância do gráfico

// Função para filtrar os dados conforme a quantidade selecionada
function filterDataByQuantity(data, quantity) {
    return {
        timestamps: data.timestamps.slice(0, quantity),
        temperaturas: data.temperaturas.slice(0, quantity),
        umidades: data.umidades.slice(0, quantity),
        pressoes: data.pressoes.slice(0, quantity),
        radiacoes: data.radiacoes.slice(0, quantity),
        anomalias: data.anomalias.slice(0, quantity) // Incluindo anomalias
    };
}

// Função para plotar o gráfico de todos os dados
function plotAllCharts(quantity = 100) {
    // Seleciona a div desejada
    const infoData2 = document.getElementById("data-info_2");

    // Remove o canvas existente se já estiver presente
    const existingCanvas = document.getElementById('my-Chart2');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Cria um novo elemento <canvas> para exibir o gráfico
    const plotedChart = document.createElement("canvas");
    plotedChart.id = 'my-Chart2';
    plotedChart.width = 900;  // Largura
    plotedChart.height = 400; // Altura
    infoData2.appendChild(plotedChart);

    console.log("plotChart - Gráfico de múltiplos dados");

    // Recupera os dados completos
    const data = getAnomalousDataArrays();
    console.log("Dados totais para anomalia: ", data);

    // Filtra os dados com base na quantidade selecionada
    const filteredData = filterDataByQuantity(data, quantity);
    console.log("Dados filtrados para anomalia: ", filteredData);

    // Define o contexto 2D do novo canvas
    const ctx = plotedChart.getContext('2d');

    // Verifica se já existe um gráfico. Se sim, destrói o gráfico anterior.
    if (myChart !== null) {
        myChart.destroy();
    }

    // Cria o gráfico com múltiplos datasets
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredData.timestamps, // Eixo X
            datasets: [
                {
                    label: 'Pressão',
                    data: filteredData.pressoes,
                    borderColor: 'rgb(78, 212, 78, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2
                },
                {
                    label: 'Temperatura',
                    data: filteredData.temperaturas,
                    borderColor: 'rgb(210, 72, 72, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2
                },
                {
                    label: 'Umidade',
                    data: filteredData.umidades,
                    borderColor: 'rgb(34, 116, 156, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2
                },
                {
                    label: 'Lux',
                    data: filteredData.radiacoes,
                    borderColor: 'rgb(210, 210, 0, 1)',
                    backgroundColor: 'rgb(210, 210, 0, 0.2)',
                    borderWidth: 2
                },
                // Dataset adicional para anomalia
                {
                    label: 'Anomalia',
                    data: filteredData.timestamps.map((timestamp, index) => {
                        return filteredData.anomalias[index] === 1 ? filteredData.pressoes[index] : null; // Ponto visível nas anomalias
                    }),
                    borderColor: 'rgb(148, 50, 188, 1)',
                    backgroundColor: 'rgb(148, 50, 188, 0.2)',
                    borderWidth: 1,
                    pointRadius: 5, // Tamanho dos pontos da anomalia
                    fill: false,
                    hidden: false, // Inicialmente visível na legenda
                    pointHoverRadius: 10, // Tamanho do ponto quando o mouse passa por cima
                    pointBackgroundColor: 'red' // Garantindo a cor vermelha para os pontos
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true, // Habilita o título
                    text: 'Série temporal dos dados', // Texto do título
                    font: {
                        size: 18, // Tamanho da fonte do título
                        weight: 'bold' // Peso da fonte
                    },
                    padding: {
                        top: 10, // Espaçamento superior
                        bottom: 10 // Espaçamento inferior
                    }
                },
                tooltip: {
                    callbacks: {
                        // Customizando o tooltip para anomalias
                        label: function(tooltipItem) {
                            if (tooltipItem.datasetIndex === 4) { // Índice do dataset de anomalias
                                return `Anomalia: ${tooltipItem.raw}`; // Exibe "Anomalia: valor"
                            }
                            return tooltipItem.label + ': ' + tooltipItem.raw; // Exibe as variáveis normais
                        }
                    }
                },
                annotation: {
                    annotations: [] // Inicializa as anotações para as anomalias
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tempo'
                    },
                    ticks: {}
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valores'
                    },
                    ticks: {}
                }
            }
        }
    });

    // Adiciona as linhas verticais para as anomalias
    const anomalyAnnotations = filteredData.anomalias
        .map((a, index) => {
            // Verifica se a anomalia é 1 (pode ser número ou string, vamos garantir que é 1)
            if (a === 1 || a === '1') {
                return {
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x',
                    value: filteredData.timestamps[index], // A posição no eixo X onde a anomalia ocorre
                    borderColor: 'rgb(148, 50, 188)',
                    borderWidth: 2,
                    label: {
                        content: 'Anomalia',
                        enabled: false // Desabilita o label da anomalia sobre a linha
                    }
                };
            }
            return null;
        })
        .filter(item => item !== null); // Filtra as anomalias

    // Adiciona as anomalias ao gráfico
    myChart.options.plugins.annotation.annotations = anomalyAnnotations;

    // Atualiza o gráfico
    myChart.update();

    console.log("Gráfico de múltiplos dados plotado com sucesso!");
}

// Função para lidar com a seleção da quantidade de dados
function handleAnomalousDataQuantitySelection() {
    const quantityInput = document.getElementById('data-quantity2'); // Seletor de quantidade de dados

    const quantity = parseInt(quantityInput.value);

    // Função para lidar com o clique do botão e chamar o gráfico
    document.getElementById('all-data-btn').addEventListener('click', function () {
        console.log("Chamando plotAllCharts com quantidade:", quantity);
        plotAllCharts(quantity); // Usa o valor atualizado de `quantity`
    });
}

// Exemplo de como integrar com a interface de usuário (HTML)
document.addEventListener("DOMContentLoaded", () => {
    // Adiciona um ouvinte para o evento de mudança no campo de quantidade de dados
    document.getElementById('data-quantity2').addEventListener('change', handleAnomalousDataQuantitySelection);
});

// Expondo a função "plotAllCharts" ao escopo global
window.plotAllCharts = plotAllCharts;

window.handleAnomalousDataQuantitySelection = handleAnomalousDataQuantitySelection;