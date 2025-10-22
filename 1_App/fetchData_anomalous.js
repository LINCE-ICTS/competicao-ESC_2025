import { database } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Define os arrays para armazenar os dados
var pressoes = [];
var radiacoes = [];
var temperaturas = [];
var umidades = [];
var anomalias = [];
var timestamps = [];

// Função para buscar e exibir dados do Realtime Database
function fetchAnomalousData() {
    const dataRef = ref(database, "dados_anomalos_teste");  // Refere-se à chave "dados_anomalos_teste"

    // Retorna uma Promise para garantir que os dados foram carregados
    return get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Limpa os arrays para evitar dados duplicados
            pressoes = [];
            radiacoes = [];
            temperaturas = [];
            umidades = [];
            anomalias = [];
            timestamps = [];

            // Itera sobre cada nó de dados meteorológicos
            Object.keys(data).forEach((key) => {
                const childData = data[key];

                // Acessando diretamente os dados de cada "child"
                const timestamp = childData.timestamp || "Sem timestamp";
                const pressao = childData.Pressao_Atmosferica;
                const radiacao = childData.Radiacao_Global;
                const temperatura = childData.Temperatura_Ar;
                const umidade = childData.Umidade_Relativa;
                const anomalia = childData.Anomalia_Pluviometrica;

                // Adiciona os valores aos arrays correspondentes
                pressoes.push(pressao);
                radiacoes.push(radiacao);
                temperaturas.push(temperatura);
                umidades.push(umidade);
                anomalias.push(anomalia);
                timestamps.push(timestamp);
            });

            // Combina os arrays em um único array de objetos para ordenação
            const combinedData = timestamps.map((timestamp, index) => ({
                timestamp,
                temperatura: temperaturas[index],
                umidade: umidades[index],
                pressao: pressoes[index],
                radiacao: radiacoes[index],
                anomalia: anomalias[index]
            }));

            // Ordena os dados com base no timestamp (convertido para número de milissegundos)
            combinedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            // Separa novamente os dados nos arrays originais
            timestamps = combinedData.map(data => data.timestamp);
            temperaturas = combinedData.map(data => data.temperatura);
            umidades = combinedData.map(data => data.umidade);
            pressoes = combinedData.map(data => data.pressao);
            radiacoes = combinedData.map(data => data.radiacao);
            anomalias = combinedData.map(data => data.anomalia);

            // Exibe os dados no Console
            console.log("Temperaturas:", temperaturas);
            console.log("Umidades:", umidades);
            console.log("Pressões:", pressoes);
            console.log("Radiação Global:", radiacoes);
            console.log("Anomalia Pluviométrica:", anomalias);
            console.log("Timestamps:", timestamps);
        } else {
            console.log("Nenhum dado encontrado.");
        }
    }).catch((error) => {
        console.error("Erro ao buscar os dados:", error);
    });
}

// Função para obter os dados
function getAnomalousDataArrays() {
    console.log("DADOS P/ ANOMALIA ACESSADOS!");
    return {
        pressoes,
        radiacoes,
        temperaturas,
        umidades,
        anomalias,
        timestamps
    };
}

// Expondo as funções "fetchAnomalousData" e "getAnomalousDataArrays" ao escopo global
window.fetchAnomalousData = fetchAnomalousData;
window.getAnomalousDataArrays = getAnomalousDataArrays;