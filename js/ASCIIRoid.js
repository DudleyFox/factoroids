import Factoroid from "./Factoroid.js";


const computeProductFromLabel = (label) => {
    const len = label.length;
    let product = 0;
    for (let i = 0; i < len; i++) {
        product = product + label[i].charCodeAt(0);
    }
    return product;
}

export default class ASCIIRoid extends Factoroid {
    constructor(options) {
        const product = computeProductFromLabel(options.label);
        super({...options, product, noWrap: true});
        this.label = options.label;
        this.title = options.title;
    }

    getLabel() {
        return this.label;
    }

    privateDraw(context, x, y) {
        super.privateDraw(context, x, y);

        context.save();
        context.fillStyle = 'lightblue';
        context.font = '10pt Courier';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.title, x, y+15);
        context.restore();
    }

};
