'use strict';


import {InterpolationSymbolsEnum} from '../enums/interpolationSymbols.Enum.js';

/**
 *
 * @classdesc Class that deals with mundane operations that are part of interpolation processing and analyses.
 * @author Robert Dumitrescu (LinkedIn: https://www.linkedin.com/in/robertdumitrescu/) (Github: https://github.com/robertdumitrescu)
 * @class AnalysisService
 */
class AnalysisService {
    /** @typedef {String} InterpolationId - The id of the interpolation. This will be something like L2C3 which basically will mean that the interpolation is at level 2, and is the third (C3 (Count 3)) interpolation found at the level 2 */

    /**
     * @typedef {Object} InterpolationAnalyzerAccumulator
     * @property {String} initial - The initial string passed to the analyzer
     * @property {Number} lastIndex - The last index that was processed
     * @property {Number} curlyBraces - This tells if the curly braces are balanced (if all the opened curly braces are having a closing one associated with them). This is an indication if the string is valid.
     * @property {Number[]} openIndexes - An array with the indexes where the interpolation opening character was found. (E.g "{")
     * @property {Number} interpolationsTic - This indicates the level (depth) of the interpolation within the string. If this is directly into the string this would be 1, if this is within another interpolation it will be a number greater than 1
     * @property {Boolean} ignore - If this is on true, the next character that is relevant will be ignored. @TODO This might need to become a {Number} since we might want to ignore multiple relevant characters in the future for more complex interpolations
     * @property {Object} levels - Object to track down levels and count of interpolations at each level. Useful to generate unique interpolation ids {@link InterpolationId}.
     * */

    /**
     * @typedef {Object} InterpolationAnalysis
     * @property {String} id - The id of the interpolation. This can be used to identify the interpolation when the interpolation process is happening
     * @property {String} level - The level of the interpolation. For example if is the root interpolation, the level will be 1, if the interpolation is nested within another interpolation, the level will be 2
     * @property {String} initial - The interpolation string before standardization
     * @property {String} standardized - The interpolation string after standardization
     * @property {String} partiallyStandardized - This will represent the interpolation but with the dependencies standardized and the rest non-standardized.
     * @property {Number} depOffset - This is the difference between the dependency standardized string {@link InterpolationAnalysis.standardized} length and the dependency initial string {@link InterpolationAnalysis.initial} length. It is used to calculate the offset of the separators of the underlying interpolation (the inferior level one).
     * @property {Number} localLastIndex - Number to track down what was added and what is left within the interpolation.
     * @property {String[]} fragments - The fragments of the interpolation split by the separator
     * @property {String} content - the content of the interpolation. This could be a simple string, or a simple address to some data or variable, an interpolation or a combination of the two
     * @property {String} options - The options of the interpolation
     * @property {Object} processedOptions - The options of the interpolation but processed
     * @property {InterpolationId[]} dependencies - This is an array of the interpolations ids that this particular interpolation is dependant on
     * @property {InterpolationId} dependant - This will represent the interpolation that depends on this interpolation (the inferior level)
     * @property {InterpolationId} rootDependant - This will represent the interpolation that depends on this interpolation (the root level)
     * @property {String[]} separatorsIndexes - This is an collection of indexes that will represent the position of the separators within the partially standardized interpolation string {@link InterpolationAnalysis.partiallyStandardized}
     * @property {String[]} initialIndexes - This is metadata and debugging information. This will indicate the start and the end index of the interpolation within the initial string passed for analysis
     * */
  
    /**
     * @typedef {Object} InterpolationsAnalysis
     * @property {String} initial - The initial string passed for analysis.
     * @property {String} standardized - The string with all the interpolations standardized including the nested ones.
     * @property {String} free - The string without any interpolations.
     * @property {Boolean} hasInterpolations - True if any interpolations are present, false if no interpolations are present.
     * @property {Boolean} isValid - This will be true, if all the curly braces are closed correctly. It will be false otherwise.
     * @property {InterpolationAnalysis[]} interpolations - An array with all the interpolations.
     * @property {InterpolationId[]} interpolationsIds - An array with the ids of the root interpolations.
     * @property {InterpolationId[]} rootInterpolationsIds - An array with the ids of the root interpolations.
     * @property {InterpolationId[]} lastLevelInterpolationsIds - An array with the ids of the last level interpolations.
     * */

    /**
     * @param {String} initial - The initial string
     * @returns {InterpolationAnalyzerAccumulator}
     * @memberof AnalysisService
     */
    static getNewAccumulator (initial) {
        /** @type {InterpolationAnalyzerAccumulator} */
        return {
            initial: initial,
            lastIndex: 0,
            curlyBraces: 0,
            openIndexes: [],
            interpolationsTic: 0,
            ignore: false,
            levels: {},
        }
    }

    /**
     * @param {String} id - The id that was generated during the analysis process
     * @returns {InterpolationAnalysis}
     * @memberof AnalysisService
     */
    static getNewInterpolationAnalysis (id) {
        /** @type {InterpolationAnalysis} */
        return {
            id: id,
            level: 0,
            initial: '',
            standardized: '',
            partiallyStandardized: '',
            depOffset: 0,
            localLastIndex: 0,
            fragments: [],
            content: '',
            options: '',
            processedOptions: {},
            dependencies: [],
            dependant: '',
            rootDependant: '',
            separatorsIndexes: [],
            initialIndexes: [],

        }
    }

    /**
     * @returns {InterpolationsAnalysis}
     * @memberof AnalysisService
     */
    static getNewInterpolationsAnalysis () {
        /** @type {InterpolationsAnalysis} */
        return {
            initial: '',
            standardized: '',
            free: '',
            hasInterpolations: false,
            isValid: true,
            interpolations: {},
            interpolationsIds: [],
            rootInterpolationsIds: [],
            lastLevelInterpolationsIds: [],
        }
    }
    
    /**
     * @description Given an string with interpolations, it will replace the interpolations with the given value without processing the interpolation. This is usually used for cleaning purposes.
     * @author Robert Dumitrescu (LinkedIn: https://www.linkedin.com/in/robertdumitrescu/) (Github: https://github.com/robertdumitrescu)
     * @static
     * @param {String} string - the string that will be analyzed
     * @returns {InterpolationsAnalysis}
     * @memberof AnalysisService
     */
    static analyze(string) {
        let interpolationsAnalysis = AnalysisService.getNewInterpolationsAnalysis();

        /** Handle special cases */
        if (!(typeof string === 'string' || string instanceof String) || !(string.length > 0)) {
            return interpolationsAnalysis;
        } else if (string.indexOf(InterpolationSymbolsEnum.startSingle) === -1) {
            interpolationsAnalysis.initial = string;
            interpolationsAnalysis.standardized = string;
            interpolationsAnalysis.free = string;
            return interpolationsAnalysis;
        } else {
            interpolationsAnalysis.initial = string;
        }

        let firstCurlyBraceIndex;
        let lastCurlyBraceIndex;
        let interpolationId;
        let parentId;
        let currentInterpolation;
        let parentInterpolation;
        let processedFragment;
        let stringAsArray = [...string];
        let lastIndex = stringAsArray.length - 1;

        /** @type {InterpolationsAnalysis} */
        let result = stringAsArray.reduce((acc, c, i) => {
            if (c === InterpolationSymbolsEnum.startSingle) {
                acc.curlyBraces++;
                if (acc.ignore === true) {
                    return acc;
                } else if (stringAsArray[i - 1] === '\\') {
                /** If the previous character is the escaping character (\) then ignore it */
                    return acc;
                } else {
                    if (
                        stringAsArray[i + 1] === InterpolationSymbolsEnum.startSingle && (stringAsArray[i - 1] !== InterpolationSymbolsEnum.startSingle || (stringAsArray[i - 1] === InterpolationSymbolsEnum.startSingle && stringAsArray[i - 2] === InterpolationSymbolsEnum.startSingle))
                    ) {
                        processedFragment = string.substring(acc.lastIndex, i);
                        if (acc.interpolationsTic === 0) {
                            interpolationsAnalysis.free = interpolationsAnalysis.free + processedFragment;
                            interpolationsAnalysis.standardized = interpolationsAnalysis.standardized + processedFragment;
                        }

                        acc.openIndexes.push(i);
                        acc.openIndexes.push(i + 1);
                        acc.interpolationsTic++;
                        if (!acc.levels.hasOwnProperty(acc.interpolationsTic)) {
                            acc.levels[acc.interpolationsTic] = 0;
                        }
                        acc.levels[acc.interpolationsTic]++;
                        interpolationId = `L${acc.interpolationsTic}C${acc.levels[acc.interpolationsTic]}`;
                        interpolationsAnalysis.interpolations[interpolationId] = AnalysisService.getNewInterpolationAnalysis(interpolationId);
                        interpolationsAnalysis.interpolations[interpolationId].initialIndexes[0] = i;

                        acc.lastIndex = i;
                    }
                }
            } else if (c === InterpolationSymbolsEnum.endSingle) {
                acc.curlyBraces--;
                if (acc.ignore === true) {
                    if (acc.interpolationsTic < 1) {
                        processedFragment = string.substring(acc.lastIndex, i);
                        interpolationsAnalysis.free = interpolationsAnalysis.free + processedFragment;
                        interpolationsAnalysis.standardized = interpolationsAnalysis.standardized + processedFragment;
                        acc.lastIndex = i;
                    }
                    acc.ignore = false;
                } else if (acc.interpolationsTic === 0 || stringAsArray[i - 1] === '\\') {
                    /**
                     * If there are no opened interpolations, then ignore it.
                     * Also, if the previous character is the escaping character (\) then ignore it
                     * */
                    processedFragment = string.substring(acc.lastIndex, i + 1);
                    interpolationsAnalysis.free = interpolationsAnalysis.free + processedFragment;
                    interpolationsAnalysis.standardized = interpolationsAnalysis.standardized + processedFragment;
                    acc.lastIndex = i + 1;
                    return acc;
                } else if (stringAsArray[i - 1] !== InterpolationSymbolsEnum.endSingle && stringAsArray[i + 1] !== InterpolationSymbolsEnum.endSingle) {
                    acc.ignore = true;
                    acc.openIndexes.pop();
                    acc.openIndexes.pop();

                    delete interpolationsAnalysis.interpolations[interpolationId];

                    acc.levels[acc.interpolationsTic]--;
                    acc.interpolationsTic--;
                    interpolationId = `L${acc.interpolationsTic}C${acc.levels[acc.interpolationsTic]}`;
                } else {
                    if (acc.interpolationsTic > 0 && stringAsArray[i + 1] === InterpolationSymbolsEnum.endSingle && (stringAsArray[i + 2] !== InterpolationSymbolsEnum.endSingle || (stringAsArray[i + 2] === InterpolationSymbolsEnum.endSingle && stringAsArray[i + 3] === InterpolationSymbolsEnum.endSingle))) {
                        firstCurlyBraceIndex = acc.openIndexes[acc.openIndexes.length - 2];
                        lastCurlyBraceIndex = i + 1;
                        if (
                            stringAsArray[firstCurlyBraceIndex] === InterpolationSymbolsEnum.startSingle &&
                        stringAsArray[firstCurlyBraceIndex + 1] === InterpolationSymbolsEnum.startSingle &&
                        stringAsArray[lastCurlyBraceIndex - 1] === InterpolationSymbolsEnum.endSingle &&
                        stringAsArray[lastCurlyBraceIndex] === InterpolationSymbolsEnum.endSingle) {
                            parentId = `L${acc.interpolationsTic - 1}C${acc.levels[acc.interpolationsTic - 1]}`;

                            /** Here we clearly know that is an interpolation */
                            currentInterpolation = interpolationsAnalysis.interpolations[interpolationId];
                            parentInterpolation = interpolationsAnalysis.interpolations[parentId];

                            /** Populate the interpolation object before performing any more analyses*/
                            currentInterpolation.initial = string.substring(firstCurlyBraceIndex, lastCurlyBraceIndex + 1);
                            currentInterpolation.initialIndexes[1] = lastCurlyBraceIndex + 1;
                            currentInterpolation.level = acc.interpolationsTic;

                            if (currentInterpolation.localLastIndex === 0) {
                                /** If the Local Last Index is still 0, it means it does not have any interpolation */
                                currentInterpolation.partiallyStandardized = currentInterpolation.initial;
                            } else {
                                /** If is different than 0, since now we know that are at the end of the interpolation, we should add to the partially standardized string whatever is remaining from the last local index till the end of the interpolation */
                                currentInterpolation.partiallyStandardized += string.substring(currentInterpolation.localLastIndex, currentInterpolation.initialIndexes[1]);
                            }

                            currentInterpolation.fragments = AnalysisService.splitByIndexes({
                                string: currentInterpolation.partiallyStandardized,
                                indexes: currentInterpolation.separatorsIndexes,
                                startOffset: 2,
                                endOffset: 2,
                            });

                            /** Since we have all the needed components/fragments, we can try to get the standardized interpolation object */
                            currentInterpolation = AnalysisService.standardizeInterpolation(currentInterpolation);

                            /** Add the interpolation to the interpolationsIds array to keep track in an array fashion */
                            interpolationsAnalysis.interpolationsIds.push(currentInterpolation.id);

                            if (acc.interpolationsTic > 1) {
                                currentInterpolation.dependant = parentId;
                                currentInterpolation.rootDependant = `L1C${acc.levels[1]}`;
                            } else if (acc.interpolationsTic === 1) {
                                interpolationsAnalysis.rootInterpolationsIds.push(currentInterpolation.id);
                                interpolationsAnalysis.standardized = interpolationsAnalysis.standardized + currentInterpolation.standardized;
                                acc.lastIndex = i + 2;
                            }

                            if (currentInterpolation.dependencies.length === 0) {
                                /** If there are no dependencies, it means is the last level */
                                interpolationsAnalysis.lastLevelInterpolationsIds.push(currentInterpolation.id);
                            } else if (currentInterpolation.dependencies.length > 0) {
                                /** @TODO this might be a branch that needs completing but if the cases are satisified without it, than it should be deleted */
                            }

                            /** Reset everything */
                            acc.openIndexes.pop();
                            acc.openIndexes.pop();
                            acc.interpolationsTic--;
                            interpolationId = `L${acc.interpolationsTic}C${acc.levels[acc.interpolationsTic]}`;
                            if (acc.interpolationsTic > 0) {
                                /** Solve the dependency graph */
                                parentInterpolation.dependencies.push(currentInterpolation.id);

                                /** Process the partially standardized string for the parent interpolation */
                                if (parentInterpolation.localLastIndex === 0) {
                                    parentInterpolation.localLastIndex = parentInterpolation.initialIndexes[0];
                                }
                                /** First add the contents from the last time thing was added to the partial standardized string then try to add the child standardized interpolation */
                                processedFragment = string.substring(parentInterpolation.localLastIndex, currentInterpolation.initialIndexes[0])
                                parentInterpolation.partiallyStandardized += processedFragment;

                                /** Add the child standardized interpolation */
                                parentInterpolation.depOffset += currentInterpolation.standardized.length - currentInterpolation.initial.length;
                                parentInterpolation.partiallyStandardized += currentInterpolation.standardized;
                                parentInterpolation.localLastIndex = currentInterpolation.initialIndexes[1];
                            }
                        }
                    }
                }
            } else if (c === '|') {
                if (interpolationsAnalysis.interpolations[interpolationId] && Array.isArray(interpolationsAnalysis.interpolations[interpolationId].separatorsIndexes)) {
                    interpolationsAnalysis.interpolations[interpolationId].separatorsIndexes.push((i - interpolationsAnalysis.interpolations[interpolationId].initialIndexes[0]) + interpolationsAnalysis.interpolations[interpolationId].depOffset);
                }
            }

            if (i === lastIndex) {
                interpolationsAnalysis.free = interpolationsAnalysis.free + string.substring(acc.lastIndex, i + 1);
                interpolationsAnalysis.standardized = interpolationsAnalysis.standardized + string.substring(acc.lastIndex, i + 1);
            }

            return acc;
        }, AnalysisService.getNewAccumulator(string))

        interpolationsAnalysis.hasInterpolations = interpolationsAnalysis.interpolationsIds.length > 0;
        interpolationsAnalysis.isValid = result.curlyBraces === 0;
        // console.log(result);
        return interpolationsAnalysis;
    }

    /**
     * @typedef {Object} SplitByIndexesOptions
     * @property {String} string - The string that will be split by indexes
     * @property {Number[]} indexes - The indexes that will indicate where to split
     * @property {Number} startOffset - How many indexes will be ignored from the start. Basically this will tell where the string that needs to be split starts. If this is for instance has the value 2, the start of the string will be considered at index 2.
     * @property {Number} endOffset - How many indexes will be ignored at the end. Basically this will tell where the string that needs to be split ends.
     * */

    /**
     * @description Given a string and an array of indexes, it will split by those indexes without the character at the index and return the remains as an array of strings
     * @param {SplitByIndexesOptions} options - Options that will define how the method will react and split
     * @returns {String[]}
     */
    static splitByIndexes (options) {
        /** Normalize options */
        if (!Number.isInteger(options.startOffset)) {
            options.startOffset = 0;
        }

        if (!Number.isInteger(options.endOffset)) {
            options.endOffset = 0;
        }

        /** Do the splitting */
        if (options.indexes.length === 0) {
            return [options.string.substring(options.startOffset, options.string.length - options.endOffset)];
        } else {
            let result = [];
            let lastIndex = options.startOffset;
            for (let i = 0; i < options.indexes.length; i++) {
                result.push(options.string.substring(lastIndex, options.indexes[i]))
                lastIndex = options.indexes[i] + 1;
                if (i === (options.indexes.length - 1)) {
                    result.push(options.string.substring(lastIndex, options.string.length - options.endOffset))
                }
            }
            return result;
        }
    }

    /**
     * @description Given an string which is an interpolation, it will return an analysis of the interpolation, alongside the standardized version of the interpolation.
     *
     * @static
     * @param {InterpolationAnalysis} interpolationAnalysis - The interpolation to be standardized
     * @returns {InterpolationAnalysis}
     * @memberof AnalysisService
     */
    static standardizeInterpolation(interpolationAnalysis) {
        let standardizedOptions = '{}';
        if (interpolationAnalysis.fragments.length === 1) {
            /** This is by far the most common case */
            interpolationAnalysis.content = interpolationAnalysis.fragments[0];
            interpolationAnalysis.options = '';
        } else if (interpolationAnalysis.fragments.length === 2) {
            /** This is the second most common case */
            interpolationAnalysis.content = interpolationAnalysis.fragments[0];
            interpolationAnalysis.options = interpolationAnalysis.fragments[1];
        } else if (interpolationAnalysis.fragments.length === 3) {
            /** This is the least common case, but it might occur */
            interpolationAnalysis.content = interpolationAnalysis.fragments[1];
            interpolationAnalysis.options = interpolationAnalysis.fragments[2];
        } else if (interpolationAnalysis.fragments.length === 0) {
            /** While this case is possible is very unlikely to happen but we need to cater for it */
            /** @TODO */
        } else if (interpolationAnalysis.fragments.length > 3) {
            /** While this case is possible is very unlikely to happen but we need to cater for it */
            /** @TODO */
        }

        if (interpolationAnalysis.options.indexOf(':') > -1) {
            /** This is not bullet proof and might error out in some scenarios @TODO */
            if (interpolationAnalysis.options.startsWith('{') && interpolationAnalysis.options.endsWith('}')) {
                standardizedOptions = interpolationAnalysis.options;
            } else {
                standardizedOptions = `{${interpolationAnalysis.options}}`;
            }
        }
        

        interpolationAnalysis.standardized = `${InterpolationSymbolsEnum.start}${interpolationAnalysis.id}${InterpolationSymbolsEnum.separator}${interpolationAnalysis.content}${InterpolationSymbolsEnum.separator}${standardizedOptions}${InterpolationSymbolsEnum.separator}${interpolationAnalysis.id}${InterpolationSymbolsEnum.end}`;

        return interpolationAnalysis;
    }
}

export {AnalysisService};