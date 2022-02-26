import Cena from "./Cena.js";

export default class CenaFim extends Cena
{
    desenhar()
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "20px Impact";
        // this.mapa?.desenhar(this.ctx, this.assets);
        this.ctx.fillStyle = "green";
        this.ctx.textAlign = "center";
        this.ctx.fillText("FINAL", this.canvas.width / 2, this.canvas.height / 2 - 30);
        if (this.dificuldade === 4)
        {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillText("Jogo finalizado! De volta ao comeco", this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
        if (this.assets.acabou())
        {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillText("Aperte enter para jogar novamente", this.canvas.width / 2, this.canvas.height / 2 + 25);
        }
    }

    quadro(t)
    {
        const that = this;
        this.t0 = this.t0 ?? t;
        this.dt = (t - this.t0) / 1000;

        if (this.assets.acabou())
        {
            if (this.input.comandos.get("PROXIMA_CENA"))
            {
                this.dificuldade = 1;
                this.game.selecionaCena("jogo");
                return;
            }
        }

        this.desenhar();
        this.iniciar();
        this.t0 = t;
    }


};