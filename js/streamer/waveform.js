import $ from "jquery"

/**
 * Based on Dancer.js (https://github.com/jsantell/dancer.js).
 *
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
class Waveform {
  /**
   * Initialize a waveform.
   *
   * @param {Object} canvas   The canvas on which to draw the waveform.
   * @param {Stream} stream   The stream to use for constructing the waveform.
   * @param {Object} options  Configuration options.
   * @constructor
   */
  constructor (canvas, stream, options) {
    let ratio = this.ratio(canvas)
      , draw = () => {
          this.draw(stream.signal, canvas, ratio, options)
        }
      , scale = () => {
          this.scale(canvas, ratio)
          draw()
        }

    scale()
    $(window).on('resize', () => scale())
    stream.bind('update', () => draw())
  }

  /**
   * Get the ratio between the device pixel ratio and the backing store pixel
   * ratio of the canvas being drawn on.
   *
   * @param   {Object} canvas The canvas for which to calculate the pixel ratio.
   * @return  {Number}        The canvas pixel ratio.
   */
  ratio (canvas) {
    let context = canvas.getContext("2d")
      , devicePixelRatio = window.devicePixelRatio || 1
      , backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1

    return devicePixelRatio / backingStoreRatio
  }

  /**
   * Scale the canvas according to a specified ratio.
   *
   * @param {Number} ratio The ratio with which to scale the canvas.
   */
  scale (canvas, ratio) {
    let context = canvas.getContext("2d")
      , $canvas = $(canvas)

    if (ratio !== 1) {
      let width = $canvas.width()
        , height = $canvas.height()

      canvas.width = width * ratio
      canvas.height = height * ratio

      context.scale(ratio, ratio)
    }
  }

  /**
   * Draw the waveform on the canvas.
   *
   * @param {Array}   signal  The waveform signal to draw.
   * @param {Object}  canvas  The canvas on which to draw the waveform.
   * @param {Number}  ratio   The pixel ratio to draw at.
   * @param {Object}  options Configuration options.
   */
  draw (signal, canvas, ratio, options) {
    let context = canvas.getContext("2d")
      , w = canvas.width
      , h = canvas.height
      , r = ratio

    options = options || {}

    context.lineWidth = options.stroke.width
    context.strokeStyle = options.stroke.color

    context.clearRect(0, 0, w, h)
    context.beginPath()

    for (let i = 0, l = signal.length; i < l; i++) {
      context.lineTo(i * (w / l), (h / (2 * r)) + signal[i] * (h / (2 * r)))
    }

    context.stroke();
    context.closePath();
  }
}

export default Waveform
