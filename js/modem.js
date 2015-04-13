import $ from "jquery"
import Streamer from "streamer"

// Expose the Streamer as a jQuery plugin.
$.fn.streamer = function (options) {
  return this.each((index, element) => {
    if ($.data(element, "streamer") === undefined) {
      $.data(element, "streamer", new Streamer(element, options))
    }
  })
}

$("[data-streamer]").streamer()
