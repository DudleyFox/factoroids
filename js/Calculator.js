export default class Calculator {
    constructor(color, text) {
        this.color = color;
        this.screenText = text;
        const yFrameSize = 20;
        const xFrameSize = 16;
        this.frame = {
            xOffset: -xFrameSize,
            yOffset: -(yFrameSize * 1.5),
            width: xFrameSize * 2,
            heigth: yFrameSize * 3
        }
        this.screen = {
            xOffset: -13,
            yOffset: -28,
            width: 26,
            heigth: 11,
        };

        const xOffset = 0;
        const yOffset = -11;
        const delta = 9;
        const font = '8pt Courier';
        const textAlign = 'center';
        const textBaseline = 'middle';
        this.text = [
            {
                value: 'C  ÷',
                xOffset,
                yOffset,
                color: this.color,
                font,
                textAlign,
                textBaseline,
            },
            {
                value: '789x',
                xOffset,
                yOffset: yOffset + delta,
                color: this.color,
                font,
                textAlign,
                textBaseline,
            },
            {
                value: '456-',
                xOffset,
                yOffset: yOffset + delta * 2,
                color: this.color,
                font,
                textAlign,
                textBaseline,
            },
            {
                value: '123+',
                xOffset,
                yOffset: yOffset + delta * 3,
                color: this.color,
                font,
                textAlign,
                textBaseline,
            },
            {
                value: '0 .=',
                xOffset,
                yOffset: yOffset + delta * 4,
                color: this.color,
                font,
                textAlign,
                textBaseline,
            },
            {
                value: this.screenText || '1',
                xOffset: 12,
                yOffset: -22,
                color: 'white',
                font: '10pt Courier',
                textAlign: 'right',
                textBaseline: 'middle',

            }

        ];
    }

    topLeft(x,y) {
        return new Point(x + this.frame.xOffset, y + this.frame.yOffset);
    }

    
    bottomRight(x,y) {
        return new Point(
            x + this.frame.xOffset + this.frame.width,
            y + this.frame.xOffset + this.frame.height);
    }

    drawFrame(context, x, y, frame, lineColor, fillColor) {
        context.beginPath();
        context.rect(x + frame.xOffset, y + frame.yOffset, frame.width, frame.heigth);

        context.strokeStyle = lineColor;
        context.stroke();
        if (fillColor) {
            context.fillStyle = fillColor;
            context.fill();
        }
    }

    drawText(context, x, y, text) {
        text.forEach(t => {
            context.font = t.font;
            context.textAlign = t.textAlign;
            context.textBaseline = t.textBaseline;
            context.fillStyle = t.color;
            context.fillText(t.value, x + t.xOffset, y + t.yOffset);
        });
    }

    draw(context, x, y) {
        context.save();
        this.drawFrame(context, x, y, this.frame, this.color, 'darkgray');
        this.drawFrame(context, x, y, this.screen, this.color, 'black');
        this.drawText(context, x, y, this.text);
        context.restore();
    }
};
