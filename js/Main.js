import Cena from "./Cena.js";
import Sprite from "./Sprite.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const cena1 = new Cena(canvas);

const en1 = new Sprite({x:140,w:30, color: "red"});
const pc = new Sprite({});

cena1.adicionar(pc);
cena1.adicionar(en1);
cena1.desenhar();


