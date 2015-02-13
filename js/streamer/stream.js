import Flash from "./adapter/flash"
import WebAudio from "./adapter/web-audio"

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
    let audioEl = new Audio()

    if (window.AudioContext) {
      return WebAudio
    }
    else {
      return Flash
    }
  }

  /**
   * @constructor
   */
  constructor (source) {
    this.audio = new Stream.Adapter(source)
  }

  /**
   * @type {Array}
   */
  get signal () {
    return this.audio.signal
  }

  /**
   * @type {Boolean}
   */
  get playing () {
    return this.audio.playing
  }

  play () {
    this.audio.play()
  }

  pause () {
    this.audio.pause()
  }

  bind (event, callback) {
    this.audio.bind(event, callback)
  }

  unbind (event) {
    this.audio.unbind(event)
  }

  trigger (event) {
    this.audio.trigger(event)
  }
}

export default Stream
