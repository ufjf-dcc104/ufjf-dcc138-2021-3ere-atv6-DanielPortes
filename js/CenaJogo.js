import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import modeloMapa1 from "../maps/mapa1.js";
import Sprite from "./Sprite.js";

export default class CenaJogo extends Cena
{
    constructor()
    {
        super();
        this.enemys = [];
        this.pc = null;
    }

    quandoColidir(a, b)
    {

        if (!this.aRemover.includes(a))
        {
            if (a.tags.has("enemy"))
            {
                const idx = this.enemys.indexOf(a);
                this.enemys.splice(idx, 1);
            }
            this.aRemover.push(a);
        }
        if (!this.aRemover.includes(b))
        {
            if (b.tags.has("enemy"))
            {
                const idx = this.enemys.indexOf(b);
                this.enemys.splice(idx, 1);
            }
            this.aRemover.push(b);
        }
        if (a.tags.has("pc") && b.tags.has("enemy"))
        {
            this.game.selecionaCena("fim");
        }
        if (a.tags.has("pc") && b.tags.has("bomba"))
        {
            this.game.selecionaCena("fim");
        }
        if (this.enemys.length === 0)
        {
            console.log("vitoria");
            this.game.selecionaCena("vitoria");
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
        this.pc = pc;
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

        let aux = [];
        for (let i = 2; i <= 2 * (this.dificuldade); i++)
        {
            for (let j = 2; j <= 2 * (this.dificuldade); j++)
            {
                if (i === 2)
                {
                    let enemy = new Sprite({
                        x: (j * 64), y: (i * 32), vx: 100, vy: +2, color: "blue", tags: ["enemy", "special"],
                    });

                    cena.adicionar(enemy);
                    aux.push(enemy);
                    continue;
                }
                let enemy = new Sprite({
                    x: (j * 64), y: (i * 32), vx: 100, vy: +0, color: "red", tags: ["enemy"],

                });
                cena.adicionar(enemy);
                aux.push(enemy);
            }
        }

        this.enemys = [];
        for (const auxKey of aux)
        {
            this.enemys.push(auxKey);
        }

        const that = this;
        var soltarBomba = function ()
        {
            for (const enemysKey of that.enemys)
            {
                if (enemysKey.tags.has("special"))
                {

                    const bomba = new Sprite({
                        x: enemysKey.x, y: enemysKey.y, vy: +100, w: 5, h: 5, color: "white", tags: ["bomba"],
                    });
                    cena.adicionar(bomba);
                }
            }
            setTimeout(soltarBomba, 10000);
        }

        soltarBomba();
    }
};