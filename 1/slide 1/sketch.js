let colors = "0066cc-3385ff-66a3ff-99c2ff-cce0ff".split("-").map(a => "#" + a);
let overAllTexture;
let waves = [];
let canvas;
let radiations = [];


function windowResized() {
  // Resize the overAllTexture canvas when the window is resized
  resizeCanvas(windowWidth, windowHeight);

  radiations[0].p.set(width / 2, height / 2);
}

class Wave {
  constructor(args) {
    let def = {
      p: createVector(0, 0),
      rSpeed: random(3) * random(), // Adjust the range for a larger radius
      color: color(0),
      r: 0,
      live: int(random(0, 300)),
      alive: true,
      polygonCount: int(random(500, 1000)), // Adjust the range for a larger spread
      randomId: int(random(50)),
      dash: random() < 0,
    };
    Object.assign(def, args);
    Object.assign(this, def);
    this.originalLive = this.live;
  }

  draw() {
    let liveRatio = this.live / this.originalLive;
    push();
    let clr = color(this.color);
    clr.setAlpha(liveRatio * 255);

    stroke(clr);
    strokeWeight(2 * liveRatio);

    noFill();
    translate(this.p);
    push();
    if (this.dash) {
      drawingContext.setLineDash([1, 15]);
    }
    ellipse(0, 0, this.r * 2, this.r * 2);
    pop();
    beginShape();
    for (let i = 0; i < 100; i++) {
      let rr = map(
        noise(i, frameCount / 500, this.randomId),
        0,
        1,
        0.9,
        1.1
      ) * this.r;
      let ang = i + random() * 0;
      let xx = rr * cos(ang),
        yy = rr * sin(ang);


  
      if (i % this.polygonCount == 0) {
        vertex(xx, yy);
      }
    }
    strokeWeight(1 * liveRatio);
    endShape();

    pop();
  }

  update() {
    this.r += this.rSpeed;
    this.live--;
    if (this.live < 0) {
      this.alive = false;
    }
  }
}

class Radiation {
  constructor(args) {
    let def = {
      p: createVector(0, 0),
      color: random(colors),
      randomId: int(random(10000)),
      freq: int(random(300, 1000)),
      lastWaveEmitTs: 0,
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }

  draw() {
    push();
    noStroke();
    translate(this.p);
    if (frameCount - this.lastWaveEmitTs < 5) {
      scale(2);
    }
    fill(this.color);
    ellipse(0, 0, 20, 20);
    pop();
  }

  update() {
    if ((this.randomId + frameCount) % this.freq == 0) {
      this.emitWave();
    }
  }

  emitWave(parent = this) {
    waves.push(
      new Wave({
        p: this.p.copy(),
        color: this.color,
        parent,
      })
    );
  }
}

function setup() {
  pixelDensity(2);
  canvas = createCanvas(1000, 1000);
  background(100);
  let total = 1;

 
  radiations.push(
    new Radiation({
      p: createVector(2 * width / 3, height / 2),
    })
  );

  fill(0);
  rect(0, 0, width, height);

 
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(200,noise(i/10,i*o/300)*random([0,0,20	,50])))
		}
	}
  
  overAllTexture.updatePixels();
  canvas.mousePressed(handleMousePress);
  windowResized();
}


function handleMousePress() {
  // Check if the mouse press is on the dot
  let d = dist(
    mouseX,
    mouseY,
    radiations[0].p.x,
    radiations[0].p.y
  );
  if (d < 10) {
    // If the press is on the dot, emit a wave
    radiations[0].emitWave();
  }
}

function draw() {
  noStroke();
  fill(240);
  rect(0, 0, width, height);

  waves.forEach((wave) => {
    wave.update();
    wave.draw();
  });
  waves = waves.filter((w) => w.alive);
  radiations.forEach((radiation) => {
    radiation.update();
    radiation.draw();
  });

  waves.forEach((wave) => {
    radiations.forEach((radiation) => {
      if (
        frameCount - radiation.lastWaveEmitTs > 5 &&
        wave.parent !== radiation &&
        abs(wave.p.dist(radiation.p) - wave.r) < 2 &&
        wave.color == radiation.color
      ) {
        radiation.emitWave();
        radiation.lastWaveEmitTs = frameCount;
        radiation.lastWaveParent = wave.parent;
      }
    });
  });

  push();
  radiations.forEach((radiation) => {
    let clr = color(radiation.color);
    clr.setAlpha(150);
    radiations.forEach((radiation2) => {
      drawingContext.setLineDash([5, 15]);
      drawingContext.lineDashOffset = frameCount / 5;
      stroke(clr);
      if (
        radiation === radiation2.lastWaveParent ||
        radiation2 === radiation.lastWaveParent
      ) {
        line(
          radiation.p.x,
          radiation.p.y,
          radiation2.p.x,
          radiation2.p.y
        );
      }
    });
  });
  pop();

  push();
  blendMode(MULTIPLY);
  image(overAllTexture, 0, 0, width, height);
  pop();

  push();
  drawingContext.filter = "blur(10px)";
  blendMode(BURN);
  image(canvas, 0, 0);
  drawingContext.filter = "blur(20px)";
  image(canvas, 0, 0);
  pop();

  push();
  blendMode(OVERLAY);
  fill(28 * 3, 28 * 3, 28 * 3);
  rect(0, 0, width, height);
  pop();

  push();
  blendMode(MULTIPLY);
  image(overAllTexture, 0, 0, width, height);
  pop();
}

function keyPressed() {
  if (key == " ") {
    if (isLooping()) {
      noLoop();
    } else {
      loop();
    }
  }
  if (key == "s") {
    save();
  }
}
