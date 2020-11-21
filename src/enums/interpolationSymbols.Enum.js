'use strict';

/** @typedef {String} InterpolationSymbol */

/**
 *
 * @classdesc Wrapper class that offers a collection of interpolation symbols {@link InterpolationSymbol}.
 * @author Robert Dumitrescu (LinkedIn: https://www.linkedin.com/in/robertdumitrescu/) (Github: https://github.com/robertdumitrescu)
 * @date 2020-04-07
 * @class InterpolationSymbolsEnum
 */
class InterpolationSymbolsEnum {
    /**
     * @description This marks the start of an interpolated fragment within a string
     * @static
     * @type {InterpolationSymbol}
     * @memberof InterpolationSymbolsEnum
     */
    static startSingle = '{';

    /**
     * @description This marks the end of an interpolated fragment within a string
     * @static
     * @type {InterpolationSymbol}
     * @memberof InterpolationSymbolsEnum
     */
    static endSingle = '}';
    /**
     * @description This marks the start of an interpolated fragment within a string
     * @static
     * @type {InterpolationSymbol}
     * @memberof InterpolationSymbolsEnum
     */
    static start = '{{';

    /**
     * @description This marks the end of an interpolated fragment within a string
     * @static
     * @type {InterpolationSymbol}
     * @memberof InterpolationSymbolsEnum
     */
    static end = '}}';

    /**
     * @description This is separating parts of the interpolations such as interpolation id, content, options
     * @static
     * @type {InterpolationSymbol}
     * @memberof InterpolationSymbolsEnum
     */
    static separator = '|';
}

export {InterpolationSymbolsEnum};