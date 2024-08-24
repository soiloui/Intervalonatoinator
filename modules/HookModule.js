export default function HookModule() {
  // Default priority for hooks
  const defaultPriority = 10;

  // Define the available hooks with their respective names and functions
  const hooks = {
    beforeInit: { name: "beforeInit", functions: [] },
    afterInit: { name: "afterInit", functions: [] },
    beforeDestroy: { name: "beforeDestroy", functions: [] },
    afterDestroy: { name: "afterDestroy", functions: [] },
    onIteration: { name: "onIteration", functions: [] },
    onIndexChange: { name: "onIndexChange", functions: [] },
    onPlay: { name: "onPlay", functions: [] },
    onPause: { name: "onPause", functions: [] },
    onPrev: { name: "onPrev", functions: [] },
    onNext: { name: "onNext", functions: [] },
  };

  // Run all functions associated with a given hook
  function runHooks(hook) {
    if (!hook || !hook.functions) return;
    hook.functions
      .sort((a, b) => b.priority - a.priority) // Sort functions by priority, higher priority first
      .forEach((hookObject) => hookObject.fn());
  }

  // Add a new function to a specific hook
  function addHook(hookName, fn, priority = defaultPriority) {
    if (!hooks[hookName]) {
      console.warn(`Hook ${hookName} does not exist.`);
      return;
    }
    hooks[hookName].functions.push({ fn, priority });
    return this;
  }

  // Remove a specific function from a hook
  function removeHook(hookName, func) {
    if (!hooks[hookName]) {
      console.warn(`Hook ${hookName} does not exist.`);
      return;
    }
    hooks[hookName].functions = hooks[hookName].functions.filter((f) => f !== func);
    return this;
  }

  // Remove all functions from all hooks
  function removeAllHooks() {
    Object.keys(hooks).forEach((key) => {
      hooks[key].functions = [];
    });
    return this;
  }

  const exposedFunctions = {
    runHooks,
    addHook,
    removeHook,
  };

  return { hooks, ...exposedFunctions };
}
