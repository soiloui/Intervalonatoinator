export default function ChainingModule() {
  // Initialize the queue to manage the chaining of methods
  const chainQueue = {
    list: [], // Holds the tasks to be executed
    isRunning: false, // Indicates if the queue is currently being processed
  };

  // Execute an individual task from the queue
  async function executeTask(task) {
    return task.fn.apply(this, task.args); // Call the function with the provided arguments
  }

  // Process the queue, executing tasks one by one
  async function executeQueue() {
    if (chainQueue.isRunning) return; // Prevent multiple queue executions simultaneously
    chainQueue.isRunning = true;

    // Continue processing until the queue is empty
    while (chainQueue.list.length) {
      const task = chainQueue.list.shift(); // Remove the first task in the queue
      await executeTask.call(this, task); // Execute the task
    }

    // Mark the queue as not running when finished
    chainQueue.isRunning = false;
  }

  // Wrap functions to enable method chaining
  function chainMethodWrapper(fn, fnName) {
    return function (...args) {
      // Immediately execute critical functions to avoid delays
      if (
        fnName === "init" ||
        fnName === "addHook" ||
        fnName === "removeHook" ||
        fnName === "setRelationTo" ||
        fnName === "removeRelationTo"
      ) {
        fn.apply(this, args); // Execute the function immediately
        return this; // Return the context to enable chaining
      }

      // For non-critical functions, add to the queue and execute in order
      chainQueue.list.push({ fn, fnName, args });
      executeQueue.call(this); // Start processing the queue
      return this; // Return the context to enable chaining
    };
  }

  // Wrap all provided functions for chaining behavior
  function chainWrapFunctions(functions) {
    Object.keys(functions).forEach((key) => {
      functions[key] = chainMethodWrapper(functions[key], key);
    });
  }

  return { chainQueue, chainWrapFunctions };
}
