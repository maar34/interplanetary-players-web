// Audio responsive Planetary Ring
// Inspired by Daniel Shiffman's Coding Train video 17.10: Sound Visualization: Radial Graph - p5.js Sound Tutorial
// Link to Daniel Shiffman's video: https://www.youtube.com/watch?v=h_aTgOl9J5I

// Stars
// Based on the Make a Planet in p5.js video by Kazuki Umeda
// Link to Kazuki Umeda's video: https://www.youtube.com/watch?v=CuD_HHrmDiA

class BodyRenderer {
  constructor(bodySize) {
    this.setBodySize(bodySize); // Ensure body size is set before initializing positions
    this.starPos = [];
    this.amp_history = [];
    this.lastPositions = [
      {x: 0, z: 0},
      {x: 0, z: 0},
      {x: 0, z: 0},
      {x: 0, z: 0}
    ];
    this.initStarPositions();
    this.t = 1; 
    this.t2 = 45; 
    this.planetRotation = 0;

  }

  setBodySize(bodySize) {
    this.bodySize = bodySize; // body size is a factor tied to the screen width and height size
    this.ringDiameter = 70 * this.bodySize;
    this.ringWidth = 3 * this.bodySize;
    this.moonSize = 0.07 * this.bodySize;
    this.planetSize = 0.66 * this.bodySize;
  }

  initStarPositions() {
    for (let i = 0; i < 150; i++) {
      let theta = random(180); // Random angle between 0 and PI
      let phi = random(360); // Random angle between 0 and TWO_PI
      let pos = createVector(
        2000 * sin(theta) * cos(phi),
        2000 * cos(theta),
        2000 * sin(theta) * sin(phi)
      );
      let brightness = random(50, 100);
      let size = random(1, 3); // Random star size
      this.starPos.push([pos, brightness, size]);
    }
  }

  renderBody() {
    this.amp_history.push(amplitud);
    push();

    // Improved material settings
    specularMaterial(60, 100, 50);
    shininess(50);
    texture(body00); // Apply the texture image

    // Improved lighting with RGB mode
    ambientLight(50);
    ambientLight(30, 30, 30); // Slight ambient light to simulate the presence of the two stars
    pointLight(255, 255, 255, 200, 200, 200); // White point light to simulate star
    directionalLight(255, 255, 0, -1, 0, 0); // Yellow directional light to simulate the other star
    spotLight(255, 255, 255, -200, -200, 400, 0, 0, -1, 16, 50); // Spotlight for dynamic effect

    // Render the main planet model
    push();
    scale(this.planetSize);
    rotateX(180);

    // Update the rotation angle based on playStateI
    if (playStateI === 1) {
        this.planetRotation -= 0.02; // Update the rotation angle
    }
    rotateZ(this.planetRotation); // Apply the rotation

    noStroke();
    model(model00); // Render the 3D model
    pop();

    // Render the ring around the planet
    push();
    strokeWeight(1.5); // Thickness of the ring
    noFill();

    // Precompute angle increment
    const angleIncrement = 360 / this.amp_history.length;
    const diameter = this.ringDiameter;

    beginShape();
    rotateX(-14);

    for (let i = 0; i < this.amp_history.length; i++) {
        let angle = i * angleIncrement;
        let cosAngle = cos(angle);
        let sinAngle = sin(angle);

        // Second ring, with a larger radius
        let r2 = diameter + map(this.amp_history[i], -.4, .4, diameter, 1); // Add extra radius
        let x2 = r2 * cosAngle;
        let y2 = r2 * sinAngle;

        let hue2 = map(this.amp_history[i], -1, 1, 150, 0);

        stroke(hue2, 80, 80); // Color of the second ring
        vertex(x2, 0, y2);
    }
    endShape(CLOSE);

    // Limit history array lengths
    if (this.amp_history.length > 360) {
        this.amp_history.shift();
    }

    pop();
    pop();
}

  renderMoons() {
    // Calculate orbit positions for the moons

      this.t = millis();  
      if (playStateI) this.t2 = 45 + (this.t / 150000 * 360 / TWO_PI); // Time in degrees 


      this.lastPositions[0].x = 260 * this.bodySize * cos(this.t2);
      this.lastPositions[0].z = 260 * this.bodySize * sin(this.t2);

      this.lastPositions[1].x = 260 * this.bodySize * cos(this.t2 + 180);
      this.lastPositions[1].z = 260 * this.bodySize * sin(this.t2 + 180);

      this.lastPositions[2].x = 260 * this.bodySize * cos(this.t2 + 90);
      this.lastPositions[2].z = 260 * this.bodySize * sin(this.t2 + 90);

      this.lastPositions[3].x = 260 * this.bodySize * cos(this.t2 + 270);
      this.lastPositions[3].z = 260 * this.bodySize * sin(this.t2 + 270);


    rotateX(-14);
    
    
    // First moon
    push();
    translate(this.lastPositions[0].x, 0, this.lastPositions[0].z);
    scale(this.moonSize);
    texture(body01); // Apply the texture image
    model(model01); // Render the 3D model
    pop();

    // Second moon
    push();
    translate(this.lastPositions[1].x, 0, this.lastPositions[1].z);
    scale(this.moonSize);
    texture(body01); // Apply the texture image
    model(model01); // Render the 3D model
    pop();

    // Third moon
    push();
    translate(this.lastPositions[2].x, 0, this.lastPositions[2].z);
    scale(this.moonSize);
    texture(body01); // Apply the texture image
    model(model01); // Render the 3D model
    pop();

    // Fourth moon
    push();
    translate(this.lastPositions[3].x, 0, this.lastPositions[3].z);
    scale(this.moonSize);
    texture(body01); // Apply the texture image
    model(model01); // Render the 3D model
    pop();
  }

  stars() {
    push();
    noStroke();
    for (let i = 0; i < this.starPos.length; i++) {
      let pos = this.starPos[i][0];
      let brightness = this.starPos[i][1];
      let size = this.starPos[i][2];

      let twinkle = brightness + sin(millis() * 0.001 + i);
      push();
      translate(pos.x, pos.y, pos.z);
      strokeWeight(size); 
      stroke(twinkle);
      point(0, 0, 0);
      pop();
    }
    pop();
  }
}
