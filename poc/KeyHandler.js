class KeyHandler {
    constructor() {
        this.map = new Array();
        for (var x = 0; x < 256; ++x) {
            this.map[x] = false;
        }
        var obj = this;
        this.storedNumber = 0;
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

    handleNumber(key) {
        if (key >= 48 && key <= 58) {
            if (this.storedNumber < 700000) {
                this.storedNumber = this.storedNumber * 10 + (key - 48)
            }
        }
        if (key >= 96 && key <= 106) {
            if (this.storedNumber < 700000) {
                this.storedNumber = this.storedNumber * 10 + (key - 96)
            }
        }
        if (key === 46 || key === 8 || key === 111 || key === 109) {
            this.storedNumber = Math.floor(this.storedNumber / 10);
        }
    }

    clearNumber() {
        this.storedNumber = 0;
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
        return this.map[65] || this.map[37];
    }

    right() {
        return this.map[68] || this.map[39];
    }

    accelerate() {
        return this.map[87] || this.map[38];
    }

    special() {
        return this.map[40] || this.map[83];
    }

    number() {
        return this.storedNumber;
    }

    erase() {
        return this.map[46] || this.map[8] || this.map[111] || this.map[109];
    }

    fire() {
        return this.map[13] || this.map[32] || this.map[107];
    }

    toggleBreachMode() {
        return this.map[66];
    }

    reset() {
        return this.map[82];
    }

    xtra() {
        return this.map[88];
    }
}
