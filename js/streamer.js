import $ from "jquery";

import Stream from "./streamer/stream"
import Waveform from "./streamer/waveform"

/**
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
class Streamer {
  /**
   * Default Streamer options.
   *
   * @type {object}
   */
  get defaults () {
    return {
      stroke: {
        width: 2
      , color: "#666"
      }
    , classes: {
        wrapper: "streamer"
      , button: "streamer-button"
      }
    , icons: {
        play: "ion-play"
      , pause: "ion-pause"
      }
    }
  }

  /**
   * Initialize a Streamer.
   *
   * @param {object} element The <audio> element to attach the Streamer to.
   * @param {object} options Custom configuration options.
   */
  constructor (element, options) {
    this.options = $.extend(this.defaults, options)

    this.audio = element
    this.$audio = $(this.audio)

    this.stream = new Stream(this.audio)

    this.$audio.wrap($("<div />", {
      "class": this.options.classes.wrapper
    }))

    this.$wrapper = this.$audio.parent()

    this.$canvas = $("<canvas />")
    this.$wrapper.append(this.$canvas)

    this.$button = $("<button />", {
      "class": this.options.classes.button
    , "type": "button"
    })
    this.$wrapper.append(this.$button)

    this.$icon = $("<span />", {
      "class": this.options.icons.play
    })
    this.$button.append(this.$icon)

    this.$button.on("click", (e) => {
      (this.stream.playing) ? this.stream.pause() : this.stream.play()
    })

    this.stream.bind("play", () => {
      this.$icon.removeClass(this.options.icons.play)
      this.$icon.addClass(this.options.icons.pause)
      this.$wrapper.addClass("is-playing")
    })

    this.stream.bind("pause", () => {
      this.$icon.removeClass(this.options.icons.pause)
      this.$icon.addClass(this.options.icons.play)
      this.$wrapper.removeClass("is-playing")
    })

    this.waveform = new Waveform(this.$canvas[0], this.stream, {
      stroke: this.options.stroke
    })
  }
}

export default Streamer;
