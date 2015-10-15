// var sin = T("sin").play();

// // sin.set({freq:880});

// sin.set({freq:50});
// T("sin", {freq:700}).play();
// T("sin", {freq:40}).play();
// T("sin", {freq:500}).play();
// T("sin", {freq:200, mull:0.2}).play();
// var VCF = T("lpf", {cutoff:1600, Q:10}, VCO).play();




// var sine1 = T("sin", {freq:440, mul:0.5});
// var sine2 = T("sin", {freq:660, mul:0.5});

// T("perc", {r:500}, sine1, sine2).on("ended", function() {
//   this.pause();
// }).bang().play();


var osc = T("pulse");
var env = T("perc", {a:50, r:2500});
var oscenv = T("OscGen", {osc:osc, env:env, mul:0.15}).play();

T("interval", {interval:500}, function(count) {
  var noteNum  = 69 + [0, 2, 4, 5, 7, 9, 11, 12][count % 8];
  var velocity = 64 + (count % 64);
  oscenv.noteOn(noteNum, velocity);
})