import Adapter from 'streamer/adapter';

/**
 * Based on Dancer.js (https://github.com/jsantell/dancer.js).
 *
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
export default class WebAudio extends Adapter {
  /**
   * Audio sample size.
   *
   * @type {Number}
   */
  get sampleSize() {
    return 2048;
  }

  /**
   * Initialize Web Audio adapter.
   *
   * @param {Object} source The <audio> source element.
   */
  constructor(source) {
    super();

    const {AudioContext} = window;

    this.context = new AudioContext();
    this.audio = source;

    if (!this.context.createScriptProcessor) {
      this.context.createScriptProcessor = this.context.createJavascriptNode;
    }

    this.processor = this.context.createScriptProcessor(
      this.sampleSize / 2, 1, 1
    );

    this.processor.onaudioprocess = (e) => this.update(e);

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

    this.audio.onprogress = (e) => {
      const target = e.currentTarget;

      if (target.duration) {
        this.progress = target.seekable.end(0) / target.duration;
      }
    };

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
        this.signal[i] = buffers.reduce((prev, curr) => {
          return prev[i] + curr[i];
        }) / channels;
      } else {
        this.signal[i] = buffers[0][i];
      }
    }

    super.update();
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
    this.progress = 1;
    this.trigger('loaded');
  }
}
