/**
 * Based on Dancer.js (https://github.com/jsantell/dancer.js).
 *
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
export default class WebAudio {
  /**
   * Audio sample size.
   *
   * @type {Number}
   */
  get sampleSize() {
    return 2048;
  }

  /**
   * Initialize web audio.
   *
   * @param {Object} source The <audio> source element.
   */
  constructor(source) {
    this.loaded = false;
    this.events = {};

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    this.context = new AudioContext();
    this.audio = source;

    if (!this.context.createScriptProcessor) {
      this.context.createScriptProcessor = this.context.createJavascriptNode;
    }

    this.processor = this.context.createScriptProcessor(
      this.sampleSize / 2, 1, 1
    );

    this.processor.onaudioprocess = e => this.update(e);

    if (!this.context.createGain) {
      this.context.createGain = this.context.createGainNode;
    }

    this.gain = this.context.createGain();
    this.signal = new Float32Array(this.sampleSize / 2);

    if (this.audio.readyState < 3) {
      this.audio.oncanplay = () => this.connect();
    } else {
      this.connect();
    }

    this.audio.onplaying = () => this.play();
    this.audio.onpause = () => this.pause();
  }

  /**
   * Executed when audio is processed by the script processor.
   *
   * @param {Object} e The audio processing event.
   */
  update(e) {
    if (!this.loaded || !this.playing) {
      return;
    }

    const buffers = [];
    const channels = e.inputBuffer.numberOfChannels;
    const resolution = this.sampleSize / channels;

    for (let i = channels - 1; i >= 0; i--) {
      buffers.push(e.inputBuffer.getChannelData(i));
    }

    for (let i = 0; i < resolution; i++) {
      if (channels > 1) {
        this.signal[i] = buffers.reduce((prev, curr) => prev[i] + curr[i]) / channels;
      } else {
        this.signal[i] = buffers[0][i];
      }
    }

    this.trigger('update');
  }

  /**
   * Hook up the audio source with other nodes.
   */
  connect() {
    this.source = this.context.createMediaElementSource(this.audio);
    this.source.connect(this.processor);
    this.source.connect(this.gain);

    this.gain.connect(this.context.destination);
    this.processor.connect(this.context.destination);

    this.loaded = true;
    this.trigger('loaded');
  }

  /**
   * Start playing the audio.
   */
  play() {
    if (this.playing || !this.audio) {
      return;
    }

    this.playing = true;
    this.trigger('play');
    this.audio.play();
  }

  /**
   * Pause the audio.
   */
  pause() {
    if (!this.playing || !this.audio) {
      return;
    }

    this.playing = false;
    this.trigger('pause');
    this.audio.pause();
  }

  /**
   * Bind a callback to an event of the audio.
   *
   * @param {String}    event     The name of the event to bind to.
   * @param {Function}  callback  The callback to bind.
   */
  bind(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);

    return this;
  }

  /**
   * Unbind an event bound to the specified name.
   *
   * @param {String} event The name of the event to unbind.
   */
  unbind(event) {
    if (this.events[event]) {
      Reflect.deleteProperty(this.events[event]);
    }

    return this;
  }

  /**
   * The the specified event.
   *
   * @param {String} event The event to trigger.
   */
  trigger(event) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback());
    }

    return this;
  }
}
