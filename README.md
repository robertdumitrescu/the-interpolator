# The interpolator - This library is in the design spec phase. CHeck out later for updates.

#### The only interpolator library you will ever need in node.js world

## Overview
This library was designed to interpolate variables, javascript code, and collection paths inside JSON files and/or Javascript objects.

But with the time and increasing requirements grew into a full fledged interpolation library for any sort of templated string or templated file.

Slowly, it evolved from being a hacky way of replacing a variable inside a string, to a more robust json interpolator and now a fully functional template engine.

## Installation

#### Via NPM
TBC - Coming soon

#### Via Yarn
TBC - Coming soon

## Parameters (Arguments)

#### Summary

- [template](#t-or-template) - what needs to be interpolated
- [fileTemplate](#ft-or-filetemplate) - what needs to be interpolated but from a file **[NICE-TO-HAVE]**
- [asString](#as-or-asstring) - Treat everything as a string and don't try to parse anything
- [data](#dt-or-data) - Variables/Functions and data in general that would be available in the template during interpolation
- [fileData](#fdt-or-filedata) - Variables/Functions and data in general that would be available in the template during interpolation but from file. **[NICE-TO-HAVE]**
- [interpolators](#i-or-interpolators) - If you want to overwrite the interpolators endings
- [replaceWithUndefined](#rwu-or-replacewithundefined) - Behaviour I: Replaces with undefined if the interpolation is not processable
- [replaceWithEmptyString](#rwes-or-replacewithemptystring) - Behaviour II: Replaces with an empty string ('') if the interpolation is not processable
- [noProcessing](#np-or-noprocessing) - Behaviour III: Does not do anything if the interpolation is not processable
- [returnOnlyResult](#ror-or-returnonlyresult) - Returns only the interpolation result
- [silenceLogs](#sl-or-silencelogs) - Silence logging during runtime
- [noLogs](#sl-or-silencelogs) - If this is set to true, the logs array will remain empty - TBC
- [noChanges](#sl-or-silencelogs) - If this is set to true, the changes array will remain empty - TBC
- [filterOut](#sl-or-silencelogs) - An array with strings to be filtered out - TBC
- [levels](#l-or-levels) - On what levels should the interpolations be processed (Only applies to collections)
- [interpolationLevels](#il-or-interpolationlevels) - How many levels from max depth of each interpolation should go up and compute


#### ```t``` or ```template``` 

**Type: {Object|Array|String}**

**Default: '' (empty string)**

Most of the time this would a collection ({Array|Object}) but there are times when this would be called recursively without control and some other types would be passed. For instance if this is called on a string which came from a txt file the whole thing will be interpreted as a string.

##### Observations

- If this is a string
    - And also is a JSON string, then this should be parsed and be treated as a collection
    - if is not a JSON string, is should be just treated as a string

#### ```ft``` or ```fileTemplate``` 

**Type: {String}**

**Default: '' (empty string)**

This is a **[NICE-TO-HAVE]** feature. Is not currently supported but it will be implemented in the future.

This parameter will describe the file location on the machine that is running the code. Both relative and absolute paths are supported.

##### Observations

- If both "template" and "fileTemplate" are specified (not empty strings)
    - The first priority will go to the fileTemplate, and if the file is found, the content of the file will be used
    - If the file which is pointed at does not match any actual files on the machine, then what is specified under "template" parameter will be used

- If it points to a ```.json``` or ```.js``` file
    - If the json string found in ```.json``` file, this will be treated as a collection
    - If the ````.js```` file exports an object, this will be treated as a collection 
    - If none of the above applies, then the content of the files will be treated as strings as a fallback
    
- If it points to any other file extension than ```.json``` or ```.js``` file, the content of the file will be treated as a string

- If this points to an actual file and everything is alright and it can be parsed and is a valid object/collection or string, the contents of the file will be attributed to the template argument by overwriting it (if is already defined)

#### ```as``` or ```asString``` 

**Type: {Boolean}**

**Default: false**

This parameter, if set to true, no matter if a template is parsable or not, exported or not, it will be treated as a string. 

#### ```dt``` or ```data```

**Type: {Object|Array|Object[]}**

**Default: {} (empty object)**

This parameter is used for passing a collection to the template and to be able to access variables and various data inside the template. 

Tip: you can also pass functions in the data which can be called inside the template.

#### ```fdt``` or ```fileData``` 

**Type: {String}**

**Default: '' (empty string)**

This is a **[NICE-TO-HAVE]** feature. Is not currently supported but it will be implemented in the future.

This parameter will describe the file location on the machine that is running the code. Both relative and absolute paths are supported.

##### Observations

- If both "data" and "fileData" are specified (not empty strings)
    - The first priority will go to the fileData, and if the file is found, the content of the file will be used
    - If the file which is pointed at does not match any actual files on the machine, then what is specified under "data" parameter will be used

- If it points to a ```.json``` or ```.js``` file
    - If the json string found in ```.json``` file, this will be treated as a collection
    - If the ````.js```` file exports an object, this will be treated as a collection 
    - If none of the above applies, then the content of the files will be treated as strings as a fallback
    
- If it points to any other file extension than ```.json``` or ```.js``` file, the content of the file will be treated as a string

- If this points to an actual file and everything is alright and it can be parsed and is a valid object/collection or string, the contents of the file will be attributed to the data argument by overwriting it (if is already defined)

Tip: you can also pass functions in the data which can be called inside the template.

#### ```i``` or ```interpolators``` 

**Type: {String|Object[]}**

**Default:**

```javascript
[
    {p: '{{', s: '}}', t: 'print'},
    {p: '+>', s: '<+', t: 'eval'},
    {p: '#>', s: '<#', t: 'compute'}
]
```

This parameter defines the interpolators types and their endings. If you want to use this interpolator in a file which is already managed by another interpolation library or templating engine, you can easily choose another endings that would not conflict the already existing syntax.

Key definitions:

- p - the prefix of the interpolation
- s - the suffix of the interpolation
- t - the type of the interpolation

##### Observations:

If you pass it from the command line (CLI), you probably want to pass it as string. Make sure that the string is a JSON valid string to be parsable inside the code.

#### ```rwu``` or ```replaceWithUndefined``` 

**Type: {String|Boolean}**

**Default: true**

This parameter represents the default behaviour in cases where the print is not found, or the eval is not processable or the compute interpolation is not computable.

Basically if this parameter is set to true, then by default when any interpolations fails, in the place of the interpolation, the library will put the string 'undefined'

Also if any of the alternative behaviours is set to true, it will automatically superseed this one. For example, if 'replaceWithEmptyString' parameter is set to true but also 'replaceWithUndefined' is set to true, then 'replaceWithEmptyString' will superseed 'replaceWithUndefined'.

Note: If you pass this parameter from command line (CLI), you can pass this as strings ('true' and 'false'). This will be automatically converted to boolean inside the code.

Alternative behaviours:
- replaceWithEmptyString
- noProcessing

#### ```rwes``` or ```replaceWithEmptyString``` 

**Type: {String|Boolean}**

**Default: false**

This parameter represents one of the alternative behaviours in cases where the print is not found, or the eval is not processable or the compute interpolation is not computable.

Basically if this parameter is set to true, then when any interpolations fails, the library will put an empty string in its place.

Also if 'noProcessing' parameter is set to true, it will automatically superseed this one. For example, if 'noProcessing' parameter is set to true but also 'replaceWithEmptyString' is set to true, then 'noProcessing' will superseed 'replaceWithEmptyString'.

Note: If you pass this parameter from command line (CLI), you can pass this as strings ('true' and 'false'). This will be automatically converted to boolean inside the code.

Alternative behaviours:
- replaceWithUndefined
- noProcessing

#### ```np``` or ```noProcessing``` 

**Type: {String|Boolean}**

**Default: false**

This parameter represents one of the alternative behaviours in cases where the print is not found, or the eval is not processable or the compute interpolation is not computable.

Basically if this parameter is set to true, then when any interpolations fails, the library will keep that interpolated string in place. Example: If we have the following string with interpolations "Lorem {{var1}} ipsum" and 'var1' is not defined, then after the interpolation, the string will look like: "Lorem {{var1}} ipsum", identical to its initial state.

This behaviour, if is set to true, superseeds any other behaviour which happens to be set to true.

Note: If you pass this parameter from command line (CLI), you can pass this as strings ('true' and 'false'). This will be automatically converted to boolean inside the code.

Alternative behaviours:
- replaceWithUndefined
- replaceWithEmptyString

#### ```ror``` or ```returnOnlyResult``` 

**Type: {String|Boolean}**

**Default: false**

By default, the interpolate function returns an object like the following:

```javascript
{
    result: "Lorem ipsum" // The result of the interpolation
    logs: [ // An array of logs. If the method ran successfully, most often this will be an empty array. This holds both warnings and errors.
        "Something fishy happened"
    ]
}
```

This parameter, if set to true, it will return only the result of the String|Collection interpolation without any logs or errors.

Note: If you pass this parameter from command line (CLI), you can pass this as strings ('true' and 'false'). This will be automatically converted to boolean inside the code.

Note: If you want to be completely oblivious of warnings, errors and logs in general you need to set both "returnOnlyResult" and "silenceLogs" to true or "true"

#### ```sl``` or ```silenceLogs``` 

**Type: {String|Boolean}**

**Default: false**

This parameter, if set to true, it will silence the console logs during runtime. Be aware that the logs will still be pushed in the logs array if 'returnOnlyResult' parameter is set to false.

Note: If you pass this parameter from command line (CLI), you can pass this as strings ('true' and 'false'). This will be automatically converted to boolean inside the code.

Note: If you want to be completely oblivious of warnings, errors and logs in general you need to set both "returnOnlyResult" and "silenceLogs" to true or "true"

#### ```l``` or ```levels```

**Type: {Number[]|String}**

**Default: null (null value)**

**Note: This applies only to collections**

This parameter, if populated, defines to what levels of a collection the interpolation should apply. This is to be able to fine tune where the interpolations should apply. If is not specified (default value: null) will try to interpolate everything. 

Note: Be aware, if you pass an empty array ([]) to this parameter, nothing will happen since it does't need to act on anything.

##### Example:

If you pass it as ```[0, 2]``` it will apply only to the root level of a collection and to level 2 items of the collection.

##### Observations:

If you pass it from the command line (CLI), you probably want to pass it as string. Make sure that the string is a JSON valid string to be parsable inside the code.

#### ```il``` or ```interpolationLevels```

**Type: {Number|String}**

**Default: null (null value)**

As a bit of background, the interpolator works backwards when it tries to compute/print and so on in terms of depth. It will go and find the deepest interpolation, try to interpolate and then go a level up one by one. 

This parameter, if populated, defines how many levels up should it go. If is not specified (default value: null) will try to interpolate everything. 

Note: Be aware, if you pass 0 (0 as number) or "0" (o as string), nothing will happen since it doesn't need to act on anything.

##### Example:

If you pass it as ```2``` and we have the following interpolated string ```Lorem {{var{{var{{var3}}}}}}``` and data looks like: ```{var1: 'ipsum', var2: 1, var3: 2}``` the output will be ```Lorem {{var1}}```

##### Observations:

If you pass it from the command line (CLI), you probably want to pass it as string.

## What it returns?

Based on what parameters you pass it returns either an object with 2 properties like the following:

```javascript
{
    result: '',
    logs: [],
    changes: []
}
```

Where:
- 'result' property is actually the result of interpolation
- 'logs' property is an array of strings which are pushed when something nefarious happens during runtime, either with '[NOTICE]', '[WARNING]' or '[ERROR]' tag
- 'changes' property is an array of objects which describes what changes were made during the interpolation process. This is added for future developments, when you want to incrementally restore the template or to see different stages of the interpolations for debugging.

If you pass "returnOnlyResult" parameter as true, then it will output only the interpolation result without the logs or changes.

## Interpolators

#### Summary

- [Print - ```{{``` and ```}}```](#print----and-) - what needs to be interpolated

#### **Print - ```{{``` and ```}}```**
This interpolation will basically print the values of variables defined in different contexts. 
If this is found inside a loop or an if statement or some block of code, it will first look to print the value of the local variable and then if not found go and try to find it in the global scope. 

#### **Eval - ```+>``` and ```<+```** [MIGHT NOT BE NEEDED]
This will compute whatever is inside and output the result of the computations.

##### Examples
- ```+>1 + 1<+``` Will compute and output ```2```
- ```+>"Hello world!".substring(1, 4)<+``` Will compute and output ```ell```

#### **Compute - ```#>``` and ```<#```** [MIGHT NOT BE NEEDED]
This will compute whatever is inside.

##### Examples
TBC

## Changes objects

This is added for future developments, when you want to incrementally restore the template or to see different stages of the interpolations for debugging. Also is very useful for understanding what happens during interpolations.

Along with the interpolated Collection|String and logs array, you will also receive an "changes" property which will be a populated or empty array based on the "noChanges" parameter value.

The structure of a change object is something like that:

```javascript
{
    op: 'replace',
    bfVal: 'lorem',
    afVal: 'ipsum'
    TBC
}
```

#### Properties description:

- op - operation {String} - This property describes the operation performed on the string. Supported operations: [OBSOLETE]
    - rpc - replace - When this operation is performed both bf(before) and af(after) needs to be populated [OBSOLETE]
    - add - add - When this operation is performed bf will be always an empty string [OBSOLETE]
- idx - index {Number} - Where in the string the operation happened
- pt - path {String} - If this is applied on a collection, the current cursor when the change was applied needs to be copied under this property
- bf - before {String} - The value that was replaced
- af - after {String} - The new value which was put in place of the old value (bf(before))
- od - order {Number} - an auto-incremented id of the changes. This will be used to back-engineer the computed interpolation to the original template
- l  - level {Number} - at what level of nesting the change occured. For instance, the string replace in initialize will have always level 0 since we are modifying the strings or the strings within an object at their first level. On the other hand, for the following case: "lorem {{ip{{dolor}}sum}} sit"m when we want to replace the "{{dolor}}" with the variable value, the level will be 2.


## Usages

#### Simple usage (printing a var inside a string)

```javascript
const Interpolator = require('the-interpolator');

const options = {
    template: 'Lorem {{var1}}',
    data: {
        var1: 'ipsum'
    },
    returnOnlyResult: true
}

let result = Interpolator.interpolate(options);

console.log(result);

// This will print: "Lorem ipsum"
```

#### Simple usage (printing an object var inside a string)

Note: If we try to print an object or an array inside a string, that collection will be stringified in JSON.

```javascript
const Interpolator = require('the-interpolator');

const options = {
    template: 'Lorem {{var1}}',
    data: {
        var1: {bla: 123}
    },
    returnOnlyResult: true
}

let result = Interpolator.interpolate(options);

console.log(result);

// This will print: "Lorem "{"bla":123}""
```

#### Simple usage (printing an object var)

Note: If we try to print an object or an array inside a string but the string has only the interpolation, the collection will be printed or assigned to the result as it is.

```javascript
const Interpolator = require('the-interpolator');

const options = {
    template: '{{var1}}',
    data: {
        var1: {bla: 123}
    },
    returnOnlyResult: true
}

let result = Interpolator.interpolate(options);

console.log(result);

// This will print: {bla: 123}
```

#### Simple usage (if | else-if | else statements)

```javascript
const Interpolator = require('the-interpolator');

const template = `
    {{ if (var1 === 0) { }}
        Variable 1 has the value: 0
    {{ } else if (var1 === 1) { }}
        Variable 1 has the value: 1
    {{ } else { }}
        Variable 1 does not have any known value
    {{ } }}
`

/** Case 1 */
let options = {
    template: template,
    data: {var1: 0},
    returnOnlyResult: true
}

let result = Interpolator.interpolate(options);
console.log(result);
// This will print: "Variable 1 has the value: 0"


/** Case 2 */
options = {
    template: template,
    data: {var1: 1},
    returnOnlyResult: true
}

result = Interpolator.interpolate(options);
console.log(result);
// This will print: "Variable 1 has the value: 1"


/** Default Case*/
options = {
    template: template,
    data: {var1: 2},
    returnOnlyResult: true
}

result = Interpolator.interpolate(options);
console.log(result);
// This will print: "Variable 1 does not have any known value"

```

#### Complex usage (nested for loops | if | if-else | compute interpolations)

Note: If you defined variables inside the template, those will be stored as properties in an "locals" object.

```javascript
const Interpolator = require('the-interpolator');

const template = `
{{ for (let it1 = 0; it1 < x.length; it1++) { }}
    {{ for (let it2 = 0; it2 < x[it1].length; it2++) { }}
    
        Iterator1 value: {{it1}} | Iterator2 value: {{it2}}
        Sum of Iterators: {{ it{{number1}} + it{{number2}} }}
        Value printed once: {{x[it1][it2]}} | Value printed twice: {{x[it1][it2]}}
       {{ if (typeof property === 'string') { }}
        This is a string: {{x[it1][it2]}}
       {{ } else if (isFinite(property)) { }}
        This is a number: {{x[it1][it2]}} and it can be added to itself: {{x[it{{number1}}][it{{number{{x.length}}}}] + x[it{{number1}}][it{{number2}}]}}
       {{ } }}
    {{ } }}
{{ } }}
`

let options = {
    template: template,
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

let result = Interpolator.interpolate(options);
console.log(result);


/* This will print something like: 

Iterator1 value: 0 | Iterator2 value: 0
Sum of Iterators: 0
Value printed once: 3 | Value printed twice: 3
This is a number: 3 and it can be added to itself: 6

Iterator1 value: 0 | Iterator2 value: 1
Sum of Iterators: 1
Value printed once: 4 | Value printed twice: 4
This is a number: 4 and it can be added to itself: 8

Iterator1 value: 1 | Iterator2 value: 0
Sum of Iterators: 1
Value printed once: lorem | Value printed twice: lorem
This is a string: lorem

Iterator1 value: 1 | Iterator2 value: 1
Sum of Iterators: 2
Value printed once: ipsum | Value printed twice: ipsum
This is a string: ipsum
*/
```

#### More examples coming soon.

## About this documentation
Keep in mind that this documentations reflects the current version of the library and the direction towards this will go. 
Certain features with the following tag "[NICE-TO-HAVE]" might be implemented in the future if they get enough support via GitHub issues.

Certain features while developing the library might be obsoleted or deprecated. Those will have the tag "[OBSOLETE]"

## Where did it come from?
Proudly built with sweat and dedication in European Union (E.U) by
- Robert Dumitrescu 
- Ionut Vornicescu