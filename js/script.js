/* ==================================================
   AGROVIVA - SCRIPT.JS (Página Única)
   ================================================== */

const estado = { saldo: 0, carbono: 0, clima: "Ideal", pontos: 0 };

function adicionarPontos(qtd) {
    estado.pontos += qtd;
    atualizarDashboard();
    
    let ranking = JSON.parse(localStorage.getItem('rankingAgro')) || [];
    const idx = ranking.findIndex(j => j.nome === "Sua Fazenda");
    if (idx >= 0) ranking[idx].pontos = estado.pontos;
    else ranking.push({ nome: "Sua Fazenda", pontos: estado.pontos });
    
    ranking.sort((a, b) => b.pontos - a.pontos);
    localStorage.setItem('rankingAgro', JSON.stringify(ranking));
    atualizarRanking();
}

function atualizarDashboard() {
    document.querySelector("#saldo").innerText = `R$ ${estado.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.querySelector("#carbono").innerText = `${estado.carbono.toFixed(2)} t`;
    document.querySelector("#clima-atual").innerText = estado.clima;
    document.querySelector("#pontos").innerText = estado.pontos;
}

// Calculadora Financeira
document.querySelector("#btn-calcular").addEventListener("click", () => {
    const custos = parseFloat(document.querySelector("#custos").value) || 0;
    const vendas = parseFloat(document.querySelector("#vendas").value) || 0;
    const lucro = vendas - custos;
    estado.saldo += lucro;
    adicionarPontos(15);
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-financeiro");
    res.style.display = "block";
    res.innerHTML = `
        <p><strong>Lucro Projetado:</strong> R$ ${lucro.toFixed(2)}</p>
        <p style="color: ${lucro > 0 ? 'green' : 'red'}; mt-2">${lucro > 0 ? '✅ Safra Lucrativa' : '⚠️ Revisar Custos'}</p>
    `;
});

// Mercado de Carbono
document.querySelector("#btn-carbono").addEventListener("click", () => {
    const area = parseFloat(document.querySelector("#area-carbono").value) || 0;
    const manejo = document.querySelector("#manejo").value;
    let fator = manejo === "ilpf" ? 4.2 : manejo === "direto" ? 2.5 : 1.1;
    
    const carbonoGerado = area * fator;
    estado.carbono += carbonoGerado;
    estado.saldo += (carbonoGerado * 80); 
    adicionarPontos(30);
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-carbono");
    res.style.display = "block";
    res.innerHTML = `<p>✅ <strong>${carbonoGerado.toFixed(2)} t</strong> de CO2 retidas. Créditos adicionados ao saldo!</p>`;
});

// Simulador Climático
document.querySelector("#btn-clima").addEventListener("click", () => {
    const clima = document.querySelector("#clima-select").value;
    const efeitos = {
        ideal: { texto: "Clima perfeito! Janela de plantio aberta.", pts: 10, exibe: "Ideal" },
        seca: { texto: "Atenção: Ative o sistema de irrigação inteligente.", pts: -5, exibe: "Seca" },
        geada: { texto: "Perigo: Cubra as mudas e proteja as estufas.", pts: -10, exibe: "Geada" },
        chuva: { texto: "Risco de fungos. Inspecione a drenagem do solo.", pts: -5, exibe: "Chuva" }
    };
    estado.clima = efeitos[clima].exibe;
    adicionarPontos(efeitos[clima].pts);
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-clima");
    res.style.display = "block";
    res.innerHTML = `<p><strong>Previsão:</strong> ${efeitos[clima].texto}</p>`;
});

// Gestão de Estufas
document.querySelector("#btn-estufa").addEventListener("click", () => {
    const temp = parseFloat(document.querySelector("#temperatura").value) || 0;
    const res = document.querySelector("#resultado-estufa");
    res.style.display = "block";
    if(temp > 30) res.innerHTML = "🔥 Muito quente! Ligando exaustores.";
    else if(temp < 15) res.innerHTML = "❄️ Frio extremo! Ligando aquecimento.";
    else res.innerHTML = "✅ Ambiente perfeitamente controlado.";
});

// CEASA Local Dinâmico
let produtos = [
    { emoji: "🍅", nome: "Tomate", preco: 4.50 }, { emoji: "🌽", nome: "Milho", preco: 1.20 },
    { emoji: "🌾", nome: "Soja", preco: 3.80 }, { emoji: "🥬", nome: "Alface", preco: 2.00 },
    { emoji: "🥛", nome: "Leite", preco: 2.50 }, { emoji: "🥩", nome: "Bovino", preco: 18.90 }
];

function atualizarCEASA() {
    produtos.forEach(p => { p.preco += (Math.random() - 0.45) * 0.3; });
    document.querySelector("#tabela-ceasa").innerHTML = `<div class="ceasa-grid">` + 
        produtos.map(p => `
            <div class="ceasa-card">
                <div style="font-size: 2rem;">${p.emoji}</div>
                <div>${p.nome}</div>
                <div class="preco">R$ ${Math.max(0.5, p.preco).toFixed(2)}</div>
            </div>
        `).join("") + `</div>`;
}
setInterval(atualizarCEASA, 5000);
atualizarCEASA();

// 6 NOTÍCIAS DINÂMICAS 
const noticias = [
    { img: "img/noticia-soja.jpg", titulo: "Soja Bate Recorde", texto: "Tecnologia de precisão aumenta produtividade na região sul do Brasil em 15%." },
    { img: "img/noticia-tecnologia.jpg", titulo: "Sensores Salivam Safra", texto: "Rede de dados previne pragas antes mesmo delas atacarem as raízes." },
    { img: "img/noticia-estufa.jpg", titulo: "Revolução nas Estufas", texto: "Iluminação de LED otimiza fotossíntese de hortaliças reduzindo custos." },
    { img: "img/noticia-soja.jpg", titulo: "Mercado de Carbono", texto: "Produtores rurais lucram transformando fazendas em sumidouros de CO2." },
    { img: "img/noticia-tecnologia.jpg", titulo: "Drones Pulverizadores", texto: "Nova frota de drones mapeia e aplica defensivos com precisão milimétrica." },
    { img: "img/noticia-estufa.jpg", titulo: "Gestão Hídrica", texto: "Fazendas do Paraná reaproveitam 100% da água da chuva em sistemas fechados." }
];

document.querySelector("#lista-noticias").innerHTML = noticias.map(n => `
    <div class="noticia-card">
        <img src="${n.img}" class="noticia-img" alt="Notícia AgroViva">
        <div class="noticia-conteudo">
            <h4>${n.titulo}</h4>
            <p>${n.texto}</p>
        </div>
    </div>
`).join("");

// IA Assistente
document.querySelector("#btn-perguntar").addEventListener("click", () => {
    const input = document.querySelector("#pergunta-ia");
    const pergunta = input.value.toLowerCase();
    if(!pergunta) return;

    const hist = document.querySelector("#historico-ia");
    hist.innerHTML += `<div class="msg-usuario">${input.value}</div>`;
    input.value = "";

    setTimeout(() => {
        let resposta = "🤖 Olá! Verifique o painel para ver as cotações em tempo real e simule seu lucro nas ferramentas acima.";
        if (pergunta.includes("clima") || pergunta.includes("chuva")) resposta = `🌤️ O clima atual da sua fazenda está registrado como: ${estado.clima}.`;
        if (pergunta.includes("saldo") || pergunta.includes("dinheiro")) resposta = `💰 Você tem R$ ${estado.saldo.toFixed(2)} em caixa.`;
        hist.innerHTML += `<div class="msg-ia">${resposta}</div>`;
        hist.scrollTop = hist.scrollHeight;
    }, 700);
});

// Ranking Local
function atualizarRanking() {
    let ranking = JSON.parse(localStorage.getItem('rankingAgro')) || [{nome: "Fazenda Elite", pontos: 800}];
    document.querySelector("#lista-ranking").innerHTML = ranking.slice(0,5).map((r, i) => `<li>${i+1}º ${r.nome} <span>${r.pontos} pts</span></li>`).join("");
}
atualizarRanking();
