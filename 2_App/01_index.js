/* --- DECLARAÇÃO DE VARIÁVEIS --- */

// Botão para coletar dados
const dataBtn = document.getElementById('fetch-Data');

// Alternância de modo escuro/claro
const darkMode = document.querySelector('.dark-mode');

// Seleciona o logo LINCE para troca dinâmica
const logo_LINCE = document.getElementById('LINCE-name');

// Seleciona o logo groWatch para troca dinâmica
const logo_groWatch = document.getElementById('groWatch-name');

/* --- EVENTOS PRINCIPAIS --- */

// Clique no botão "Coletar Dados"
dataBtn.addEventListener('click', () => {
    console.log("Iniciando coleta de dados...");

    // Coleta dados principais
    fetchData()
        .then(() => {
            console.log("Dados coletados com sucesso!");
            getDataArrays();
        })
        .catch((error) => {
            console.error("Erro ao coletar dados principais:", error);
        });

    // Coleta dados anômalos
    fetchAnomalousData()
        .then(() => {
            console.log("Dados anômalos coletados com sucesso!");
            getAnomalousDataArrays();
        })
        .catch((error) => {
            console.error("Erro ao coletar dados anômalos:", error);
        });
});

// Clique para alternar o modo escuro/claro
darkMode.addEventListener('click', () => {
    // Alterna a classe global de tema
    document.body.classList.toggle('dark-mode-variables');

    // Alterna o ícone ativo (sol/lua)
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');

    // Atualiza o logo do LINCE
    if (document.body.classList.contains('dark-mode-variables')) {
        logo_LINCE.src = 'images/LINCE-blackMode-S_ICTS.png';
    } else {
        logo_LINCE.src = 'images/LINCE-whiteMode-S_ICTS.png';
    }

    // Atualiza o logo do groWatch
    if (document.body.classList.contains('dark-mode-variables')) {
        logo_groWatch.src = 'images/groWatch - logo_S-fundo_claro.png';
    } else {
        logo_groWatch.src = 'images/groWatch - logo_S-fundo_escuro.png';
    }

    // Atualiza os iconês das culturas (lettuce e cabbage)
    const lettuceIcons = document.getElementById('lettuce-name');
    const cabbageIcons = document.getElementById('cabbage-name');
    if (document.body.classList.contains('dark-mode-variables')) {
        lettuceIcons.src = 'images/lettuce-icon_Escuro.png';
    } else {
        lettuceIcons.src = 'images/lettuce-icon.png';
    }
    if (document.body.classList.contains('dark-mode-variables')) {
        cabbageIcons.src = 'images/cabbage-icon_Escuro.png';
    } else {
        cabbageIcons.src = 'images/cabbage-icon.png';
    }

    // Atualiza o icone do Tank
    const tankIcon = document.getElementById('tank-name');
    if (document.body.classList.contains('dark-mode-variables')) {
        tankIcon.src = 'images/tank-icon_Escuro.png';
    } else {
        tankIcon.src = 'images/tank-icon.png';
    }

    console.log("Tema alternado. Modo escuro:", document.body.classList.contains('dark-mode-variables'));
});

// /* --- OPCIONAL: Inserir dados no painel (placeholder visual) --- */
// // Exemplo: Atualizar blocos de dados (lettuce e cabbage) após coleta
// function updateDataVisuals() {
//     const output = document.getElementById('data-output');
//     if (!output) return;

//     output.innerHTML = `
//         <div class="data-block lettuce">
//           <img src="images/icon_lettuce.png" alt="Lettuce Icon">
//           <p>Última coleta de alface: ${new Date().toLocaleString()}</p>
//         </div>
//         <div class="data-block cabbage">
//           <img src="images/icon_cabbage.png" alt="Cabbage Icon">
//           <p>Última coleta de repolho: ${new Date().toLocaleString()}</p>
//         </div>
//     `;
// }

// Executa o update visual após cada coleta
dataBtn.addEventListener('click', updateDataVisuals);