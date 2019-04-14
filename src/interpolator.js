'use strict';

const Lodash = require('lodash');
const FileSystem = require('fs');
const chalk = require('chalk');
const PathHelper = require('collection-path-helper');

/**
 * @class Interpolator
 * @constructor
 */
class Interpolator {

    /**
     * This takes as an input (argument) a string or a collection and then filters out according to an array certain strings and logs the filtering in a changes array
     * Returns an object with "filtered" property and "changes" property
     * @param {Object} options - Various options for filtering out. Might include also transient properties (For recursion only)
     * @param {String|Array|Object} options.template - The item on which the filtering out will be applied
     * @param {String[]} options.filterOut - An array of strings which will be filtered out.
     * @param {String} options.newValue - If this is specified, it will any occurance of the strings in the array will be replaced with this value instead of the default ("")
     * @param {Object=} transience - An object with transient properties collected during iteration
     * @param {Object=} transience.filtered - The template after filtering
     * @param {Number=} transience.level - This reflects the current level
     * @param {String=} transience.cursor - This reflects the current cursor
     * @param {Number=} transience.changeOrder - This reflects the order number of the last change
     * @param {Object[]=} transience.changes - This is the array with the changes made on the template
     * @returns {Object}
     */
    static filterOut(options, transience) {
        let defaultOptions = {
            filterOut: [],
            newValue: ''
        };

        options = {...defaultOptions, ...options};

        if (typeof transience === 'undefined') {
            transience = {
                level: -1,
                cursor: '',
                changeOrder: -1,
                changes: [],
                filtered: options.template
            };
        }

        if ((typeof transience.filtered === 'object' && transience.filtered !== null && Object.prototype.toString.call(transience.filtered) === '[object Object]')) {
            /** Handling object data structures */
            transience.level += 1;
            for (let key in transience.filtered) {
                transience.cursor = `${transience.cursor}.${key}`;
                if (transience.cursor.charAt(0) === '.') { transience.cursor = transience.cursor.replace('.', ''); }

                /** Recursively filtering out again on object data structures */
                let result = Interpolator.filterOut(options, {...transience, filtered: transience.filtered[key]});

                /** Re-mapping the result to the current transience object */
                transience.filtered[key] = result.filtered;
                transience.changeOrder = result.changeOrder;

                transience.cursor = PathHelper.removePathLevels(transience.cursor);
            }
            transience.level -= 1;
        } else if (Array.isArray(transience.filtered)) {
            /** Handling arrays */
            transience.level += 1;
            for (let i = 0; i < transience.filtered.length; i++) {
                transience.cursor = `${transience.cursor}[${i}]`;

                /** Recursively filtering out again on array objects */
                let result = Interpolator.filterOut(options, {...transience, filtered: transience.filtered[i]});

                /** Re-mapping the result to the current transience object */
                transience.filtered[i] = result.filtered;
                transience.changeOrder = result.changeOrder;

                transience.cursor = PathHelper.removePathLevels(transience.cursor);
            }
            transience.level -= 1;
        } else if (typeof transience.filtered === 'string' || transience.filtered instanceof String) {
            /** Handling strings directly. Here is where all the real processing is happening */
            for (let i = 0; i < options.filterOut.length; i++) {
                while (transience.filtered.indexOf(options.filterOut[i]) > -1) {
                    let index = transience.filtered.indexOf(options.filterOut[i]);
                    transience.filtered = transience.filtered.replace(options.filterOut[i], '');
                    transience.changeOrder++;
                    let change = {idx: index, pt: transience.cursor, bf: options.filterOut[i], af: options.newValue, od: transience.changeOrder};
                    transience.changes.push(change);
                }
            }
        }

        if (transience.level === -1) {
            delete transience.level;
            delete transience.cursor;
        }

        return transience;
    }

    /**
     * Reverses all the changes made to a String/Object/Array according to changes array.
     * Returns the initial template before the interpolation process.
     * @param {Object} options - Various options for reversing the result of a interpolation template, to the original template.
     * @param {String|Array|Object} options.result - The result of the interpolation that needs to be reverted
     * @param {Object[]} options.changes - An array of change objects (that needs to be applied on the result incrementally based on "od" to get the initial template)
     * @param {Object=} transience - An object with transient properties collected during iteration
     * @param {Object=} transience.template - The template after reversing all the changes
     * @returns {String|Array|Object}
     */
    static reverse(options, transience) {
        let defaultOptions = {
            result: '',
            changes: []
        };

        options = {...defaultOptions, ...options};

        if (typeof transience === 'undefined') {
            transience = {
                template: options.result
            };
        }

        let lastChangeNumber = Math.max(...options.changes.map(a => a.od));

        for (let i = lastChangeNumber; i > -1; i--) {
            console.log(i);
            let scope = PathHelper.get(transience.template, options.changes[i].pt);
            scope = Interpolator.reverseChange({input: scope, change: options.changes[i]});
            transience.template = PathHelper.set(transience.template, options.changes[i].pt, scope);
        }

        return transience.template;
    }

    /**
     * Reverses a change within a string according to a change object
     * @param {Object} options
     * @param {String} options.input
     * @param {Object} options.change
     * @param {Number} options.change.idx - index - where in the string the operation happened
     * @param {String} options.change.pt - path - this property is not used but is not worth sanitizing since is used in the above level
     * @param {String} options.change.bf - before - The value that was replaced
     * @param {String} options.change.af - after - The new value which was put in place of the old value (bf(before))
     * @param {Number} options.change.od - order - an auto-incremented id of the changes. This will be used to back-engineer the computed interpolation to the original template
     * @returns {String}
     */
    static reverseChange(options) {
        let defaultOptions = {
            input: '',
            change: {idx: 0, pt: '', bf: '', af: '', od: 0}
        };

        options = {...defaultOptions, ...options};

        let endIdx = options.change.idx + options.change.af.length;

        let firstChunk = options.input.substring(0, options.change.idx);
        let lastChunk = options.input.substring(endIdx);
        let replaced = firstChunk + options.change.bf + lastChunk;

        return replaced;
    }

    /**
     * Stringifies anything
     * @param {*} property - The item which needs to be stringified
     * @returns {String}
     */
    static stringify(property) {
        let stringified = '';
        if ((typeof property === 'object' && property !== null && Object.prototype.toString.call(property) === '[object Object]') || Array.isArray(property)) {
            stringified = `${JSON.stringify(property)}`;
        } else if (typeof property === 'string' || property instanceof String) {
            stringified = `"${property}"`;
        } else {
            stringified = property;
        }

        return stringified;
    }

    /**
     * Get an Acronym/Abbreviation out of a camelCase String
     * @param {String} camelCaseString - The string from which the abbreviation will be extracted
     * @returns {String}
     */
    static getCCAcronym(camelCaseString) {
        let acronyim = '';

        if ((typeof camelCaseString === 'string' || camelCaseString instanceof String) && camelCaseString.length !== 0) {
            acronyim += camelCaseString[0];

            for (let i = 1; i < camelCaseString.length; i++) {
                if (/[A-Z]|[\u0080-\u024F]/.test(camelCaseString[i])) {
                    acronyim += camelCaseString[i];
                }
            }
        }

        acronyim = acronyim.toLowerCase();

        return acronyim;

    }

    /**
     * This method purpose is to normalize, validate, act on default or they're lack of and have a final template ready of the interpolation process
     * @param {Object} options - Identical to {@link Interpolator.interpolate}
     * @returns {Object}
     */
    static initialize(options) {
        let msg = '';
        let keyAcronym = '';

        let defaultOptions = {
            template: '',
            fileTemplate: '',
            asString: false,
            data: {},
            fileData: '',
            interpolators: [
                // {p: '#>', s: '<#', t: 'path'},
                // {p: '{{', s: '}}', t: 'var'},
                // {p: '+>', s: '<+', t: 'eval'}
                {p: '{{', s: '}}', t: 'code'}
            ],
            replaceWithUndefined: true,
            replaceWithEmptyString: false,
            noProcessing: false,
            returnOnlyResult: false,
            silenceLogs: false,
            noLogs: false,
            noChanges: false,
            filterOut: [],
            levels: null,
            interpolationLevels: null
        };

        let transience = {
            logs: [],
            changes: [],
            changeOrder: -1
        };

        if (typeof options === 'object' && options !== null) {
            for (let key in defaultOptions) {
                keyAcronym = Interpolator.getCCAcronym(key);
                if (options[keyAcronym] && options[key]) {
                    msg = `[WARNING] Both options.${keyAcronym} and options.${key} are defined. Using options.${key}: ${Interpolator.stringify(options[key])}`;
                    if (!defaultOptions.silenceLogs) { console.log(chalk.yellow(msg)); }
                    if (!defaultOptions.noLogs) { transience.logs.push(msg); }
                    defaultOptions[key] = options[key];
                } else if (options[keyAcronym]) {
                    defaultOptions[key] = options[keyAcronym];
                } else if (options[key]) {
                    defaultOptions[key] = options[key];
                }
            }
        } else {
            /** Generic message */
            msg = '[WARNING] The options argument was invalid. Therefore, defaultOptions will be used.';
            if (!defaultOptions.silenceLogs) { console.log(chalk.yellow(msg)); }
            if (!defaultOptions.noLogs) { transience.logs.push(msg); }
        }

        /** @TODO Getting the file from fileTemplate argument */
        /** @TODO Getting the file from fileData argument */
        // if ((typeof defaultOptions.fileTemplate === 'string' || defaultOptions.fileTemplate instanceof String) && defaultOptions.fileTemplate.length > 0) {
        //     let filePath = `${path.dirname(__filename)}${defaultOptions.fileTemplate}`;
        //     console.log(filePath);
        //     console.log(path.dirname(__filename));
        //     try {
        //         let fileContents = FileSystem.readFileSync(filePath, {encoding: 'utf-8'});
        //         defaultOptions.template = fileContents;
        //     } catch (e) {
        //         msg = `${e}. Using options.template: ${Interpolator.stringify(defaultOptions.template)} instead.`;
        //         if (!defaultOptions.silenceLogs) { console.log(chalk.yellow(msg)); }
        //         if (!defaultOptions.noLogs) { transience.logs.push(msg); }
        //     }
        // }


        let filtered = Interpolator.filterOut();

        msg = '[NOTICE] Starting with the following options:';
        if (!defaultOptions.silenceLogs) { console.log(chalk.cyan(msg)); }
        if (!defaultOptions.noLogs) { transience.logs.push(msg); }

        for (let key in defaultOptions) {
            msg = `[NOTICE] ${key}(${Interpolator.getCCAcronym(key)}): ${Interpolator.stringify(defaultOptions[key])}`;
            if (!defaultOptions.silenceLogs) { console.log(chalk.cyan(msg)); }
            if (!defaultOptions.noLogs) { transience.logs.push(msg); }
        }

        return {
            options: defaultOptions,
            transience: transience
        };
    }

    /**
     * Get By path
     * @param collection
     * @param path
     * @returns {*}
     */
    static get(collection, path) {
        if (path.length === 0) {
            return collection;
        }
        if (typeof path === 'string' && path instanceof String && path.startsWith('.')) {
            path = path.replace('.', '');
        }

        return Lodash.get(collection, path, undefined);
    }

    /**
     * @TODO We should add unit tests
     * Check if there is a certain pair of interpolators into the string
     * @param {String} string
     * @param {String} prefix
     * @param {String} suffix
     */
    static checkInterpolatorPair(string, prefix, suffix) {
        let prefixPosition = string.indexOf(prefix);
        let suffixPosition = string.indexOf(suffix);

        return prefixPosition > -1 && suffixPosition > -1 && suffixPosition > prefixPosition;
    }

    /**
     * Interpolate values from an object
     * @param {Object} collection
     * @param {Object} options
     * @param {Object[]} options.interpolators
     * @param {Number=} options.level
     * @param {Number[]=} options.levels
     */
    static objectInterpolate(collection, options) {
        let result = {};

        let doInterpolate = true;
        if (options.levels.length > 0 && !options.levels.includes(options.level)) {
            doInterpolate = false;
        }
        for (let key in collection) {
            if (doInterpolate) {
                let value = collection[key];
                key = Interpolator.stringInterpolate(key, options);
                collection[key] = value;
            }
            if (Interpolator.canPassUnchanged(collection[key], options.interpolators)) {
                result[key] = collection[key];
            } else if (Lodash.isString(collection[key]) && doInterpolate) {
                result[key] = Interpolator.stringInterpolate(collection[key], options);
            } else if (Lodash.isArray(collection[key])) {
                options.level++;
                result[key] = Interpolator.arrayInterpolate(collection[key], options);
                options.level--;
            } else if (Lodash.isObject(collection[key])) {
                options.level++;
                result[key] = Interpolator.objectInterpolate(collection[key], options);
                options.level--;
            } else {
                result[key] = collection[key];
            }
        }

        return result;
    }

    /**
     * Interpolate a string
     * @param {String} collection
     * @param {Object} options
     * @param {Object[]} options.interpolators
     */
    static stringInterpolate(collection, options) {
        if (Interpolator.hasInterpolators(collection, options.interpolators)) {
            let separators = Interpolator.getSeparators(options.interpolators);
            let tokens = Interpolator.getTokens(collection, separators);
            let parseTree = Interpolator.parseTokens(tokens);
            let jsCode = Interpolator.createCode(parseTree, options);

            let result = eval(jsCode);

            return result;
        }
        return collection;
    }

    /**
     * Interpolate a string
     * @param {String} collection
     * @param {Object} options
     * @param {Object[]} options.interpolators
     * @param {Number=} options.level
     * @param {Number[]=} options.levels
     */
    static arrayInterpolate(collection, options) {
        let result = [];

        let doInterpolate = true;
        if (options.levels.length > 0 && !options.levels.includes(options.level)) {
            doInterpolate = false;
        }

        // options.data.push({varName: 'count', value: collection.length});

        for (let i in collection) {
            if (Interpolator.canPassUnchanged(collection[i], options.interpolators)) {
                result.push(collection[i]);
            } else if (Lodash.isString(collection[i]) && doInterpolate) {
                result.push(Interpolator.stringInterpolate(collection[i], options));
            } else if (Lodash.isArray(collection[i])) {
                options.level++;
                result.push(Interpolator.arrayInterpolate(collection[i], options));
                options.level--;
            } else if (Lodash.isObject(collection[i])) {
                options.level++;
                result.push(Interpolator.objectInterpolate(collection[i], options));
                options.level--;
            } else {
                result.push(collection[i]);
            }
        }

        // options.data.pop();

        return result;
    }

    /**
     * Check if there are any interpolators into the string
     * @param {String} string
     * @param {Array} interpolators
     */
    static hasInterpolators(string, interpolators) {
        for (let interpolatorKey in interpolators) {
            let interpolator = interpolators[interpolatorKey];
            if (
                interpolator.prefix
                && interpolator.suffix
                && Interpolator.checkInterpolatorPair(string, interpolator.prefix, interpolator.suffix)
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {*} collection
     * @param {*} interpolators
     * @returns {*|boolean}
     */
    static canPassUnchanged(collection, interpolators) {
        return Lodash.isUndefined(collection)
            || Lodash.isNull(collection)
            || Lodash.isBoolean(collection)
            || Lodash.isNumber(collection)
            || Lodash.isDate(collection)
            || (Lodash.isArray(collection) && Lodash.isEmpty(collection))
            || (Lodash.isObject(collection) && Lodash.isEmpty(collection))
            || (Lodash.isString(collection) && !Interpolator.hasInterpolators(collection, interpolators));
    }

    /**
     * @param {String} path
     * @returns {String}
     */
    static getPathContext(path) {
        if (!path.includes('|')) {
            return '';
        }
        return path.split('|')[1];
    }

    /**
     * @param {String} path
     * @returns {String}
     */
    static removePathContext(path) {
        if (!path.includes('|')) {
            return path;
        }
        return path.split('|')[0];
    }

    /**
     * For a given contextName, chooses and returns the appropriate context
     * @param {String} contextName
     * @param {Object[]|Array|Object} contexts
     * @returns {Array|Object}
     */
    static getContext(contextName, contexts) {

        if (Array.isArray(contexts)) {
            if (contextName.length === 0 && contexts.length > 0) {
                if (typeof contexts[0] === 'object' && contexts[0] !== null && contexts[0].name && typeof contexts[0].collection) {
                    return contexts[0].collection;
                }
                return contexts;

            }

            for (let i = 0; i < contexts.length; i++) {
                if (contexts[i].name && contexts[i].name === contextName) {
                    return contexts[i].collection;
                }
            }

        }

        if (contextName.length > 0) {
            return undefined;
        }

        return contexts;
    }

    /**
     * @param {String} property
     * @return {String}
     */
    static filterOutSpaces(property) {
        return property.replace(' ', '');
    }

    /**
     * Evaluate operations
     * @param {Object} node
     * @param {Object} options
     */
    static evaluateTree(node, options) {
        switch (node.type) {
        case 'string': {
            return node.value;
        }
            break;
        case 'path': {
            let newNode = {
                value: node.value,
                type: 'group'
            };
            let path = Interpolator.evaluateTree(newNode, options);
            let contextName = Interpolator.getPathContext(path);
            let context = Interpolator.getContext(contextName, options.context);
            path = Interpolator.removePathContext(path);
            if (path) {
                let retrievedContext = Interpolator.get(context, path);
                if (typeof retrievedContext !== 'undefined') {
                    return retrievedContext;
                } if (typeof retrievedContext === 'undefined' && options.noProcessing === true) {
                    /** @TODO Instead of doing this, we should save along with the node, the originalInterpolation string */
                    return `#>${path}<#`;
                }
                return 'undefined';

            }
            if (node.siblingsCount === 1) {
                return context;
            }
            return JSON.stringify(context);


        }
            break;
        case 'var': {
            let newNode = {
                value: node.value,
                type: 'group'
            };
            let varName = Interpolator.evaluateTree(newNode, options);
            let varValue = Interpolator.getVarValue(varName, options.data, {noProcessing: options.noProcessing});
            if (node.siblingsCount === 1) {
                return varValue;
            } if (Lodash.isArray(varValue) || Lodash.isObject(varValue)) {
                return JSON.stringify(varValue);
            }
            return varValue;

        }
            break;
        case 'eval': {
            let newNode = {
                value: node.value,
                type: 'group'
            };
            let evalResult;
            try {
                evalResult = eval(Interpolator.evaluateTree(newNode, options));
            } catch (e) {
                if (options.noProcessing === true) {
                    /** @TODO Instead of doing this, we should save along with the node, the originalInterpolation string */
                    evalResult = `+>${node.value[0].value}<+`;
                } else {
                    evalResult = 'undefined';
                }
            }

            return evalResult;
        }
            break;
        case 'code': {
            let jsCode = '';
            let codeValue = '';
            
            for (let i in node.value) {
                if (node.value[i].type == 'string') {
                    let varValue = Interpolator.getVarValue(node.value[i].value, options.data, options);
                    if (typeof varValue === 'undefined' || varValue === 'undefined') {
                        varValue = node.value[i].value;
                    }
                    jsCode += varValue;
                } else {
                    jsCode += Interpolator.evaluateTree(node.value[i], options);
                }
            }

            codeValue = Interpolator.getVarValue(jsCode, options.data, options);
            if (typeof codeValue === 'undefined' || codeValue === 'undefined') {
                codeValue = jsCode;
            }

            return codeValue;
        }
            break;
        case 'group':
        default: {
            let result = '';
            for (let i in node.value) {
                node.value[i].siblingsCount = node.value.length;

                let evaluateValue = Interpolator.evaluateTree(node.value[i], options);

                if (node.value.length === 1) {
                    return evaluateValue;
                }

                if (!Lodash.isString(evaluateValue) && node.value[i].type === 'path') {
                    // return evaluateValue;
                } else if (!Lodash.isString(evaluateValue) && node.value[i].type === 'var' && node.value[i].siblingsCount === 1) {
                    return evaluateValue;
                }
                result += evaluateValue;

            }
            return result;
        }
            break;
        }
    }

    /**
     * Get var value by name
     * @param {String} varName
     * @param {Array} vars
     * @param {Object} options
     * @param {Boolean} options.noProcessing
     * @return {String}
     */
    static getVarValue(varName, vars, options) {

        let val = Lodash.get(vars, varName);

        if (typeof val === 'undefined') {
            for (let i in vars) {
                if (vars[i].varName === varName) {
                    val = vars[i].value;
                    break;
                }
            }
        }

        if (typeof val === 'undefined') {
            if (options.noProcessing === true) {
                /** @TODO Instead of doing this, we should save along with the node, the originalInterpolation string */
                return `{{${varName}}}`;
            }

            return 'undefined';

        }


        return val;
    }

    /**
     * Check if the string has any JS key word to determine if is a pice of JS code
     * 
     * @param {string} code
     * 
     * @returns {boolean}
     */
    static checkIfHasJsCode(code) {
        let jsKeyWords = ['abstract','arguments','await','boolean','break','byte','case','catch','char','class','const','continue','debugger','default','delete','do','double','else','enum','eval','export','extends','false','final','finally','float','for','function','goto','if','implements','import','in','instanceof','int','interface','let','long','native','new','null','package','private','protected','public','return','short','static','super','switch','synchronized','this','throw','throws','transient','true','try','typeof','var','void','volatile','while','with','yield','abstract','boolean','byte','char','double','final','float','goto','int','long','native','short','synchronized','throws','transient','volatile'];
        let jsOperators = ['\\{', '\\}', '\\;', '\='];
        let jsKeyWordsToFind = [];

        for (let keyWordIndex in jsKeyWords) {
            jsKeyWordsToFind.push(jsKeyWords[keyWordIndex] + ' ');
            jsKeyWordsToFind.push(jsKeyWords[keyWordIndex] + '\\(');
            jsKeyWordsToFind.push(jsKeyWords[keyWordIndex] + '\\.');
        }

        for (let jsOperatorIndex in jsOperators) {
            jsKeyWordsToFind.push(jsOperators[jsOperatorIndex]);
        }

        let jsCodeChecker = new RegExp(jsKeyWordsToFind.join('|'), "gmi");

        return jsCodeChecker.test(code);
    }

    /**
     * Generates an object with all separators used to know how to split the string in tokens
     * @param {Array} interpolations
     */
    static getSeparators(interpolations) {
        let separators = {};

        for (let i in interpolations) {
            separators[interpolations[i].prefix] = {
                position: 'prefix',
                type: interpolations[i].type
            };
            separators[interpolations[i].suffix] = {
                position: 'suffix',
                type: interpolations[i].type
            };
        }

        return separators;
    }

    /**
     * Split string in tokens spliting by separators
     * @param {String} string
     * @param {Object} separators
     */
    static getTokens(string, separators) {
        let i = 0;
        let tokens = [];

        /**
         * Check if from current point it will start a separator
         * @param {String} string
         * @param {Number} i
         * @param {Object} separators
         */
        let isSeparatorStart = function (string, i, separators) {
            for (let separator in separators) {
                if (string.substring(i, i + separator.length) === separator) {
                    return separator;
                }
            }
            return false;
        };

        while (i < string.length) {
            let currentSeparator = isSeparatorStart(string, i, separators);

            if (currentSeparator) {
                tokens.push(
                    {
                        value: currentSeparator,
                        type: separators[currentSeparator].type,
                        position: separators[currentSeparator].position
                    }
                );

                i += currentSeparator.length;
            } else {
                let tempString = '';

                while (!isSeparatorStart(string, i, separators) && i < string.length) {
                    tempString += string[i++];
                }

                tokens.push(
                    {
                        type: 'string',
                        value: tempString
                    }
                );
            }
        }

        return tokens;
    }

    /**
     * Parse tokens into a tree in order to set operations order
     * @param {Array} tokens
     */
    static parseTokens(tokens) {
        let rootNode = {
            value: [],
            type: 'group'
        };
        let currentNode = rootNode;

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type === 'string') {
                currentNode.value.push(Lodash.cloneDeep(tokens[i]));
            } else if (tokens[i].position === 'prefix') {
                let newNode = {
                    type: tokens[i].type,
                    value: [],
                    parent: currentNode,
                };
                currentNode.value.push(newNode);
                currentNode = newNode;
            } else {
                if (currentNode.type == 'code') {
                    let hasJsCode = false;

                    for (let j in currentNode.value) {
                        if (Interpolator.checkIfHasJsCode(currentNode.value[j].value)) {
                            hasJsCode = true;
                            break;
                        }
                    }

                    currentNode.hasJsCode = hasJsCode;
                }
                currentNode = currentNode.parent;
            }
        }

        return rootNode;
    }

    /**
     * Evaluate operations
     * @param {Object} node
     * @param {Object} options
     * 
     * @returns {string}
     */
    static createCode(node, options) {
        let jsCode = '';

        jsCode += Interpolator.createOutputFunction();
        jsCode += Interpolator.getVarsFromData(options.data);

        if (node.type == 'group') {
            for (let i in node.value) {
                if (node.value[i].type == 'code') {
                    if (node.value[i].hasJsCode && node.value[i].value.length == 1){
                        jsCode += node.value[i].value[0].value;
                    } else {
                        let evaluateCode = Interpolator.evaluateTree(node.value[i], options);
                        if (!node.value[i].hasJsCode) {
                            evaluateCode = '_writeIntoInterpolatorResultOutput(' + evaluateCode + ');';
                        }
                        jsCode += evaluateCode;
                    }
                } else {
                    jsCode += '_writeIntoInterpolatorResultOutput(\`' + node.value[i].value + '\`);';
                }
            }
        }

        jsCode += 'interpolatorResultOutput;';

        return jsCode;
    }

    /**
     * Make JS code variables from data
     * 
     * @param {array} data 
     * 
     * @returns {string}
     */
    static getVarsFromData(data) {
        let jsCode = '';

        for (let i in data) {
            jsCode += 'let ' + i + ' = ' + JSON.stringify(data[i]) + ";\n";
        }

        return jsCode;
    }

    static createOutputFunction() {
        return `let interpolatorResultOutput = '';
function _writeIntoInterpolatorResultOutput(string) { interpolatorResultOutput += string; }`;
    }

    /**
     * This method should interpolate any type of data
     * The method should support an infinite number of levels and an infinite number of interpolations of any of type within the same level
     * Interpolators:
     * path interpolator: {prefix: "#>", suffix: "<#", type: "path"}
     * var interpolator: {prefix: "{{", suffix: "}}", type: "var"}
     * eval interpolator: {prefix: "+>", suffix: "<+", type: "eval"} - Remote code execution is not a concern at the moment
     * @param {Object=} options
     * @param {Object|Array|String} options.template - Most of the time this would a collection ({Array|Object}) but there are times when this would be called recursively without control and some other types would be passed.
     * @param {String} options.fileTemplate - If the template is within a file, then instead of populating template, populate file template with a valid path. If this is populated, template is ignored
     * @param {Object[]=} options.interpolators -  an array of interpolators objects
     * @param {Object[]} options.data - an array of var objects
     * @param {Object[]} options.replaceWithUndefined - (Default: true) If this is set to true, when an interpolation couldn't be processed for some reason, the interpolation will be replaced with undefined
     * @param {Object[]} options.noProcessing - (Default: false) If this is set to true, then when an interpolation couldn't be processed than it will remain in place as an interpolation and it should be logged
     * @param {Object[]} options.returnOnlyResult - (Default: true) If this is set to true, then instead of returning an object with the properties "result", "logs", "errors" and so on, it will return just the result of the interpolation
     * @param {Object|Array} options.context - This would be an collection which can be accessed via Lodash.get() with the paths discovered while extrapolating
     * @param {Number=} options.level - This is meant for tracking the current level of recursivity
     * @param {Number=} options.interpolationLevel - This is to track how deep the interpolation went when executing evaluateTree
     * @param {Number[]=s} options.levels - This is for restricting interpolation to certain levels
     * @param {String[]} options.logs - This will be populated with log messages while executing
     * @return {Object|Array|String}
     */
    static interpolate(options) {


        let defaultOptions = {
            template: '',
            fileTemplate: '',
            interpolators: [
                // {prefix: '#>', suffix: '<#', type: 'path'},
                // {prefix: '{{', suffix: '}}', type: 'var'},
                // {prefix: '+>', suffix: '<+', type: 'eval'}
                {prefix: '{{', suffix: '}}', type: 'code'}
            ],
            vars: [],
            context: {},
            replaceWithUndefined: true,
            noProcessing: false,
            returnOnlyResult: true,
            asString: false,
            level: -1,
            levels: []
        };

        options = {...defaultOptions, ...options};

        let template = '';
        if ((typeof options.fileTemplate === 'string' || options.fileTemplate instanceof String) && options.fileTemplate.length > 0) {

            try {
                options.fileTemplate = `${__dirname}${options.fileTemplate}`;
                let fileContents = FileSystem.readFileSync(options.fileTemplate, {encoding: 'utf-8'});
                template = fileContents;
            } catch (e) {
                // console.log(e);
                /** @TODO Some logging need to happen here */
            }
        }

        let result;

        if (template === '') {
            template = options.template;
        }

        if (Interpolator.canPassUnchanged(template, options.interpolators)) {
            result = template;
        }

        if (typeof template === 'string') {
            result = Interpolator.stringInterpolate(template, options);
        }

        if (Lodash.isArray(template)) {
            options.level++;
            result = Interpolator.arrayInterpolate(template, options);
        }

        if (Lodash.isObject(template) && Object.prototype.toString.call(template) === '[object Object]') {
            options.level++;
            result = Interpolator.objectInterpolate(template, options);
        }

        if (options.returnOnlyResult === true) {
            return result;
        }
        return {result: result, logs: options.logs};


    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = Interpolator; }
