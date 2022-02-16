import AssetManager from "./AssetManager.js";
import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";
import Game from "./Game.js";
import CenaJogo from "./CenaJogo.js";
import CenaCarragando from "./CenaCarragando.js";
import CenaFim from "./CenaFim.js";

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
assets.carregaImagem("invaders", "assets/invaders.png");
assets.carregaImagem("skull", "assets/skull2.png");
assets.carregaImagem("doguinho", "assets/doguinho.png");
assets.carregaImagem("glass", "assets/glass.png");

assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("colision", "assets/colision.wav");
assets.carregaAudio("boom", "assets/boom.wav");

const canvas = document.querySelector("canvas");
canvas.width = 20 * 32;
canvas.height = 22 * 32;

input.configurarTeclado({
    "ArrowLeft": "MOVE_ESQUERDA",
    "ArrowRight": "MOVE_DIREITA",
    "Enter": "PROXIMA_CENA",
    " ": "ATIRA",
});
const game = new Game(canvas, assets, input);

const cena0 = new CenaCarragando(canvas, assets);
const cena1 = new CenaJogo(canvas, assets);
const cena2 = new CenaFim(canvas, assets);
game.adicionarCena("carregando", cena0);
game.adicionarCena("jogo", cena1);
game.adicionarCena("fim", cena2);

game.iniciar();

document.addEventListener("keydown", (e) =>
{
    switch (e.key)
    {
        case "s":
            game.iniciar();
            break;
        case "S":
            game.parar();
            break;
        case "c":
            assets.play("moeda");
            break;
        case "b":
            assets.play("boom");
            break;
    }
});


