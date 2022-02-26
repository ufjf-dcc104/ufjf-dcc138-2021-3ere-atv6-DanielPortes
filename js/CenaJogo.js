import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import modeloMapa1 from "../maps/mapa1.js";
import Sprite from "./Sprite.js";
import Bomba from "./Bomba.js";

export default class CenaJogo extends Cena
{
    constructor()
    {
        super();
        this.pc = null;
        this.cooldown = 0;
    }

    passo(dt)
    {
        if (!this.assets.acabou())
        {
            return;
        }
        for (const sprite of this.sprites)
        {
            sprite.passo(dt);
        }

        this.cooldown += this.dt;
        if (this.cooldown >= 3)
        {
            this.soltarBomba();
            this.cooldown = 0;
        }
    }

    quandoColidir(a, b)
    {
        if (a.tags.has("bomba") && b.tags.has("bomba"))
        {
            return;
        }
        if (a.tags.has("projetil") && b.tags.has("projetil"))
        {
            return;
        }
        if (a.tags.has("enemy") && b.tags.has("bomba"))
        {
            return;
        }
        if (a.tags.has("enemy") && b.tags.has("enemy"))
        {
            return;
        }
        if (a.tags.has("pc") && b.tags.has("projetil"))
        {
            return;
        }
        if (!this.aRemover.includes(a))
        {
            if (a.tags.has("enemy"))
            {
                this.assets.play("invaderkilled");
                const idx = this.enemys.indexOf(a);
                this.enemys.splice(idx, 1);
            }
            if (b.tags.has("projetil"))
            {
                this.aRemover.push(b);
            }
            this.aRemover.push(a);
        } else if (!this.aRemover.includes(b))
        {
            if (b.tags.has("enemy"))
            {
                this.assets.play("invaderkilled");
                const idx = this.enemys.indexOf(b);
                this.enemys.splice(idx, 1);
            }
            if (b.tags.has("projetil"))
            {
                this.aRemover.push(a);
            }
            this.aRemover.push(b);
        }
        if (a.tags.has("pc") && b.tags.has("enemy"))  // jogador  morre
        {
            this.dificuldade === 1 ? this.dificuldade = 1 : this.dificuldade -= 1;
            this.game.selecionaCena("fim");
        }
        if (a.tags.has("pc") && b.tags.has("bomba")) // jogador  morre
        {
            this.dificuldade === 1 ? this.dificuldade = 1 : this.dificuldade -= 1;
            this.game.selecionaCena("fim");
        }
        if (this.enemys.length === 0) // terminou todos objetivos
        {
            this.dificuldade += 1;
            if (this.dificuldade === 5)
            {
                this.game.selecionaCena("zeramento");
                this.dificuldade = 1;
                return;
            }
            this.game.selecionaCena("vitoria");
        }
    }

    preparar()
    {
        super.preparar();
        this.enemys = [];
        const mapa1 = new Mapa(22, 20, 32);
        mapa1.carregaMapa(modeloMapa1);
        this.configuraMapa(mapa1);

        const pc = new Sprite({x: 300, y: 600, vx: 1000});
        pc.tags.add("pc");
        this.pc = pc;
        const cena = this;
        cena.cooldownAtirar = 0;
        cena.cooldownEspecial = 0;
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
            cena.cooldownAtirar += cena.dt;
            cena.cooldownEspecial += cena.dt;
            if (cena.input.comandos.get("ATIRA") && cena.cooldownAtirar >= .3) // tiro de habilidade especial
            {
                cena.assets.play("shoot");
                if (cena.cooldownEspecial >= 1)
                {
                    for (let i = 0; i < 3; i++)
                    {
                        const bomba = new Bomba({
                            x: this.x + (20 * (i)),
                            y: this.y - 18,
                            vy: -300,
                            w: 5,
                            h: 5,
                            color: "yellow",
                            tags: ["projetil"],
                        });
                        cena.adicionar(bomba);
                    }
                    cena.cooldownAtirar = 0;
                    cena.cooldownEspecial = 0;
                    return;
                }

                const bomba = new Bomba({
                    x: this.x, y: this.y, vy: -300, w: 5, h: 5, color: "black", tags: ["projetil"],
                });
                cena.adicionar(bomba);
                cena.input.comandos.set("ATIRA", false);
                cena.cooldownAtirar = 0;


            }

        };
        this.adicionar(pc);

        for (let i = 2; i <= 2 * (this.dificuldade); i++)
        {
            for (let j = 2; j <= 2 * (this.dificuldade); j++)
            {
                if (i === 2)
                {
                    let enemy = new Sprite({
                        x: (j * 64),
                        y: (i * 32),
                        vx: 65 * (this.dificuldade),
                        vy: 0,
                        color: "blue",
                        tags: ["enemy", "special"],
                    });
                    this.enemys.push(enemy);
                    cena.adicionar(enemy);
                    continue;
                }
                let enemy = new Sprite({
                    x: (j * 64), y: (i * 32), vx: 100, vy: +0, color: "red", tags: ["enemy"],

                });
                cena.adicionar(enemy);
                this.enemys.push(enemy);
            }
        }

    }

    soltarBomba()
    {
        for (const enemy of this.enemys)
        {
            if (enemy.tags.has("special"))
            {
                const bomba = new Bomba({
                    x: enemy.x, y: enemy.y, vy: +100, w: 5, h: 5, color: "white", tags: ["bomba"],
                });
                this.adicionar(bomba);
            }
        }
        var temp = [];
        for (const enemy of this.enemys)
        {
            if (enemy.tags.has("special"))
            {
                temp.push(enemy);
            }
        }
        if (temp.length !== 0)
        {
            this.assets.play("lowpitch");
        }
    }

};