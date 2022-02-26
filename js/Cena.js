import Sprite from "./Sprite.js";

export default class Cena
{
    constructor(canvas = null, assets = null)
    {
        this.canvas = canvas;
        this.ctx = canvas?.getContext("2d");
        this.assets = assets;
        this.game = null;
        this.dificuldade = 1;
        this.preparar();
    }

    desenhar()
    {
        this.ctx.fillStyle = "lightcyan";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.mapa?.desenhar(this.ctx, this.assets);

        if (this.assets.acabou())
        {
            for (let s = 0; s < this.sprites.length; s++)
            {
                const sprite = this.sprites[s];
                sprite.desenhar(this.ctx, this.assets);
                sprite.aplicaRestricoes();
            }
        }
        this.ctx.fillStyle = "yellow";
        this.ctx.textAlign = "left";
        this.ctx.fillText(this.assets?.progresso(), 10, 20);
    }

    adicionar(sprite)
    {
        sprite.cena = this;
        this.sprites.push(sprite);
    }

    passo(dt)
    {
        if (this.assets.acabou())
        {
            for (const sprite of this.sprites)
            {
                sprite.passo(dt);
            }
        }
    }

    quadro(t)
    {
        const that = this;
        this.t0 = this.t0 ?? t;
        this.dt = (t - this.t0) / 1000;

        this.checaColisao();
        this.passo(this.dt);
        this.desenhar();
        this.removerSprites();
        if (this.rodando)
        {
            this.iniciar();
        }

        this.t0 = t;
    }

    iniciar()
    {
        this.rodando = true;
        this.idAnim = requestAnimationFrame((t) =>
        {
            this.quadro(t);
        });
    }

    parar()
    {
        this.rodando = false;
        cancelAnimationFrame(this.idAnim);
        this.t0 = null;
        this.dt = 0;
    }

    checaColisao()
    {
        for (let a = 0; a < this.sprites.length - 1; a++)
        {
            const spriteA = this.sprites[a];
            for (let b = a + 1; b < this.sprites.length; b++)
            {
                const spriteB = this.sprites[b];
                if (spriteA.colidiuCom(spriteB))
                {
                    this.assets.play("colision");
                    this.quandoColidir(spriteA, spriteB);
                }
            }
        }
    }

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

        console.log(this.aRemover);
    }

    removerSprites()
    {
        for (const alvo of this.aRemover)
        {
            const idx = this.sprites.indexOf(alvo);
            if (idx >= 0)
            {
                this.sprites.splice(idx, 1);
            }
        }
        this.aRemover = [];
    }

    configuraMapa(mapa)
    {
        this.mapa = mapa;
        this.mapa.cena = this;
    }

    criaInimigo()
    {
        const that = this;

        let rl = 0, rc = 0;
        while (that.mapa.tiles[rl][rc] !== 0)
        {
            rl = Math.floor(Math.random() * (16 - 1) + 1);
            rc = Math.floor(Math.random() * (20 - 1) + 1);
        }
        const en1 = new Sprite({
            x: rc * 32 + 32 / 2, y: rl * 32 + 32 / 2, color: "red"
        });
        that.adicionar(en1);
        setTimeout(that.criaInimigo, 10000);
    }

    preparar()
    {
        this.sprites = [];
        this.aRemover = [];
        this.t0 = null;
        this.dt = 0;
        this.idAnim = null;
        this.mapa = null;
        this.rodando = true;
    }

}