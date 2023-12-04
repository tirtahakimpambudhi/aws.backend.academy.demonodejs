// event.js
import { EventEmitter } from 'node:events';

/** @type {EventEmitter} Private event emitter instance */
const _emitter = new EventEmitter();

/**
 * Get all registered event names
 * @returns {Array<string|symbol>} Array of event names currently registered
 * @example
 * const events = getNameEvents();
 * console.log('Registered events:', events);
 */
const getNameEvents = () => {
  return _emitter.eventNames();
};

/**
 * Remove all event listeners
 * @returns {void}
 * @example
 * clearEvents();
 * console.log('All events cleared');
 */
const clearEvents = () => {
  _emitter.removeAllListeners();
};

/**
 * Register an event handler
 * @param {string} nameEvent - The name of the event to handle
 * @param {Function} [callback=() => {}] - The callback function to execute when event is emitted
 * @returns {void}
 * @throws {Error} If there's an error registering the event handler
 * @example
 * handleEvent('userLoggedIn', (user) => {
 *   console.log(`User ${user.name} logged in`);
 * });
 */
const handleEvent = (nameEvent, callback = () => {}) => {
  try {
    _emitter.on(nameEvent, callback);
  } catch (error) {
    console.error(`Error handle event : ${error.message}`);
  }
};

/**
 * Emit an event with optional arguments
 * @param {string} nameEvent - The name of the event to emit
 * @param {...*} args - Arguments to pass to the event handlers
 * @returns {void}
 * @throws {Error} If there's an error emitting the event
 * @example
 * sendEvent('userLoggedIn', { name: 'John', id: 123 });
 */
const sendEvent = (nameEvent, ...args) => {
  try {
    _emitter.emit(nameEvent, ...args);
  } catch (error) {
    console.error(`Error handle event : ${error.message}`);
  }
};

export { handleEvent, sendEvent, getNameEvents, clearEvents };
