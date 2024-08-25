export default class PointerHandler {
    constructor(parent) {
        let obj = this;
        const p = parent || window;
        p.addEventListener('pointerdown', function (evt) { obj.OnDown(evt) }, true);
        p.addEventListener('pointerup', function (evt) { obj.OnUp(evt) }, true);
        p.addEventListener('pointermove', function (evt) { obj.OnMove(evt) }, true);
        p.addEventListener('pointercancel', function (evt) { obj.OnCancel(evt) }, true);
        p.addEventListener('pointerleave', function (evt) { obj.OnLeave(evt) }, true);
        this.subscribers = [];
    }

    Subscribe(s) {
        this.subscribers.push(s);
    }

    Unsubscribe(s) {
        this.subscribers = this.subscribers.filter(x => x !== s);
    }

    OnDown(evt) {
        const rect = evt.target.getBoundingClientRect();
        const x = evt.clientX - rect.left; //x position within the element.
        const y = evt.clientY - rect.top;  //y position within the element.
        this.subscribers.forEach(s => s.OnDown(evt, x, y));
    }

    OnUp(evt) {
        const rect = evt.target.getBoundingClientRect();
        const x = evt.clientX - rect.left; //x position within the element.
        const y = evt.clientY - rect.top;  //y position within the element.
        this.subscribers.forEach(s => s.OnUp(evt, x, y));
    }

    OnCancel(evt) {
        const rect = evt.target.getBoundingClientRect();
        const x = evt.clientX - rect.left; //x position within the element.
        const y = evt.clientY - rect.top;  //y position within the element.
        this.subscribers.forEach(s => s.OnCancel(evt));
    }

    OnLeave(evt) {
        const rect = evt.target.getBoundingClientRect();
        const x = evt.clientX - rect.left; //x position within the element.
        const y = evt.clientY - rect.top;  //y position within the element.
        this.subscribers.forEach(s => s.OnLeave(evt));
    }

    OnMove(evt) {
        const rect = evt.target.getBoundingClientRect();
        const x = evt.clientX - rect.left; //x position within the element.
        const y = evt.clientY - rect.top;  //y position within the element.
        this.subscribers.forEach(s => s.OnMove(evt, x, y));
    }
}
