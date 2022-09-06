export default class PowerUpBase {
    constructor() {
        this.cooldown = 0;
    }
    tick() {
        if (this.cooldown > 0) {
            this.cooldown -= 1;
        }
    }
    update(ship, delta) {
        throw new Error('Did you forget to implement this?');
    }
}