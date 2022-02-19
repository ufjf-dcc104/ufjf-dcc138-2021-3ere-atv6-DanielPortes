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
        if (this.tags.has("special"))
        {
            ctx.drawImage(assets.img("eye"), this.x, this.y, 32, 32);
        } else if (this.tags.has("enemy"))
        {
            ctx.drawImage(assets.img("skull"), this.x, this.y, 32, 32);

        } else if (this.tags.has("pc"))
        {
            ctx.drawImage(assets.img("doguinho"), this.x, this.y, 32, 32);

        } else
        {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        }
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