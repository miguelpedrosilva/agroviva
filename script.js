/* ==================================================
   AGROVIVA - SCRIPT.JS PARTE 1
   ================================================== */

/* =========================
   ESTADO GLOBAL
========================= */

const estado = {
    saldo: 0,
    carbono: 0,
    clima: "Ideal",
    pontos: 0
};

/* =========================
   TELA DE ENTRADA
========================= */

const telaEntrada = document.querySelector("#tela-entrada");
const btnEntrar = document.querySelector("#btn-entrar");

if (btnEntrar) {
    btnEntrar.addEventListener("click", () => {
        telaEntrada.style.opacity = "0";

        setTimeout(() => {
            telaEntrada.style.display = "none";
        }, 500);
    });
}

/* =========================
   DASHBOARD
========================= */

const saldoDashboard = document.querySelector("#saldo");
const carbonoDashboard = document.querySelector("#carbono");
const climaDashboard = document.querySelector("#clima-atual");
const pontosDashboard = document.querySelector("#pontos");

function atualizarDashboard() {

    if (saldoDashboard) {
        saldoDashboard.innerText =
            `R$ ${estado.saldo.toLocaleString('pt-BR', {
                minimumFractionDigits: 2
            })}`;
    }

    if (carbonoDashboard) {
        carbonoDashboard.innerText =
            `${estado.carbono.toFixed(2)} t`;
    }

    if (climaDashboard) {
        climaDashboard.innerText =
            estado.clima;
    }

    if (pontosDashboard) {
        pontosDashboard.innerText =
            estado.pontos;
    }
}

atualizarDashboard();

/* =========================
   SISTEMA DE ABAS
========================= */

const abas = document.querySelectorAll(".aba");
const conteudos = document.querySelectorAll(".conteudo");

abas.forEach(botao => {

    botao.addEventListener("click", () => {

        abas.forEach(a => {
            a.classList.remove("ativa");
        });

        conteudos.forEach(c => {
            c.classList.remove("ativa");
        });

        botao.classList.add("ativa");

        const alvo =
            document.querySelector(
                "#" + botao.dataset.aba
            );

        if (alvo) {
            alvo.classList.add("ativa");
        }
    });

});

/* =========================
   CALCULADORA FINANCEIRA
========================= */

const btnCalcular =
    document.querySelector("#btn-calcular");

const inputCustos =
    document.querySelector("#custos");

const inputVendas =
    document.querySelector("#vendas");

const resultadoFinanceiro =
    document.querySelector("#resultado-financeiro");

if (btnCalcular) {

    btnCalcular.addEventListener("click", () => {

        const custos =
            parseFloat(inputCustos.value) || 0;

        const vendas =
            parseFloat(inputVendas.value) || 0;

        const lucro =
            vendas - custos;

        estado.saldo = lucro;

        atualizarDashboard();

        let status = "";

        if (lucro > 0) {

            status =
                "🟢 Produção viável";

            estado.pontos += 10;

        } else if (lucro === 0) {

            status =
                "🟡 Empate financeiro";

        } else {

            status =
                "🔴 Prejuízo";

        }

        atualizarDashboard();

        resultadoFinanceiro.innerHTML = `
            <h3>Resultado Financeiro</h3>

            <p>
            Custos:
            <strong>
            R$ ${custos.toFixed(2)}
            </strong>
            </p>

            <p>
            Vendas:
            <strong>
            R$ ${vendas.toFixed(2)}
            </strong>
            </p>

            <p>
            Lucro:
            <strong>
            R$ ${lucro.toFixed(2)}
            </strong>
            </p>

            <p>
            ${status}
            </p>
        `;
    });

}

/* =========================
   MERCADO DE CARBONO
========================= */

const btnCarbono =
    document.querySelector("#btn-carbono");

const areaCarbono =
    document.querySelector("#area-carbono");

const manejoCarbono =
    document.querySelector("#manejo");

const resultadoCarbono =
    document.querySelector("#resultado-carbono");

if (btnCarbono) {

    btnCarbono.addEventListener("click", () => {

        const area =
            parseFloat(areaCarbono.value);

        const manejo =
            manejoCarbono.value;

        if (!area || area <= 0) {

            resultadoCarbono.innerHTML =
                "Digite uma área válida.";

            return;
        }

        let fator = 1.1;

        let nomeManejo =
            "Tradicional";

        if (manejo === "direto") {

            fator = 2.5;

            nomeManejo =
                "Plantio Direto";
        }

        if (manejo === "ilpf") {

            fator = 4.2;

            nomeManejo =
                "ILPF";
        }

        const carbono =
            area * fator;

        const credito =
            carbono * 75;

        estado.carbono =
            carbono;

        estado.saldo +=
            credito;

        estado.pontos += 25;

        atualizarDashboard();

        resultadoCarbono.innerHTML = `
            <h3>Resultado Carbono</h3>

            <p>
            Área:
            ${area} ha
            </p>

            <p>
            Manejo:
            ${nomeManejo}
            </p>

            <p>
            Carbono Retido:
            <strong>
            ${carbono.toFixed(2)} t
            </strong>
            </p>

            <p>
            Crédito Gerado:
            <strong>
            R$ ${credito.toFixed(2)}
            </strong>
            </p>
        `;
    });

}

/* =========================
   CLIMA INTELIGENTE
========================= */

const btnClima =
    document.querySelector("#btn-clima");

const climaSelect =
    document.querySelector("#clima-select");

const resultadoClima =
    document.querySelector("#resultado-clima");

if (btnClima) {

    btnClima.addEventListener("click", () => {

        const clima =
            climaSelect.value;

        estado.clima =
            clima;

        atualizarDashboard();

        let mensagem = "";

        if (clima === "ideal") {

            mensagem =
                "🌦️ Condições excelentes para plantio.";

            estado.pontos += 5;
        }

        if (clima === "seca") {

            mensagem =
                "🔥 Atenção! Considere irrigação.";

        }

        if (clima === "geada") {

            mensagem =
                "❄️ Risco de perdas por geada.";

        }

        atualizarDashboard();

        resultadoClima.innerHTML = `
            <h3>Diagnóstico Climático</h3>

            <p>
            Cenário:
            <strong>
            ${clima.toUpperCase()}
            </strong>
            </p>

            <p>
            ${mensagem}
            </p>
        `;
    });

}

/* =========================
   RANKING LOCAL
========================= */

const ranking = [
    {
        nome: "Pedro",
        pontos: 1500
    },
    {
        nome: "Maria",
        pontos: 1200
    },
    {
        nome: "João",
        pontos: 950
    }
];

function atualizarRanking() {

    const lista =
        document.querySelector("#ranking ol");

    if (!lista) return;

    lista.innerHTML = "";

    ranking.forEach(jogador => {

        lista.innerHTML += `
            <li>
            ${jogador.nome}
            -
            ${jogador.pontos}
            pts
            </li>
        `;
    });

}

atualizarRanking();

/* =========================
   NOTÍCIAS INICIAIS
========================= */

const noticias = [
    "🌾 Mercado da soja apresenta alta nesta semana.",
    "🌽 Milho safrinha mantém crescimento no Paraná.",
    "🥒 Produção de pepino cresce nas estufas.",
    "🍅 Tomate segue valorizado no atacado.",
    "🥬 Alface mantém estabilidade de preços."
];

const listaNoticias =
    document.querySelector("#lista-noticias");

if (listaNoticias) {

    listaNoticias.innerHTML = "";

    noticias.forEach(noticia => {

        listaNoticias.innerHTML += `
            <div class="noticia">
                ${noticia}
            </div>
        `;
    });

}

/* =========================
   INICIALIZAÇÃO
========================= */

atualizarDashboard();

console.log(
    "✅ AgroViva Parte 1 carregada."
   );
)
