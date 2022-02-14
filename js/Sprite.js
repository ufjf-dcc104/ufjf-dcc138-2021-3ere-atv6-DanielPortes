export default class Sprite
{
    constructor({
                    x = 100, y = 100,
                    w = 20, h = 20,
                    color = "white", vx = 0,
                    vy = 0, controlar = () => {}
                    , tags = []
                } = {})
    {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.color = color;
        this.cena = null;
        this.mx = 0;
        this.my = 0;
        this.controlar = controlar
        this.tags = new Set();
        tags.forEach((tag) =>
        {
            this.tags.add(tag);
        });
        this.aux = false;

    }

    desenhar(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        ctx.strokeStyle = "blue";
        ctx.strokeRect(
            this.mx * this.cena.mapa.SIZE,
            this.my * this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
            this.cena.mapa.SIZE);
    }

    controlar(dt)
    {

    }

    mover(dt)
    {
        this.x = this.x + this.vx * dt;
        this.y = this.y + this.vy * dt;
        this.mx = Math.floor(this.x / this.cena.mapa.SIZE);
        this.my = Math.floor(this.y / this.cena.mapa.SIZE);
    }

    passo(dt)
    {
        this.controlar(dt);
        this.mover(dt);
    }

    colidiuCom(outro)
    {
        if (this.tags?.has("pc") && outro.tags?.has("projetilPC"))
        {return false;}
        if (this.tags?.has("enemy") && outro.tags?.has("bomba"))
        {
            return false;
        }
        if (this.tags?.has("bomba") && outro.tags?.has("bomba"))
        {
            return false;
        }
        return !(
            (this.x - this.w / 2 > outro.x + outro.w / 2) ||
            (this.x + this.w / 2 < outro.x - outro.w / 2) ||
            (this.y - this.h / 2 > outro.y + outro.h / 2) ||
            (this.y + this.h / 2 < outro.y - outro.h / 2)
        );
    }

    aplicaRestricoes(dt)
    {
        this.aplicaRestricoesCima(this.mx, this.my - 1);
        this.aplicaRestricoesCima(this.mx - 1, this.my - 1);
        this.aplicaRestricoesCima(this.mx + 1, this.my - 1);
        this.aplicaRestricoesDireita(this.mx + 1, this.my - 1);
        this.aplicaRestricoesDireita(this.mx + 1, this.my);
        this.aplicaRestricoesDireita(this.mx + 1, this.my + 1);
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my - 1);
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my);
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my + 1);
        // this.aplicaRestricoesBaixo(this.mx - 1, this.my + 1);
        // this.aplicaRestricoesBaixo(this.mx + 1, this.my + 1);
        this.aplicaRestricoesBaixo(this.mx, this.my + 1);
    }

    aplicaRestricoesDireita(pmx, pmy)
    {
        const SIZE = this.cena.mapa.SIZE
        if (this.vx > 0)
        {
            if (this.cena.mapa.tiles[pmy][pmx] !== 0)
            {
                const tile = {
                    x: pmx * SIZE + SIZE / 2,
                    y: pmy * SIZE + SIZE / 2,
                    w: SIZE,
                    h: SIZE
                }
                this.cena.ctx.strokeStyle = 'white'
                this.cena.ctx.strokeRect(tile.x - SIZE / 2, tile.y - SIZE / 2, SIZE, SIZE)
                if (this.colidiuCom(tile))
                {
                    for (const sprite of this.cena.sprites)
                    {
                        if (sprite.tags.has("enemy"))
                        {
                            sprite.vx = -100;
                            sprite.vy += 2;
                        }
                    }
                    this.x = tile.x - tile.w / 2 - this.w / 2 - 1
                }

            }
        }
    }

    aplicaRestricoesEsquerda(pmx, pmy)
    {
        const SIZE = this.cena.mapa.SIZE
        if (this.vx < 0)
        {
            if (this.cena.mapa.tiles[pmy][pmx] !== 0)
            {
                const tile = {
                    x: pmx * SIZE + SIZE / 2,
                    y: pmy * SIZE + SIZE / 2,
                    w: SIZE,
                    h: SIZE
                }
                this.cena.ctx.strokeStyle = 'white'
                this.cena.ctx.strokeRect(tile.x - SIZE / 2, tile.y - SIZE / 2, SIZE, SIZE)
                if (this.colidiuCom(tile))
                {
                    for (const sprite of this.cena.sprites)
                    {
                        if (sprite.tags.has("enemy"))
                        {
                            sprite.vx = 100;
                            sprite.vy += 2;
                        }
                    }
                    this.x = tile.x + tile.w / 2 + this.w / 2 + 1
                }
            }
        }
    }

    aplicaRestricoesBaixo(pmx, pmy)
    {
        const SIZE = this.cena.mapa.SIZE
        if (pmy > 20 || pmx > 20)
        {
            if (this.tags.has("enemy"))
            {
                this.cena.game.selecionaCena("fim");
            }
            this.cena.aRemover.push(this);
            return;
        }
        if (this.vy > 0)
        {
            if (this.cena.mapa.tiles[pmy][pmx] !== 0)
            {
                const tile = {
                    x: pmx * SIZE + SIZE / 2,
                    y: pmy * SIZE + SIZE / 2,
                    w: SIZE,
                    h: SIZE
                }
                this.cena.ctx.strokeStyle = 'white'
                this.cena.ctx.strokeRect(tile.x - SIZE / 2, tile.y - SIZE / 2, SIZE, SIZE)
                if (this.colidiuCom(tile))
                {
                    this.vy = 0
                    this.y = tile.y - tile.h / 2 - this.h / 2 - 1
                }

            }
        }
    }

    aplicaRestricoesCima(pmx, pmy)
    {
        const SIZE = this.cena.mapa.SIZE
        if (pmy <= 0 || pmx < 0)
        {
            this.cena.aRemover.push(this);
            return;
        }
        if (this.vy < 0)
        {
            if (this.cena.mapa.tiles[pmy][pmx] !== 0)
            {
                const tile = {
                    x: pmx * SIZE + SIZE / 2,
                    y: (pmy + 1) * SIZE + SIZE / 2,
                    w: SIZE,
                    h: SIZE
                }
                this.cena.ctx.strokeStyle = 'white'
                this.cena.ctx.strokeRect(tile.x - SIZE / 2, (tile.y - 32) - SIZE / 2, SIZE, SIZE)
                if (this.colidiuCom(tile))
                {
                    this.vy = 0
                    this.y = (tile.y - 32) + tile.h / 2 + this.h / 2 + 1
                }
            }
        }
    }

    atirar(x, y)
    {
        const projetil = new Sprite({
            x: x, y: y, vy: -300, w: 5, h: 3, color: "black", tags: ["projetilPC"],
        });
        this.cena.adicionar(projetil);
    }

}