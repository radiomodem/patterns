import Flash from "streamer/adapter/flash"
import WebAudio from "streamer/adapter/web-audio"

/**
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
class Stream {
  /**
   * Detect support for different APIs and return the appropriate audio
   * adapter.
   *
   * This enables easy access to the different adapters:
   *
   *   new Streamer.Adapter(source)
   *
   * @return {Adapter} The Adapter constructor for the supported API.
   */
  static get Adapter () {
    if (window.AudioContext) {
      return WebAudio
    }
    else {
      return Flash
    }
  }

  /**
   * Initialize a stream.
   *
   * @param {Object} source The <audio> source element.
   * @constructor
   */
  constructor (source) {
    this.audio = new Stream.Adapter(source)
  }

  /**
   * Get the audio signal.
   *
   * @type {Array}
   */
  get signal () {
    return this.audio.signal
  }

  /**
   * Is the stream playing?
   *
   * @type {Boolean}
   */
  get playing () {
    return this.audio.playing
  }

  /**
   * Start playing the stream.
   */
  play () {
    this.audio.play()
  }

  /**
   * Pause the stream.
   */
  pause () {
    this.audio.pause()
  }

  /**
   * Bind a callback to an event of the stream.
   *
   * @param {String}    event     The name of the event to bind to.
   * @param {Function}  callback  The callback to bind.
   */
  bind (event, callback) {
    this.audio.bind(event, callback)
  }

  /**
   * Unbind an event bound to the specified name.
   *
   * @param {String} event The name of the event to unbind.
   */
  unbind (event) {
    this.audio.unbind(event)
  }

  /**
   * The the specified event.
   *
   * @param {String} event The event to trigger.
   */
  trigger (event) {
    this.audio.trigger(event)
  }
}

export default Stream
