/* ==================================================
   FORÇAR O SCROLL PARA O TOPO AO RECARREGAR
   ================================================== */
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ==================================================
   AGROVIVA - SCRIPT.JS (Lógica Front-End)
   ================================================== */

const estado = { 
    fazenda: "Não Informada",
    cultura: "Não Informada",
    saldo: 0, 
    carbono: 0, 
    clima: "Ideal", 
    pontos: 0 
};

document.querySelector("#btn-iniciar-gestao")?.addEventListener("click", () => {
    const nome = document.querySelector("#nome-fazenda-input").value;
    const cultura = document.querySelector("#cultura-input").value;

    if(nome === "" || cultura === "") {
        alert("⚠️ Por favor, preencha o nome da fazenda e escolha uma cultura para continuar.");
        return;
    }

    estado.fazenda = nome;
    estado.cultura = cultura;

    document.querySelector("#display-nome-fazenda").innerText = estado.fazenda;
    document.querySelector("#display-cultura").innerText = estado.cultura;

    const dashboard = document.querySelector("#dashboard");
    dashboard.style.display = "block";

    dashboard.scrollIntoView({ behavior: "smooth" });
    atualizarDashboard();
});

function atualizarDashboard() {
    const elSaldo = document.querySelector("#saldo");
    const elCarbono = document.querySelector("#carbono");
    const elClima = document.querySelector("#clima-atual");
    const elPontos = document.querySelector("#pontos");

    if(elSaldo) elSaldo.innerText = `R$ ${estado.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if(elCarbono) elCarbono.innerText = `${estado.carbono.toFixed(2)} t`;
    if(elClima) elClima.innerText = estado.clima;
    if(elPontos) elPontos.innerText = estado.pontos;
}

document.querySelector("#btn-calcular")?.addEventListener("click", () => {
    const custos = parseFloat(document.querySelector("#custos").value) || 0;
    const vendas = parseFloat(document.querySelector("#vendas").value) || 0;
    const lucro = vendas - custos;
    
    estado.saldo += lucro;
    estado.pontos += 15;
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-financeiro");
    res.style.display = "block";
    res.innerHTML = `<strong>Análise para a cultura de ${estado.cultura}:</strong><br> Lucro Projetado: R$ ${lucro.toFixed(2)} <br> ${lucro > 0 ? '✅ Safra viável financeiramente.' : '⚠️ Risco detectado. Ajuste seus custos.'}`;
});

document.querySelector("#btn-carbono")?.addEventListener("click", () => {
    const area = parseFloat(document.querySelector("#area-carbono").value) || 0;
    const manejo = document.querySelector("#manejo").value;
    let fator = manejo === "ilpf" ? 4.2 : manejo === "direto" ? 2.5 : 1.1;
    
    const carbonoGerado = area * fator;
    estado.carbono += carbonoGerado;
    estado.saldo += (carbonoGerado * 80); 
    estado.pontos += 30;
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-carbono");
    res.style.display = "block";
    res.innerHTML = `✅ <strong>${carbonoGerado.toFixed(2)} t</strong> de CO2 retidas. Créditos aplicados!`;
});

document.querySelector("#btn-clima")?.addEventListener("click", () => {
    const clima = document.querySelector("#clima-select").value;
    const efeitos = {
        ideal: { texto: "Clima perfeito para a sua lavoura.", pts: 10, exibe: "Ideal" },
        seca: { texto: "Cuidado! Ative a irrigação na sua plantação de " + estado.cultura + ".", pts: -5, exibe: "Seca" },
        geada: { texto: "Alerta térmico. Risco alto de perdas.", pts: -10, exibe: "Geada" },
        chuva: { texto: "O excesso de chuva pode causar fungos no solo.", pts: -5, exibe: "Chuva Extrema" }
    };
    
    estado.clima = efeitos[clima].exibe;
    estado.pontos += efeitos[clima].pts;
    atualizarDashboard();
    
    const res = document.querySelector("#resultado-clima");
    res.style.display = "block";
    res.innerHTML = `<strong>Aviso Climático:</strong> ${efeitos[clima].texto}`;
});

document.querySelector("#btn-estufa")?.addEventListener("click", () => {
    const temp = parseFloat(document.querySelector("#temperatura").value) || 0;
    const res = document.querySelector("#resultado-estufa");
    res.style.display = "block";
    if(temp > 30) res.innerHTML = "🔥 Ambiente sobreaquecido! Recomendação: Ligar exaustores imediatamente.";
    else if(temp < 15) res.innerHTML = "❄️ Temperatura crítica! Recomendação: Ativar sistema térmico.";
    else res.innerHTML = "✅ Parâmetros perfeitos para controle do ambiente.";
});

const noticiasData = [
    { img: "img/noticia-soja.jpg", titulo: "Mercado Agrícola Digital", texto: "Plataformas otimizam a venda direta de grãos, aumentando a margem do produtor." },
    { img: "img/noticia-tecnologia.jpg", titulo: "Agricultura de Precisão", texto: "Sensores IoT nas lavouras do Paraná ajudam a combater pragas rapidamente." },
    { img: "img/noticia-estufa.jpg", titulo: "O Futuro do Cultivo", texto: "Sistemas hidropônicos integrados a inteligência artificial economizam até 80% de água." }
];

const containerNoticias = document.querySelector("#lista-noticias");
if (containerNoticias) {
    containerNoticias.innerHTML = noticiasData.map(n => `
        <div class="noticia-card">
            <img src="${n.img}" alt="Notícia" class="noticia-img">
            <div class="noticia-conteudo">
                <h4>${n.titulo}</h4>
                <p class="texto-apoio">${n.texto}</p>
            </div>
        </div>
    `).join("");
}

atualizarDashboard();
