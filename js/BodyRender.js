class BodyRenderer {
    constructor(bodySize) {
      this.bodySize = bodySize;
      this.starPos = [];
      this.initStarPositions();
    }
  
    setBodySize(bodySize) {
      this.bodySize = bodySize; // body size is a factor tied to the screen width and height size. 
    }
  
    initStarPositions() {
      for (let i = 0; i < 150; i++) {
        let theta = random(PI); // Random angle between 0 and PI
        let phi = random(TWO_PI); // Random angle between 0 and TWO_PI
        let pos = createVector(
          2000 * sin(theta) * cos(phi),
          2000 * cos(theta),
          2000 * sin(theta) * sin(phi)
        );
        let brightness = random(100, 127);
        this.starPos.push([pos, brightness]);
      }
    }
  
    renderBody() {
      push();
      normalMaterial();
  
      sphere(80 * this.bodySize, 24, 24);
      rotateX(PI * 0.4);
      torus(120 * this.bodySize, 7 * this.bodySize, 24, 24);
  
      translate(-260 * this.bodySize, 0, 0);
      sphere(15 * this.bodySize, 24, 24);
  
      translate(520 * this.bodySize, 0, 0);
      sphere(15 * this.bodySize, 24, 24);
  
      translate(-260 * this.bodySize, -260 * this.bodySize, 0);
      sphere(15 * this.bodySize, 24, 24);
  
      translate(0, 520 * this.bodySize, 0);
      sphere(15 * this.bodySize, 24, 24);
  
      pop();
    }
  
    stars() {
      push();
      strokeWeight(3);
      beginShape(POINTS);
      for (let i = 0; i < this.starPos.length; i++) {
        stroke(this.starPos[i][1]);
        vertex(
          this.starPos[i][0].x,
          this.starPos[i][0].y,
          this.starPos[i][0].z
        );
      }
      endShape();
      pop();
    }
  }
  