'use strict';

import chai from 'chai';

import {AnalysisService} from './analysis.Service.js';
import {teleJsonConfig} from '../configs/telejson.Config.js';
import Telejson from 'telejson';

const stringify = Telejson.stringify;
let expect = chai.expect;

describe('AnalysisService', () => {
    describe('splitByIndexes', () => {
        it('should split for an empty array of indexes', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [],
            };

            /** @type {String[]} */
            let expected = ['sit-amet'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an empty array of indexes with startOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [],
                startOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['t-amet'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an empty array of indexes with endOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [],
                endOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['sit-am'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an empty array of indexes with startOffset and endOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [],
                startOffset: 2,
                endOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['t-am'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 1 index', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [3],
            };

            /** @type {String[]} */
            let expected = ['sit', 'amet'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 1 index with startOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [3],
                startOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['t', 'amet'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 1 index with endOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [3],
                endOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['sit', 'am'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 1 index with startOffset and endOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-amet',
                indexes: [3],
                startOffset: 2,
                endOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['t', 'am'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 2 index', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-dolor-amet',
                indexes: [3, 9],
            };

            /** @type {String[]} */
            let expected = ['sit', 'dolor', 'amet'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 2 index with startOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-dolor-amet',
                indexes: [3, 9],
                startOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['t', 'dolor', 'amet'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 2 index with endOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-dolor-amet',
                indexes: [3, 9],
                endOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['sit', 'dolor', 'am'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
        it('should split for an array of indexes with only 2 index with startOffset and endOffset', () => {
            /** @type {SplitByIndexesOptions} */
            let initial = {
                string: 'sit-dolor-amet',
                indexes: [3, 9],
                startOffset: 2,
                endOffset: 2,
            };

            /** @type {String[]} */
            let expected = ['t', 'dolor', 'am'];

            /** @type {String[]} */
            let actual = AnalysisService.splitByIndexes(initial);

            expect(actual).to.deep.equal(expected);
        });
    });
    describe('analyze', () => {
        it('should analyze null', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '',
                standardized: '',
                free: '',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze(null);

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze an empty string', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '',
                standardized: '',
                free: '',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze an string without any curly braces', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l-ips(dolor, sit).amet[2]',
                standardized: 'l-ips(dolor, sit).amet[2]',
                free: 'l-ips(dolor, sit).amet[2]',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l-ips(dolor, sit).amet[2]');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze an string without interpolations and with non matching number of curly braces', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l-ips{{2, 3, {4, 5}, d} dolor',
                standardized: 'l-ips{{2, 3, {4, 5}, d} dolor',
                free: 'l-ips{{2, 3, {4, 5}, d} dolor',
                hasInterpolations: false,
                isValid: false,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l-ips{{2, 3, {4, 5}, d} dolor');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze a simple one', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{b}}c',
                standardized: 'a{{L1C1|b|{}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{b}}',
                        standardized: '{{L1C1|b|{}|L1C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 6],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{b}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze an simple interpolation within a string with glob like variable ranges outside of any interpolation', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{b}}c(zz|y)12',
                standardized: 'a{{L1C1|b|{}|L1C1}}c(zz|y)12',
                free: 'ac(zz|y)12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{b}}',
                        standardized: '{{L1C1|b|{}|L1C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 6],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{b}}c(zz|y)12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze a simple interpolation within a string with 2 glob like curly brace enums', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{a, 2}a{{b}}c{1, null}',
                standardized: '{a, 2}a{{L1C1|b|{}|L1C1}}c{1, null}',
                free: '{a, 2}ac{1, null}',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{b}}',
                        standardized: '{{L1C1|b|{}|L1C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [7, 12],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{a, 2}a{{b}}c{1, null}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze two simple root interpolations', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{b}}n{{d}}c',
                standardized: 'a{{L1C1|b|{}|L1C1}}n{{L1C2|d|{}|L1C2}}c',
                free: 'anc',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{b}}',
                        standardized: '{{L1C1|b|{}|L1C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 6],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{d}}',
                        standardized: '{{L1C2|d|{}|L1C2}}',
                        partiallyStandardized: '{{d}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['d'],
                        content: 'd',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [7, 12],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2'],
                rootInterpolationsIds: ['L1C1', 'L1C2'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{b}}n{{d}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with separators', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b|m}}c',
                standardized: 'a{{L1C1|b|{}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b|m}}',
                        standardized: '{{L1C1|b|{}|L1C1}}',
                        partiallyStandardized: '{{n|b|m}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n', 'b', 'm'],
                        content: 'b',
                        options: 'm',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3, 5],
                        initialIndexes: [1, 10],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b|m}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with separators and multiple options', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: 3, d: null, l: true}}c',
                standardized: 'a{{L1C1|n|{b: 3, d: null, l: true}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: 3, d: null, l: true}}',
                        standardized: '{{L1C1|n|{b: 3, d: null, l: true}|L1C1}}',
                        partiallyStandardized: '{{n|b: 3, d: null, l: true}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n', 'b: 3, d: null, l: true'],
                        content: 'n',
                        options: 'b: 3, d: null, l: true',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3],
                        initialIndexes: [1, 29],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: 3, d: null, l: true}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with separators and multiple options (some as interpolations)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: {{g}}, d: null, l: {{o}}}}c',
                standardized: 'a{{L1C1|n|{b: {{L2C1|g|{}|L2C1}}, d: null, l: {{L2C2|o|{}|L2C2}}}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: {{g}}, d: null, l: {{o}}}}',
                        standardized: '{{L1C1|n|{b: {{L2C1|g|{}|L2C1}}, d: null, l: {{L2C2|o|{}|L2C2}}}|L1C1}}',
                        partiallyStandardized: '{{n|b: {{L2C1|g|{}|L2C1}}, d: null, l: {{L2C2|o|{}|L2C2}}}}',
                        depOffset: 26,
                        localLastIndex: 32,
                        fragments: ['n', 'b: {{L2C1|g|{}|L2C1}}, d: null, l: {{L2C2|o|{}|L2C2}}'],
                        content: 'n',
                        options: 'b: {{L2C1|g|{}|L2C1}}, d: null, l: {{L2C2|o|{}|L2C2}}',
                        processedOptions: {},
                        dependencies: ['L2C1', 'L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3],
                        initialIndexes: [1, 34],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{g}}',
                        standardized: '{{L2C1|g|{}|L2C1}}',
                        partiallyStandardized: '{{g}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['g'],
                        content: 'g',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [8, 13],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{o}}',
                        standardized: '{{L2C2|o|{}|L2C2}}',
                        partiallyStandardized: '{{o}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['o'],
                        content: 'o',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [27, 32],
                    },
                },
                interpolationsIds: ['L2C1', 'L2C2', 'L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: {{g}}, d: null, l: {{o}}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with separators and multiple options (some as interpolations with options)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: {{g|e:2, f: true}}, d: null, l: {{o|q:"sit", p: false}}}}c',
                standardized: 'a{{L1C1|n|{b: {{L2C1|g|{e:2, f: true}|L2C1}}, d: null, l: {{L2C2|o|{q:"sit", p: false}|L2C2}}}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: {{g|e:2, f: true}}, d: null, l: {{o|q:"sit", p: false}}}}',
                        standardized: '{{L1C1|n|{b: {{L2C1|g|{e:2, f: true}|L2C1}}, d: null, l: {{L2C2|o|{q:"sit", p: false}|L2C2}}}|L1C1}}',
                        partiallyStandardized: '{{n|b: {{L2C1|g|{e:2, f: true}|L2C1}}, d: null, l: {{L2C2|o|{q:"sit", p: false}|L2C2}}}}',
                        depOffset: 24,
                        localLastIndex: 63,
                        fragments: ['n', 'b: {{L2C1|g|{e:2, f: true}|L2C1}}, d: null, l: {{L2C2|o|{q:"sit", p: false}|L2C2}}'],
                        content: 'n',
                        options: 'b: {{L2C1|g|{e:2, f: true}|L2C1}}, d: null, l: {{L2C2|o|{q:"sit", p: false}|L2C2}}',
                        processedOptions: {},
                        dependencies: ['L2C1', 'L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3],
                        initialIndexes: [1, 65],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{g|e:2, f: true}}',
                        standardized: '{{L2C1|g|{e:2, f: true}|L2C1}}',
                        partiallyStandardized: '{{g|e:2, f: true}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['g', 'e:2, f: true'],
                        content: 'g',
                        options: 'e:2, f: true',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3],
                        initialIndexes: [8, 26],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{o|q:"sit", p: false}}',
                        standardized: '{{L2C2|o|{q:"sit", p: false}|L2C2}}',
                        partiallyStandardized: '{{o|q:"sit", p: false}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['o', 'q:"sit", p: false'],
                        content: 'o',
                        options: 'q:"sit", p: false',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3],
                        initialIndexes: [40, 63],
                    },
                },
                interpolationsIds: ['L2C1', 'L2C2', 'L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: {{g|e:2, f: true}}, d: null, l: {{o|q:"sit", p: false}}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with separators and multiple options (some as string)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: "sit", d: [], l: true}}c',
                standardized: 'a{{L1C1|n|{b: "sit", d: [], l: true}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: "sit", d: [], l: true}}',
                        standardized: '{{L1C1|n|{b: "sit", d: [], l: true}|L1C1}}',
                        partiallyStandardized: '{{n|b: "sit", d: [], l: true}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n', 'b: "sit", d: [], l: true'],
                        content: 'n',
                        options: 'b: "sit", d: [], l: true',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3],
                        initialIndexes: [1, 31],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: "sit", d: [], l: true}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with separators and multiple options (some as empty object)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: "sit", d: [], l: {}}}c',
                standardized: 'a{{L1C1|n|{b: "sit", d: [], l: {}}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: "sit", d: [], l: {}}}',
                        standardized: '{{L1C1|n|{b: "sit", d: [], l: {}}|L1C1}}',
                        partiallyStandardized: '{{n|b: "sit", d: [], l: {}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n', 'b: "sit", d: [], l: {}'],
                        content: 'n',
                        options: 'b: "sit", d: [], l: {}',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3],
                        initialIndexes: [1, 29],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: "sit", d: [], l: {}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with separators and multiple options (some as populated object)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: {}, d: [], l: {j: "sit"}}}c',
                standardized: 'a{{L1C1|n|{b: "sit", d: [], l: {}}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: {}, d: [], l: {j: "sit"}}}',
                        standardized: '{{L1C1|n|{b: {}, d: [], l: {j: "sit"}}|L1C1}}',
                        partiallyStandardized: '{{n|b: {}, d: [], l: {j: "sit"}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n', 'b: {}, d: [], l: {j: "sit"}'],
                        content: 'n',
                        options: 'b: {}, d: [], l: {j: "sit"}',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3],
                        initialIndexes: [1, 29],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: {}, d: [], l: {j: "sit"}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple interpolation with interpolation like curly braces within options and an actual interpolation within curly braces', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: {{1, 2}, {{c}}, {a, b}}, d: [], l: {j: "sit"}}}c',
                standardized: 'a{{L1C1|n|{b: {{1, 2}, {{L2C1|c|{}|L2C1}}, {a, b}}, d: [], l: {}}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: {{1, 2}, {{c}}, {a, b}}, d: [], l: {j: "sit"}}}',
                        standardized: '{{L1C1|n|{b: {{1, 2}, {{L2C1|c|{}|L2C1}}, {a, b}}, d: [], l: {j: "sit"}}|L1C1}}',
                        partiallyStandardized: '{{n|b: {{1, 2}, {{L2C1|c|{}|L2C1}}, {a, b}}, d: [], l: {j: "sit"}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n', 'b: {{1, 2}, {{c}}, {a, b}}, d: [], l: {j: "sit"}'],
                        content: 'n',
                        options: 'b: {{1, 2}, {{c}}, {a, b}}, d: [], l: {j: "sit"}',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3], // this is broken
                        initialIndexes: [1, 29], // this is broken
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 1,
                        initial: '{{c}}',
                        standardized: '{{L2C1|c|{}|L2C1}}',
                        partiallyStandardized: '{{c}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n'],
                        content: 'n',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3], // this is broken
                        initialIndexes: [1, 29], // this is broken
                    },
                },
                interpolationsIds: ['L1C1', 'L2C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: {{1, 2}, {{c}}, {a, b}}, d: [], l: {j: "sit"}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze an interpolation with an object as options which contains another interpolation with object', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{n|b: {{1, 2}, 3}, d: [], l: {j: {{o|j:{{4, 5}, {8, 0}}}}}}}c',
                standardized: 'a{{L1C1|n|b: {{1, 2}, 3}, d: [], l: {j: {{L2C1|o|{j:{{4, 5}, {8, 0}}}|L2C1}}}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{n|b: {{1, 2}, 3}, d: [], l: {j: {{o|j:{{4, 5}, {8, 0}}}}}}}',
                        standardized: '{{L1C1|n|b: {{1, 2}, 3}, d: [], l: {j: {{L2C1|o|{j:{{4, 5}, {8, 0}}}|L2C1}}}|L1C1}}',
                        partiallyStandardized: '{{n|b: {{1, 2}, 3}, d: [], l: {j: {{L2C1|o|{j:{{4, 5}, {8, 0}}}|L2C1}}}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['n', 'b: {{1, 2}, 3}, d: [], l: {j: {{L2C1|o|{j:{{4, 5}, {8, 0}}}|L2C1}}}}}'],
                        content: 'n',
                        options: 'b: {{1, 2}, 3}, d: [], l: {j: {{L2C1|o|{j:{{4, 5}, {8, 0}}}|L2C1}}}}}',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3], // this is broken
                        initialIndexes: [1, 29], // this is broken
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 1,
                        initial: '{{o|j:{{4, 5}, {8, 0}}}}',
                        standardized: '{{L2C1|o|{j:{{4, 5}, {8, 0}}}|L2C1}}',
                        partiallyStandardized: '{{o|j:{{4, 5}, {8, 0}}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['j:{{4, 5}, {8, 0}}'],
                        content: 'o',
                        options: 'j:{{4, 5}, {8, 0}}',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3], // this is broken
                        initialIndexes: [1, 29], // this is broken
                    },
                },
                interpolationsIds: ['L1C1', 'L2C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{n|b: {{1, 2}, 3}, d: [], l: {j: {{o|j:{{4, 5}, {8, 0}}}}}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with one nested', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{{{b}}}}c',
                standardized: 'a{{L1C1|{{L2C1|b|{}|L2C1}}|{}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{b}}}}',
                        standardized: '{{L1C1|{{L2C1|b|{}|L2C1}}|{}|L1C1}}',
                        partiallyStandardized: '{{{{L2C1|b|{}|L2C1}}}}',
                        depOffset: 13,
                        localLastIndex: 8,
                        fragments: ['{{L2C1|b|{}|L2C1}}'],
                        content: '{{L2C1|b|{}|L2C1}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 10],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b}}',
                        standardized: '{{L2C1|b|{}|L2C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [3, 8],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{{{b}}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with two nested', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{{{b}}d{{e}}}}c',
                standardized: 'a{{L1C1|{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{b}}d{{e}}}}',
                        standardized: '{{L1C1|{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{}|L1C1}}',
                        partiallyStandardized: '{{{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}}}',
                        depOffset: 26,
                        localLastIndex: 14,
                        fragments: ['{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}'],
                        content: '{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1', 'L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 16],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b}}',
                        standardized: '{{L2C1|b|{}|L2C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [3, 8],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{e}}',
                        standardized: '{{L2C2|e|{}|L2C2}}',
                        partiallyStandardized: '{{e}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['e'],
                        content: 'e',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [9, 14],
                    },
                },
                interpolationsIds: ['L2C1', 'L2C2', 'L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{{{b}}d{{e}}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a string with two root interpolations with different depths', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{{{x}}}}d{{{{{{r|l: 2}}}}}}c',
                standardized: 'a{{L1C1|{{L2C1|x|{}|L2C1}}|{}|L1C1}}d{{L1C2|{{L2C2|{{L3C1|r|{l: 2}|L3C1}}|{}|L2C2}}|{}|L1C2}}c',
                free: 'adc',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{x}}}}',
                        standardized: '{{L1C1|{{L2C1|x|{}|L2C1}}|{}|L1C1}}',
                        partiallyStandardized: '{{{{L2C1|x|{}|L2C1}}}}',
                        depOffset: 13,
                        localLastIndex: 8,
                        fragments: ['{{L2C1|x|{}|L2C1}}'],
                        content: '{{L2C1|x|{}|L2C1}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 10],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{x}}',
                        standardized: '{{L2C1|x|{}|L2C1}}',
                        partiallyStandardized: '{{x}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['x'],
                        content: 'x',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [3, 8],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{{{r|l: 2}}}}}}',
                        standardized: '{{L1C2|{{L2C2|{{L3C1|r|{l: 2}|L3C1}}|{}|L2C2}}|{}|L1C2}}',
                        partiallyStandardized: '{{{{L2C2|{{L3C1|r|{l: 2}|L3C1}}|{}|L2C2}}}}',
                        depOffset: 38,
                        localLastIndex: 27,
                        fragments: ['{{L2C2|{{L3C1|r|{l: 2}|L3C1}}|{}|L2C2}}'],
                        content: '{{L2C2|{{L3C1|r|{l: 2}|L3C1}}|{}|L2C2}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [11, 29],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{{{r|l: 2}}}}',
                        standardized: '{{L2C2|{{L3C1|r|{l: 2}|L3C1}}|{}|L2C2}}',
                        partiallyStandardized: '{{{{L3C1|r|{l: 2}|L3C1}}}}',
                        depOffset: 25,
                        localLastIndex: 26,
                        fragments: ['{{L3C1|r|{l: 2}|L3C1}}'],
                        content: '{{L3C1|r|{l: 2}|L3C1}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L3C1'],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [13, 27],
                    },
                    L3C1: {
                        id: 'L3C1',
                        level: 3,
                        initial: '{{r|l: 2}}',
                        standardized: '{{L3C1|r|{l: 2}|L3C1}}',
                        partiallyStandardized: '{{r|l: 2}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['r', 'l: 2'],
                        content: 'r',
                        options: 'l: 2',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L2C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [3],
                        initialIndexes: [15, 25],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L3C1', 'L2C2', 'L1C2'],
                rootInterpolationsIds: ['L1C1', 'L1C2'],
                lastLevelInterpolationsIds: ['L2C1', 'L3C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{{{x}}}}d{{{{{{r|l: 2}}}}}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a string with two root interpolations with different depths in middle of other strings', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{z{{x}}y}}d{{m{{n{{r|l: 2}}t}}j}}c',
                standardized: 'a{{L1C1|z{{L2C1|x|{}|L2C1}}y|{}|L1C1}}d{{L1C2|m{{L2C2|n{{L3C1|r|{l: 2}|L3C1}}t|{}|L2C2}}j|{}|L1C2}}c',
                free: 'adc',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{z{{x}}y}}',
                        standardized: '{{L1C1|z{{L2C1|x|{}|L2C1}}y|{}|L1C1}}',
                        partiallyStandardized: '{{z{{L2C1|x|{}|L2C1}}y}}',
                        depOffset: 13,
                        localLastIndex: 9,
                        fragments: ['z{{L2C1|x|{}|L2C1}}y'],
                        content: 'z{{L2C1|x|{}|L2C1}}y',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 12],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{x}}',
                        standardized: '{{L2C1|x|{}|L2C1}}',
                        partiallyStandardized: '{{x}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['x'],
                        content: 'x',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [4, 9],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{m{{n{{r|l: 2}}t}}j}}',
                        standardized: '{{L1C2|m{{L2C2|n{{L3C1|r|{l: 2}|L3C1}}t|{}|L2C2}}j|{}|L1C2}}',
                        partiallyStandardized: '{{m{{L2C2|n{{L3C1|r|{l: 2}|L3C1}}t|{}|L2C2}}j}}',
                        depOffset: 25,
                        localLastIndex: 32,
                        fragments: ['m{{L2C2|n{{L3C1|r|{l: 2}|L3C1}}t|{}|L2C2}}j'],
                        content: 'm{{L2C2|n{{L3C1|r|{l: 2}|L3C1}}t|{}|L2C2}}j',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [13, 35],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{n{{r|l: 2}}t}}',
                        standardized: '{{L2C2|n{{L3C1|r|{l: 2}|L3C1}}t|{}|L2C2}}',
                        partiallyStandardized: '{{n{{L3C1|r|{l: 2}|L3C1}}t}}',
                        depOffset: 12,
                        localLastIndex: 29,
                        fragments: ['n{{L3C1|r|{l: 2}|L3C1}}t'],
                        content: 'n{{L3C1|r|{l: 2}|L3C1}}t',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L3C1'],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [16, 32],
                    },
                    L3C1: {
                        id: 'L3C1',
                        level: 3,
                        initial: '{{r|l: 2}}',
                        standardized: '{{L3C1|r|{l: 2}|L3C1}}',
                        partiallyStandardized: '{{r|l: 2}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['r', 'l: 2'],
                        content: 'r',
                        options: 'l: 2',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L2C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [3],
                        initialIndexes: [19, 29],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L3C1', 'L2C2', 'L1C2'],
                rootInterpolationsIds: ['L1C1', 'L1C2'],
                lastLevelInterpolationsIds: ['L2C1', 'L3C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{z{{x}}y}}d{{m{{n{{r|l: 2}}t}}j}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with two nested with separators at root level', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{{{b}}d{{e}}|d: 2}}c',
                standardized: 'a{{L1C1|{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{d: 2}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{b}}d{{e}}|d: 2}}',
                        standardized: '{{L1C1|{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{d: 2}|L1C1}}',
                        partiallyStandardized: '{{{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|d: 2}}',
                        depOffset: 26,
                        localLastIndex: 14,
                        fragments: ['{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}', 'd: 2'],
                        content: '{{L2C1|b|{}|L2C1}}d{{L2C2|e|{}|L2C2}}',
                        options: 'd: 2',
                        processedOptions: {},
                        dependencies: ['L2C1', 'L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [39],
                        initialIndexes: [1, 21],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b}}',
                        standardized: '{{L2C1|b|{}|L2C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [3, 8],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{e}}',
                        standardized: '{{L2C2|e|{}|L2C2}}',
                        partiallyStandardized: '{{e}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['e'],
                        content: 'e',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [9, 14],
                    },
                },
                interpolationsIds: ['L2C1', 'L2C2', 'L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{{{b}}d{{e}}|d: 2}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with two nested with separators at both levels', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{{{1|b}}d{{2|e|3}}|d: 2}}c',
                standardized: 'a{{L1C1|{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{d: 2}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{1|b}}d{{2|e|3}}|d: 2}}',
                        standardized: '{{L1C1|{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{d: 2}|L1C1}}',
                        partiallyStandardized: '{{{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|d: 2}}',
                        depOffset: 20,
                        localLastIndex: 20,
                        fragments: ['{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}', 'd: 2'],
                        content: '{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}',
                        options: 'd: 2',
                        processedOptions: {},
                        dependencies: ['L2C1', 'L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [39],
                        initialIndexes: [1, 27],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{1|b}}',
                        standardized: '{{L2C1|1|{}|L2C1}}',
                        partiallyStandardized: '{{1|b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['1', 'b'],
                        content: '1',
                        options: 'b',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3],
                        initialIndexes: [3, 10],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{2|e|3}}',
                        standardized: '{{L2C2|e|{}|L2C2}}',
                        partiallyStandardized: '{{2|e|3}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['2', 'e', '3'],
                        content: 'e',
                        options: '3',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3, 5],
                        initialIndexes: [11, 20],
                    },
                },
                interpolationsIds: ['L2C1', 'L2C2', 'L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{{{1|b}}d{{2|e|3}}|d: 2}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a simple one with two nested with separators at both levels with two root levels', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{{{1|b}}d{{2|e|3}}|d: 2}}c{{{{3|n}}m{{8|l|9}}|i: 4}}',
                standardized: 'a{{L1C1|{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{d: 2}|L1C1}}c{{L1C2|{{L2C3|3|{}|L2C3}}m{{L2C4|l|{}|L2C4}}|{i: 4}|L1C2}}',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{1|b}}d{{2|e|3}}|d: 2}}',
                        standardized: '{{L1C1|{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|{d: 2}|L1C1}}',
                        partiallyStandardized: '{{{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}|d: 2}}',
                        depOffset: 20,
                        localLastIndex: 20,
                        fragments: ['{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}', 'd: 2'],
                        content: '{{L2C1|1|{}|L2C1}}d{{L2C2|e|{}|L2C2}}',
                        options: 'd: 2',
                        processedOptions: {},
                        dependencies: ['L2C1', 'L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [39],
                        initialIndexes: [1, 27],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{1|b}}',
                        standardized: '{{L2C1|1|{}|L2C1}}',
                        partiallyStandardized: '{{1|b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['1', 'b'],
                        content: '1',
                        options: 'b',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3],
                        initialIndexes: [3, 10],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{2|e|3}}',
                        standardized: '{{L2C2|e|{}|L2C2}}',
                        partiallyStandardized: '{{2|e|3}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['2', 'e', '3'],
                        content: 'e',
                        options: '3',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [3, 5],
                        initialIndexes: [11, 20],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{3|n}}m{{8|l|9}}|i: 4}}',
                        standardized: '{{L1C2|{{L2C3|3|{}|L2C3}}m{{L2C4|l|{}|L2C4}}|{i: 4}|L1C2}}',
                        partiallyStandardized: '{{{{L2C3|3|{}|L2C3}}m{{L2C4|l|{}|L2C4}}|i: 4}}',
                        depOffset: 20,
                        localLastIndex: 47,
                        fragments: ['{{L2C3|3|{}|L2C3}}m{{L2C4|l|{}|L2C4}}', 'i: 4'],
                        content: '{{L2C3|3|{}|L2C3}}m{{L2C4|l|{}|L2C4}}',
                        options: 'i: 4',
                        processedOptions: {},
                        dependencies: ['L2C3', 'L2C4'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [39],
                        initialIndexes: [28, 54],
                    },
                    L2C3: {
                        id: 'L2C3',
                        level: 2,
                        initial: '{{3|n}}',
                        standardized: '{{L2C3|3|{}|L2C3}}',
                        partiallyStandardized: '{{3|n}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['3', 'n'],
                        content: '3',
                        options: 'n',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [3],
                        initialIndexes: [30, 37],
                    },
                    L2C4: {
                        id: 'L2C4',
                        level: 2,
                        initial: '{{8|l|9}}',
                        standardized: '{{L2C4|l|{}|L2C4}}',
                        partiallyStandardized: '{{8|l|9}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['8', 'l', '9'],
                        content: 'l',
                        options: '9',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [3, 5],
                        initialIndexes: [38, 47],
                    },
                },
                interpolationsIds: ['L2C1', 'L2C2', 'L1C1', 'L2C3', 'L2C4', 'L1C2'],
                rootInterpolationsIds: ['L1C1', 'L1C2'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2', 'L2C3', 'L2C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{{{1|b}}d{{2|e|3}}|d: 2}}c{{{{3|n}}m{{8|l|9}}|i: 4}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze two root interpolations within a curly brace series', () => {
            /** @TODO THIS NEEDS TO BE FIXED */
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{{b}}, 4, {{d|u: 2}}}n',
                standardized: 'a{{{L1C1|{b|{}|L1C1}}, 4, {{L1C2|d|{u: 2}|L1C2}}}n',
                free: 'a{, 4, }n',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{b}}',
                        standardized: '{{L1C1|b|{}|L1C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 7], // this is broken
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{d|u: 2}}',
                        standardized: '{{L1C2|d|{u: 2}|L1C2}}',
                        partiallyStandardized: '{{d|u: 2}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['d', 'u: 2'],
                        content: 'd',
                        options: 'u: 2',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [3], // this is broken
                        initialIndexes: [12, 23], // this is broken
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2'],
                rootInterpolationsIds: ['L1C1', 'L1C2'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{{b}}, 4, {{d|u: 2}}}n');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze a string that does not have any interpolations but is interpolation like (1)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{{1, 2}, {a, b}}',
                standardized: '{{1, 2}, {a, b}}',
                free: '{{1, 2}, {a, b}}',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{{1, 2}, {a, b}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze a string that does not have any interpolations but is interpolation like (2)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{{1, 2}, {{d, 4}, {5, 8}}, {a, b}}',
                standardized: '{{1, 2}, {{d, 4}, {5, 8}}, {a, b}}',
                free: '{{1, 2}, {{d, 4}, {5, 8}}, {a, b}}',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{{1, 2}, {{d, 4}, {5, 8}}, {a, b}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze a string that is interpolation like but also has an actual interpolation in the middle', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{{1, 2}, {{c}}, {a, b}}',
                standardized: '{{1, 2}, {{L1C1|c|{}|L1C1}}, {a, b}}',
                free: '{{1, 2}, , {a, b}}',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{c}}',
                        standardized: '{{L1C1|c|{}|L1C1}}',
                        partiallyStandardized: '{{c}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['c'],
                        content: 'c',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 7], // this is broken
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{{1, 2}, {{c}}, {a, b}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        
        it('should analyze an interpolation within a string', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'a{{b}}c',
                standardized: 'a{{L1C1|b|{}|L1C1}}c',
                free: 'ac',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{b}}',
                        standardized: '{{L1C1|b|{}|L1C1}}',
                        partiallyStandardized: '{{b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b'],
                        content: 'b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 6],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('a{{b}}c');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });


        it('should analyze several interpolations within a string', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a-z)@la}}12',
                standardized: 'l{{L1C1|21b|{}|L1C1}}ip{{L1C2|a4|{}|L1C2}}s{{L1C3|b@la|{}|L1C3}}la{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}12',
                free: 'lipsla12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21b}}',
                        standardized: '{{L1C1|21b|{}|L1C1}}',
                        partiallyStandardized: '{{21b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['21b'],
                        content: '21b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 8],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{a4}}',
                        standardized: '{{L1C2|a4|{}|L1C2}}',
                        partiallyStandardized: '{{a4}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['a4'],
                        content: 'a4',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [10, 16],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la}}',
                        standardized: '{{L1C3|b@la|{}|L1C3}}',
                        partiallyStandardized: '{{b@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b@la'],
                        content: 'b@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [17, 25],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [27, 47],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a-z)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string when is starting with interpolation', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a-z)@la}}12',
                standardized: '{{L1C1|21b|{}|L1C1}}ip{{L1C2|a4|{}|L1C2}}s{{L1C3|b@la|{}|L1C3}}la{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}12',
                free: 'ipsla12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21b}}',
                        standardized: '{{L1C1|21b|{}|L1C1}}',
                        partiallyStandardized: '{{21b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['21b'],
                        content: '21b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [0, 7],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{a4}}',
                        standardized: '{{L1C2|a4|{}|L1C2}}',
                        partiallyStandardized: '{{a4}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['a4'],
                        content: 'a4',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [9, 15],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la}}',
                        standardized: '{{L1C3|b@la|{}|L1C3}}',
                        partiallyStandardized: '{{b@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b@la'],
                        content: 'b@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [16, 24],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [26, 46],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a-z)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string when is ending with interpolation', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a-z)@la}}',
                standardized: 'l{{L1C1|21b|{}|L1C1}}ip{{L1C2|a4|{}|L1C2}}s{{L1C3|b@la|{}|L1C3}}la{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                free: 'lipsla',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21b}}',
                        standardized: '{{L1C1|21b|{}|L1C1}}',
                        partiallyStandardized: '{{21b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['21b'],
                        content: '21b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 8],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{a4}}',
                        standardized: '{{L1C2|a4|{}|L1C2}}',
                        partiallyStandardized: '{{a4}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['a4'],
                        content: 'a4',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [10, 16],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la}}',
                        standardized: '{{L1C3|b@la|{}|L1C3}}',
                        partiallyStandardized: '{{b@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b@la'],
                        content: 'b@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [17, 25],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [27, 47],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a-z)@la}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });


        it('should analyze several interpolations within a string (glob like separator)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a|a)@la}}12',
                standardized: 'l{{L1C1|21b|{}|L1C1}}ip{{L1C2|a4|{}|L1C2}}s{{L1C3|b@la|{}|L1C3}}la{{L1C4|b[2].bla(a|a)@la|{}|L1C4}}12',
                free: 'lipsla12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21b}}',
                        standardized: '{{L1C1|21b|{}|L1C1}}',
                        partiallyStandardized: '{{21b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['21b'],
                        content: '21b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [5, 12],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{a4}}',
                        standardized: '{{L1C2|a4|{}|L1C2}}',
                        partiallyStandardized: '{{a4}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['a4'],
                        content: 'a4',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [14, 20],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la}}',
                        standardized: '{{L1C3|b@la|{}|L1C3}}',
                        partiallyStandardized: '{{b@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b@la'],
                        content: 'b@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [23, 31],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a|a)@la}}',
                        standardized: '{{L1C4|b[2].bla(a|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a|a)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a|a)@la'],
                        content: 'b[2].bla(a|a)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [12],
                        initialIndexes: [33, 53],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a|a)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string when is starting with interpolation (glob like separator)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a|a)@la}}12',
                standardized: '{{L1C1|21b|{}|L1C1}}ip{{L1C2|a4|{}|L1C2}}s{{L1C3|b@la|{}|L1C3}}la{{L1C4|b[2].bla(a|{}|L1C4}}12',
                free: 'ipsla12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21b}}',
                        standardized: '{{L1C1|21b|{}|L1C1}}',
                        partiallyStandardized: '{{21b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['21b'],
                        content: '21b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [0, 7],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{a4}}',
                        standardized: '{{L1C2|a4|{}|L1C2}}',
                        partiallyStandardized: '{{a4}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['a4'],
                        content: 'a4',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [9, 15],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la}}',
                        standardized: '{{L1C3|b@la|{}|L1C3}}',
                        partiallyStandardized: '{{b@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b@la'],
                        content: 'b@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [18, 26],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a|a)@la}}',
                        standardized: '{{L1C4|b[2].bla(a|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a|a)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a', 'a)@la'],
                        content: 'b[2].bla(a',
                        options: 'a)@la',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [12],
                        initialIndexes: [28, 48],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a|a)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string when is ending with interpolation (glob like separator)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a|a)@la}}',
                standardized: 'l{{L1C1|21b|{}|L1C1}}ip{{L1C2|a4|{}|L1C2}}s{{L1C3|b@la|{}|L1C3}}la{{L1C4|b[2].bla(a|{}|L1C4}}',
                free: 'lipsla',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21b}}',
                        standardized: '{{L1C1|21b|{}|L1C1}}',
                        partiallyStandardized: '{{21b}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['21b'],
                        content: '21b',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [5, 12],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{a4}}',
                        standardized: '{{L1C2|a4|{}|L1C2}}',
                        partiallyStandardized: '{{a4}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['a4'],
                        content: 'a4',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [14, 20],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la}}',
                        standardized: '{{L1C3|b@la|{}|L1C3}}',
                        partiallyStandardized: '{{b@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b@la'],
                        content: 'b@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [23, 31],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a|a)@la}}',
                        standardized: '{{L1C4|b[2].bla(a|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a|a)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a', 'a)@la'],
                        content: 'b[2].bla(a',
                        options: 'a)@la',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [12],
                        initialIndexes: [33, 53],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21b}}ip{{a4}}s{{b@la}}la{{b[2].bla(a|a)@la}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze several interpolations within a string (multiple levels)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21{{b[2].bla(a-z)@la}}b}}ip{{{{b[2].bla(a-z)@la}}a4}}s{{b@la{{b[2].bla(a-z)@la}}}}la{{b[2].bla(a-z)@la}}12',
                standardized: 'l{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}ip{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}s{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}la{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}12',
                free: 'lipsla12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21{{b[2].bla(a-z)@la}}b}}',
                        standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}',
                        partiallyStandardized: '{{21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b}}',
                        depOffset: 13,
                        localLastIndex: 25,
                        fragments: ['21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b'],
                        content: '21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 28],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [5, 25],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{b[2].bla(a-z)@la}}a4}}',
                        standardized: '{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}',
                        partiallyStandardized: '{{{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4}}',
                        depOffset: 13,
                        localLastIndex: 52,
                        fragments: ['{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4'],
                        content: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [30, 56],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [32, 52],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la{{b[2].bla(a-z)@la}}}}',
                        standardized: '{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}',
                        partiallyStandardized: '{{b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}}}',
                        depOffset: 13,
                        localLastIndex: 83,
                        fragments: ['b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}'],
                        content: 'b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C3'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [57, 85],
                    },
                    L2C3: {
                        id: 'L2C3',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C3',
                        rootDependant: 'L1C3',
                        separatorsIndexes: [],
                        initialIndexes: [63, 83],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [87, 107],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L2C2', 'L1C2', 'L2C3', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2', 'L2C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21{{b[2].bla(a-z)@la}}b}}ip{{{{b[2].bla(a-z)@la}}a4}}s{{b@la{{b[2].bla(a-z)@la}}}}la{{b[2].bla(a-z)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string when is starting with interpolation (multiple levels)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{{21{{b[2].bla(a-z)@la}}b}}ip{{{{b[2].bla(a-z)@la}}a4}}s{{b@la{{b[2].bla(a-z)@la}}}}la{{b[2].bla(a-z)@la}}12',
                standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}ip{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}s{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}la{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}12',
                free: 'ipsla12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21{{b[2].bla(a-z)@la}}b}}',
                        standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}',
                        partiallyStandardized: '{{21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b}}',
                        depOffset: 13,
                        localLastIndex: 24,
                        fragments: ['21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b'],
                        content: '21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [0, 27],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [4, 24],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{b[2].bla(a-z)@la}}a4}}',
                        standardized: '{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}',
                        partiallyStandardized: '{{{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4}}',
                        depOffset: 13,
                        localLastIndex: 51,
                        fragments: ['{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4'],
                        content: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [29, 55],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [31, 51],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la{{b[2].bla(a-z)@la}}}}',
                        standardized: '{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}',
                        partiallyStandardized: '{{b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}}}',
                        depOffset: 13,
                        localLastIndex: 82,
                        fragments: ['b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}'],
                        content: 'b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C3'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [56, 84],
                    },
                    L2C3: {
                        id: 'L2C3',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C3',
                        rootDependant: 'L1C3',
                        separatorsIndexes: [],
                        initialIndexes: [62, 82],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [86, 106],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L2C2', 'L1C2', 'L2C3', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2', 'L2C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{{21{{b[2].bla(a-z)@la}}b}}ip{{{{b[2].bla(a-z)@la}}a4}}s{{b@la{{b[2].bla(a-z)@la}}}}la{{b[2].bla(a-z)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string when is ending with interpolation (multiple levels)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21{{b[2].bla(a-z)@la}}b}}ip{{{{b[2].bla(a-z)@la}}a4}}s{{b@la{{b[2].bla(a-z)@la}}}}la{{b[2].bla(a-z)@la}}',
                standardized: 'l{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}ip{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}s{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}la{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                free: 'lipsla',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21{{b[2].bla(a-z)@la}}b}}',
                        standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}',
                        partiallyStandardized: '{{21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b}}',
                        depOffset: 13,
                        localLastIndex: 25,
                        fragments: ['21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b'],
                        content: '21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 28],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [5, 25],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{b[2].bla(a-z)@la}}a4}}',
                        standardized: '{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}',
                        partiallyStandardized: '{{{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4}}',
                        depOffset: 13,
                        localLastIndex: 52,
                        fragments: ['{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4'],
                        content: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [30, 56],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [32, 52],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la{{b[2].bla(a-z)@la}}}}',
                        standardized: '{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}',
                        partiallyStandardized: '{{b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}}}',
                        depOffset: 13,
                        localLastIndex: 83,
                        fragments: ['b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}'],
                        content: 'b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C3'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [57, 85],
                    },
                    L2C3: {
                        id: 'L2C3',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C3',
                        rootDependant: 'L1C3',
                        separatorsIndexes: [],
                        initialIndexes: [63, 83],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [87, 107],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L2C2', 'L1C2', 'L2C3', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2', 'L2C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21{{b[2].bla(a-z)@la}}b}}ip{{{{b[2].bla(a-z)@la}}a4}}s{{b@la{{b[2].bla(a-z)@la}}}}la{{b[2].bla(a-z)@la}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });


        it('should analyze several interpolations within a string with glob like braces (multiple levels)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21{{b[2].bla(a-z)@la}}b}}i{a,b}p{{{{b[2].bla(a-z)@la}}a4}}s[1-9A-Z]u[a-z]m{{b@la{{b[2].bla(a-z)@la}}}}l(aa|bb|12)a{{b[2].bla(a-z)@la}}12',
                standardized: 'l{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}i{a,b}p{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}s[1-9A-Z]u[a-z]m{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}l(aa|bb|12)a{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}12',
                free: 'li{a,b}ps[1-9A-Z]u[a-z]ml(aa|bb|12)a12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21{{b[2].bla(a-z)@la}}b}}',
                        standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}',
                        partiallyStandardized: '{{21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b}}',
                        depOffset: 13,
                        localLastIndex: 25,
                        fragments: ['21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b'],
                        content: '21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 28],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [5, 25],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{b[2].bla(a-z)@la}}a4}}',
                        standardized: '{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}',
                        partiallyStandardized: '{{{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4}}',
                        depOffset: 13,
                        localLastIndex: 57,
                        fragments: ['{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4'],
                        content: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [35, 61],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [37, 57],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la{{b[2].bla(a-z)@la}}}}',
                        standardized: '{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}',
                        partiallyStandardized: '{{b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}}}',
                        depOffset: 13,
                        localLastIndex: 103,
                        fragments: ['b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}'],
                        content: 'b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C3'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [77, 105],
                    },
                    L2C3: {
                        id: 'L2C3',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C3',
                        rootDependant: 'L1C3',
                        separatorsIndexes: [],
                        initialIndexes: [83, 103],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [117, 137],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L2C2', 'L1C2', 'L2C3', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2', 'L2C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21{{b[2].bla(a-z)@la}}b}}i{a,b}p{{{{b[2].bla(a-z)@la}}a4}}s[1-9A-Z]u[a-z]m{{b@la{{b[2].bla(a-z)@la}}}}l(aa|bb|12)a{{b[2].bla(a-z)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string with glob like braces when is starting with interpolation (multiple levels)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: '{{21{{b[2].bla(a-z)@la}}b}}i{a,b}p{{{{b[2].bla(a-z)@la}}a4}}s[1-9A-Z]u[a-z]m{{b@la{{b[2].bla(a-z)@la}}}}l(aa|bb|12)a{{b[2].bla(a-z)@la}}12',
                standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}i{a,b}p{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}s[1-9A-Z]u[a-z]m{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}l(aa|bb|12)a{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}12',
                free: 'i{a,b}ps[1-9A-Z]u[a-z]ml(aa|bb|12)a12',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21{{b[2].bla(a-z)@la}}b}}',
                        standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}',
                        partiallyStandardized: '{{21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b}}',
                        depOffset: 13,
                        localLastIndex: 24,
                        fragments: ['21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b'],
                        content: '21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [0, 27],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [4, 24],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{b[2].bla(a-z)@la}}a4}}',
                        standardized: '{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}',
                        partiallyStandardized: '{{{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4}}',
                        depOffset: 13,
                        localLastIndex: 56,
                        fragments: ['{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4'],
                        content: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [34, 60],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [36, 56],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la{{b[2].bla(a-z)@la}}}}',
                        standardized: '{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}',
                        partiallyStandardized: '{{b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}}}',
                        depOffset: 13,
                        localLastIndex: 102,
                        fragments: ['b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}'],
                        content: 'b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C3'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [76, 104],
                    },
                    L2C3: {
                        id: 'L2C3',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C3',
                        rootDependant: 'L1C3',
                        separatorsIndexes: [],
                        initialIndexes: [82, 102],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [116, 136],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L2C2', 'L1C2', 'L2C3', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2', 'L2C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('{{21{{b[2].bla(a-z)@la}}b}}i{a,b}p{{{{b[2].bla(a-z)@la}}a4}}s[1-9A-Z]u[a-z]m{{b@la{{b[2].bla(a-z)@la}}}}l(aa|bb|12)a{{b[2].bla(a-z)@la}}12');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze several interpolations within a string with glob like braces when is ending with interpolation (multiple levels)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{21{{b[2].bla(a-z)@la}}b}}i{a,b}p{{{{b[2].bla(a-z)@la}}a4}}s[1-9A-Z]u[a-z]m{{b@la{{b[2].bla(a-z)@la}}}}l(aa|bb|12)a{{b[2].bla(a-z)@la}}',
                standardized: 'l{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}i{a,b}p{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}s[1-9A-Z]u[a-z]m{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}l(aa|bb|12)a{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                free: 'li{a,b}ps[1-9A-Z]u[a-z]ml(aa|bb|12)a',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{21{{b[2].bla(a-z)@la}}b}}',
                        standardized: '{{L1C1|21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b|{}|L1C1}}',
                        partiallyStandardized: '{{21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b}}',
                        depOffset: 13,
                        localLastIndex: 25,
                        fragments: ['21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b'],
                        content: '21{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}b',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C1'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 28],
                    },
                    L2C1: {
                        id: 'L2C1',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C1|b[2].bla(a-z)@la|{}|L2C1}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C1',
                        rootDependant: 'L1C1',
                        separatorsIndexes: [],
                        initialIndexes: [5, 25],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{b[2].bla(a-z)@la}}a4}}',
                        standardized: '{{L1C2|{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4|{}|L1C2}}',
                        partiallyStandardized: '{{{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4}}',
                        depOffset: 13,
                        localLastIndex: 57,
                        fragments: ['{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4'],
                        content: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}a4',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C2'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [35, 61],
                    },
                    L2C2: {
                        id: 'L2C2',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C2|b[2].bla(a-z)@la|{}|L2C2}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C2',
                        rootDependant: 'L1C2',
                        separatorsIndexes: [],
                        initialIndexes: [37, 57],
                    },
                    L1C3: {
                        id: 'L1C3',
                        level: 1,
                        initial: '{{b@la{{b[2].bla(a-z)@la}}}}',
                        standardized: '{{L1C3|b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}|{}|L1C3}}',
                        partiallyStandardized: '{{b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}}}',
                        depOffset: 13,
                        localLastIndex: 103,
                        fragments: ['b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}'],
                        content: 'b@la{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        options: '',
                        processedOptions: {},
                        dependencies: ['L2C3'],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [77, 105],
                    },
                    L2C3: {
                        id: 'L2C3',
                        level: 2,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L2C3|b[2].bla(a-z)@la|{}|L2C3}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: 'L1C3',
                        rootDependant: 'L1C3',
                        separatorsIndexes: [],
                        initialIndexes: [83, 103],
                    },
                    L1C4: {
                        id: 'L1C4',
                        level: 1,
                        initial: '{{b[2].bla(a-z)@la}}',
                        standardized: '{{L1C4|b[2].bla(a-z)@la|{}|L1C4}}',
                        partiallyStandardized: '{{b[2].bla(a-z)@la}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['b[2].bla(a-z)@la'],
                        content: 'b[2].bla(a-z)@la',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [117, 137],
                    },
                },
                interpolationsIds: ['L2C1', 'L1C1', 'L2C2', 'L1C2', 'L2C3', 'L1C3', 'L1C4'],
                rootInterpolationsIds: ['L1C1', 'L1C2', 'L1C3', 'L1C4'],
                lastLevelInterpolationsIds: ['L2C1', 'L2C2', 'L2C3', 'L1C4'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{21{{b[2].bla(a-z)@la}}b}}i{a,b}p{{{{b[2].bla(a-z)@la}}a4}}s[1-9A-Z]u[a-z]m{{b@la{{b[2].bla(a-z)@la}}}}l(aa|bb|12)a{{b[2].bla(a-z)@la}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze an interpolation with glob like string at the beginning', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{{{a, b}, bla}}}',
                standardized: 'l{{L1C1|{{a, b}, bla}|{}|L1C1}}',
                free: 'l',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{a, b}, bla}}}',
                        standardized: '{{L1C1|{{a, b}, bla}|{}|L1C1}}',
                        partiallyStandardized: '{{{{a, b}, bla}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['{{a, b}, bla}'],
                        content: '{{a, b}, bla}',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 18],
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{{{a, b}, bla}}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze an interpolation with glob like string at the beginning (double)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{{{a, b}, bla}}}ips{{{{a, b}, bla}}}',
                standardized: 'l{{L1C1|{{a, b}, bla}|{}|L1C1}}ips{{L1C2|{{a, b}, bla}|{}|L1C2}}',
                free: 'lips',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{{a, b}, bla}}}',
                        standardized: '{{L1C1|{{a, b}, bla}|{}|L1C1}}',
                        partiallyStandardized: '{{{{a, b}, bla}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['{{a, b}, bla}'],
                        content: '{{a, b}, bla}',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [1, 18],
                    },
                    L1C2: {
                        id: 'L1C2',
                        level: 1,
                        initial: '{{{{a, b}, bla}}}',
                        standardized: '{{L1C2|{{a, b}, bla}|{}|L1C2}}',
                        partiallyStandardized: '{{{{a, b}, bla}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['{{a, b}, bla}'],
                        content: '{{a, b}, bla}',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [21, 38],
                    },
                },
                interpolationsIds: ['L1C1', 'L1C2'],
                rootInterpolationsIds: ['L1C1', 'L1C2'],
                lastLevelInterpolationsIds: ['L1C1', 'L1C2'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{{{a, b}, bla}}}ips{{{{a, b}, bla}}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze an interpolation with glob like string in the middle', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{{l, {a, b}, bla}}}',
                standardized: 'l{{L1C1|{l, {a, b}, bla}|{}|L1C1}}',
                free: 'l',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{l, {a, b}, bla}}}',
                        standardized: '{{L1C1|{l, {a, b}, bla}|{}|L1C1}}',
                        partiallyStandardized: '{{{l, {a, b}, bla}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['{l, {a, b}, bla}'],
                        content: '{l, {a, b}, bla}',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [5, 22], // this is broken
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{{l, {a, b}, bla}}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze an interpolation with glob like string at the end', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{{l, {a, b}}}}',
                standardized: 'l{{L1C1|{l, {a, b}}|{}|L1C1}}',
                free: 'l',
                hasInterpolations: true,
                isValid: true,
                interpolations: {
                    L1C1: {
                        id: 'L1C1',
                        level: 1,
                        initial: '{{{l, {a, b}}}}',
                        standardized: '{{L1C1|{l, {a, b}}|{}|L1C1}}',
                        partiallyStandardized: '{{{l, {a, b}}}}',
                        depOffset: 0,
                        localLastIndex: 0,
                        fragments: ['{l, {a, b}}'],
                        content: '{l, {a, b}}',
                        options: '',
                        processedOptions: {},
                        dependencies: [],
                        dependant: '',
                        rootDependant: '',
                        separatorsIndexes: [],
                        initialIndexes: [5, 22], // this is broken
                    },
                },
                interpolationsIds: ['L1C1'],
                rootInterpolationsIds: ['L1C1'],
                lastLevelInterpolationsIds: ['L1C1'],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{{l, {a, b}}}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });


        it('should analyze when there are no interpolation but interpolation like glob strings (1)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{a, b}, bla}',
                standardized: 'l{{a, b}, bla}',
                free: 'l{{a, b}, bla}',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{a, b}, bla}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze when there are no interpolation but interpolation like glob strings (2)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{l, {a, b}, bla}',
                standardized: 'l{l, {a, b}, bla}',
                free: 'l{l, {a, b}, bla}',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{l, {a, b}, bla}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze when there are no interpolation but interpolation like glob strings (3)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{l, {a, b}}',
                standardized: 'l{l, {a, b}}',
                free: 'l{l, {a, b}}',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{l, {a, b}}');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });

        it('should analyze when there are no interpolation but interpolation like glob strings and more content afterwards (1)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{{a, b}, bla}dolor',
                standardized: 'l{{a, b}, bla}dolor',
                free: 'l{{a, b}, bla}dolor',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{{a, b}, bla}dolor');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze when there are no interpolation but interpolation like glob strings and more content afterwards  (2)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{l, {a, b}, bla}dolor',
                standardized: 'l{l, {a, b}, bla}dolor',
                free: 'l{l, {a, b}, bla}dolor',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{l, {a, b}, bla}dolor');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
        it('should analyze when there are no interpolation but interpolation like glob strings and more content afterwards  (3)', () => {
            /** @type {InterpolationsAnalysis} */
            let expected = {
                initial: 'l{l, {a, b}}dolor',
                standardized: 'l{l, {a, b}}dolor',
                free: 'l{l, {a, b}}dolor',
                hasInterpolations: false,
                isValid: true,
                interpolations: {},
                interpolationsIds: [],
                rootInterpolationsIds: [],
                lastLevelInterpolationsIds: [],
            };

            /** @type {InterpolationsAnalysis} */
            let actual = AnalysisService.analyze('l{l, {a, b}}dolor');

            expect(stringify(actual, teleJsonConfig)).to.deep.equal(stringify(expected, teleJsonConfig));
        });
    });
});