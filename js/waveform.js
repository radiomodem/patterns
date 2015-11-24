import $ from 'jquery';

/**
 * Based on Dancer.js (https://github.com/jsantell/dancer.js).
 *
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
export default class Waveform {
  /**
   * Initialize a waveform.
   *
   * @param {HTMLCanvasElement} canvas  The canvas on which to draw the waveform.
   * @param {Stream}            stream  The stream to use for constructing the waveform.
   * @param {Object}            options Configuration options.
   * @constructor
   */
  constructor(canvas, stream, options) {
    const ratio = this.ratio(canvas);
    const draw = () => {
      this.draw(stream.signal, canvas, ratio, options);
    };
    const scale = () => {
      this.scale(canvas, ratio);
      draw();
    };

    scale();
    $(window).on('resize', () => scale());
    stream.bind('update', () => draw());
  }

  /**
   * Get the ratio between the device pixel ratio and the backing store pixel
   * ratio of the canvas being drawn on.
   *
   * @param   {HTMLCanvasElement} canvas  The canvas for which to calculate the
   *                                      pixel ratio.
   * @return  {Number}                    The canvas pixel ratio.
   */
  ratio(canvas) {
    const context = canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = context.webkitBackingStorePixelRatio ||
                              context.mozBackingStorePixelRatio ||
                              context.msBackingStorePixelRatio ||
                              context.oBackingStorePixelRatio ||
                              context.backingStorePixelRatio || 1;

    return devicePixelRatio / backingStoreRatio;
  }

  /**
   * Scale the canvas according to a specified ratio.
   *
   * @param {HTMLCanvasElement} canvas  The canvas to scale.
   * @param {Number}            ratio   The ratio with which to scale the
   *                                    canvas.
   */
  scale(canvas, ratio) {
    const ctx = canvas.getContext('2d');
    const $canvas = $(canvas);

    if (ratio !== 1) {
      const width = $canvas.width();
      const height = $canvas.height();

      canvas.width = width * ratio;
      canvas.height = height * ratio;

      ctx.scale(ratio, ratio);
    }
  }

  /**
   * Draw the waveform on the canvas.
   *
   * @param {Array}             signal  The waveform signal to draw.
   * @param {HTMLCanvasElement} canvas  The canvas on which to draw the
   *                                    waveform.
   * @param {Number}            ratio   The pixel ratio to draw at.
   * @param {Object}            options Configuration options.
   */
  draw(signal, canvas, ratio, options) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const r = ratio;

    options = options || {};

    ctx.lineWidth = options.stroke.width;
    ctx.strokeStyle = options.stroke.color;

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();

    for (let i = 0, l = signal.length; i < l; i++) {
      ctx.lineTo(i * (w / l), h / (2 * r) + signal[i] * (h / (2 * r)));
    }

    ctx.stroke();
    ctx.closePath();
  }
}
