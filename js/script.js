// var sin = T("sin").play();

// // sin.set({freq:880});

// sin.set({freq:50});
// var a = function () {
// T("sin", {freq:700}).play();
// T("sin", {freq:40}).play();
// T("sin", {freq:500}).play();
// T("sin", {freq:200, mull:0.2}).play();
// };


// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// // Create a stereo panner
// var panNode = audioCtx.createStereoPanner();

// // Event handler function to increase panning to the right and left
// // when the slider is moved

//   panNode.pan.value = 1;

// a.connect(panNode);
// panNode.connect(audioCtx.destination);

// var VCF = T("lpf", {cutoff:1600, Q:10}, VCO).play();




// var sine1 = T("sin", {freq:440, mul:0.5});
// var sine2 = T("sin", {freq:660, mul:0.5});

// T("perc", {r:500}, sine1, sine2).on("ended", function() {
//   this.pause();
// }).bang().play();


// var osc = T("pulse");
// var env = T("perc", {a:50, r:2500});
// var oscenv = T("OscGen", {osc:osc, env:env, mul:0.15}).play();

// T("interval", {interval:500}, function(count) {
//   var noteNum  = 69 + [0, 2, 4, 5, 7, 9, 11, 12][count % 8];
//   var velocity = 64 + (count % 64);
//   oscenv.noteOn(noteNum, velocity);
// })

// var freqs = [440, 493, 523, 554, 587, 659, 698];
// var vco = T("saw", {freq:T("param"), mul:0.8});
// var vcf = T("MoogFF", {freq:T("param"), gain:2.1, mul:0.25}, vco).play();

// T("interval", {interval:150}, function(count) {
//   var f = freqs[(Math.random() * freqs.length)|0] * 0.5;
//   vco.freq.linTo(f, "20ms");
//   vcf.freq.sinTo(880 * 2, "60ms");
// }).start();

// var context = window.AudioContext || window.webkitAudioContext;


// function play(semitone) {
// // Create some sweet sweet nodes.
// var oscillator = context.createOscillator(); 
// oscillator.connect(context.destination);
// // Play a sine type curve at A4 frequency (440hz). 
// oscillator.frequency.value = 440; 
// oscillator.detune.value = semitone * 100;
// // Note: this constant will be replaced with "sine". 
// oscillator.type = oscillator.SINE; 
// oscillator.start(0);
// }



// play(2);




// Start off by initializing a new context.
context = new (window.AudioContext || window.webkitAudioContext)();

if (!context.createGain)
  context.createGain = context.createGainNode;
if (!context.createDelay)
  context.createDelay = context.createDelayNode;
if (!context.createScriptProcessor)
  context.createScriptProcessor = context.createJavaScriptNode;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  function( callback ){
  window.setTimeout(callback, 1000 / 60);
};
})();


function playSound(buffer, time) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source[source.start ? 'start' : 'noteOn'](time);
}

function loadSounds(obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}




function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};







function OscillatorSample() {
  this.isPlaying = false;
}

OscillatorSample.prototype.play = function() {
  // Create some sweet sweet nodes.
  this.oscillator = context.createOscillator();
  this.analyser = context.createAnalyser();

  // Setup the graph.
  this.oscillator.connect(this.analyser);
  this.analyser.connect(context.destination);

  this.oscillator[this.oscillator.start ? 'start' : 'noteOn'](0);

  requestAnimFrame(this.visualize.bind(this));
};

OscillatorSample.prototype.stop = function() {
  this.oscillator.stop(0);
};

OscillatorSample.prototype.toggle = function() {
  (this.isPlaying ? this.stop() : this.play());
  this.isPlaying = !this.isPlaying;

};

OscillatorSample.prototype.changeFrequency = function(val) {
  this.oscillator.frequency.value = val;
};

OscillatorSample.prototype.changeDetune = function(val) {
  this.oscillator.detune.value = val;
};

OscillatorSample.prototype.changeType = function(type) {
  this.oscillator.type = type;
};

OscillatorSample.prototype.visualize = function() {
  this.canvas.width = this.WIDTH;
  this.canvas.height = this.HEIGHT;
  var drawContext = this.canvas.getContext('2d');

  var times = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteTimeDomainData(times);
  for (var i = 0; i < times.length; i++) {
    var value = times[i];
    var percent = value / 256;
    var height = this.HEIGHT * percent;
    var offset = this.HEIGHT - height - 1;
    var barWidth = this.WIDTH/times.length;
    drawContext.fillStyle = 'black';
    drawContext.fillRect(i * barWidth, offset, 1, 1);
  }
  requestAnimFrame(this.visualize.bind(this));
};


var sample = new OscillatorSample();
