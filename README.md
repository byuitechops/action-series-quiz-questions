# Action Series Quiz Questions
### *Package Name*: action-series-quiz-questions
### *Child Type*: Post Import
### *Platform*: Online 
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

This module abstracts the pattern used by the action-series model.

The action-series model takes a single object returned by a GET request and puts it through a series of submodules, each containing a condition and an action. If the condition passes, the action is committed on the object, and then passed on. If the condition fails, the action is not ran and the object is passed on to the next submodule. When all of the submodules have completed, the object is then converted into a PUT object, and then sent to Canvas to implement the new changes to the object. This model prevents the need for additional API calls, prevents many module coordination issues, and speeds up the conversion process.

## How to Install

```
npm install action-series-quiz-questions
```

## Run Requirements

None

## Options

None

## Outputs

None

## Process

This module uses the quiz questions "template" and runs an asynchronous forEach on each quiz question. The template provides methods and data used to complete the action-series model.

## Log Categories

Please review the documentation for each file found in the "actions" directory.

## Requirements

Please review the documentation for each file found in the "actions" directory.
