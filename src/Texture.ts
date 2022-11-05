/**
 * An object containing information about a texture.
 *
 * @private
 */
export default class Texture {
    transparent: boolean;
    source: undefined;
    name: undefined;
    extension: undefined;
    path: undefined;
    pixels: undefined;
    width: undefined;
    height: undefined;
    constructor() {
        this.transparent = false;
        this.source = undefined;
        this.name = undefined;
        this.extension = undefined;
        this.path = undefined;
        this.pixels = undefined;
        this.width = undefined;
        this.height = undefined;
    }
}