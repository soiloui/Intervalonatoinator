import { Observer } from "../utils.js";

export default function DOMModule(settings, context, modules) {
  const { hookModule, iterationModule } = modules;
  const { hooks, runHooks, addHook } = hookModule;
  const { play, pause, next, prev, jumpToIndex } = iterationModule;
  const { dom } = settings;

  // Initializes DOM-related functionality
  function initDOM() {
    adjustContext();
    dom.applyActiveClass && handleActiveClass();
    dom.applyIndexation && applyIndexation();
    dom.selectors.indexNav.length && initIndexNav();
    registerEventListeners();
  }

  // Adjust context for DOM operations
  function adjustContext() {
    const totalChildren = document.querySelectorAll(dom.selectors.children).length;
    context.minIndex = 0;
    context.maxIndex = totalChildren - 1;
  }

  // Cleans up and removes event listeners
  function destroyDOM() {
    removeEventListeners();
  }

  // Handles adding or removing the 'active' class based on the current index
  function handleActiveClass(selector = dom.selectors.children) {
    const elements = document.querySelectorAll(selector);

    // Initialize the active class
    elements[context.currIndex].classList.add("active");

    // Update the active class on index change
    addHook("onIndexChange", () => {
      elements.forEach((element) => element.classList.remove("active"));
      elements[context.currIndex].classList.add("active");
    });
  }

  // Applies data-index attributes to child elements
  function applyIndexation() {
    const children = document.querySelectorAll(dom.selectors.children);
    children.forEach((child, index) => {
      child.dataset.index = index;
    });
  }

  // Adds a selector to the DOM settings
  function addButton(type, selector) {
    updateSelector(type, selector, "add");
    return this;
  }

  // Removes a selector from the DOM settings
  function removeButton(type, selector) {
    updateSelector(type, selector, "remove");
    return this;
  }

  // Updates the selectors list by adding or removing selectors
  function updateSelector(type, selector, action) {
    if (!dom.selectors[type]) {
      console.warn(`No selectors defined for type: ${type}`);
      return;
    }

    if (action === "add") {
      dom.selectors[type].push(selector);
    } else if (action === "remove") {
      dom.selectors[type] = dom.selectors[type].filter((item) => item !== selector);
    } else {
      console.warn(`Unknown action: ${action}`);
    }
  }

  // Activates hover behavior on child elements
  function activateOnItemHover() {
    const itemsSelector = dom.selectors.children;

    if (!context.observers[itemsSelector]) {
      context.observers[itemsSelector] = new Observer(`${itemsSelector}[data-index]`);
    }

    context.observers[itemsSelector].subscribe("hover", (e) => {
      if (e.hover) jumpToIndex(e.node.dataset.index);
    });
  }

  // Activates click behavior on child elements
  function activateOnItemClick() {
    const itemsSelector = dom.selectors.children;

    if (!context.observers[itemsSelector]) {
      context.observers[itemsSelector] = new Observer(`${itemsSelector}[data-index]`);
    }

    context.observers[itemsSelector].subscribe("click", (e) => {
      jumpToIndex(e.node.dataset.index);
    });
  }

  // INDEX NAVIGATION START
  // Initializes the index navigation
  function initIndexNav() {
    dom.selectors.indexNav.forEach((selector) => createIndexNav(selector));
  }

  // Creates the index navigation elements
  function createIndexNav(selector, navItemClassName = "nav-item") {
    if (isNavSelectorPresent(selector)) return this;

    const navContainer = document.querySelector(selector);
    if (!navContainer) {
      console.warn(`No nav container found for selector: ${selector}`);
      return this;
    }

    const fragment = document.createDocumentFragment();
    const children = document.querySelectorAll(dom.selectors.children);
    children.forEach((child, index) => {
      const navItem = document.createElement("div");
      navItem.classList.add(navItemClassName);
      navItem.dataset.index = index;
      fragment.appendChild(navItem);
    });

    navContainer.appendChild(fragment);
    handleActiveClass(`${selector} .${navItemClassName}`);
    settings.dom.selectors.indexNav.push(selector);
  }

  // Removes index navigation elements
  function removeIndexNav(selector) {
    const navContainer = document.querySelector(selector);
    if (!navContainer) {
      console.warn(`No nav container found for selector: ${selector}`);
      return this;
    }
    navContainer.remove();
    settings.dom.selectors.indexNav = settings.dom.selectors.indexNav.filter(
      (s) => s !== selector
    );
  }

  // Activates hover behavior on index navigation
  function indexNavOnHover() {
    if (!dom.selectors.indexNav.length) return;

    if (new Set(dom.selectors.indexNav).size !== dom.selectors.indexNav.length) {
      dom.selectors.indexNav = [...new Set(dom.selectors.indexNav)];
    }

    dom.selectors.indexNav.forEach((selector, index) => {
      const navContainer = document.querySelector(selector);
      if (!navContainer) {
        console.warn(`No nav container found for selector: ${selector}`);
        return this;
      }

      if (!context.observers[`${selector}`]) {
        context.observers[`${selector}`] = new Observer(`${selector} [data-index]`);
      }

      context.observers[`${selector}`].subscribe("hover", (e) => {
        const { hover, node } = e;
        if (!hover) return;
        jumpToIndex(node.dataset.index);
      });
    });
  }

  // Checks if the nav selector is already present to prevent duplication
  function isNavSelectorPresent(selector) {
    const selectorsSet = new Set(dom.selectors.indexNav);
    return (
      selectorsSet.size !== dom.selectors.indexNav.length ||
      document.querySelector(`${selector} [data-index]`)
    );
  }
  // INDEX NAVIGATION END

  // Registers global event listeners
  function registerEventListeners() {
    document.addEventListener("click", clickOnPlayElems);
    document.addEventListener("click", clickOnPauseElems);
    document.addEventListener("click", clickOnPrevElems);
    document.addEventListener("click", clickOnNextElems);
    document.addEventListener("click", clickOnNavElems);
  }

  // Removes global event listeners
  function removeEventListeners() {
    document.removeEventListener("click", clickOnPlayElems);
    document.removeEventListener("click", clickOnPauseElems);
    document.removeEventListener("click", clickOnPrevElems);
    document.removeEventListener("click", clickOnNextElems);
    document.removeEventListener("click", clickOnNavElems);
  }

  // Handles clicks on navigation elements
  function clickOnNavElems(e) {
    if (!dom.selectors.indexNav.length) return;
    const navParent = e.target.closest(dom.selectors.indexNav.join(","));
    if (!navParent) return;
    if (navParent === e.target) return;
    jumpToIndex(e.target.dataset.index);
  }

  // Handles clicks on play elements
  function clickOnPlayElems(e) {
    if (!dom.selectors.play.length) return;
    if (!e.target.matches(dom.selectors.play.join(","))) return;
    play();
  }

  // Handles clicks on pause elements
  function clickOnPauseElems(e) {
    if (!dom.selectors.pause.length) return;
    if (!e.target.matches(dom.selectors.pause.join(","))) return;
    pause();
  }

  // Handles clicks on previous elements
  function clickOnPrevElems(e) {
    if (!dom.selectors.prev.length) return;
    if (!e.target.matches(dom.selectors.prev.join(","))) return;
    prev();
  }

  // Handles clicks on next elements
  function clickOnNextElems(e) {
    if (!dom.selectors.next.length) return;
    if (!e.target.matches(dom.selectors.next.join(","))) return;
    next();
  }

  const exposedFunctions = {
    initDOM,
    destroyDOM,
    addButton,
    removeButton,
    createIndexNav,
    removeIndexNav,
    indexNavOnHover,
    activateOnItemHover,
    activateOnItemClick,
  };

  return { ...exposedFunctions };
}
