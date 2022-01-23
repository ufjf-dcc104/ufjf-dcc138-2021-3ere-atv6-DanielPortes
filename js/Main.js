import Cena from "./Cena.js";
import Sprite from "./Sprite.js";
import AssetManager from "./AssetManager.js";
import Mixer from "./Mixer.js";
import Mapa from "./Mapa.js";
import modeloMapa1 from "../maps/mapa1.js";
import InputManager from "./InputManager.js";

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

input.configurarTeclado(
    {
        "ArrowLeft": "MOVE_ESQUERDA",
        "ArrowRight": "MOVE_DIREITA",
        "ArrowUp": "MOVE_CIMA",
        "ArrowDown": "MOVE_BAIXO",
    }
);

const mapa1 = new Mapa(16, 20, 32);
mapa1.carregaMapa(modeloMapa1);
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

criaInimigo();

function criaInimigo()
{
    let rl = 0, rc = 0;
    while (mapa1.titles[rl][rc] !== 0)
    {
        rl = Math.floor(Math.random() * (mapa1.LINHAS - 1 + 1) + 1);
        rc = Math.floor(Math.random() * (mapa1.COLUNAS - 1 + 1) + 1);
    }

    cena1.adicionar(new Sprite({x: rc * 32 + 32 / 2, y: rl * 32 + 32 / 2, color: "red", controlar: perseguePC,}));
    setTimeout(criaInimigo, 10000);
}


const en1 = new Sprite({x: 360, y: 300, vx: -10, color: "red", controlar: perseguePC});
cena1.adicionar(en1);
cena1.adicionar(new Sprite({x: 550, y: 400, vy: 10, color: "red", controlar: perseguePC}));
cena1.adicionar(new Sprite({x: 555, y: 160, vy: -10, color: "red", controlar: perseguePC}));
cena1.adicionar(new Sprite({x: 200, y: 450, vy: -10, color: "red", controlar: perseguePC}));

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


