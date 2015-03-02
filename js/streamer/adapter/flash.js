import $ from "jquery"

import Adapter from "streamer/adapter"

/**
 * Based on Dancer.js (https://github.com/jsantell/dancer.js).
 *
 * @author Kasper Kronborg Isager <kasperisager@gmail.com>
 */
class Flash extends Adapter {
  static get soundManagerPath () {
    return {
      js: "lib/soundmanager2.js"
    , swf: "lib/soundmanager2.swf"
    }
  }

  static loadSoundManager (done) {
    window.SM2_DEFER = true

    $.ajax({
      dataType: "script"
    , cache: true
    , url: Flash.soundManagerPath.js
    , success: () => {
        require(["SoundManager"], (lib) => {
          let { SoundManager } = lib

          if (!Flash.soundManager) {
            Flash.soundManager = new SoundManager()

            $.extend(true, Flash.soundManager, {
              flashVersion: 9
            , flash9Options: {
                useWaveformData: true
              }
            , preferFlash: true
            , useHTML5Audio: false
            , useWaveformData: true
            , useHighPerformance: true
            , useFastPolling: true
            , multiShot: false
            , debugMode: false
            , debugFlash: false
            , url: Flash.soundManagerPath.swf
            })

            Flash.soundManager.beginDelayedInit()
          }

          // Expose the Sound Manager instance globally so that Flash can attach
          // to it.
          window.soundManager = Flash.soundManager

          Flash.soundManager.onready(() => done())
        })
      }
    })
  }

  get sampleSize () {
    return 1024
  }

  get sampleRate () {
    return 44100
  }

  constructor (source) {
    super()

    this.source = source

    let path = this.source.src || $(this.source).find(
      "source[src$=mp3], source[src$=mp4], source[src$=m4a]"
    )[0].src

    this.wave_L = []
    this.wave_R = []
    this.signal = new Float32Array(this.sampleSize)

    Flash.loadSoundManager(() => {
      this.audio = Flash.soundManager.createSound({
        url: path
      , stream: true
      , autoLoad: true
      , whileplaying: () => {
          this.update()
        }
      , whileloading: () => {
          this.progress = this.bytesLoaded / this.bytesTotal
        }
      , onload: () => {
          this.loaded = true
          this.progress = 1
          this.trigger("loaded")
        }
      , onplay: () => this.play()
      , onresume: () => this.play()
      , onpause: () => this.pause()
      , onfinish: () => this.pause()
      })
    })
  }

  update () {
    if (!this.loaded && !this.playing) {
      return
    }

    this.wave_L = this.audio.waveformData.left;
    this.wave_R = this.audio.waveformData.right;

    let avg;

    for (let i = 0, j = this.wave_L.length; i < j; i++) {
      avg = parseFloat(this.wave_L[i]) + parseFloat(this.wave_R[i]);

      this.signal[2 * i] = avg / 2;
      this.signal[i * 2 + 1] = avg / 2;
    }

    super.update()
  }
}

export default Flash
