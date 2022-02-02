import Cena from "./Cena.js";

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

        console.log(this.aRemover);
    }

};