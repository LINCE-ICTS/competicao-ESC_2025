// const { colorText, colorLine, colorBackground } = window.appThemeVariables;

let myChart = null; // Variável global para armazenar a instância do gráfico

// Função para filtrar os dados conforme a quantidade selecionada
function filterDataByQuantity(data, quantity) {
    return {
        timestamps: data.timestamps.slice(0, quantity),
        temperaturas: data.temperaturas.slice(0, quantity),
        umidades: data.umidades.slice(0, quantity),
        pressoes: data.pressoes.slice(0, quantity),
        luxs: data.luxs.slice(0, quantity)
    };
}

// Função para plotar o gráfico de Pressão
function plotPressChart(quantity = 100) {
    // Seleciona a div desejada
    const infoData1 = document.getElementById("data-info_1");

    // Remove o canvas existente se já estiver presente
    const existingCanvas = document.getElementById('my-Chart');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Cria um novo elemento <canvas> para exibir o gráfico
    const plotedChart = document.createElement("canvas");
    plotedChart.id = 'my-Chart';
    plotedChart.width = 900;  // Largura
    plotedChart.height = 400; // Altura
    infoData1.appendChild(plotedChart);

    console.log("plotChart!!!!!");

    // Recupera os dados completos
    const data = getDataArrays();
    console.log("Dados totais: ", data);

    // Filtra os dados com base na quantidade selecionada
    const filteredData = filterDataByQuantity(data, quantity);
    console.log("Dados filtrados: ", filteredData);

    // Define o contexto 2D do novo canvas
    const ctx = plotedChart.getContext('2d');

    // Verifica se já existe um gráfico. Se sim, destrói o gráfico anterior.
    if (myChart !== null) {
        myChart.destroy();
    }

    // Cria o gráfico
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
                }
            ]
        },
        options: {
            responsive: true,
            //maintainAspectRatio: false, // Permite personalizar o tamanho
            plugins: {
                title: {
                    display: true, // Habilita o título
                    text: 'Série temporal dos dados de Pressão atmosférica', // Texto do título
                    font: {
                        size: 18, // Tamanho da fonte do título
                        weight: 'bold' // Peso da fonte
                    },
                    //color: '#333', // Cor do título
                    padding: {
                        top: 10, // Espaçamento superior
                        bottom: 10 // Espaçamento inferior
                    }
                }
            },
            scales: {
                x: {
                    title: {                // Título do eixo x
                        display: true,
                        text: 'Tempo',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo x
                        //color: '#333'
                    }
                },
                y: {
                    title: {                // Título do eixo y
                        display: true,
                        text: 'Valores',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo y
                        //color: '#333'
                    }
                }
            }
        }
    });

    console.log("Gráfico de pressão plotado com sucesso!");
}
// Função para plotar o gráfico de Temperatura
function plotTempChart(quantity = 100) {
    // Seleciona a div desejada
    const infoData1 = document.getElementById("data-info_1");

    // Remove o canvas existente se já estiver presente
    const existingCanvas = document.getElementById('my-Chart');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Cria um novo elemento <canvas> para exibir o gráfico
    const plotedChart = document.createElement("canvas");
    plotedChart.id = 'my-Chart';
    plotedChart.width = 800;  // Largura
    plotedChart.height = 400; // Altura
    infoData1.appendChild(plotedChart);

    console.log("plotChart!!!!!");

    // Recupera os dados completos
    const data = getDataArrays();
    console.log("Dados totais: ", data);

    // Filtra os dados com base na quantidade selecionada
    const filteredData = filterDataByQuantity(data, quantity);
    console.log("Dados filtrados: ", filteredData);

    // Define o contexto 2D do novo canvas
    const ctx = plotedChart.getContext('2d');

    // Verifica se já existe um gráfico. Se sim, destrói o gráfico anterior.
    if (myChart !== null) {
        myChart.destroy();
    }

    // Cria o gráfico
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredData.timestamps, // Eixo X
            datasets: [
                {
                    label: 'Temperatura',
                    data: filteredData.temperaturas, // Eixo Y
                    borderColor: 'rgb(210, 72, 72, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            //maintainAspectRatio: false, // Permite personalizar o tamanho
            plugins: {
                title: {
                    display: true, // Habilita o título
                    text: 'Série temporal dos dados de Temperatura do ar', // Texto do título
                    font: {
                        size: 18, // Tamanho da fonte do título
                        weight: 'bold' // Peso da fonte
                    },
                    //color: '#333', // Cor do título
                    padding: {
                        top: 10, // Espaçamento superior
                        bottom: 10 // Espaçamento inferior
                    }
                }
            },
            scales: {
                x: {
                    title: {                // Título do eixo x
                        display: true,
                        text: 'Tempo',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo x
                        //color: '#333'
                    }
                },
                y: {
                    title: {                // Título do eixo y
                        display: true,
                        text: 'Valores',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo y
                        //color: '#333'
                    }
                }
            }
        }
    });

    console.log("Gráfico de temperatura plotado com sucesso!");
}
// Função para plotar o gráfico de Umidade
function plotHumidChart(quantity = 100) {
    // Seleciona a div desejada
    const infoData1 = document.getElementById("data-info_1");

    // Remove o canvas existente se já estiver presente
    const existingCanvas = document.getElementById('my-Chart');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Cria um novo elemento <canvas> para exibir o gráfico
    const plotedChart = document.createElement("canvas");
    plotedChart.id = 'my-Chart';
    plotedChart.width = 800;  // Largura
    plotedChart.height = 400; // Altura
    infoData1.appendChild(plotedChart);

    console.log("plotChart!!!!!");

    // Recupera os dados completos
    const data = getDataArrays();
    console.log("Dados totais: ", data);

    // Filtra os dados com base na quantidade selecionada
    const filteredData = filterDataByQuantity(data, quantity);
    console.log("Dados filtrados: ", filteredData);

    // Define o contexto 2D do novo canvas
    const ctx = plotedChart.getContext('2d');

    // Verifica se já existe um gráfico. Se sim, destrói o gráfico anterior.
    if (myChart !== null) {
        myChart.destroy();
    }

    // Cria o gráfico
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredData.timestamps, // Eixo X
            datasets: [
                {
                    label: 'Umidade',
                    data: filteredData.umidades, // Eixo Y
                    borderColor: 'rgb(34, 116, 156, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            //maintainAspectRatio: false, // Permite personalizar o tamanho
            plugins: {
                title: {
                    display: true, // Habilita o título
                    text: 'Série temporal dos dados de Umidade relativa do ar', // Texto do título
                    font: {
                        size: 18, // Tamanho da fonte do título
                        weight: 'bold' // Peso da fonte
                    },
                    //color: '#333', // Cor do título
                    padding: {
                        top: 10, // Espaçamento superior
                        bottom: 10 // Espaçamento inferior
                    }
                }
            },
            scales: {
                x: {
                    title: {                // Título do eixo x
                        display: true,
                        text: 'Tempo',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo x
                        //color: '#333'
                    }
                },
                y: {
                    title: {                // Título do eixo y
                        display: true,
                        text: 'Valores',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo y
                        //color: '#333'
                    }
                }
            }
        }
    });

    console.log("Gráfico plotado com sucesso!");
}
// Função para plotar o gráfico de Lux
function plotLuxChart(quantity = 100) {
    // Seleciona a div desejada
    const infoData1 = document.getElementById("data-info_1");

    // Remove o canvas existente se já estiver presente
    const existingCanvas = document.getElementById('my-Chart');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Cria um novo elemento <canvas> para exibir o gráfico
    const plotedChart = document.createElement("canvas");
    plotedChart.id = 'my-Chart';
    plotedChart.width = 800;  // Largura
    plotedChart.height = 400; // Altura
    infoData1.appendChild(plotedChart);

    console.log("plotChart!!!!!");

    // Recupera os dados completos
    const data = getDataArrays();
    console.log("Dados totais: ", data);

    // Filtra os dados com base na quantidade selecionada
    const filteredData = filterDataByQuantity(data, quantity);
    console.log("Dados filtrados: ", filteredData);

    // Define o contexto 2D do novo canvas
    const ctx = plotedChart.getContext('2d');

    // Verifica se já existe um gráfico. Se sim, destrói o gráfico anterior.
    if (myChart !== null) {
        myChart.destroy();
    }

    // Cria o gráfico
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredData.timestamps, // Eixo X
            datasets: [
                {
                    label: 'Lux',
                    data: filteredData.luxs, // Eixo Y
                    borderColor: 'rgb(210, 210, 0, 1)',
                    backgroundColor: 'rgb(210, 210, 0, 0.2)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            //maintainAspectRatio: false, // Permite personalizar o tamanho
            plugins: {
                title: {
                    display: true, // Habilita o título
                    text: 'Série temporal dos dados de Radiação luminosa', // Texto do título
                    font: {
                        size: 18, // Tamanho da fonte do título
                        weight: 'bold' // Peso da fonte
                    },
                    //color: '#333', // Cor do título
                    padding: {
                        top: 10, // Espaçamento superior
                        bottom: 10 // Espaçamento inferior
                    }
                }
            },
            scales: {
                x: {
                    title: {                // Título do eixo x
                        display: true,
                        text: 'Tempo',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo x
                        //color: '#333'
                    }
                },
                y: {
                    title: {                // Título do eixo y
                        display: true,
                        text: 'Valores',
                        //color: '#333'
                    },
                    ticks: {                // Rótulos do eixo y
                        //color: '#333'
                    }
                }
            }
        }
    });

    console.log("Gráfico plotado com sucesso!");
}

// Função para lidar com a seleção da quantidade de dados
function handleDataQuantitySelection() {
    const quantityInput = document.getElementById('data-quantity'); // Seletor de quantidade de dados

    const quantity = parseInt(quantityInput.value);

    // Função para lidar com o clique do botão de Pressão e chamar o gráfico
    document.getElementById('press-btn').addEventListener('click', function () {
        console.log("Chamando plotPressChart com quantidade:", quantity);
        plotPressChart(quantity); // Usa o valor atualizado de `quantity`
    });
    // Função para lidar com o clique do botão de Temperatura e chamar o gráfico
    document.getElementById('temp-btn').addEventListener('click', function () {
        console.log("Chamando plotTempChart com quantidade:", quantity);
        plotTempChart(quantity); // Usa o valor atualizado de `quantity`
    });
    // Função para lidar com o clique do botão de Umidade e chamar o gráfico
    document.getElementById('humid-btn').addEventListener('click', function () {
        console.log("Chamando plotHumidChart com quantidade:", quantity);
        plotHumidChart(quantity); // Usa o valor atualizado de `quantity`
    });
    // Função para lidar com o clique do botão de Umidade e chamar o gráfico
    document.getElementById('lux-btn').addEventListener('click', function () {
        console.log("Chamando plotLuxChart com quantidade:", quantity);
        plotLuxChart(quantity); // Usa o valor atualizado de `quantity`
    });
}

// Exemplo de como integrar com a interface de usuário (HTML)
document.addEventListener("DOMContentLoaded", () => {
    // Adiciona um ouvinte para o evento de mudança no campo de quantidade de dados
    document.getElementById('data-quantity').addEventListener('change', handleDataQuantitySelection);
});

// Expondo a função "plotChart" ao escopo global
window.plotPressChart = plotPressChart;
window.plotTempChart = plotTempChart;
window.plotHumidChart = plotHumidChart;
window.plotLuxChart = plotLuxChart;

window.handleDataQuantitySelection = handleDataQuantitySelection;