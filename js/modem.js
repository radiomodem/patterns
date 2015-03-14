!function(e){"function"==typeof define&&define.amd?define("modem",["exports","jquery","streamer"],e):"undefined"!=typeof exports&&e(exports,require("jquery"),require("streamer"))}(function(e,t,n){"use strict";var r=function(e){return e&&e.__esModule?e["default"]:e},i=r(t),o=r(n);i.fn.streamer=function(e){return this.each(function(){void 0===i.data(this,"streamer")&&i.data(this,"streamer",new o(this,e))})},i("[data-streamer]").streamer()}),function(e){"function"==typeof define&&define.amd?define("streamer",["exports","module","jquery","streamer/stream","streamer/waveform"],e):"undefined"!=typeof exports&&"undefined"!=typeof module&&e(exports,module,require("jquery"),require("streamer/stream"),require("streamer/waveform"))}(function(e,t,n,r,i){"use strict";var o=function(e){return e&&e.__esModule?e["default"]:e},a=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},u=o(n),c=o(r),f=o(i),d=function(){function e(t,n){var r=this;s(this,e),this.options=u.extend(this.defaults,n);var i=this.options.classes,o=this.options.icons;this.audio=t,this.$audio=u(this.audio),this.stream=new c(this.audio),this.$audio.wrap(u("<div />",{"class":i.wrapper})),this.$wrapper=this.$audio.parent(),this.$canvas=u("<canvas />"),this.$wrapper.append(this.$canvas),this.$button=u("<button />",{"class":i.button,type:"button"}),this.$wrapper.append(this.$button),this.$icon=u("<span />",{"class":""+i.icon+" "+i.icon+"-play "+o.play}),this.$button.append(this.$icon),this.$button.on("click",function(){r.stream.playing?r.stream.pause():r.stream.play()}),this.stream.bind("play",function(){r.$icon.removeClass(""+i.icon+"-play "+o.play),r.$icon.addClass(""+i.icon+"-pause "+o.pause),r.$wrapper.addClass("is-playing")}),this.stream.bind("pause",function(){r.$icon.removeClass(""+i.icon+"-pause "+o.pause),r.$icon.addClass(""+i.icon+"-play "+o.play),r.$wrapper.removeClass("is-playing")}),this.waveform=new f(this.$canvas[0],this.stream,{stroke:this.options.stroke})}return a(e,{defaults:{get:function(){return{stroke:{width:2,color:"#666"},classes:{wrapper:"streamer",button:"streamer-button",icon:"streamer-icon"},icons:{play:"ion-play",pause:"ion-pause"}}}}}),e}();t.exports=d}),function(e){"function"==typeof define&&define.amd?define("streamer/adapter",["exports","module"],e):"undefined"!=typeof exports&&"undefined"!=typeof module&&e(exports,module)}(function(e,t){"use strict";var n=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),r=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},i=function(){function e(){r(this,e),this.loaded=!1,this.progress=0,this.events={}}return n(e,{play:{value:function(){this.playing||(this.playing=!0,this.trigger("play"),this.audio.play())}},pause:{value:function(){this.playing&&(this.playing=!1,this.trigger("pause"),this.audio.pause())}},update:{value:function(){this.trigger("update")}},bind:{value:function(e,t){return this.events[e]||(this.events[e]=[]),this.events[e].push(t),this}},unbind:{value:function(e){return this.events[e]&&delete this.events[e],this}},trigger:{value:function(e){return this.events[e]&&this.events[e].forEach(function(e){return e()}),this}}}),e}();t.exports=i}),function(e){"function"==typeof define&&define.amd?define("streamer/stream",["exports","module","streamer/adapter/flash","streamer/adapter/web-audio"],e):"undefined"!=typeof exports&&"undefined"!=typeof module&&e(exports,module,require("streamer/adapter/flash"),require("streamer/adapter/web-audio"))}(function(e,t,n,r){"use strict";var i=function(e){return e&&e.__esModule?e["default"]:e},o=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},s=i(n),u=i(r),c=function(){function e(t){a(this,e),this.audio=new e.Adapter(t)}return o(e,{signal:{get:function(){return this.audio.signal}},playing:{get:function(){return this.audio.playing}},play:{value:function(){this.audio.play()}},pause:{value:function(){this.audio.pause()}},bind:{value:function(e,t){this.audio.bind(e,t)}},unbind:{value:function(e){this.audio.unbind(e)}},trigger:{value:function(e){this.audio.trigger(e)}}},{Adapter:{get:function(){return window.AudioContext?u:s}}}),e}();t.exports=c}),function(e){"function"==typeof define&&define.amd?define("streamer/waveform",["exports","module","jquery"],e):"undefined"!=typeof exports&&"undefined"!=typeof module&&e(exports,module,require("jquery"))}(function(e,t,n){"use strict";var r=function(e){return e&&e.__esModule?e["default"]:e},i=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},a=r(n),s=function(){function e(t,n,r){var i=this;o(this,e);var s=this.ratio(t),u=function(){i.draw(n.signal,t,s,r)},c=function(){i.scale(t,s),u()};c(),a(window).on("resize",function(){return c()}),n.bind("update",function(){return u()})}return i(e,{ratio:{value:function(e){var t=e.getContext("2d"),n=window.devicePixelRatio||1,r=t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1;return n/r}},scale:{value:function(e,t){var n=e.getContext("2d"),r=a(e);if(1!==t){var i=r.width(),o=r.height();e.width=i*t,e.height=o*t,n.scale(t,t)}}},draw:{value:function(e,t,n,r){var i=t.getContext("2d"),o=t.width,a=t.height,s=n;r=r||{},i.lineWidth=r.stroke.width,i.strokeStyle=r.stroke.color,i.clearRect(0,0,o,a),i.beginPath();for(var u=0,c=e.length;c>u;u++)i.lineTo(u*(o/c),a/(2*s)+e[u]*(a/(2*s)));i.stroke(),i.closePath()}}}),e}();t.exports=s}),function(e){"function"==typeof define&&define.amd?define("streamer/adapter/flash",["exports","module","jquery","streamer/adapter"],e):"undefined"!=typeof exports&&"undefined"!=typeof module&&e(exports,module,require("jquery"),require("streamer/adapter"))}(function(e,t,n,r){"use strict";var i=function(e){return e&&e.__esModule?e["default"]:e},o=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=function p(e,t,n){var r=Object.getOwnPropertyDescriptor(e,t);if(void 0===r){var i=Object.getPrototypeOf(e);return null===i?void 0:p(i,t,n)}if("value"in r&&r.writable)return r.value;var o=r.get;return void 0===o?void 0:o.call(n)},s=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},u=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},c=i(n),f=i(r),d=function(e){function t(e){var n=this;u(this,t),a(Object.getPrototypeOf(t.prototype),"constructor",this).call(this),this.source=e;var r=this.source.src||c(this.source).find("source[src$=mp3], source[src$=mp4], source[src$=m4a]")[0].src;this.wave_L=[],this.wave_R=[],this.signal=new Float32Array(this.sampleSize),t.loadSoundManager(function(){n.audio=t.soundManager.createSound({url:r,stream:!0,autoLoad:!0,whileplaying:function(){n.update()},whileloading:function(){n.progress=n.bytesLoaded/n.bytesTotal},onload:function(){n.loaded=!0,n.progress=1,n.trigger("loaded")},onplay:function(){return n.play()},onresume:function(){return n.play()},onpause:function(){return n.pause()},onfinish:function(){return n.pause()}})})}return s(t,e),o(t,{sampleSize:{get:function(){return 1024}},sampleRate:{get:function(){return 44100}},update:{value:function(){if(this.loaded||this.playing){this.wave_L=this.audio.waveformData.left,this.wave_R=this.audio.waveformData.right;for(var e=void 0,n=0,r=this.wave_L.length;r>n;n++)e=parseFloat(this.wave_L[n])+parseFloat(this.wave_R[n]),this.signal[2*n]=e/2,this.signal[2*n+1]=e/2;a(Object.getPrototypeOf(t.prototype),"update",this).call(this)}}}},{soundManagerPath:{get:function(){return{js:"lib/soundmanager2.js",swf:"lib/soundmanager2.swf"}}},loadSoundManager:{value:function(e){window.SM2_DEFER=!0,c.ajax({dataType:"script",cache:!0,url:t.soundManagerPath.js,success:function(){require(["SoundManager"],function(n){var r=n.SoundManager;t.soundManager||(t.soundManager=new r,c.extend(!0,t.soundManager,{flashVersion:9,flash9Options:{useWaveformData:!0},preferFlash:!0,useHTML5Audio:!1,useWaveformData:!0,useHighPerformance:!0,useFastPolling:!0,multiShot:!1,debugMode:!1,debugFlash:!1,url:t.soundManagerPath.swf}),t.soundManager.beginDelayedInit()),window.soundManager=t.soundManager,t.soundManager.onready(function(){return e()})})}})}}}),t}(f);t.exports=d}),function(e){"function"==typeof define&&define.amd?define("streamer/adapter/web-audio",["exports","module","streamer/adapter"],e):"undefined"!=typeof exports&&"undefined"!=typeof module&&e(exports,module,require("streamer/adapter"))}(function(e,t,n){"use strict";var r=function(e){return e&&e.__esModule?e["default"]:e},i=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function f(e,t,n){var r=Object.getOwnPropertyDescriptor(e,t);if(void 0===r){var i=Object.getPrototypeOf(e);return null===i?void 0:f(i,t,n)}if("value"in r&&r.writable)return r.value;var o=r.get;return void 0===o?void 0:o.call(n)},a=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},s=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},u=r(n),c=function(e){function t(e){var n=this;s(this,t),o(Object.getPrototypeOf(t.prototype),"constructor",this).call(this);var r=window.AudioContext;this.context=new r,this.audio=e,this.context.createScriptProcessor||(this.context.createScriptProcessor=this.context.createJavascriptNode),this.processor=this.context.createScriptProcessor(this.sampleSize/2,1,1),this.processor.onaudioprocess=function(e){return n.update(e)},this.context.createGain||(this.context.createGain=this.context.createGainNode),this.gain=this.context.createGain(),this.signal=new Float32Array(this.sampleSize/2),this.audio.readyState<3?this.audio.oncanplay=function(){return n.connect()}:this.connect(),this.audio.onprogress=function(e){var t=e.currentTarget;t.duration&&(n.progress=t.seekable.end(0)/t.duration)},this.audio.onplaying=function(){return n.play()},this.audio.onpause=function(){return n.pause()}}return a(t,e),i(t,{sampleSize:{get:function(){return 2048}},update:{value:function(e){var n=this;if(this.loaded&&this.playing){for(var r=[],i=e.inputBuffer.numberOfChannels,a=this.sampleSize/i,s=i;s--;)r.push(e.inputBuffer.getChannelData(s));for(var s=0;a>s;s++)!function(e){n.signal[e]=i>1?r.reduce(function(t,n){return t[e]+n[e]})/i:r[0][e]}(s);o(Object.getPrototypeOf(t.prototype),"update",this).call(this)}}},connect:{value:function(){this.source=this.context.createMediaElementSource(this.audio),this.source.connect(this.processor),this.source.connect(this.gain),this.gain.connect(this.context.destination),this.processor.connect(this.context.destination),this.loaded=!0,this.progress=1,this.trigger("loaded")}}}),t}(u);t.exports=c});
//# sourceMappingURL=modem.js.map