export default class KeyHandler {
    constructor() {
        this.map = new Array();
        for (var x = 0; x < 256; ++x) {
            this.map[x] = false;
        }
        var obj = this;
        this.storedNumber = 0;
        this.postFiring = false;
        window.addEventListener('keydown', function (evt) { obj.OnKeyDown(evt) }, true);
        window.addEventListener('keyup', function (evt) { obj.OnKeyUp(evt) }, true);
    }

    keydown(key) {
        this.map[key] = true;
        this.handleNumber(key)
    }

    keyup(key) {
        this.map[key] = false;
        
    }

    setNumber(n) {
        if (this.postFiring && this.storedNumber > 0) {
            this.clearNumber();
        }
        if (this.storedNumber < 700000) {
            this.storedNumber = this.storedNumber * 10 + n;
        }

    }

    handleNumber(key) {
        if (key >= 48 && key <= 58) {
            this.setNumber(key - 48);    
        }
        if (key >= 96 && key <= 106) {
            this.setNumber(key - 96);
        }
        if (key === 46 || key === 8 || key === 111 || key === 109) {
            this.storedNumber = Math.floor(this.storedNumber / 10);
        }
    }

    clearNumber() {
        this.storedNumber = 0;
        this.postFiring = false;
    }

    OnKeyDown(evt) {
        if (evt.keyCode < 112) {// let the function keys work.
            evt.preventDefault();
        }
        this.keydown(evt.keyCode);

        return false;
    }

    OnKeyUp(evt) {
        if (evt.keyCode < 112) {// let the function keys work.
            evt.preventDefault();
        }
        this.keyup(evt.keyCode);
        return false;
    }

    left() {
        // A or left arrow
        return this.map[65] || this.map[37];
    }

    right() {
        // D or right arrow
        return this.map[68] || this.map[39];
    }

    accelerate() {
        // W or up arrow
        return this.map[87] || this.map[38];
    }

    special() {
        // S or down arrow
        return this.map[40] || this.map[83];
    }

    escape() {
        // ESC
        return this.map[27];
    }

    number() {
        return this.storedNumber;
    }

    erase() {
        // Delete or Backspace or numberpad '-' or numberpad '/'
        return this.map[46] || this.map[8] || this.map[111] || this.map[109];
    }

    fire() {
        // enter or space or numberpad '+'
        return this.map[13] || this.map[32] || this.map[107];
    }

    fired() {
        this.postFiring = true;
    }

    firingSolution() {
        // 'F'
        return this.map[70];
    }

    factoroidBehavior() {
        // 'B'
        return this.map[66];
    }

    continue() {
        // 'C'
        return this.map[67] || this.fire();
    }

    powerUp() {
        // 'P'
        return this.map[80];
    }

    reset() {
        // 'R'
        return this.map[82];
    }

    xtra() {
        // 'X'
        return this.map[88];
    }
}
