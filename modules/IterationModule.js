export default function IterationModule(settings, context, modules) {
  const { hookModule } = modules;
  const { hooks } = hookModule;

  // Ensure the interval resets whenever the index changes
  resetIntervalOnIndexChange();

  // Jump to a specific index and trigger the necessary hooks
  function jumpToIndex(index) {
    context.prevIndex = context.currIndex;
    context.currIndex = index;
    hookModule.runHooks(hooks.onIndexChange);
    return this;
  }

  // Move to the next index, looping back to the start if necessary
  function next() {
    context.prevIndex = context.currIndex;
    context.currIndex++;
    if (context.currIndex > context.maxIndex) {
      context.currIndex = context.minIndex;
    }
    hookModule.runHooks(hooks.onIndexChange);
    return this;
  }

  // Move to the previous index, looping back to the end if necessary
  function prev() {
    context.prevIndex = context.currIndex;
    context.currIndex--;
    if (context.currIndex < context.minIndex) {
      context.currIndex = context.maxIndex;
    }
    hookModule.runHooks(hooks.onIndexChange);
    return this;
  }

  // Start the iteration process and trigger the play hook
  function play() {
    runInterval();
    context.isPlaying = true;
    hookModule.runHooks(hooks.onPlay);
    return this;
  }

  // Pause the iteration process and trigger the pause hook
  function pause() {
    removeInterval();
    context.isPlaying = false;
    hookModule.runHooks(hooks.onPause);
    return this;
  }

  // Clear the existing interval to stop the iteration process
  function removeInterval() {
    clearInterval(context.interval);
  }

  // Start the interval that triggers the iteration process
  function runInterval() {
    removeInterval(); // Ensure no duplicate intervals are running
    context.interval = setInterval(() => {
      hookModule.runHooks(hooks.onIteration);
    }, settings.intervalTime);
  }

  // Update the interval time and restart the interval
  function updateIntervalTime(newIntervalTime) {
    settings.intervalTime = newIntervalTime;
    runInterval();
    return this;
  }

  // Reset the interval whenever the index changes, if currently playing
  function resetIntervalOnIndexChange() {
    hookModule.addHook("onIndexChange", () => {
      if (!context.isPlaying) return;
      runInterval();
    });
  }

  const exposedFunctions = {
    play,
    pause,
    next,
    prev,
    jumpToIndex,
    updateIntervalTime,
    removeInterval,
  };

  return { ...exposedFunctions };
}
