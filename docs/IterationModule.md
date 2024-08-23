## API Reference

### IterationModule

**Functions:**

- `play()`

  - Starts the interval-based iteration.
  - **Returns:** `this` for chaining.

- `pause()`

  - Pauses the interval-based iteration.
  - **Returns:** `this` for chaining.

- `next()`

  - Moves to the next item in the sequence.
  - **Returns:** `this` for chaining.

- `prev()`

  - Moves to the previous item in the sequence.
  - **Returns:** `this` for chaining.

- `jumpToIndex(index)`

  - Jumps to the specified index.
  - **Parameters:**
    - `index` (Number): The index to jump to.
  - **Returns:** `this` for chaining.

- `updateIntervalTime(newIntervalTime)`

  - Updates the interval time for automatic iteration.
  - **Parameters:**
    - `newIntervalTime` (Number): The new interval time in milliseconds.
  - **Returns:** `this` for chaining.

- `removeInterval()`
  - Removes the current interval.
  - **Returns:** `this` for chaining.

**Usage Example:**

```javascript
import IterationModule from "./modules/IterationModule";

const iteration = IterationModule(settings, context, modules);
iteration
  .play()
  .next()
  .jumpToIndex(2);
```
