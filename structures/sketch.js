// All the paths
let paths = [];
// Are we painting?
let painting = false;
// How long until the next circle
let next = 1;
// Where are we now and where were we?
let current;
let previous;

function setup() {
  createCanvas(windowWidth, windowHeight);
  current = createVector(0, 0);
  previous = createVector(0, 0);
}

function draw() {
  background(255);
  // If it's time for a new point
  if (millis() > next && painting) {
    // Grab mouse position
    current.x = mouseX;
    current.y = mouseY;

    // New particle's force is based on mouse movement
    let force = p5.Vector.sub(current, previous);
    force.mult(3);

    // Add new particle
    paths[paths.length - 1].add(current, force);

    // Schedule next circle
    next = millis() + random(10);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for (let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

// Start it up
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
}

// Stop
function mouseReleased() {
  painting = false;
}

// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
    this.startColor = color(random(200), random(5), random(50));
    this.endColor = color(random(50), random(10), random(90));
  }

  add(position, force) {
    // Determine the color of the particle based on its position in the path
    let lerpAmount = this.particles.length / 100; // Adjusted for a smoother color transition
    let particleColor = lerpColor(this.startColor, this.endColor, lerpAmount);

    // Add a new particle with a position, force, and color
    this.particles.push(new Particle(position, force, particleColor));
  }

  // Display path
  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }

  // Display path
  display() {
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If we should remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      } else {
        this.particles[i].display(this.particles[i + 1]);
      }
    }
  }
}

// Particles along the path
class Particle {
  constructor(position, force, col) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.9;
    this.lifespan = 255; // Start with a full lifespan
    this.color = col; // Particle's color
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    this.lifespan--;
  }

  // Draw particle and connect it with a line
  display(other) {
    strokeWeight(2);
    stroke(this.color);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);

    // If we need to draw a line
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
}
