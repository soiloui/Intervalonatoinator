import DOMModule from "./modules/DOMModule.js";
import IterationModule from "./modules/IterationModule.js";
import HookModule from "./modules/HookModule.js";
import ChainingModule from "./modules/ChainingModule.js";
import RelationsModule from "./modules/RelationsModule.js";
import { deepMerge, randomID } from "./utils.js";

export default function Intervalonatoinator(userSettings = {}) {
  const defaultSettings = {
    intervalTime: 1200,
    autoplay: false,
    range: {
      enabled: false,
      from: 0,
      to: 10,
    },
    dom: {
      enabled: true,
      applyActiveClass: true,
      applyIndexation: true,
      selectors: {
        children: "",
        play: [],
        pause: [],
        next: [],
        prev: [],
        indexNav: [],
      },
    },
    relations: [],
  };

  // Merge user settings with the default settings
  const settings = deepMerge(defaultSettings, userSettings);

  // Context object to manage the state of the instance
  const context = {
    observers: {},
    interval: null,
    minIndex: settings.range.from,
    maxIndex: settings.range.to,
    currIndex: settings.range.from,
    prevIndex: settings.range.from,
    isPlaying: false,
    isPauseForce: false,
    lastDirection: "",
  };

  // Initialize all the necessary modules
  const hookModule = HookModule();
  const iterationModule = IterationModule(settings, context, { hookModule });
  const domModule = DOMModule(settings, context, { hookModule, iterationModule });
  const relationsModule = RelationsModule(settings, context, {
    hookModule,
    iterationModule,
  });
  const chainingModule = ChainingModule();

  const { hooks } = hookModule;

  // Initializes the main functionality
  function init() {
    hookModule.runHooks(hooks.beforeInit);
    coreFunctionality();
    settings.autoplay && iterationModule.play();
    settings.dom.enabled && domModule.initDOM();
    hookModule.runHooks(hooks.afterInit);
    return this;
  }

  // Cleans up and destroys the instance
  function destroy() {
    hookModule.runHooks(hooks.beforeDestroy);
    iterationModule.removeInterval();
    domModule.destroyDOM();
    hookModule.runHooks(hooks.afterDestroy);
  }

  function coreFunctionality() {
    incrementIndexOnIteration();
    handleLastDirection();
  }

  // Handles updating last direction
  function handleLastDirection() {
    hookModule.addHook("onIndexChange", () => {
      const { prevIndex, currIndex, minIndex, maxIndex } = context;
      const isBigger = currIndex > prevIndex;
      const isOnEdgeEnd = currIndex === maxIndex && prevIndex === minIndex;
      const isOnEdgeStart = currIndex === minIndex && prevIndex === maxIndex;

      if ((isBigger && !isOnEdgeEnd) || isOnEdgeStart) {
        context.lastDirection = "next";
      } else {
        context.lastDirection = "prev";
      }
    });
  }

  // Handles index incrementation on each iteration
  function incrementIndexOnIteration() {
    hookModule.addHook("onIteration", () => {
      context.prevIndex = context.currIndex;
      context.currIndex++;
      if (context.currIndex > context.maxIndex) {
        context.currIndex = context.minIndex;
      }
      hookModule.runHooks(hooks.onIndexChange);
    });
    return this;
  }

  // Utility function to create a delay
  function wait(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const exposedFunctions = {
    // Core
    init,
    destroy,
    wait,

    // Iteration Module
    play: iterationModule.play,
    pause: iterationModule.pause,
    pauseForce: iterationModule.pauseForce,
    pauseForceOff: iterationModule.pauseForceOff,
    next: iterationModule.next,
    prev: iterationModule.prev,
    jumpToIndex: iterationModule.jumpToIndex,
    updateIntervalTime: iterationModule.updateIntervalTime,

    // DOM Module
    addButton: domModule.addButton,
    removeButton: domModule.removeButton,
    createIndexNav: domModule.createIndexNav,
    removeIndexNav: domModule.removeIndexNav,
    indexNavOnHover: domModule.indexNavOnHover,
    activateOnItemHover: domModule.activateOnItemHover,
    activateOnItemClick: domModule.activateOnItemClick,
    pauseOnHover: domModule.pauseOnHover,
    pauseOnHoverOut: domModule.pauseOnHoverOut,
    playOnHover: domModule.playOnHover,
    playOnHoverOut: domModule.playOnHoverOut,

    // Hook Module
    addHook: hookModule.addHook,
    removeHook: hookModule.removeHook,

    // Relations Module
    setRelationTo: relationsModule.setRelationTo,
    removeRelationTo: relationsModule.removeRelationTo,
  };

  // Wrap functions to support chaining
  chainingModule.chainWrapFunctions(exposedFunctions);

  // Return the instance with additional properties
  return {
    id: randomID(),
    ...exposedFunctions,
    settings,
    hooks,
    context,
  };
}
