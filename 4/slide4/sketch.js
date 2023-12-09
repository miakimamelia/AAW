var x = 0;
var y = 0;
var gap = 20;
var deg = 0;
var color2 = 'rgb(255,255,255)';

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(60);
}

function mousePressed() {
  color2 = 'rgb(0,0,239)';
}

function mouseReleased() {
  color2 = 'rgb(255,255,255)';
}

function draw() {
  spin();
  maze();
  grid();
}

function maze() {
  stroke(color2);
  strokeWeight(1.5);
  if (random(1) < 0.1) {
    line(x, y, x + gap, y + gap);
  } else {
    line(x, y + gap, x + gap, y);
  }

  x = x + 10;
  if (x > width) {
    x = 0;
    y = y + gap;
  }
}

function grid() {

}

function spin() {
  push();
  scale(1);
  translate(width / 2, height / 2);
  rotate(radians(deg));
  deg++;
  fill(color2);
  triangle(0, 0, 1000, 100);
  pop();
}

function keyPressed() {
  if (keyCode == 32) {
    saveCanvas('', 'png');
  }
}

