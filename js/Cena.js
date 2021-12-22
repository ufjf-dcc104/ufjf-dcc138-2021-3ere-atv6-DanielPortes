export default class Cena
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.sprites = [];
    }

    desenhar()
    {
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.sprites.length; i++)
        {
            const sprite = this.sprites[i];
            sprite.desenhar(this.ctx);
        }
    }

    adicionar(sprite)
    {
        this.sprites.push(sprite);
    }

    passo(dt)
    {
        for (const sprite of this.sprites)
        {
            sprite.passo(dt);
        }
    }
}