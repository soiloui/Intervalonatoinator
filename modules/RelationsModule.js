export default function RelationsModule(settings, context, modules) {
  const { hookModule } = modules;
  const { hooks } = hookModule;

  // Store references to the hook callbacks
  const relationsMap = new Map();

  // Synchronize the current index based on the related instance's index
  function indexRelation(instance) {
    context.prevIndex = context.currIndex;
    context.currIndex = instance.context.currIndex;
    hookModule.runHooks(hooks.onIndexChange);
  }

  // Synchronize the current index based on the active DOM element in the related instance
  function domRelation(instance) {
    const currParent = document
      .querySelector(`${instance.settings.dom.selectors.children}.active`)
      .closest(settings.dom.selectors.children);
    if (!currParent) return;
    const currParentIndex = currParent.dataset.index;
    context.prevIndex = context.currIndex;
    context.currIndex = currParentIndex;
    hookModule.runHooks(hooks.onIndexChange);
  }

  // Set a relationship to another instance with the specified type
  function setRelationTo(instance, type) {
    if (!instance) {
      console.warn("setRelationTo: instance is not defined");
      return this;
    }
    if (!type) {
      console.warn("setRelationTo: type is not defined");
      return this;
    }

    // Remove any existing relation before adding a new one
    removeRelationTo(instance);

    // Create and register the appropriate callback based on the relation type
    const callback = createCallback(type, instance);
    if (!callback) return this;

    settings.relations.push({ target: instance, type: type });
    instance.addHook("onIndexChange", callback);
    relationsMap.set(instance, { type: type, callback });

    return this;
  }

  // Create a callback function based on the type of relation
  function createCallback(type, instance) {
    switch (type) {
      case "index":
        return () => indexRelation(instance);
      case "dom":
        return () => domRelation(instance);
      default:
        console.warn(`createCallback: Unknown type '${type}'`);
        return null;
    }
  }

  // Remove an existing relationship with another instance
  function removeRelationTo(instance) {
    const relation = relationsMap.get(instance);
    if (!relation) return this;

    instance.removeHook("onIndexChange", relation.callback);
    settings.relations = settings.relations.filter((rel) => rel.target !== instance);
    relationsMap.delete(instance);

    return this;
  }

  const exposedFunctions = {
    setRelationTo,
    removeRelationTo,
  };

  return { ...exposedFunctions };
}
