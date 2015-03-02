import $ from "jquery"
import Streamer from "streamer"

$.fn.streamer = function (options) {
  return this.each(function () {
    if ($.data(this, "streamer") === undefined) {
      $.data(this, "streamer", new Streamer(this, options))
    }
  })
}

$("[data-streamer]").streamer()
