# The interpolator - This library is in the design spec phase. CHeck out later for updates.

#### The only interpolator library you will ever need in node.js world

## Overview
This library was designed to interpolate variables, javascript code, and collection paths inside JSON files and/or Javascript objects.

But with the time and increasing requirements grew into a full fledged interpolation library for any sort of templated string or templated file.

Slowly, it evolved from being a hacky way of replacing a variable inside a string, to a more robust json interpolator and now a fully functional template engine.

The engine is split into 2 components. One which is the Interpolation Analyzer and one that offers operations with interpolations, one of them being the ```interpolate``` method.

## Installation

#### Via NPM
TBC - Coming soon

#### Via Yarn
TBC - Coming soon

## Analysis

### Parameters (Arguments)

### Examples

## Interpolation

### Parameters (Arguments)

### Examples

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


## Usages and examples

### More examples coming soon.

## About this documentation
Keep in mind that this documentations reflects the current version of the library and the direction towards this will go. 
Certain features with the following tag "[NICE-TO-HAVE]" might be implemented in the future if they get enough support via GitHub issues.

Certain features while developing the library might be obsoleted or deprecated. Those will have the tag "[OBSOLETE]"

## Where did it come from?
Proudly built with sweat and dedication in European Union (E.U) by
- Robert Dumitrescu 
- Ionut Vornicescu