'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Lodash = require('lodash');
const path = require('path');
const DeepMerge = require('deepmerge');

describe('Interpolator', () => {

    let Interpolator;
    before(() => {
        Interpolator = require('./interpolator');
    });

    describe('-> interpolate', () => {

        it('should execute code', async () => {

            let initial = `
{{ for (let it1 = 0; it1 < x.length; it1++) { }}
    {{ for (let it2 = 0; it2 < x[it1].length; it2++) { }}
    
        Iterator1 value: {{it1}} | Iterator2 value: {{it2}}
        Sum of Iterators: {{ it{{number1}} + it{{number2}} }}
        Value printed once: {{x[it1][it2]}} | Value printed twice: {{x[it1][it2] + x[it1][it2]}}
       {{ if (typeof x[it1][it2] === 'string') { }}
        This is a string: {{x[it1][it2]}}
       {{ } else if (isFinite(x[it1][it2])) { }}
        This is a number: {{x[it1][it2]}} and it can be added to itself: {{x[it{{number1}}][it{{number{{x.length}}}}] + x[it{{number1}}][it{{number2}}]}}
       {{ } }}
    {{ } }}
{{ } }}
`;
            let options = {
                template: initial,
                data: {
                    x: [
                        [3, 4],
                        ['lorem', 'ipsum'],
                    ],
                    number1: 1,
                    number2: 2
                },
                returnOnlyResult: true
            }
            let expected = `

    
    
        Iterator1 value: 0 | Iterator2 value: 0
        Sum of Iterators: 0
        Value printed once: 3 | Value printed twice: 6
       
        This is a number: 3 and it can be added to itself: 6
       
    
    
        Iterator1 value: 0 | Iterator2 value: 1
        Sum of Iterators: 1
        Value printed once: 4 | Value printed twice: 8
       
        This is a number: 4 and it can be added to itself: 8
       
    

    
    
        Iterator1 value: 1 | Iterator2 value: 0
        Sum of Iterators: 1
        Value printed once: lorem | Value printed twice: loremlorem
       
        This is a string: lorem
       
    
    
        Iterator1 value: 1 | Iterator2 value: 1
        Sum of Iterators: 2
        Value printed once: ipsum | Value printed twice: ipsumipsum
       
        This is a string: ipsum
       
    

`;

            let actual = Interpolator.interpolate(options);
            expect(actual).to.deep.equal(expected);
        });
    })

    // describe('-> filterOut', () => {
    //     it('should return the property as it is if is undefined', async () => {
    //         let initial = {
    //             template: undefined,
    //             filterOut: []
    //         };

    //         let expected = {
    //             filtered: undefined,
    //             changes: [],
    //             changeOrder: -1
    //         };
    //         let actual = Interpolator.filterOut(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the property filtered out when is a string', async () => {
    //         let initial = {
    //             template: 'lorem ipsum    dolor sit amet',
    //             filterOut: ['   ']
    //         };

    //         let expected = {
    //             filtered: 'lorem ipsum dolor sit amet',
    //             changes: [
    //                 {idx: 11, pt: '', bf: '   ', af: '', od: 0}
    //             ],
    //             changeOrder: 0
    //         };
    //         let actual = Interpolator.filterOut(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the property filtered out when is an simple object', async () => {
    //         let initial = {
    //             template: {prop1: 'lorem ipsum    dolor sit amet', prop2: 5},
    //             filterOut: ['   ']
    //         };

    //         let expected = {
    //             filtered: {prop1: 'lorem ipsum dolor sit amet', prop2: 5},
    //             changes: [
    //                 {idx: 11, pt: 'prop1', bf: '   ', af: '', od: 0}
    //             ],
    //             changeOrder: 0
    //         };
    //         let actual = Interpolator.filterOut(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the property filtered out when is an simple array', async () => {
    //         let initial = {
    //             template: ['lorem ipsum    dolor sit amet', 5],
    //             filterOut: ['   ']
    //         };

    //         let expected = {
    //             filtered: ['lorem ipsum dolor sit amet', 5],
    //             changes: [
    //                 {idx: 11, pt: '[0]', bf: '   ', af: '', od: 0}
    //             ],
    //             changeOrder: 0
    //         };
    //         let actual = Interpolator.filterOut(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the property filtered out when is an simple array (3 elements)', async () => {
    //         let initial = {
    //             template: ['   lorem ipsum    dolor sit amet', 5, 'lorem ipsum dolor    sit amet   '],
    //             filterOut: ['   ']
    //         };

    //         let expected = {
    //             filtered: ['lorem ipsum dolor sit amet', 5, 'lorem ipsum dolor sit amet'],
    //             changes: [
    //                 {idx: 0, pt: '[0]', bf: '   ', af: '', od: 0},
    //                 {idx: 11, pt: '[0]', bf: '   ', af: '', od: 1},
    //                 {idx: 17, pt: '[2]', bf: '   ', af: '', od: 2},
    //                 {idx: 26, pt: '[2]', bf: '   ', af: '', od: 3}
    //             ],
    //             changeOrder: 3
    //         };
    //         let actual = Interpolator.filterOut(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });
    // });

    // describe('-> reverse', () => {
    //     it('should reverse a simple string', async () => {
    //         let initial = {
    //             result: 'lorem ipsum dolor sit amet',
    //             changes: [
    //                 {idx: 11, pt: '', bf: '   ', af: '', od: 0}
    //             ]
    //         };

    //         let expected = 'lorem ipsum    dolor sit amet';
    //         let actual = Interpolator.reverse(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should reverse a simple string with 3 level interpolation', async () => {
    //         let initial = {
    //             result: 'lorem ipsum dolor sit amet',
    //             changes: [
    //                 {idx: 18, pt: '', bf: '{{z}}', af: '3', od: 0},
    //                 {idx: 15, pt: '', bf: '{{y3123}}', af: 'nx', od: 1},
    //                 {idx: 12, pt: '', bf: '{{xnxabc}}', af: 'dolor', od: 2}
    //             ]
    //         };

    //         let expected = 'lorem ipsum {{x{{y{{z}}123}}abc}} sit amet';
    //         let actual = Interpolator.reverse(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });
    // });

    // describe('-> reverseChange', () => {
    //     it('should reverse a simple string (replace with empty string)', async () => {
    //         let initial = {
    //             input: 'lorem ipsum dolor sit amet',
    //             change: {idx: 11, pt: '', bf: '   ', af: '', od: 0}
    //         };

    //         let expected = 'lorem ipsum    dolor sit amet';
    //         let actual = Interpolator.reverseChange(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should reverse a simple string (replace with another string)', async () => {
    //         let initial = {
    //             input: 'lorem ipsum Consecteur dolor sit amet',
    //             change: {idx: 11, pt: '', bf: '   ', af: 'Consecteur ', od: 0}
    //         };

    //         let expected = 'lorem ipsum    dolor sit amet';
    //         let actual = Interpolator.reverseChange(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should reverse a simple string (replace empty string with another string - start)', async () => {
    //         let initial = {
    //             input: 'bla lorem ipsum Consecteur dolor sit amet',
    //             change: {idx: 0, pt: '', bf: '', af: 'bla ', od: 0}
    //         };

    //         let expected = 'lorem ipsum Consecteur dolor sit amet';
    //         let actual = Interpolator.reverseChange(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should reverse a simple string (replace empty string with another string - end)', async () => {
    //         let initial = {
    //             input: 'lorem ipsum Consecteur dolor sit amet bla',
    //             change: {idx: 37, pt: '', bf: '', af: 'bla ', od: 0}
    //         };

    //         let expected = 'lorem ipsum Consecteur dolor sit amet';
    //         let actual = Interpolator.reverseChange(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should reverse a simple string (replace empty string with multiple strings - start, middle, end and change refers to middle)', async () => {
    //         let initial = {
    //             input: 'bla lorem ipsum bla dolor sit amet bla',
    //             change: {idx: 16, pt: '', bf: '', af: 'bla ', od: 0}
    //         };

    //         let expected = 'bla lorem ipsum dolor sit amet bla';
    //         let actual = Interpolator.reverseChange(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should reverse a simple string (multiline)', async () => {
    //         let initial = {
    //             input: `lorem ipsum\nConsecteur amet\nbla bla bla\ndolor sit amet`,
    //             change: {idx: 11, pt: '', bf: `\n{{if (x === true) {}}\nConsecteur amet\nbla bla bla\n{{ } }}\n`, af: '\nConsecteur amet\nbla bla bla\n', od: 0}
    //         };

    //         let expected = 'lorem ipsum\n{{if (x === true) {}}\nConsecteur amet\nbla bla bla\n{{ } }}\ndolor sit amet';
    //         let actual = Interpolator.reverseChange(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });
    // });

    // describe('-> getCCAcronym', () => {
    //     it('should return an empty string when undefined is passed', async () => {
    //         let actual = Interpolator.getCCAcronym();
    //         expect(actual).to.deep.equal('');
    //     });

    //     it('should return an empty string when empty string is passed', async () => {
    //         let actual = Interpolator.getCCAcronym('');
    //         expect(actual).to.deep.equal('');
    //     });

    //     it('should return just the first letter when a simple word is passed', async () => {
    //         let actual = Interpolator.getCCAcronym('word');
    //         expect(actual).to.deep.equal('w');
    //     });

    //     it('should return an acronym from an camel case string (1)', async () => {
    //         let actual = Interpolator.getCCAcronym('replaceWithEmptyString');
    //         expect(actual).to.deep.equal('rwes');
    //     });

    //     it('should return an acronym from an camel case string (2)', async () => {
    //         let actual = Interpolator.getCCAcronym('interpolationLevels');
    //         expect(actual).to.deep.equal('il');
    //     });

    //     it('should return an acronym from an camel case string (3)', async () => {
    //         let actual = Interpolator.getCCAcronym('returnOnlyResult');
    //         expect(actual).to.deep.equal('ror');
    //     });
    // });

    // describe('-> initialize', () => {
    //     beforeEach(() => {
    //         this.defaultExpected = {
    //             options: {
    //                 template: '',
    //                 fileTemplate: '',
    //                 asString: false,
    //                 data: {},
    //                 fileData: '',
    //                 interpolators: [
    //                     {p: '#>', s: '<#', t: 'path'},
    //                     {p: '{{', s: '}}', t: 'var'},
    //                     {p: '+>', s: '<+', t: 'eval'}
    //                 ],
    //                 replaceWithUndefined: true,
    //                 replaceWithEmptyString: false,
    //                 noProcessing: false,
    //                 returnOnlyResult: false,
    //                 silenceLogs: false,
    //                 noLogs: false,
    //                 noChanges: false,
    //                 filterOut: [],
    //                 levels: null,
    //                 interpolationLevels: null
    //             },
    //             transience: {
    //                 logs: [],
    //                 changeOrder: -1,
    //                 changes: []
    //             }
    //         };

    //         this.defaultLogs = [
    //             '[NOTICE] Starting with the following options:',
    //             '[NOTICE] template(t): ""',
    //             '[NOTICE] fileTemplate(ft): ""',
    //             '[NOTICE] asString(as): false',
    //             '[NOTICE] data(d): {}',
    //             '[NOTICE] fileData(fd): ""',
    //             '[NOTICE] interpolators(i): [{"p":"#>","s":"<#","t":"path"},{"p":"{{","s":"}}","t":"var"},{"p":"+>","s":"<+","t":"eval"}]',
    //             '[NOTICE] replaceWithUndefined(rwu): true',
    //             '[NOTICE] replaceWithEmptyString(rwes): false',
    //             '[NOTICE] noProcessing(np): false',
    //             '[NOTICE] returnOnlyResult(ror): false',
    //             '[NOTICE] silenceLogs(sl): false',
    //             '[NOTICE] noLogs(nl): false',
    //             '[NOTICE] noChanges(nc): false',
    //             '[NOTICE] filterOut(fo): []',
    //             '[NOTICE] levels(l): null',
    //             '[NOTICE] interpolationLevels(il): null'
    //         ];

    //         /** Stubbing console.log */
    //         this.consoleLogStub = sinon.spy(console, 'log');

    //         /** Stubbing dirname */
    //         this.pathDirnameStub = sinon.stub(path, 'dirname');
    //         this.pathDirnameStub.returns('');
    //     });
    //     it('should log a warning message and return defaults if options is undefined', async () => {

    //         let expected = {
    //             options: {},
    //             transience: {
    //                 logs: [
    //                     '[WARNING] The options argument was invalid. Therefore, defaultOptions will be used.',
    //                     ...this.defaultLogs
    //                 ]
    //             }
    //         };

    //         expected = DeepMerge(this.defaultExpected, expected);

    //         let actual = Interpolator.initialize();

    //         expect(this.consoleLogStub.callCount).to.be.equal(expected.transience.logs.length);
    //         expect(actual).to.deep.equal(expected);

    //     });

    //     it('should log a warning message and return defaults if options is null', async () => {

    //         let expected = {
    //             options: {},
    //             transience: {
    //                 logs: [
    //                     '[WARNING] The options argument was invalid. Therefore, defaultOptions will be used.',
    //                     ...this.defaultLogs
    //                 ]
    //             }
    //         };

    //         expected = DeepMerge(this.defaultExpected, expected);

    //         let actual = Interpolator.initialize();

    //         expect(this.consoleLogStub.callCount).to.be.equal(expected.transience.logs.length);
    //         expect(actual).to.deep.equal(expected);

    //     });

    //     it('should not log any warning messages and return defaults if options is empty object', async () => {

    //         let expected = {
    //             options: {},
    //             transience: {
    //                 logs: [
    //                     ...this.defaultLogs
    //                 ]
    //             }
    //         };

    //         expected = DeepMerge(this.defaultExpected, expected);

    //         let actual = Interpolator.initialize({});

    //         expect(this.consoleLogStub.callCount).to.be.equal(expected.transience.logs.length);
    //         expect(actual).to.deep.equal(expected);

    //     });

    //     it('should log a warning message if both template and t arguments are defined', async () => {

    //         let initial = {
    //             template: 'Interpolate me! {{}}',
    //             t: 'Interpolate me2! {{}}',
    //         };

    //         let expected = {
    //             options: {
    //                 template: 'Interpolate me! {{}}',
    //             },
    //             transience: {
    //                 logs: [
    //                     '[WARNING] Both options.t and options.template are defined. Using options.template: "Interpolate me! {{}}"',
    //                     '[NOTICE] Starting with the following options:',
    //                     '[NOTICE] template(t): "Interpolate me! {{}}"',
    //                     '[NOTICE] fileTemplate(ft): ""',
    //                     '[NOTICE] asString(as): false',
    //                     '[NOTICE] data(d): {}',
    //                     '[NOTICE] fileData(fd): ""',
    //                     '[NOTICE] interpolators(i): [{"p":"#>","s":"<#","t":"path"},{"p":"{{","s":"}}","t":"var"},{"p":"+>","s":"<+","t":"eval"}]',
    //                     '[NOTICE] replaceWithUndefined(rwu): true',
    //                     '[NOTICE] replaceWithEmptyString(rwes): false',
    //                     '[NOTICE] noProcessing(np): false',
    //                     '[NOTICE] returnOnlyResult(ror): false',
    //                     '[NOTICE] silenceLogs(sl): false',
    //                     '[NOTICE] noLogs(nl): false',
    //                     '[NOTICE] noChanges(nc): false',
    //                     '[NOTICE] filterOut(fo): []',
    //                     '[NOTICE] levels(l): null',
    //                     '[NOTICE] interpolationLevels(il): null'
    //                 ]
    //             }
    //         };

    //         expected = DeepMerge(this.defaultExpected, expected);

    //         let actual = Interpolator.initialize(initial);

    //         expect(this.consoleLogStub.callCount).to.be.equal(expected.transience.logs.length);
    //         expect(actual).to.deep.equal(expected);

    //     });

    //     it('should not log any warning message if options.t is defined', async () => {

    //         let initial = {
    //             t: 'Interpolate me2! {{}}',
    //         };

    //         let expected = {
    //             options: {
    //                 template: 'Interpolate me2! {{}}',
    //             },
    //             transience: {
    //                 logs: [
    //                     '[NOTICE] Starting with the following options:',
    //                     '[NOTICE] template(t): "Interpolate me2! {{}}"',
    //                     '[NOTICE] fileTemplate(ft): ""',
    //                     '[NOTICE] asString(as): false',
    //                     '[NOTICE] data(d): {}',
    //                     '[NOTICE] fileData(fd): ""',
    //                     '[NOTICE] interpolators(i): [{"p":"#>","s":"<#","t":"path"},{"p":"{{","s":"}}","t":"var"},{"p":"+>","s":"<+","t":"eval"}]',
    //                     '[NOTICE] replaceWithUndefined(rwu): true',
    //                     '[NOTICE] replaceWithEmptyString(rwes): false',
    //                     '[NOTICE] noProcessing(np): false',
    //                     '[NOTICE] returnOnlyResult(ror): false',
    //                     '[NOTICE] silenceLogs(sl): false',
    //                     '[NOTICE] noLogs(nl): false',
    //                     '[NOTICE] noChanges(nc): false',
    //                     '[NOTICE] filterOut(fo): []',
    //                     '[NOTICE] levels(l): null',
    //                     '[NOTICE] interpolationLevels(il): null'
    //                 ]
    //             }
    //         };

    //         expected = DeepMerge(this.defaultExpected, expected);

    //         let actual = Interpolator.initialize(initial);

    //         expect(this.consoleLogStub.callCount).to.be.equal(expected.transience.logs.length);
    //         expect(actual).to.deep.equal(expected);

    //     });

    //     it('should not log any warning message if options.template is defined', async () => {

    //         let initial = {
    //             template: 'Interpolate me2! {{}}',
    //         };

    //         let expected = {
    //             options: {
    //                 template: 'Interpolate me2! {{}}',
    //             },
    //             transience: {
    //                 logs: [
    //                     '[NOTICE] Starting with the following options:',
    //                     '[NOTICE] template(t): "Interpolate me2! {{}}"',
    //                     '[NOTICE] fileTemplate(ft): ""',
    //                     '[NOTICE] asString(as): false',
    //                     '[NOTICE] data(d): {}',
    //                     '[NOTICE] fileData(fd): ""',
    //                     '[NOTICE] interpolators(i): [{"p":"#>","s":"<#","t":"path"},{"p":"{{","s":"}}","t":"var"},{"p":"+>","s":"<+","t":"eval"}]',
    //                     '[NOTICE] replaceWithUndefined(rwu): true',
    //                     '[NOTICE] replaceWithEmptyString(rwes): false',
    //                     '[NOTICE] noProcessing(np): false',
    //                     '[NOTICE] returnOnlyResult(ror): false',
    //                     '[NOTICE] silenceLogs(sl): false',
    //                     '[NOTICE] noLogs(nl): false',
    //                     '[NOTICE] noChanges(nc): false',
    //                     '[NOTICE] filterOut(fo): []',
    //                     '[NOTICE] levels(l): null',
    //                     '[NOTICE] interpolationLevels(il): null'
    //                 ]
    //             }
    //         };

    //         expected = DeepMerge(this.defaultExpected, expected);

    //         let actual = Interpolator.initialize(initial);

    //         expect(this.consoleLogStub.callCount).to.be.equal(expected.transience.logs.length);
    //         expect(actual).to.deep.equal(expected);

    //     });



    //     afterEach(() => {
    //         /** Restoring the console.log */
    //         console.log.restore();

    //         /** Restoring the path.dirname */
    //         path.dirname.restore();
    //     });
    // });

    // describe('-> getPathContext', () => {
    //     it('should return an empty string when path does not have a context', async () => {

    //         let initial = 'bla';
    //         let expected = '';

    //         let actual = Interpolator.getPathContext(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return an empty string when path has an empty context', async () => {

    //         let initial = 'bla|';
    //         let expected = '';

    //         let actual = Interpolator.getPathContext(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the context when the context is present', async () => {

    //         let initial = 'bla|vsScheme';
    //         let expected = 'vsScheme';

    //         let actual = Interpolator.getPathContext(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });
    // });

    // describe('-> removePathContext', () => {
    //     it('should return the path when path does not have a context', async () => {

    //         let initial = 'bla';
    //         let expected = 'bla';

    //         let actual = Interpolator.removePathContext(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the path when path has an empty context', async () => {

    //         let initial = 'bla|';
    //         let expected = 'bla';

    //         let actual = Interpolator.removePathContext(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the path when the context is present', async () => {

    //         let initial = 'bla|vsScheme';
    //         let expected = 'bla';

    //         let actual = Interpolator.removePathContext(initial);
    //         expect(actual).to.deep.equal(expected);
    //     });
    // });

    // describe('-> getContext', () => {

    //     it('should return an empty object if contexts is undefined', async () => {

    //         let contextName = '';
    //         let expected;

    //         let actual = Interpolator.getContext(contextName);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return an empty object if contexts is not an array', async () => {

    //         let contextName = '';
    //         let contexts = 'lorem ipsum';
    //         let expected = 'lorem ipsum';

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return contexts when is array and contextName is empty string', async () => {

    //         let contextName = '';
    //         let contexts = [null, undefined, 'a', 3, true, false, 'lorem', NaN, [], {}, 0, -5];
    //         let expected = contexts;

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return an empty object is null is passed as contexts', async () => {

    //         let contextName = '';
    //         let contexts = null;
    //         let expected = null;

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the contexts object if is defined and is not null', async () => {

    //         let contextName = '';
    //         let contexts = {
    //             prop1: 'prop1',
    //             prop2: 'prop2'
    //         };
    //         let expected = contexts;

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return an empty context if the context object contains name and collection properties', async () => {

    //         let contextName = 'lorem';
    //         let contexts = {
    //             name: 'vsScheme',
    //             collection: [4, 5, 6]
    //         };
    //         let expected;

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return an empty object if contexts is is an array but is empty', async () => {

    //         let contextName = '';
    //         let contexts = [];
    //         let expected = [];

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the array when the first object does not match the contexts schema', async () => {

    //         let contextName = '';
    //         let contexts = [
    //             {
    //                 prop1: 'vsScheme',
    //                 prop2: [1, 2, 3]
    //             },
    //             {
    //                 name: 'collection',
    //                 collection: [4, 5, 6]
    //             }
    //         ];

    //         let expected = contexts;

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the first context if contextName is an empty string', async () => {

    //         let contextName = '';
    //         let contexts = [
    //             {
    //                 name: 'vsScheme',
    //                 collection: [1, 2, 3]
    //             },
    //             {
    //                 name: 'collection',
    //                 collection: [4, 5, 6]
    //             }
    //         ];

    //         let expected = [1, 2, 3];

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the right context for contextName (0)', async () => {

    //         let contextName = 'vsScheme';
    //         let contexts = [
    //             {
    //                 name: 'vsScheme',
    //                 collection: [1, 2, 3]
    //             },
    //             {
    //                 name: 'collection',
    //                 collection: [4, 5, 6]
    //             }
    //         ];

    //         let expected = [1, 2, 3];

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the right context for contextName (1)', async () => {

    //         let contextName = 'collection';
    //         let contexts = [
    //             {
    //                 name: 'vsScheme',
    //                 collection: [1, 2, 3]
    //             },
    //             {
    //                 name: 'collection',
    //                 collection: [4, 5, 6]
    //             }
    //         ];

    //         let expected = [4, 5, 6];

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return a real life example (1)', async () => {

    //         let contextName = '';
    //         let contexts = [
    //             {
    //                 name: 'collection',
    //                 collection: [1, 2, 3]
    //             }
    //         ];

    //         let expected = [1, 2, 3];

    //         let actual = Interpolator.getContext(contextName, contexts);
    //         expect(actual).to.deep.equal(expected);
    //     });
    // });

    // describe('-> interpolate', () => {

    //     it('should forward garbage data (undefined)', async () => {

    //         let initial;
    //         let expected;

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should forward garbage data (null)', async () => {

    //         let initial = null;
    //         let expected = null;

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should forward garbage data (Boolean false)', async () => {

    //         let initial = false;
    //         let expected = false;

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a number as it was', async () => {

    //         let initial = 3;
    //         let expected = 3;

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a DateTime object as it is', async () => {

    //         let initial = new Date('Sun Feb 28 2010 05:30:00 GMT+0530 (IST)');
    //         let expected = new Date('Sun Feb 28 2010 05:30:00 GMT+0530 (IST)');

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave an empty array as it is', async () => {

    //         let initial = [];
    //         let expected = [];

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave an empty object as it is', async () => {

    //         let initial = {};
    //         let expected = {};

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should choose the fileTemplate argument if the fileTemplate argument points to an existent file', async () => {

    //         let options = {
    //             fileTemplate: '/data/string.txt',
    //             template: 'lorem ipsum'
    //         };
    //         let expected = 'lorem ipsum in string template';

    //         let actual = Interpolator.interpolate(options);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the root value if the path is not specific', async () => {

    //         let options = {
    //             template: '#><#',
    //             context: 'value'
    //         };
    //         let expected = 'value';

    //         let actual = Interpolator.interpolate(options);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should return the root value if the path is not specific and the context is an array', async () => {

    //         let options = {
    //             template: '#><#',
    //             context: [null, undefined, 'a', 3, true, false, 'lorem', NaN, [], {}, 0, -5]
    //         };
    //         let expected = [null, undefined, 'a', 3, true, false, 'lorem', NaN, [], {}, 0, -5];

    //         let actual = Interpolator.interpolate(options);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should choose the template argument if the fileTemplate argument points to a non existent file', async () => {

    //         let options = {
    //             fileTemplate: '/loremIpsum/ipsum.lorem',
    //             template: 'lorem ipsum'
    //         };
    //         let expected = 'lorem ipsum';

    //         let actual = Interpolator.interpolate(options);
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave an empty string as it is', async () => {

    //         let initial = '';
    //         let expected = '';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a string unaltered when no interpolation is detected', async () => {

    //         let initial = 'Lorem ipsum dolor sit amet consectetuer';
    //         let expected = 'Lorem ipsum dolor sit amet consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a string unaltered when no interpolation is detected (partial path prefixes)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #x<# consectetuer';
    //         let expected = 'Lorem ipsum dolor sit #x<# consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a string unaltered when no interpolation is detected (partial path suffixes)', async () => {

    //         let initial = 'Lorem ipsum dolor sit >#x< consectetuer';
    //         let expected = 'Lorem ipsum dolor sit >#x< consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a string unaltered when no interpolation is detected (partial var prefixes)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {x}} consectetuer';
    //         let expected = 'Lorem ipsum dolor sit {x}} consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a string unaltered when no interpolation is detected (partial var suffixes)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{x} consectetuer';
    //         let expected = 'Lorem ipsum dolor sit {{x} consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a string unaltered when no interpolation is detected (partial eval prefixes)', async () => {

    //         let initial = 'Lorem ipsum dolor sit +x<+ consectetuer';
    //         let expected = 'Lorem ipsum dolor sit +x<+ consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should leave a string unaltered when no interpolation is detected (partial eval suffixes)', async () => {

    //         let initial = 'Lorem ipsum dolor sit +>x+ consectetuer';
    //         let expected = 'Lorem ipsum dolor sit +>x+ consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add undefined if context are not defined (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[2].lorem.ipsum[5].ipsum<# consectetuer';
    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add undefined if context is defined but is garbage (number) (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[2].lorem.ipsum[5].ipsum<# consectetuer';
    //         let context = 3;
    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add undefined if context is defined but is garbage (object) (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[2].lorem.ipsum[5].ipsum<# consectetuer';
    //         let context = {a: 'b'};
    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add undefined if context is defined but is garbage (array) (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[2].lorem.ipsum[5].ipsum<# consectetuer';
    //         let context = [{name: 'collection', collection: [1, 2, 3]}];
    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add 2 if value was find in contexts (array) (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[1]<# consectetuer';
    //         let context = [{name: 'collection', collection: [1, 2, 3]}];
    //         let expected = 'Lorem ipsum dolor sit 2 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add 2 by choosing the first context if the context name was not specified and if value was find in contexts (array) (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[1]<# consectetuer';
    //         let context = [
    //             {name: 'collection', collection: [1, 2, 3]},
    //             {name: 'vsScheme', collection: [4, 5, 6]}
    //         ];
    //         let expected = 'Lorem ipsum dolor sit 2 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add 5 by choosing the right context if the context name was specified and if value was find in contexts (array) (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[1]|vsScheme<# consectetuer';
    //         let context = [
    //             {name: 'collection', collection: [1, 2, 3]},
    //             {name: 'vsScheme', collection: [4, 5, 6]}
    //         ];
    //         let expected = 'Lorem ipsum dolor sit 5 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add undefined if data are not defined (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{x}} consectetuer';
    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should add whatever results from eval (eval interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit +>1 + 1<+ consectetuer';
    //         let expected = 'Lorem ipsum dolor sit 2 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with undefined when the path is valid and context is defined but the path is not findable within context', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[2].lorem.ipsum[5].ipsum<# consectetuer';
    //         let context = {
    //             title: 'Laundry and cleaning',
    //             children: [
    //                 {
    //                     title: 'Vacuum cleaners',
    //                     children: [
    //                         {
    //                             title: 'Bissell SmartClean 1605',
    //                         },
    //                         {
    //                             title: 'Dyson 360 Eye',
    //                         }
    //                     ]
    //                 }
    //             ]
    //         };

    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with the actual value when the path is valid and findable within context (top-level object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>children[0].title<# consectetuer';
    //         let context = {
    //             title: 'Laundry and cleaning',
    //             children: [
    //                 {
    //                     title: 'Vacuum cleaners',
    //                     children: [
    //                         {
    //                             title: 'Bissell SmartClean 1605',
    //                         },
    //                         {
    //                             title: 'Dyson 360 Eye',
    //                         }
    //                     ]
    //                 }
    //             ]
    //         };

    //         let expected = 'Lorem ipsum dolor sit Vacuum cleaners consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with the actual value when the path is valid and findable within context (top-level object) (path not within string)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>children[0].title<# consectetuer';

    //         let context = {
    //             title: 'Laundry and cleaning',
    //             children: [
    //                 {
    //                     title: ['whatever', 1, 2, 3],
    //                     children: [
    //                         {
    //                             title: 'Bissell SmartClean 1605',
    //                         },
    //                         {
    //                             title: 'Dyson 360 Eye',
    //                         }
    //                     ]
    //                 }
    //             ]
    //         };

    //         let expected = 'Lorem ipsum dolor sit whatever,1,2,3 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with the actual value when the path is valid and findable within context (top-level array)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[0].children[0].title<# consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'Dyson 360 Eye',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit Bissell SmartClean 1605 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should stringify the context if context is a collection and the path is pointing to top level', async () => {

    //         let initial = 'Lorem ipsum dolor sit #><# consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'Dyson 360 Eye',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit [{"title":"Vacuum cleaners","children":[{"title":"Bissell SmartClean 1605"},{"title":"Dyson 360 Eye"}]}] consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should not stringify the context if context is a collection and the path is pointing to top level and the path is not within a string', async () => {

    //         let initial = '#><#';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'Dyson 360 Eye',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = [
    //             {
    //                 title: 'Vacuum cleaners',
    //                 children: [
    //                     {
    //                         title: 'Bissell SmartClean 1605',
    //                     },
    //                     {
    //                         title: 'Dyson 360 Eye',
    //                     }
    //                 ]
    //             }
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with the actual value when the path is valid and findable within context - multiple interpolations (path interpolation)', async () => {

    //         let initial = 'Lorem #>[0].children[1].title<# dolor sit #>[0].children[0].title<# consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'Dyson 360 Eye',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = 'Lorem Dyson 360 Eye dolor sit Bissell SmartClean 1605 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });


    //     it('should interpolate and replace with the actual value when the path is valid and findable within context - nested interpolations - at the end (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[0].children[0].#>[0].children[1].title<#<# consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit Bissell SmartClean 1605 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with the actual value when the path is valid and findable within context - nested interpolations - in the middle (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>[0].#>[0].children[1].title<#.title<# consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'children[0]',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit Bissell SmartClean 1605 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with the actual value when the path is valid and findable within context - nested interpolations - at the start (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>#>[0].children[1].title<#.children[0].title<# consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: '[0]',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit Bissell SmartClean 1605 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with the actual value when the path is valid and findable within context - multiple and nested interpolations (path interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit #>#>[0].children[1].title<#.children[0].#>[0].children[2].title<#<# consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: '[0]',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit Bissell SmartClean 1605 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with undefined when the varName is valid but is not defined in data (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{x}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value when the varName is valid and is defined in data (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with stringified actual value (when object) when the varName is valid and is defined in data (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: {
    //                     prop1: 'value1',
    //                     prop2: 3
    //                 }
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit {"prop1":"value1","prop2":3} consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with stringified actual value (when array) when the varName is valid and is defined in data (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: [
    //                     {
    //                         prop1: 'value1',
    //                         prop2: 3
    //                     },
    //                     {
    //                         prop3: 'value3',
    //                         prop4: 5
    //                     }
    //                 ]
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit [{"prop1":"value1","prop2":3},{"prop3":"value3","prop4":5}] consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when boolean) when the varName is valid and is defined in data (var interpolation) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: false
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = false;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when number) when the varName is valid and is defined in data (var interpolation) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 3
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = 3;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when null) when the varName is valid and is defined in data (var interpolation) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: null
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = null;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when object) when the varName is valid and is defined in data (var interpolation) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: {
    //                     prop1: 'value1',
    //                     prop2: 3
    //                 }
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = {
    //             prop1: 'value1',
    //             prop2: 3
    //         };

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when array) when the varName is valid and is defined in data (var interpolation) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: [
    //                     {
    //                         prop1: 'value1',
    //                         prop2: 3
    //                     },
    //                     {
    //                         prop3: 'value3',
    //                         prop4: 5
    //                     }
    //                 ]
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 5
    //             }
    //         ];

    //         let expected = [
    //             {
    //                 prop1: 'value1',
    //                 prop2: 3
    //             },
    //             {
    //                 prop3: 'value3',
    //                 prop4: 5
    //             }
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value - multiple interpolations (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer {{varNumber2}}';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer amet';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value nested interpolations - at the end (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber{{varNumber2}}}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value nested interpolations - in the middle (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber{{varNumber2}}ForStuff}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value nested interpolations - at the start (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{{{varNumber2}}ForStuff}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber1'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (var interpolation)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{{{varNumber2}}For{{varNumber3}}}} consectetuer';
    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber1'
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });


    //     it('should interpolate and replace with undefined when the varName is valid but is not defined in data (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{x}} consectetuer';
    //         let data = {
    //             varNumber1: 8,
    //             varNumber2: 5
    //         };

    //         let expected = 'Lorem ipsum dolor sit undefined consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value when the varName is valid and is defined in data (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer';
    //         let data = {
    //             varNumber1: 8,
    //             varNumber2: 5
    //         };

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with stringified actual value (when object) when the varName is valid and is defined in data (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer';
    //         let data = {
    //             varNumber1: {
    //                 prop1: 'value1',
    //                 prop2: 3
    //             },
    //             varNumber2: 5
    //         };

    //         let expected = 'Lorem ipsum dolor sit {"prop1":"value1","prop2":3} consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with stringified actual value (when array) when the varName is valid and is defined in data (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer';
    //         let data = {
    //             varNumber1: [
    //                 {
    //                     prop1: 'value1',
    //                     prop2: 3
    //                 },
    //                 {
    //                     prop3: 'value3',
    //                     prop4: 5
    //                 }
    //             ],
    //             varNumber2: 5
    //         };

    //         let expected = 'Lorem ipsum dolor sit [{"prop1":"value1","prop2":3},{"prop3":"value3","prop4":5}] consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when boolean) when the varName is valid and is defined in data (var interpolation - from object) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = {
    //             varNumber1: false,
    //             varNumber2: 5
    //         };

    //         let expected = false;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when number) when the varName is valid and is defined in data (var interpolation - from object) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = {
    //             varNumber1: 3,
    //             varNumber2: 5
    //         };

    //         let expected = 3;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when null) when the varName is valid and is defined in data (var interpolation - from object) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = {
    //             varNumber1: null,
    //             varNumber2: 5
    //         };

    //         let expected = null;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when object) when the varName is valid and is defined in data (var interpolation - from object) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = {
    //             varNumber1: {
    //                 prop1: 'value1',
    //                 prop2: 3
    //             },
    //             varNumber2: 5
    //         };

    //         let expected = {
    //             prop1: 'value1',
    //             prop2: 3
    //         };

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with not stringified actual value (when array) when the varName is valid and is defined in data (var interpolation - from object) - only var within string', async () => {

    //         let initial = '{{varNumber1}}';
    //         let data = {
    //             varNumber1: [
    //                 {
    //                     prop1: 'value1',
    //                     prop2: 3
    //                 },
    //                 {
    //                     prop3: 'value3',
    //                     prop4: 5
    //                 }
    //             ],
    //             varNumber2: 5
    //         };

    //         let expected = [
    //             {
    //                 prop1: 'value1',
    //                 prop2: 3
    //             },
    //             {
    //                 prop3: 'value3',
    //                 prop4: 5
    //             }
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value - multiple interpolations (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber1}} consectetuer {{varNumber2}}';
    //         let data = {
    //             varNumber1: 8,
    //             varNumber2: 'amet'
    //         };

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer amet';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value nested interpolations - at the end (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber{{varNumber2}}}} consectetuer';
    //         let data = {
    //             varNumber1: 8,
    //             varNumber2: 1
    //         };

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value nested interpolations - in the middle (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{varNumber{{varNumber2}}ForStuff}} consectetuer';
    //         let data = {
    //             varNumber1ForStuff: 8,
    //             varNumber2: 1
    //         };

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value nested interpolations - at the start (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{{{varNumber2}}ForStuff}} consectetuer';
    //         let data = {
    //             varNumber1ForStuff: 8,
    //             varNumber2: 'varNumber1',
    //         };


    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (var interpolation - from object)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{{{varNumber2}}For{{varNumber3}}}} consectetuer';
    //         let data = {
    //             varNumber1ForStuff: 8,
    //             varNumber2: 'varNumber1',
    //             varNumber3: 'Stuff'
    //         };

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });


    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (2 levels)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[0].children[1].title<#For{{varNumber3}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber1'
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (2 levels) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[4].children[1].title<#For{{varNumber12}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber1'
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (3 levels)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber2}}].children[{{varNumber2bis}}].title<#For{{varNumber3}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[{{varNumber+>3 - 1<+bis}}].title<#For{{varNumber+>3 * 1<+}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (string with nested eval interpolations)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[{{varNumber+>3 - 1<+bis}}].title<#For{{varNumber+>+>+>1+1<++1<+ * 1<+}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (string with nested eval interpolations) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[{{varNumber+>3 - 1<+bis}}].title<#For{{varNumber+>+>+>1+1<++1<+ * 1<+}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (string with nested eval interpolations) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[{{varNumber+>3 - 1<+bis}}].title<#For{{varNumber+>+>+>1+={-1<++1<+ * 1<+}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit {{varNumber1For{{varNumber+>+>+>1+={-1<++1<+ * 1<+}}}} consectetuer';

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[{{varNumber+>3 - 1<+bis}}].title<#For{{varNumber+>3 * 1<+}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 +--=+ 1<+}}].children[{{varNumber+>3 -{-++ 1<+bis}}].title<#For{{varNumber+>3 *:+-+/ 1<+}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 1
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types)', async () => {

    //         let initial = 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer';
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             }
    //         ];

    //         let expected = 'Lorem ipsum dolor sit 8 consectetuer';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (array - one level)', async () => {

    //         let initial = [
    //             'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //             'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //             'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //             'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //         ];
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = [
    //             'Lorem ipsum dolor sit 8 consectetuer',
    //             'Lorem ipsum dolor sit 8 consectetuer',
    //             'Lorem ipsum dolor sit amet consectetuer',
    //             'Lorem dolor dolor sit amet consectetuer',
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (array - two level)', async () => {

    //         let initial = [
    //             ['Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer'],
    //             ['Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer']
    //         ];
    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = [
    //             ['Lorem ipsum dolor sit 8 consectetuer'],
    //             ['Lorem ipsum dolor sit 8 consectetuer',
    //                 'Lorem ipsum dolor sit amet consectetuer',
    //                 'Lorem dolor dolor sit amet consectetuer']
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (object - one level)', async () => {

    //         let initial = {
    //             prop1: 2,
    //             prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //             prop3: null,
    //             prop4: false,
    //             prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //             prop6: 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //             prop7: new Date('Sun Feb 28 2010 05:30:00 GMT+0530 (IST)'),
    //             prop8: 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //         };

    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = {
    //             prop1: 2,
    //             prop2: 'Lorem ipsum dolor sit 8 consectetuer',
    //             prop3: null,
    //             prop4: false,
    //             prop5: 'Lorem ipsum dolor sit 8 consectetuer',
    //             prop6: 'Lorem ipsum dolor sit amet consectetuer',
    //             prop7: new Date('Sun Feb 28 2010 05:30:00 GMT+0530 (IST)'),
    //             prop8: 'Lorem dolor dolor sit amet consectetuer'
    //         };

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (object - 3 levels)', async () => {

    //         let initial = {
    //             prop1: 2,
    //             prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //             prop3: {
    //                 subProp: null,
    //                 prop4: false,
    //                 prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop6: [
    //                     {
    //                         prop7: true,
    //                         prop8: 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //                     },
    //                     {
    //                         prop9: false,
    //                         prop10: 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //                     }
    //                 ]
    //             }
    //         };

    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = {
    //             prop1: 2,
    //             prop2: 'Lorem ipsum dolor sit 8 consectetuer',
    //             prop3: {
    //                 subProp: null,
    //                 prop4: false,
    //                 prop5: 'Lorem ipsum dolor sit 8 consectetuer',
    //                 prop6: [
    //                     {
    //                         prop7: true,
    //                         prop8: 'Lorem ipsum dolor sit amet consectetuer'
    //                     },
    //                     {
    //                         prop9: false,
    //                         prop10: 'Lorem dolor dolor sit amet consectetuer'
    //                     }
    //                 ]
    //             }
    //         };

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (object - 3 levels) (asString)', async () => {

    //         let initial = {
    //             prop1: 2,
    //             prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //             prop3: {
    //                 subProp: null,
    //                 prop4: false,
    //                 prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop6: [
    //                     {
    //                         prop7: true,
    //                         prop8: 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //                     },
    //                     {
    //                         prop9: false,
    //                         prop10: 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //                     }
    //                 ]
    //             }
    //         };

    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = {
    //             prop1: 2,
    //             prop2: 'Lorem ipsum dolor sit 8 consectetuer',
    //             prop3: {
    //                 subProp: null,
    //                 prop4: false,
    //                 prop5: 'Lorem ipsum dolor sit 8 consectetuer',
    //                 prop6: [
    //                     {
    //                         prop7: true,
    //                         prop8: 'Lorem ipsum dolor sit amet consectetuer'
    //                     },
    //                     {
    //                         prop9: false,
    //                         prop10: 'Lorem dolor dolor sit amet consectetuer'
    //                     }
    //                 ]
    //             }
    //         };

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             asString: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (array of nested objects)', async () => {

    //         let initial = [
    //             {
    //                 prop1: 2,
    //                 prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 prop2: 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     prop4: true,
    //                     prop5: 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //                 }
    //             }
    //         ];


    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = [
    //             {
    //                 prop1: 2,
    //                 prop2: 'Lorem ipsum dolor sit 8 consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit 8 consectetuer',
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 prop2: 'Lorem ipsum dolor sit amet consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     prop4: true,
    //                     prop5: 'Lorem dolor dolor sit amet consectetuer'
    //                 }
    //             }
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate and replace with actual value multiple and nested interpolations (mixed) (4 levels - all types) (array of nested objects with mixed types)', async () => {

    //         let initial = [
    //             null,
    //             5,
    //             {
    //                 prop1: 2,
    //                 prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 prop2: 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     prop4: true,
    //                     prop5: false
    //                 }
    //             },
    //             'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //         ];


    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = [
    //             null,
    //             5,
    //             {
    //                 prop1: 2,
    //                 prop2: 'Lorem ipsum dolor sit 8 consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit 8 consectetuer',
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 prop2: 'Lorem ipsum dolor sit amet consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     prop4: true,
    //                     prop5: false
    //                 }
    //             },
    //             'Lorem dolor dolor sit amet consectetuer'
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate in nested collection the keys and values', async () => {

    //         let initial = [
    //             null,
    //             5,
    //             {
    //                 prop1: 2,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 }
    //             },
    //             {
    //                 '#>[0].children[5].title<#': 5,
    //                 prop2: 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 prop3: {
    //                     '{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}': 'lorem ipsum - unaltered string',
    //                     prop4: true,
    //                     prop5: false
    //                 }
    //             },
    //             'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer'
    //         ];


    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = [
    //             null,
    //             5,
    //             {
    //                 0: 'Lorem ipsum dolor sit 8 consectetuer',
    //                 prop1: 2,
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit 8 consectetuer'
    //                 }
    //             },
    //             {
    //                 4: 5,
    //                 prop2: 'Lorem ipsum dolor sit amet consectetuer',
    //                 prop3: {
    //                     varNumber: 'lorem ipsum - unaltered string',
    //                     prop4: true,
    //                     prop5: false
    //                 }
    //             },
    //             'Lorem dolor dolor sit amet consectetuer'
    //         ];

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate just for first level', async () => {

    //         let initial = [
    //             null,
    //             5,
    //             {
    //                 '{{#>[0].children[4].title<##>[0].children[5].title<#}}': 2,
    //                 prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     subProp12: 'lorem {{varNumber+>1 + 1<+}} - unaltered string',
    //                     prop4: true,
    //                     prop5: false,
    //                     '{{varNumber+>1 + 1<+}}2': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             },
    //             'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //             {
    //                 prop1: 2,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 '{{varNumber6}}': {
    //                     subProp8: 'lorem ipsum - unaltered string',
    //                     subProp90: 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}}',
    //                     prop41: true,
    //                     prop52: false,
    //                     '{{varNumber+>1 + 1<+}}52': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             },
    //         ];


    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = [
    //             null,
    //             5,
    //             {
    //                 '{{#>[0].children[4].title<##>[0].children[5].title<#}}': 2,
    //                 prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer'
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     subProp12: 'lorem {{varNumber+>1 + 1<+}} - unaltered string',
    //                     prop4: true,
    //                     prop5: false,
    //                     '{{varNumber+>1 + 1<+}}2': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             },
    //             'Lorem dolor dolor sit amet consectetuer',
    //             {
    //                 prop1: 2,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 '{{varNumber6}}': {
    //                     subProp8: 'lorem ipsum - unaltered string',
    //                     subProp90: 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}}',
    //                     prop41: true,
    //                     prop52: false,
    //                     '{{varNumber+>1 + 1<+}}52': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             }
    //         ];

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             levels: [0]
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate for certain levels', async () => {

    //         let initial = [
    //             null,
    //             5,
    //             {
    //                 '{{#>[0].children[4].title<##>[0].children[5].title<#}}': 2,
    //                 prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].#>[0].children[{{varNumber2bis}}].title<#<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     subProp12: 'lorem {{varNumber+>1 + 1<+}} - unaltered string',
    //                     prop4: true,
    //                     prop5: false,
    //                     '{{varNumber+>1 + 1<+}}2': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             },
    //             'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}} {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //             {
    //                 prop1: 2,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 '{{varNumber6}}': {
    //                     subProp8: 'lorem ipsum - unaltered string',
    //                     subProp90: 'Lorem {{+>`{{varNumber+>Number(#>[0].children[5].title<#) + 2<+}}${Number(#>[0].children[5].title<#)}`<+}}',
    //                     prop41: true,
    //                     prop52: false,
    //                     '{{varNumber+>1 + 1<+}}52': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             },
    //         ];


    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     {
    //                         title: 'Vacuum cleaners',
    //                         children: [
    //                             {
    //                                 title: 'Bissell SmartClean 1605',
    //                             },
    //                             {
    //                                 title: 'varNumber1',
    //                             },
    //                             {
    //                                 title: 'title',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             },
    //                             {
    //                                 title: 'varNumber',
    //                             },
    //                             {
    //                                 title: '4',
    //                             },
    //                             {
    //                                 title: 'ipsum',
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ];

    //         let data = [
    //             {
    //                 NPath: '[0]',
    //                 varName: 'varNumber1ForStuff',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 8
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 0
    //             },
    //             {
    //                 NPath: '[1]',
    //                 varName: 'varNumber2bis',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 2
    //             },
    //             {
    //                 NPath: '[2]',
    //                 varName: 'varNumber3',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'Stuff'
    //             },
    //             {
    //                 NPath: '[3]',
    //                 varName: 'varNumber4',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'dolor'
    //             },
    //             {
    //                 NPath: '[4]',
    //                 varName: 'varNumber5',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'amet'
    //             },
    //             {
    //                 NPath: '[5]',
    //                 varName: 'varNumber6',
    //                 level: 0,
    //                 domainLevel: 0,
    //                 value: 'varNumber'
    //             }
    //         ];

    //         let expected = [
    //             null,
    //             5,
    //             {
    //                 '{{#>[0].children[4].title<##>[0].children[5].title<#}}': 2,
    //                 prop2: 'Lorem ipsum dolor sit {{#>[{{varNumber+>1 + 1<+}}].children[+>3 - 2<+].title<#For{{varNumber+>3 * 1<+}}}} consectetuer',
    //                 prop3: {
    //                     subProp: null,
    //                     prop4: false,
    //                     prop5: 'Lorem ipsum dolor sit 8 consectetuer'
    //                 }
    //             },
    //             {
    //                 prop1: 5,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 prop3: {
    //                     subProp: 'lorem ipsum - unaltered string',
    //                     subProp12: 'lorem 0 - unaltered string',
    //                     prop4: true,
    //                     prop5: false,
    //                     '02': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             },
    //             'Lorem dolor dolor sit amet consectetuer',
    //             {
    //                 prop1: 2,
    //                 '{{varNumber+>1 + 1<+}}': 'Lorem ipsum {{#>[0].children[4].title<##>[0].children[5].title<#}} sit {{{{varNumber6}}+>5<+}} consectetuer',
    //                 '{{varNumber6}}': {
    //                     subProp8: 'lorem ipsum - unaltered string',
    //                     subProp90: 'Lorem dolor',
    //                     prop41: true,
    //                     prop52: false,
    //                     '052': {
    //                         prop7: '{{#>[0].children[4].title<##>[0].children[5].title<#}}'
    //                     }
    //                 }
    //             }
    //         ];

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             levels: [0, 2]
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (path)', async () => {

    //         let initial = '(0, #>[0][1]<#]';


    //         let context = [{name: 'collection', collection: [[1, 2]]}];

    //         let data = [{
    //             varName: 'varNumber1ForStuff',
    //             value: 8
    //         }];

    //         let expected = '(0, 2]';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (var)', async () => {

    //         let initial = '(0, {{var1}}]';


    //         let context = [{name: 'collection', collection: []}];

    //         let data = [{
    //             varName: 'var1',
    //             value: 2
    //         }];

    //         let expected = '(0, 2]';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (eval)', async () => {

    //         let initial = '(0, +>1 + 1<+]';


    //         let context = [{name: 'collection', collection: [[1, 2]]}];

    //         let data = [];

    //         let expected = '(0, 2]';

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (path) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '(0, #>[0][1]<#]';


    //         let context = [{name: 'collection', collection: [[1, 2]]}];

    //         let data = [{
    //             varName: 'varNumber1ForStuff',
    //             value: 8
    //         }];

    //         let expected = '(0, 2]';

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (var) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '(0, {{var1}}]';


    //         let context = [{name: 'collection', collection: []}];

    //         let data = [{
    //             varName: 'var1',
    //             value: 2
    //         }];

    //         let expected = '(0, 2]';

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (eval) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '(0, +>1 + 1<+]';


    //         let context = [{name: 'collection', collection: [[1, 2]]}];

    //         let data = [];

    //         let expected = '(0, 2]';

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (path) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '(0, #>[0][5]<#]';


    //         let context = [{name: 'collection', collection: [[1, 2]]}];

    //         let data = [{
    //             varName: 'varNumber1ForStuff',
    //             value: 8
    //         }];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (var) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '(0, {{var1}}]';


    //         let context = [{name: 'collection', collection: []}];

    //         let data = [{
    //             varName: 'var5',
    //             value: 2
    //         }];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (simplified) (1) (eval) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '(0, +>1 +-- 1<+]';


    //         let context = [{name: 'collection', collection: [[1, 2]]}];

    //         let data = [];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({
    //             template: initial,
    //             context: context,
    //             data: data,
    //             noProcessing: true
    //         });
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate real life example (1)', async () => {

    //         let initial = {
    //             isArray: true,
    //             '[+>6 - 6<+]': {
    //                 isArray: true,
    //                 '[0]': {
    //                     isString: true
    //                 },
    //                 '[2]': {
    //                     isArray: true
    //                 }
    //             },
    //             iterator: {
    //                 isArray: true,
    //                 '[0, +>8 / 2 / 2<+]': {
    //                     2: {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     },
    //                     isArray: true,
    //                     '(0, #>[0][1]<#]': {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     }
    //                 },
    //                 '[0]': {
    //                     isNull: true
    //                 },
    //                 '[0, 1.5]': {
    //                     2: {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     },
    //                     isArray: true,
    //                     '(0, #>[0][1]<#]': {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     }
    //                 }
    //             },
    //             '(+>(6 / 2) - 2<+, 2]': {
    //                 isArray: true
    //             },
    //             '[0]': {
    //                 isArray: true,
    //                 '[0]': {
    //                     isString: true
    //                 },
    //                 '[2]': {
    //                     isArray: true
    //                 }
    //             },
    //             '(1, 2]': {
    //                 isArray: true
    //             }
    //         };


    //         let context = [
    //             {
    //                 name: 'collection',
    //                 collection: [
    //                     [
    //                         1,
    //                         2,
    //                         [
    //                             4,
    //                             5,
    //                             6
    //                         ]
    //                     ],
    //                     [
    //                         1,
    //                         2,
    //                         [
    //                             4,
    //                             5,
    //                             {
    //                                 array: [
    //                                     9,
    //                                     3,
    //                                     5
    //                                 ],
    //                                 stringProp: 'lorem'
    //                             }
    //                         ],
    //                         3,
    //                         12,
    //                         15,
    //                         21,
    //                         22
    //                     ],
    //                     [
    //                         1,
    //                         2,
    //                         [
    //                             {
    //                                 array: [
    //                                     91,
    //                                     92,
    //                                     93
    //                                 ],
    //                                 stringProp2: 'ipsum'
    //                             },
    //                             5,
    //                             6
    //                         ]
    //                     ],
    //                     18,
    //                     20,
    //                     21
    //                 ]
    //             }
    //         ];

    //         let data = [];

    //         let expected = {
    //             isArray: true,
    //             '[0]': {
    //                 isArray: true,
    //                 '[0]': {
    //                     isString: true
    //                 },
    //                 '[2]': {
    //                     isArray: true
    //                 }
    //             },
    //             iterator: {
    //                 isArray: true,
    //                 '[0, 2]': {
    //                     2: {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     },
    //                     isArray: true,
    //                     '(0, 2]': {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     }
    //                 },
    //                 '[0]': {
    //                     isNull: true
    //                 },
    //                 '[0, 1.5]': {
    //                     2: {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     },
    //                     isArray: true,
    //                     '(0, 2]': {
    //                         stringProp: {
    //                             stringIsPopulated: true
    //                         }
    //                     }
    //                 }
    //             },
    //             '(1, 2]': {
    //                 isArray: true
    //             }
    //         };

    //         let actual = Interpolator.interpolate({template: initial, context: context, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval)', async () => {

    //         let initial = '+>1+1<+';

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '+>1+=--{1<+';

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '+>1+=--{1<+';

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '+>1+1<+';

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval - with spaces)', async () => {

    //         let initial = '+> 1 + 1 <+';

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval - with spaces) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '+> 1 + = - - { 1 <+';

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval - with spaces) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '+> 1 + = - - { 1 <+';

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (eval - with spaces) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '+> 1 + 1 <+';

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var)', async () => {

    //         let initial = '{{x}}';

    //         let data = {x: 2};

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '{{y}}';

    //         let data = {x: 2};

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '{{y}}';

    //         let data = {x: 2};

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, data: data, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '{{x}}';

    //         let data = {x: 2};

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, data: data, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var - with spaces)', async () => {

    //         let initial = '{{ x }}';

    //         let data = {x: 2};

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var - with spaces) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '{{ y }}';

    //         let data = {x: 2};

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, data: data});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var - with spaces) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '{{ y }}';

    //         let data = {x: 2};

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, data: data, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (var - with spaces) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '{{ x }}';

    //         let data = {x: 2};

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, data: data, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context)', async () => {

    //         let initial = '#><#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [1, {lorem: 2}];

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#><#';

    //         let context = [
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#><#';

    //         let context = [
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#><#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [1, {lorem: 2}];

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context - with spaces)', async () => {

    //         let initial = '#>  <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [1, {lorem: 2}];

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context - with spaces) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#>  <#';

    //         let context = [
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context - with spaces) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>  <#';

    //         let context = [
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context - with spaces) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>  <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [4, {ipsum: 5}];

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context)', async () => {

    //         let initial = '#>[1].lorem<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#>[1].ipsum<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>[1].ipsum<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>[1].lorem<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context - with spaces)', async () => {

    //         let initial = '#>  <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [1, {lorem: 2}];

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context - with spaces) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#> [1].ipsum <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - no context - with spaces) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#> [1].ipsum <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - no context - with spaces) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#> [1].lorem <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 2;

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context)', async () => {

    //         let initial = '#>[1].ipsum|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 5;

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#>[1].lorem|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>[1].lorem|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>[1].ipsum|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 5;

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context - with spaces)', async () => {

    //         let initial = '#> [1].ipsum | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 5;

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context - with spaces) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#> [1].lorem | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context - with spaces) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#> [1].lorem | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (path - with context - with spaces) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#> [1].ipsum | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 5;

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context)', async () => {

    //         let initial = '#>|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [4, {ipsum: 5}];

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#>|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>|context2<#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [4, {ipsum: 5}];

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context - with spaces)', async () => {

    //         let initial = '#>  | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [4, {ipsum: 5}];

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context - with spaces) (not Processable - noProcessing: false, replaceWithUndefined: true)', async () => {

    //         let initial = '#>  | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = 'undefined';

    //         let actual = Interpolator.interpolate({template: initial, context: context});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context - with spaces) (not Processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>  | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = Lodash.cloneDeep(initial);

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate a string with only the interpolation (empty path - with context - with spaces) (processable - noProcessing: true, replaceWithUndefined: false)', async () => {

    //         let initial = '#>  | context2 <#';

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [4, {ipsum: 5}];

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });

    //     it('should interpolate complex example with nested, multi-branch interpolations and nested loops', async () => {

    //         let initial = `
    //             0>for(let i=0; i<JSON.stringify(data).length; i++) {<0
                
    //             0> } <0
                
                
    //         `;

    //         let context = [
    //             {name: 'collection', collection: [1, {lorem: 2}]},
    //             {name: 'context2', collection: [4, {ipsum: 5}]}
    //         ];

    //         let expected = [4, {ipsum: 5}];

    //         let actual = Interpolator.interpolate({template: initial, context: context, noProcessing: true});
    //         expect(actual).to.deep.equal(expected);
    //     });
    // });
});
