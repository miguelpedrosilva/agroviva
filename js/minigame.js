/* =====================================================
   AGROVIVA HARVEST - MINIGAME (Colheita Desafio)
===================================================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let scorePartida = 0;
let gameOver = false;
let gameLoopId = null;
let spawnerId = null;
let nomeAtual = "Anônimo";

const trator = { x: 265, y: 280, largura: 70, altura: 50, vel: 7 };

const emojisBons = ["🍅", "🌽", "🌾", "🥬"];
const emojisRuins = ["🪨", "🪵"]; 
let itens = [];
let esq = false, dir = false;

document.addEventListener("keydown", (e) => { if(e.key === "ArrowLeft") esq = true; if(e.key === "ArrowRight") dir = true; });
document.addEventListener("keyup", (e) => { if(e.key === "ArrowLeft") esq = false; if(e.key === "ArrowRight") dir = false; });

document.getElementById("btn-esquerda")?.addEventListener("touchstart", (e) => { e.preventDefault(); esq = true; });
document.getElementById("btn-esquerda")?.addEventListener("touchend", () => { esq = false; });
document.getElementById("btn-direita")?.addEventListener("touchstart", (e) => { e.preventDefault(); dir = true; });
document.getElementById("btn-direita")?.addEventListener("touchend", () => { dir = false; });

// --- LÓGICA DE INÍCIO DE JOGO ---
document.getElementById("btn-play")?.addEventListener("click", () => {
    const inputNome = document.getElementById("nome-jogador").value.trim();
    if (inputNome === "") {
        alert("⚠️ Digite seu nome para registrar sua pontuação no Ranking!");
        return;
    }
    
    nomeAtual = inputNome;
    document.getElementById("tela-start-jogo").style.display = "none"; // Esconde a tela inicial
    iniciarJogo();
});

function iniciarJogo() {
    scorePartida = 0;
    itens = [];
    trator.x = 265;
    gameOver = false;
    
    if (spawnerId) clearInterval(spawnerId);
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    
    spawnerId = setInterval(criarItem, 1000);
    loop();
}

function criarItem() {
    if (gameOver) return;
    
    const isObstaculo = Math.random() > 0.8; 
    const lista = isObstaculo ? emojisRuins : emojisBons;
    const emojiSorteado = lista[Math.floor(Math.random() * lista.length)];

    itens.push({ 
        x: Math.random() * (canvas.width - 40), 
        y: -30, 
        emoji: emojiSorteado, 
        vel: 3 + Math.random() * 2,
        bad: isObstaculo
    });
}

function salvarRanking(pontosFinais) {
    let ranking = JSON.parse(localStorage.getItem('rankingAgroViva')) || [
        {nome: "Miguel Pedro", pontos: 200},
        {nome: "Fazenda Elite", pontos: 150},
        {nome: "Colheita Pró", pontos: 100}
    ];
    
    ranking.push({ nome: nomeAtual, pontos: pontosFinais });
    ranking.sort((a, b) => b.pontos - a.pontos);
    
    localStorage.setItem('rankingAgroViva', JSON.stringify(ranking));
    atualizarRanking();
}

function atualizarRanking() {
    let ranking = JSON.parse(localStorage.getItem('rankingAgroViva')) || [];
    const listaHtml = document.querySelector("#lista-ranking");
    if(listaHtml) {
        // .slice(0,3) garante que mostre apenas o TOP 3!
        listaHtml.innerHTML = ranking.slice(0,3).map((r, i) => `<li>${i+1}º ${r.nome} <span>${r.pontos} pts</span></li>`).join("");
    }
}

function encerrarJogo() {
    salvarRanking(scorePartida);
    clearInterval(spawnerId);
    alert(`💥 FIM DE JOGO! Você bateu num obstáculo.\n${nomeAtual}, sua colheita rendeu: ${scorePartida} pontos.`);
    document.getElementById("tela-start-jogo").style.display = "flex"; // Mostra a tela de novo
}

function atualizarGame() {
    if (gameOver) return;

    if (esq && trator.x > 0) trator.x -= trator.vel;
    if (dir && trator.x < canvas.width - trator.largura) trator.x += trator.vel;

    itens.forEach((item, i) => {
        item.y += item.vel;
        
        if (item.y > trator.y - 10 && item.y < trator.y + trator.altura && item.x > trator.x - 20 && item.x < trator.x + trator.largura) {
            itens.splice(i, 1);
            
            if (item.bad) {
                gameOver = true;
                setTimeout(encerrarJogo, 100); 
            } else {
                scorePartida += 10;
            }
        }
    });
    itens = itens.filter(item => item.y < canvas.height);
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#654321"; 
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    ctx.fillStyle = "#87CEEB"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height - 30);

    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Carga: ${scorePartida}`, 15, 30);
    
    ctx.font = "35px Arial";
    itens.forEach(item => ctx.fillText(item.emoji, item.x, item.y));
    
    ctx.font = "50px Arial";
    ctx.fillText("🚜", trator.x, trator.y + 40);
}

function loop() {
    if (gameOver) return; // Para o loop se bater
    atualizarGame();
    desenhar();
    gameLoopId = requestAnimationFrame(loop);
}

// Quando a página carrega, apenas desenha o fundo parado e atualiza o ranking
desenhar();
atualizarRanking();
