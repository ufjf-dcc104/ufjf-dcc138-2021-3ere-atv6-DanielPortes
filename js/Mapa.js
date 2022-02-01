export default class Mapa
{
    constructor(linhas = 8, colunas = 12, tamanho = 32)
    {
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.tiles = [];
        for (let l = 0; l < this.LINHAS; l++)
        {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++)
            {
                this.tiles[l][c] = 0;
            }
        }
        this.mapa = null;
        this.cena = null;
    }

    desenhar(ctx, assets)
    {
        for (let l = 0; l < this.LINHAS; l++)
        {
            for (let c = 0; c < this.COLUNAS; c++)
            {
                switch (this.tiles[l][c])
                {
                    case 0:
                        ctx.drawImage(assets.img('glass'), 32 * c, 32 * l, 32, 32);
                        break;
                    case 1:
                        ctx.drawImage(assets.img("wall"), 32 * c, 32 * l, 32, 32);
                        break;
                    default:
                        ctx.drawImage(assets.img("floor"), 32 * c, 32 * l, 32, 32);
                        break;
                }
            }


        }
    }

    carregaMapa(modelo)
    {
        this.LINHAS = modelo.length;
        this.COLUNAS = modelo[0]?.length ?? 0;
        this.titles = []
        for (let l = 0; l < this.LINHAS; l++)
        {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++)
            {
                this.tiles[l][c] = modelo[l][c];
            }
        }
    }
};