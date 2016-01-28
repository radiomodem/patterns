import $ from 'jquery';
import Streamer from './streamer';
import SlideIn from './slide-in';

// Expose the Streamer as a jQuery plugin.
$.fn.streamer = function (options) {
  return this.each((index, element) => {
    if ($.data(element, 'streamer') === undefined) {
      $.data(element, 'streamer', new Streamer(element, options));
    }
  });
};

$('[data-streamer]').streamer();

$.fn.slideIn = function (options) {
  return this.each((index, element) => {
    if ($.data(element, 'slide-in') === undefined) {
      $.data(element, 'slide-in', new SlideIn(element, options));
    }
  });
};

$('[data-slide-in]').slideIn();
