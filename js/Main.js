import Cena from "./Cena.js";
import Sprite from "./Sprite.js";
import AssetManager from "./AssetManager.js";
import Mixer from "./Mixer.js";
import Mapa from "./Mapa.js";
import modeloMapa1 from "../maps/mapa1.js";
import InputManager from "./InputManager.js";
import Game from "./Game.js";

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("garota", "assets/garota.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("fire", "assets/fire.png");
assets.carregaImagem("floor", "assets/floor.png");
assets.carregaImagem("orc", "assets/orc.png");
assets.carregaImagem("eye", "assets/eye.png");
assets.carregaImagem("wall", "assets/wall.png");
assets.carregaImagem("wall2", "assets/wall2.png");
assets.carregaImagem("glass", "assets/glass.png");

assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("colision", "assets/colision.wav");
assets.carregaAudio("boom", "assets/boom.wav");

const canvas = document.querySelector("canvas");
canvas.width = 20 * 32;
canvas.height = 16 * 32;

input.configurarTeclado({
    "ArrowLeft": "MOVE_ESQUERDA", "ArrowRight": "MOVE_DIREITA", "ArrowUp": "MOVE_CIMA", "ArrowDown": "MOVE_BAIXO",
});
const game = new Game(canvas, assets, input);

const mapa1 = new Mapa(16, 20, 32);
mapa1.carregaMapa(modeloMapa1);

const cena1 = new Cena(canvas, assets, mapa1);
game.adicionarCena("jogo", cena1);
cena1.configuraMapa(mapa1);

const pc = new Sprite({x: 50, vx: 10});
pc.controlar = function (dt)
{
    if (input.comandos.get("MOVE_ESQUERDA"))
    {
        this.vx = -50;
    } else if (input.comandos.get("MOVE_DIREITA"))
    {
        this.vx = +50;
    } else
    {
        this.vx = 0;
    }
    if (input.comandos.get("MOVE_CIMA"))
    {
        this.vy = -50;
    } else if (input.comandos.get("MOVE_BAIXO"))
    {
        this.vy = +50;
    } else
    {
        this.vy = 0;
    }

};
cena1.adicionar(pc);

function perseguePC(dt)
{
    this.vx = 25 * Math.sign(pc.x - this.x);
    this.vy = 25 * Math.sign(pc.y - this.y);
}


function geraNumeroRandomico(min, max)
{
    return Math.floor(Math.random() * (max - min + min) + min);
}

criaInimigo();

function criaInimigo()
{
    let posicoes = geraPosicaoValida();

    cena1.adicionar(new Sprite({
        x: posicoes[1], y: posicoes[0], color: "red", controlar: perseguePC,
    }));
    setTimeout(criaInimigo, 10000);
}

function geraPosicaoValida()
{
    let rl = 0, rc = 0;
    do
    {
        rl = geraNumeroRandomico(1, mapa1.LINHAS);
        rc = geraNumeroRandomico(1, mapa1.COLUNAS);
    } while (mapa1.titles[rl][rc] !== 0)

    return [rl * 32 + 32 / 2, rc * 32 + 32 / 2];
}

//
// const en1 = new Sprite({
//     x: geraPosicaoValida()[0], y: geraPosicaoValida()[1], vx: -10, color: "red", controlar: perseguePC
// });
// cena1.adicionar(en1);
// cena1.adicionar(new Sprite({
//     x: geraPosicaoValida()[0], y: geraPosicaoValida()[1], vy: 10, color: "red", controlar: perseguePC
// }));
// cena1.adicionar(new Sprite({
//     x: geraPosicaoValida()[0], y: geraPosicaoValida()[1], vy: -10, color: "red", controlar: perseguePC
// }));
// cena1.adicionar(new Sprite({
//     x: geraPosicaoValida()[0], y: geraPosicaoValida()[1], vy: -10, color: "red", controlar: perseguePC
// }));

cena1.iniciar();

document.addEventListener("keydown", (e) =>
{
    switch (e.key)
    {
        case "s":
            cena1.iniciar();
            break;
        case "S":
            cena1.parar();
            break;
        case "c":
            assets.play("moeda");
            break;
        case "b":
            assets.play("boom");
            break;
    }
});


