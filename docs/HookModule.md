# HookModule API Documentation

## Overview

The `HookModule` provides a mechanism for adding, removing, and executing hooks (callbacks) at various points in the application lifecycle. Hooks enable you to run custom code in response to specific events or actions. The module allows you to manage these hooks efficiently, including setting priorities for the order of execution.

## Hooks

The `HookModule` defines several hooks that can be used to execute functions at different stages of the application:

- `beforeInit`
- `afterInit`
- `beforeDestroy`
- `afterDestroy`
- `onIteration`
- `onIndexChange`
- `onPlay`
- `onPause`
- `onPrev`
- `onNext`

Each hook has a name and a list of functions that are executed when the hook is triggered.

## Functions

### `runHooks(hook)`

**Description:**
Executes all functions registered for the specified hook. The functions are executed in the order of their priority, with higher priority functions being executed first.

**Parameters:**

- `hook` (Object): The hook object containing the list of functions to be executed. This object should include a `functions` property, which is an array of objects containing the function (`fn`) and its `priority`.

**Returns:**

- `void`

**Usage Example:**

```javascript
const hook = {
  functions: [
    { fn: () => console.log("High priority function"), priority: 20 },
    { fn: () => console.log("Low priority function"), priority: 10 },
  ],
};
runHooks(hook);
// Output:
// High priority function
// Low priority function
```

### `addHook(hookName, fn, priority = 10)`

**Description:**
Adds a function to the specified hook. The function will be executed when the hook is triggered. You can also specify a priority for the function to determine the order in which it is executed relative to other functions in the same hook.

**Parameters:**

- `hookName` (String): The name of the hook to which the function should be added. This must match one of the predefined hook names.
- `fn` (Function): The function to be added to the hook.
- `priority` (Number, optional): The priority of the function. Functions with higher priority are executed first. Default is `10`.

**Returns:**

- `this` (Object): The `HookModule` instance, enabling method chaining.

**Usage Example:**

```javascript
addHook("onPlay", () => console.log("Play hook triggered"), 15);
```

### `removeHook(hookName, func)`

**Description:**
Removes a function from the specified hook. The function will no longer be executed when the hook is triggered.

**Parameters:**

- `hookName` (String): The name of the hook from which the function should be removed.
- `func` (Function): The function to be removed from the hook.

**Returns:**

- `this` (Object): The `HookModule` instance, enabling method chaining.

**Usage Example:**

```javascript
const myFunction = () => console.log("Play hook triggered");
addHook("onPlay", myFunction);
removeHook("onPlay", myFunction);
```

### `removeAllHooks()`

**Description:**
Removes all functions from all hooks, effectively clearing all registered hooks.

**Returns:**

- `this` (Object): The `HookModule` instance, enabling method chaining.

**Usage Example:**

```javascript
removeAllHooks();
```

## Example Usage

Here’s an example demonstrating how to use the `HookModule` to add and run hooks:

```javascript
import HookModule from "./modules/HookModule";

const hookModule = HookModule();

// Define a hook function
const onInitFunction = () => {
  console.log("Initialization complete");
};

// Add the function to the `beforeInit` hook
hookModule.addHook("beforeInit", onInitFunction);

// Run the `beforeInit` hook to execute the function
hookModule.runHooks(hookModule.hooks.beforeInit);

// Remove the function from the `beforeInit` hook
hookModule.removeHook("beforeInit", onInitFunction);
```

In this example, a function is added to the `beforeInit` hook, executed when the hook is run, and then removed from the hook.

## Notes

- Ensure that the function names and hook names are correct when adding or removing hooks.
- Hooks are executed in the order of their priority. If no priority is specified, the default priority of `10` is used.
- The `removeAllHooks` function can be used to clear all hooks, which is useful for resetting the state during testing or when reinitializing the module.

For more details, refer to the core project documentation and other module documentation for integration details.
