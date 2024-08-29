# Intervalonatoinator

## Overview

**Intervalonatoinator** is a powerful JavaScript framework designed for creating interactive and dynamic content modules with ease. It provides a robust set of features for managing intervals, DOM interactions, and module relations. Built with a modular architecture, it offers flexibility and extensibility for various use cases, including data visualization, interactive dashboards, and custom UI components.

## Features

- **Interval Management:** Automatically play, pause, and iterate through content with customizable intervals.
- **DOM Interactions:** Easily manage DOM elements, add or remove buttons, and create interactive index navigation.
- **Hook System:** Register and run hooks for custom functionality during different lifecycle events.
- **Module Relations:** Establish and manage relationships between different instances for synchronized interactions.
- **Chaining:** Supports method chaining for fluent API usage.

## Installation

To get started with Intervalonatoinator, clone the repository and include the necessary modules in your project.

```bash
git clone https://github.com/your-username/intervalonatoinator.git
cd intervalonatoinator
```

## Usage

### Basic Setup

1. **Initialize the Framework**

   Create a new instance of the `Intervalonatoinator` with your custom settings.

   ```javascript
   import Intervalonatoinator from "./path/to/Intervalonatoinator";

   const settings = {
     intervalTime: 1000,
     autoplay: true,
     dom: {
       enabled: true,
       applyActiveClass: true,
       applyIndexation: true,
       selectors: {
         children: ".item",
         play: [".play-button"],
         pause: [".pause-button"],
         next: [".next-button"],
         prev: [".prev-button"],
         indexNav: [".index-nav"],
       },
     },
     relations: [],
   };

   const intervalonatoinator = Intervalonatoinator(settings);
   intervalonatoinator.init();
   ```

2. **Control Playback**

   Use the available methods to control the playback and navigation.

   ```javascript
   intervalonatoinator.play(); // Start automatic updates
   intervalonatoinator.pause(); // Pause automatic updates
   intervalonatoinator.next(); // Move to the next item
   intervalonatoinator.prev(); // Move to the previous item
   intervalonatoinator.jumpToIndex(3); // Jump to the item with index 3
   ```

3. **Add and Remove Buttons**

   Dynamically manage buttons and index navigation.

   ```javascript
   intervalonatoinator.addButton("play", ".new-play-button");
   intervalonatoinator.removeButton("pause", ".old-pause-button");
   ```

4. **Create and Remove Index Navigation**

   Manage index navigation dynamically.

   ```javascript
   intervalonatoinator.createIndexNav(".nav-container");
   intervalonatoinator.removeIndexNav(".nav-container");
   ```

5. **Hooks and Relations**

   Add hooks for custom actions and manage module relations.

   ```javascript
   intervalonatoinator.addHook("onPlay", () => console.log("Playback started"));
   intervalonatoinator.setRelationTo(anotherInstance, "index");
   ```

## Modules

### `IterationModule`

Handles interval-based iteration and navigation.

### `DOMModule`

Manages DOM elements, including buttons and index navigation.

### `HookModule`

Provides a flexible hook system for executing custom functions during various events.

### `RelationsModule`

Allows setting up and managing relations between different instances for synchronized behavior.

### `ChainingModule`

Enables method chaining for a more fluent and expressive API.

## API Reference

Refer to the following modules for detailed API documentation:

- [IterationModule](./docs/IterationModule.md)
- [DOMModule](./docs/DOMModule.md)
- [HookModule](./docs/HookModule.md)
- [RelationsModule](./docs/RelationsModule.md)
- [ChainingModule](./docs/ChainingModule.md)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, please contact [mieczyslaw.palian@gmail.com](mailto:mieczyslaw.palian@gmail.com).
