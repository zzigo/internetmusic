/** Represents a color in Ableton */
export declare class Color {
    private readonly color;
    constructor(color: number | string);
    get hex(): string;
    get rgb(): {
        r: number;
        g: number;
        b: number;
    };
    get numberRepresentation(): number;
    toString(): string;
    toJSON(): number;
}
