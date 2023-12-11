const [W, H] = [128, 96];

let p,
  capture,
  loaded = false;

function setup() {
  noCanvas();
  p = createElement("span");
  capture = createCapture(VIDEO, () => {
    capture.size(W, H);
    console.log("preload", capture.width, capture.height);
    loaded = true;
  });
  capture.hide();
  setInterval(() => console.log(frameRate()), 1000);
}

//const PIX = '     .-,_:~;*!"+=j7?Ltzsuo#XhZgEORMWB@';
// const PIX = '  `.,_;^+*LTtjkAGgRNW@';
const PIX = '   `.,_;^+*LTt1jZkAdGgDRNW@';
console.log(PIX);

function draw() {
  if (!loaded) return;
  let str = "";

  capture.loadPixels();

  for (let j = 0; j < capture.height; ++j) {
    for (let i = 0; i < capture.width; ++i) {

      const idx = (i + j * capture.width) * 4;
      const blueComponent = capture.pixels[idx + 2] / 255; // Blue component normalized between 0 and 1

      const c = PIX[floor(blueComponent * PIX.length)];

      str += (c == ' ' ? '&nbsp;' : c);
    }
    str += "<br/>";
  }
  p.html(str);
}
