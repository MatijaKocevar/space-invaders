const drawText = (
    context: CanvasRenderingContext2D,
    options?: {
        text: string;
        fillStyle: string | CanvasGradient | CanvasPattern;
        font: string;
        alignment: CanvasTextAlign;
        x: number;
        y: number;
    }
) => {
    if (options) {
        const { alignment, fillStyle, font, text, x, y } = options;

        context.fillStyle = fillStyle;
        context.font = font;
        context.textAlign = alignment;
        context.fillText(text, x, y);
    }
};

export { drawText };
