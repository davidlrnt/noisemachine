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