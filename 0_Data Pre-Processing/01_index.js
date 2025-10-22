/* --- DECLARAÇÃO DE VARIÁVEIS --- */

// Seleciona o elemento 'aside' da página e o armazena na variável sideMenu.
const sideMenu = document.querySelector('aside');

// Seleção das ID relacionadas aos botões
const menuBtn = document.getElementById('menu-btn');    // Botão para abrir o sidebar no modo mobile
const closeBtn = document.getElementById('close-btn');  // Botão para fechar o sidebar
const dataBtn = document.getElementById('fetch-Data');  // Botão para coletar os dados no database

// Seleciona e armazena a classe 'dark-mode' em uma variável
const darkMode = document.querySelector('.dark-mode');

/* --- CRIAÇÃO DE EVENTOS --- */

// Adiciona um evento de clique ao botão de menu (menuBtn).
// Quando clicado, o menu lateral (sideMenu) é exibido definindo o estilo 'display' como 'block'.
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

// Adiciona um evento de clique ao botão de fechar (closeBtn).
// Quando clicado, o menu lateral (sideMenu) é ocultado, definindo o estilo 'display' como 'none'.
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

// Adiciona um evento de clique ao botão de coletar dados (dataBtn)
dataBtn.addEventListener('click', () => {
    // Coleta de dados das variáveis
    fetchData()
        .then(() => {
            getDataArrays();
        });
    
    // Coleta de dados das variáveis com os alertas de anomalia
    fetchAnomalousData()
        .then(() => {
            getAnomalousDataArrays();
        });
});

// Adiciona um evento de clique ao elemento de modo escuro (darkMode).
// Quando clicado, alterna a classe 'dark-mode-variables' no corpo do documento,
// permitindo alternar entre temas claro e escuro.
darkMode.addEventListener('click', () => {
    // Alterna a classe do corpo para ativar o modo escuro.
    document.body.classList.toggle('dark-mode-variables');
    
    // Alterna a classe 'active' nos elementos filhos específicos do darkMode.
    // Isso permite alterar a aparência dos ícones ou indicadores de modo escuro e claro.
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');

    // Altera a source da imagem.
    const logo = document.getElementById('LINCE-name');
    if (document.body.classList.contains('dark-mode-variables')) {
        logo.src = 'images/LINCE-blackMode-S_ICTS.png'; // Caminho da imagem para o modo escuro
    } else {
        logo.src = 'images/LINCE-whiteMode-S_ICTS.png'; // Caminho da imagem para o modo claro
    }

    // // Acessa os valores das variáveis do CSS no arquivo .js
    // const rootStyles = getComputedStyle(document.documentElement);

    // // Atribui os valores das variáveis de estilo a variáveis do .js
    // const colorText = rootStyles.getPropertyValue('--color-text').trim();
    // const colorLine = rootStyles.getPropertyValue('--color-info').trim();
    // const colorBackground = rootStyles.getPropertyValue('--color-background').trim();

    // // Verificando os valores no console
    // console.log("Cor do Texto:", colorText);
    // console.log("Cor da Linha:", colorLine);
    // console.log("Cor do Fundo:", colorBackground);

    // // Atualiza o gráfico com as novas variáveis
    // if (myChart !== null) {
    //     myChart.options.plugins.title.color = colorText;
    //     myChart.options.scales.x.title.color = colorText;
    //     myChart.options.scales.x.ticks.color = colorText;
    //     myChart.options.scales.y.title.color = colorText;
    //     myChart.options.scales.y.ticks.color = colorText;
    //     myChart.update();
    // }

    // // Armazenando as variáveis em um escopo global para uso em outros scripts
    // window.appThemeVariables = {
    //     colorText,
    //     colorLine,
    //     colorBackground
    // };

    // // Verificando se as variáveis estão armazenadas globalmente
    // console.log("Variáveis de thema escuro para Chart no escopo global: ", window.appThemeVariables);
});

// export { colorText, colorLine, colorBackground };

// <td class="${user.status === 'Declined' ? 'danger' : user.status === 'Pending' ? 'warning' : 'primary'}">
//     ${user.status}                      // Status do pedido com cor condicional
// </td>

// Itera sobre cada pedido em Orders para gerar linhas de uma tabela com detalhes do pedido.
// Userss.forEach(user => {
//     // Cria um novo elemento <tr> para representar uma linha da tabela.
//     const tr = document.createElement('tr');

//     // Define o conteúdo da linha de tabela com informações do pedido.
//     const trContent = `
//         <td>${user.productName}</td>           // Nome do usuário
//         <td>${user.activityField}</td>          // Campo de atuação
//         <td>${user.affiliatedInstitute}</td>          // Instituto afiliado
//         <td class="primary">Details</td>         // Coluna de ação para detalhes
//     `;
    
//     // Define o conteúdo HTML dentro do elemento <tr>.
//     tr.innerHTML = trContent;
    
//     // Adiciona a linha (tr) ao corpo da tabela na página.
//     document.querySelector('table tbody').appendChild(tr);
// });