/* =====================================================
   AGROVIVA HARVEST - MINIGAME EM CANVAS
===================================================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
const trator = { x: 350, y: 320, largura: 70, altura: 50, vel: 8 };
const emojis = ["🍅", "🥒", "🥬", "🌽", "💧"];
let itens = [];
let esq = false, dir = false;

// Controles Teclado
document.addEventListener("keydown", (e) => { if(e.key === "ArrowLeft") esq = true; if(e.key === "ArrowRight") dir = true; });
document.addEventListener("keyup", (e) => { if(e.key === "ArrowLeft") esq = false; if(e.key === "ArrowRight") dir = false; });

// Controles Touch (Celular)
document.getElementById("btn-esquerda")?.addEventListener("touchstart", (e) => { e.preventDefault(); esq = true; });
document.getElementById("btn-esquerda")?.addEventListener("touchend", () => { esq = false; });
document.getElementById("btn-direita")?.addEventListener("touchstart", (e) => { e.preventDefault(); dir = true; });
document.getElementById("btn-direita")?.addEventListener("touchend", () => { dir = false; });

function criarItem() {
    itens.push({ x: Math.random() * (canvas.width - 40), y: -30, emoji: emojis[Math.floor(Math.random() * emojis.length)], vel: 3 + Math.random() * 2 });
}

function atualizarGame() {
    if (esq && trator.x > 0) trator.x -= trator.vel;
    if (dir && trator.x < canvas.width - trator.largura) trator.x += trator.vel;

    itens.forEach((item, i) => {
        item.y += item.vel;
        // Colisão
        if (item.y > trator.y && item.x > trator.x - 20 && item.x < trator.x + trator.largura) {
            itens.splice(i, 1);
            score += 10;
            document.getElementById("score").innerText = score;
            if(score % 50 === 0) adicionarPontos(50); // Envia para o ranking global a cada 50 pontos
        }
    });
    // Remove itens que caíram (desperdício)
    itens = itens.filter(item => item.y < canvas.height);
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fundo Terra
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Itens
    ctx.font = "35px Arial";
    itens.forEach(item => ctx.fillText(item.emoji, item.x, item.y));
    
    // Trator
    ctx.font = "50px Arial";
    ctx.fillText("🚜", trator.x, trator.y + 40);
}

function loop() {
    atualizarGame();
    desenhar();
    requestAnimationFrame(loop);
}

setInterval(criarItem, 1000);
loop();
