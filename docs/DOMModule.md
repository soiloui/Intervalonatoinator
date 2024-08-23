# DOMModule API Documentation

## Overview

The `DOMModule` is responsible for handling various DOM-related functionalities. It allows you to manage and manipulate DOM elements, handle active classes, index navigation, and more.

## Functions

### `initDOM()`

**Description:**
Initializes the DOM-related functionalities based on the provided settings.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
import DOMModule from './modules/DOMModule';

const dom = DOMModule(settings, context, modules);
dom.initDOM();
```

### `destroyDOM()`

**Description:**
Cleans up any DOM-related functionalities and event listeners.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.destroyDOM();
```

### `addButton(type, selector)`

**Description:**
Adds a button to the specified type.

**Parameters:**
- `type` (String): The type of button to add (e.g., 'play', 'pause').
- `selector` (String): The CSS selector for the button.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.addButton('play', '.play-button');
```

### `removeButton(type, selector)`

**Description:**
Removes a button from the specified type.

**Parameters:**
- `type` (String): The type of button to remove (e.g., 'play', 'pause').
- `selector` (String): The CSS selector for the button.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.removeButton('play', '.play-button');
```

### `createIndexNav(selector, navItemClassName)`

**Description:**
Creates index navigation items within the specified container.

**Parameters:**
- `selector` (String): The CSS selector for the navigation container.
- `navItemClassName` (String, optional): The class name for navigation items. Defaults to `"nav-item"`.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.createIndexNav('.index-nav');
```

### `removeIndexNav(selector)`

**Description:**
Removes the index navigation from the specified container.

**Parameters:**
- `selector` (String): The CSS selector for the navigation container.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.removeIndexNav('.index-nav');
```

### `indexNavOnHover()`

**Description:**
Sets up hover functionality for index navigation items.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.indexNavOnHover();
```

### `activateOnItemHover()`

**Description:**
Activates an item when hovered over.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.activateOnItemHover();
```

### `activateOnItemClick()`

**Description:**
Activates an item when clicked.

**Returns:**
- `this` for method chaining.

**Usage Example:**
```javascript
dom.activateOnItemClick();
```

## Example Usage

Here's a comprehensive example demonstrating the usage of various `DOMModule` functions:

```javascript
import DOMModule from './modules/DOMModule';

const dom = DOMModule(settings, context, modules);

dom.initDOM()
  .createIndexNav('.index-nav')
  .activateOnItemClick()
  .indexNavOnHover();
```

This example initializes the DOM, creates index navigation, sets up item click activation, and adds hover functionality.

## Notes

- Ensure that the `settings` and `context` objects are correctly configured before initializing the `DOMModule`.
- The module assumes that appropriate CSS selectors are defined in the settings for various elements and buttons.

For more information, refer to the core project documentation.

