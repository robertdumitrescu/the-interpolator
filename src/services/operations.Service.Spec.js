'use strict';

import chai from 'chai';

import {OperationsService} from './operations.Service.js';
import {teleJsonConfig} from '../configs/telejson.Config.js';
import Telejson from 'telejson';

const stringify = Telejson.stringify;
let expect = chai.expect;

describe('OperationsService', () => {
    describe('interpolate', () => {
        it('should interpolate an interpolation within a string', () => {
            /** @type {InterpolateOptions} */
            let initial = {

            };
            
            /** @type {InterpolateResult} */
            let expected = {

            };

            /** @type {InterpolateResult} */
            let actual = OperationsService.interpolate(initial);

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
    });
});