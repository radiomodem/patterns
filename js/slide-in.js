import $ from 'jquery';

/**
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
export default class SlideIn {
  /**
   * Default Slide In options.
   *
   * @type {Object}
   */
  get defaults() {
    return {
      classes: {
        open: 'is-open'
      }
    };
  }

  /**
   * Initialize a Slide In.
   *
   * @param {Object} element The element to attach the Slide In to.
   * @param {Object} options Custom configuration options.
   */
  constructor(element, options) {
    this.options = $.extend(this.defaults, options);

    this.$element = $(element);

    const classes = this.options.classes;
    const $close = this.$element.find('[data-slide-in-close]');
    const $toggle = $(`[data-slide-in-toggle=${this.$element.attr('id')}]`);

    $toggle.on('click', () => {
      if (this.$element.hasClass(classes.open)) {
        this.hide();
      } else {
        this.show();
      }
    });

    $close.on('click', () => {
      if (this.$element.hasClass(classes.open)) {
        this.hide();
      } else {
        this.show();
      }
    });
  }

  /**
   * Show the Slide In.
   */
  show() {
    this.$element.addClass(this.options.classes.open);
  }

  /**
   * Hide the Slide In.
   */
  hide() {
    this.$element.removeClass(this.options.classes.open);
  }
}
