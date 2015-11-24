/**
 * Based on Dancer.js (https://github.com/jsantell/dancer.js).
 *
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
export default class Adapter {
  /**
   * Initialize an audio adapter.
   *
   * @constructor
   */
  constructor() {
    this.loaded = false;
    this.progress = 0;
    this.events = {};
  }

  /**
   * Start playing the audio.
   */
  play() {
    if (this.playing || !this.audio) {
      return;
    }

    this.playing = true;
    this.trigger('play');
    this.audio.play();
  }

  /**
   * Pause the audio.
   */
  pause() {
    if (!this.playing || !this.audio) {
      return;
    }

    this.playing = false;
    this.trigger('pause');
    this.audio.pause();
  }

  /**
   * Trigger an update of the audio.
   */
  update() {
    this.trigger('update');
  }

  /**
   * Bind a callback to an event of the audio.
   *
   * @param {String}    event     The name of the event to bind to.
   * @param {Function}  callback  The callback to bind.
   */
  bind(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);

    return this;
  }

  /**
   * Unbind an event bound to the specified name.
   *
   * @param {String} event The name of the event to unbind.
   */
  unbind(event) {
    if (this.events[event]) {
      Reflect.deleteProperty(this.events[event]);
    }

    return this;
  }

  /**
   * The the specified event.
   *
   * @param {String} event The event to trigger.
   */
  trigger(event) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback());
    }

    return this;
  }
}
