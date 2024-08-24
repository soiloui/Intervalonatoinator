# ChainingModule API Documentation

## Overview

The `ChainingModule` is designed to provide chaining functionality for method calls, enabling you to queue up asynchronous tasks and execute them in sequence. It wraps functions to allow method chaining and ensure tasks are executed in the order they are queued.

## Functions

### `chainMethodWrapper(fn, fnName)`

**Description:**
Wraps a function to enable method chaining and queue execution. Critical functions are executed immediately, while other functions are queued for sequential execution.

**Parameters:**

- `fn` (Function): The function to be wrapped.
- `fnName` (String): The name of the function being wrapped.

**Returns:**

- `Function`: The wrapped function that supports chaining.

**Usage Example:**

```javascript
const wrappedFunction = chainMethodWrapper(someFunction, "someFunctionName");
wrappedFunction(arg1, arg2);
```

### `chainWrapFunctions(functions)`

**Description:**
Wraps all functions in the provided object to enable method chaining and queue execution.

**Parameters:**

- `functions` (Object): An object where keys are function names and values are the functions to be wrapped.

**Returns:**

- `void`

**Usage Example:**

```javascript
const myFunctions = {
  functionA: () => {
    /* implementation */
  },
  functionB: () => {
    /* implementation */
  },
};

chainWrapFunctions(myFunctions);
```

### `executeTask(task)`

**Description:**
Executes a single task from the queue. This function is used internally to handle task execution.

**Parameters:**

- `task` (Object): The task object containing the function and its arguments.

**Returns:**

- `Promise`: A promise that resolves when the task is completed.

**Usage Example:**

```javascript
const task = { fn: someFunction, args: [arg1, arg2] };
executeTask(task).then(() => {
  /* handle completion */
});
```

### `executeQueue()`

**Description:**
Processes the queue of tasks and executes them sequentially. This function ensures that tasks are executed in the order they are added.

**Returns:**

- `void`

**Usage Example:**

```javascript
executeQueue();
```

## Example Usage

Here’s an example demonstrating how to use the `ChainingModule` to queue and execute tasks:

```javascript
import ChainingModule from "./modules/ChainingModule";

const chaining = ChainingModule();

// Define some functions to be chained
const someFunction = (param) => {
  console.log("Function executed with:", param);
};

// Wrap functions for chaining
const wrappedFunctions = {
  someFunction,
};

chaining.chainWrapFunctions(wrappedFunctions);

// Execute functions in sequence
wrappedFunctions
  .someFunction("First call")
  .someFunction("Second call")
  .someFunction("Third call");
```

In this example, `someFunction` is wrapped to support chaining. Each call to `someFunction` returns the `ChainingModule` instance, allowing further calls to be chained.

## Notes

- Ensure that the functions being wrapped do not have side effects that might interfere with chaining or queue execution.
- Critical functions such as `init`, `addHook`, `removeHook`, `setRelationTo`, and `removeRelationTo` are executed immediately and are not queued.

For more details, refer to the core project documentation and other module documentation for integration details.
