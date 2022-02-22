import Sprite from "./Sprite.js";

export default class Bomba extends Sprite {
    aplicaRestricoesBaixo(pmx, pmy) {
        super.aplicaRestricoesBaixo(pmx, pmy);
        if (this.vy === 0) {
            this.cena.aRemover.push(this);
        }
    }

    aplicaRestricoesCima(pmx, pmy) {
        super.aplicaRestricoesCima(pmx, pmy);
        if (this.vy === 0) {
            this.cena.aRemover.push(this);
        }
    }


}
