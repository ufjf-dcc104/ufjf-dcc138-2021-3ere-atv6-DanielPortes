import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import modeloMapa1 from "../maps/mapa1.js";
import Sprite from "./Sprite.js";

export default class CenaJogo extends Cena
{
    quandoColidir(a, b)
    {
        if (!this.aRemover.includes(a))
        {
            this.aRemover.push(a);
        }
        if (!this.aRemover.includes(b))
        {
            this.aRemover.push(b);
        }
        if (a.tags.has("pc") && b.tags.has("enemy"))
        {
            this.game.selecionaCena("fim");
        }
    }

    preparar()
    {
        super.preparar();

        const mapa1 = new Mapa(22, 20, 32);
        mapa1.carregaMapa(modeloMapa1);
        this.configuraMapa(mapa1);

        const pc = new Sprite({x: 300, y: 600, vx: 1000});
        pc.tags.add("pc");
        const cena = this;
        pc.controlar = function (dt)
        {
            if (cena.input.comandos.get("MOVE_ESQUERDA"))
            {
                this.vx = -200;
            } else if (cena.input.comandos.get("MOVE_DIREITA"))
            {
                this.vx = +200;
            } else
            {
                this.vx = 0;
            }
            if (cena.input.comandos.get("ATIRA"))
            {
                this.atirar(this.x, this.y);
                cena.input.comandos.set("ATIRA", false);
            }

        };
        this.adicionar(pc);

        function perseguePC(dt)
        {
            this.vx = 25 * Math.sign(pc.x - this.x);
            this.vy = 25 * Math.sign(pc.y - this.y);
        }

        /*        const en1 = new Sprite({
                    x: 100, y: 100, vx: 10, color: "red", controlar: perseguePC, tags: ["enemy"],
                });
                // this.adicionar(en1);

                this.adicionar(new Sprite({
                    x: 200, y: 150, vy: 10, color: "red", controlar: perseguePC, tags: ["enemy"],
                }));
                this.adicionar(new Sprite({
                    x: 300, y: 100, vy: 10, color: "red", controlar: perseguePC, tags: ["enemy"],
                }));
                this.adicionar(new Sprite({
                    x: 100, y: 250, vy: 10, color: "red", controlar: perseguePC, tags: ["enemy"],
                }));*/

    }
};