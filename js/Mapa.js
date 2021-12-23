export default class Mapa
{
    constructor(linhas = 8, colunas = 12, tamanho = 32)
    {
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.titles = [];
        for (let l = 0; l < this.LINHAS; l++)
        {
            this.titles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++)
            {
                this.titles[l][c] = 0;
            }
        }
        this.cena = null;
    }

    desenhar(ctx)
    {
        for (let l = 0; l < this.LINHAS; l++)
        {
            for (let c = 0; c < this.COLUNAS; c++)
            {
                switch (this.titles[l][c])
                {
                    case 1:
                        ctx.fillStyle = "grey";
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        break;
                    case 2:
                        ctx.fillStyle = "darkgreen";
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "orange";
                        break;
                    default:
                        ctx.fillStyle = "black";
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "grey";
                        break;
                }
                ctx.fillRect(c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
                ctx.strokeRect(c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);

            }


        }
    }

    carregaMapa(modelo)
    {
        this.LINHAS = modelo.length;
        this.COLUNAS = modelo[0]?.length ?? 0;
        this.title = []
        for (let l = 0; l < this.LINHAS; l++)
        {
            this.titles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++)
            {
                this.titles[l][c] = modelo[l][c];
            }
        }
    }
};