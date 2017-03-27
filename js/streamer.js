import $ from 'jquery';
import WebAudio from './web-audio';
import Waveform from './waveform';

/**
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
export default class Streamer {
  /**
   * Default Streamer options.
   *
   * @type {Object}
   */
  static get defaults() {
    return {
      classes: {
        wrapper: 'streamer',
        button: 'streamer-button',
        icon: 'streamer-icon'
      },
      icons: {
        play: 'ion-play',
        pause: 'ion-pause',
        offline: 'ion-android-microphone-off'
      },
      labels: {
        play: 'Continue playing',
        pause: 'Stop playing',
        offline: 'Stream offline'
      }
    };
  }

  /**
   * Initialize a Streamer.
   *
   * @param {Audio}   element The <audio> element to attach the Streamer to.
   * @param {Object}  options Custom configuration options.
   */
  constructor(element, options) {
    this.options = $.extend(Streamer.defaults, options);

    element.addEventListener('error', e => this.onError(e), true);
    element.load()

    const {classes, icons, labels} = this.options;

    this.audio = new WebAudio(element);
    this.$audio = $(element);

    this.$audio.wrap($('<div />', {
      class: classes.wrapper
    }));

    this.$wrapper = this.$audio.parent();
    this.$canvas = $('<canvas />');
    this.$wrapper.append(this.$canvas);

    this.$button = $('<button />', {
      'class': classes.button,
      'type': 'button',
      'aria-label': labels.play
    });
    this.$wrapper.append(this.$button);

    this.$icon = $('<span />', {
      class: `${classes.icon} ${classes.icon}-play ${icons.play}`
    });
    this.$button.append(this.$icon);

    this.audio.bind('play', () => this.onPlay());
    this.audio.bind('pause', () => this.onPause());
    this.$button.on('click', () => this.onButtonClick());

    if (element.autoplay) {
      this.audio.play();
    }

    this.waveform = new Waveform(this.$canvas[0], this.audio, this.options.waveform);
  }

  onPlay() {
    if (this.offline) {
      return;
    }

    const {labels, icons, classes} = this.options;

    this.$button.attr('aria-label', labels.pause);
    this.$icon.removeClass(`${classes.icon}-play ${icons.play}`);
    this.$icon.addClass(`${classes.icon}-pause ${icons.pause}`);
    this.$wrapper.addClass('is-playing');
  }

  onPause() {
    if (this.offline) {
      return;
    }

    const {labels, icons, classes} = this.options;

    this.$button.attr('aria-label', labels.play);
    this.$icon.removeClass(`${classes.icon}-pause ${icons.pause}`);
    this.$icon.addClass(`${classes.icon}-play ${icons.play}`);
    this.$wrapper.removeClass('is-playing');
  }

  onButtonClick() {
    if (this.offline) {
      return;
    }

    if (this.audio.playing) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  }

  onError() {
    this.offline = true;
    this.audio.pause();

    const {labels, icons, classes} = this.options;

    this.$button.attr('aria-label', labels.offline);
    this.$icon.removeClass(`${classes.icon}-pause ${icons.pause}`);
    this.$icon.removeClass(`${classes.icon}-play ${icons.play}`);
    this.$icon.addClass(`${classes.icon}-offline ${icons.offline}`);
    this.$wrapper.removeClass('is-playing');
  }
}
