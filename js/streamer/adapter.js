/**
 * Based on Dancer.js (https://github.com/jsantell/dancer.js).
 *
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
class Adapter {
  constructor () {
    this.loaded = false
    this.progress = 0
    this.events = {}
  }

  play () {
    if (this.playing) return

    this.playing = true
    this.trigger("play")
    this.audio.play()
  }

  pause () {
    if (!this.playing) return

    this.playing = false
    this.trigger("pause")
    this.audio.pause()
  }

  update () {
    this.trigger("update")
  }

  bind (event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(callback)

    return this
  }

  unbind (event) {
    if (this.events[event]) {
      delete this.events[event]
    }

    return this
  }

  trigger (event) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback())
    }

    return this
  }
}

export default Adapter
