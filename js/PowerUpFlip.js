import PowerUpBase from './PowerUpBase.js';

export default class PowerUpFlip extends PowerUpBase {
    constructor() {
        super();
    }

    update(ship, factoroids, delta) {
        if (this.cooldown === 0) {
            ship.rotation += 180;
            this.cooldown = 15;
        }

    }
}