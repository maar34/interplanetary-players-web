class BodyRenderer {
  constructor(bodySize) {
    this.bodySize = bodySize;
    this.starPos = [];
    this.initStarPositions();
    this.ringDiameter; 
    this.ringWidth; 
    this.moonSize; 
    this.planetSize; 
    this.lo_history = [];
    this.mid_history = [];
    this.hi_history = [];

  }

  setBodySize(bodySize) {
    this.bodySize = bodySize; // body size is a factor tied to the screen width and height size.
    this.ringDiameter = 70 * this.bodySize; 
    this.ringWidth = 3 * this.bodySize; 
    this.moonSize = .07* this.bodySize; 
    this.planetSize = .66* this.bodySize; 
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
      let size = random(1., 3.); // Random star size
      this.starPos.push([pos, brightness, size]);
    }
  }

  renderBody() {
    this.lo_history.push(lo);
    this.mid_history.push(mid);
    this.hi_history.push(hi);

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
    rotateX(90);
    rotateZ(-frameCount * 0.6); // Slow rotation for dynamic effect
    noStroke();
    model(model00); // Render the 3D model
    pop();

    // Render the ring around the planet
    push();
    strokeWeight(2); // Thickness of the ring
    noFill();

    // Precompute angle increment
    const angleIncrement = 360 / this.lo_history.length;
    const diameter = this.ringDiameter;
/*
    beginShape();
    for (let i = 0; i < this.lo_history.length; i++) {
      let angle = i * angleIncrement;
      let cosAngle = cos(angle);
      let sinAngle = sin(angle);
    
      // Primer anillo
      let r1 = diameter + map(this.lo_history[i], -1, 1, 0, diameter);
      let x1 = r1 * cosAngle;
      let y1 = r1 * sinAngle;
    
      let hue1 = map(this.lo_history[i], -1, 1, 150, 0);
    
      stroke(hue1, 80, 80); // Color del primer anillo
      vertex(x1, 0, y1);
    }
    endShape(CLOSE);
    
    beginShape();
    for (let i = 0; i < this.mid_history.length; i++) {
      let angle = i * angleIncrement;
      let cosAngle = cos(angle);
      let sinAngle = sin(angle);
    
      // Segundo anillo, con un radio más grande
      let r2 = diameter + map(this.mid_history[i], -1, 1, 0, diameter) + 30; // Añadir extraRadius
      let x2 = r2 * cosAngle;
      let y2 = r2 * sinAngle;
    
      let hue2 = map(this.mid_history[i], -1, 1, 150, 0);
    
      stroke(hue2, 80, 80); // Color del segundo anillo
      vertex(x2, 0, y2);
    }
    endShape(CLOSE);
    
    beginShape();
  for (let i = 0; i < this.hi_history.length; i++) {
    let angle = i * angleIncrement;
    let cosAngle = cos(angle);
    let sinAngle = sin(angle);

    // Tercer anillo, con un radio aún más grande
    let r3 = diameter + map(this.hi_history[i], -1, 1, 0, diameter) + 60; // Añadir extraRadius para el tercer anillo
    let x3 = r3 * cosAngle;
    let y3 = r3 * sinAngle;

    let hue3 = map(this.hi_history[i], -1, 1, 150, 0);

    stroke(hue3, 80, 80); // Color del tercer anillo
    vertex(x3, 0, y3);
  }
endShape(CLOSE);
*/

    


    // Limit history array lengths
    if (this.lo_history.length > 360) {
      this.lo_history.shift();
      this.mid_history.shift();
      this.hi_history.shift();
    }

    pop();

    // Render smaller moons or spheres around the planet
    this.renderMoons();
    pop();
}





  renderMoons() {
    // Calculate orbit positions for the moons
    let t = 45 + (millis() / 100000 * 360 / TWO_PI); // Time in degrees
    // First moon
    push();
    let x1 = 260 * this.bodySize * cos(t);
    let z1 = 260 * this.bodySize * sin(t);
    translate(x1, 0, z1);
    scale(this.moonSize);
    texture(body01); // Apply the texture image
    model(model01); // Render the 3D model
    pop();

    // Second moon
    push();


    let x2 = 260 * this.bodySize * cos(t + 180);
    let z2 = 260 * this.bodySize * sin(t + 180);
    translate(x2, 0, z2);
    scale(this.moonSize);
    texture(body01); // Apply the texture image
    model(model01); // Render the 3D model
    pop();

    // Third moon
    push();
    let x3 = 260 * this.bodySize * cos(t + 90);
    let z3 = 260 * this.bodySize * sin(t + 90);
    translate(x3, 0, z3);
    scale(this.moonSize);
    texture(body01); // Apply the texture image
    model(model01); // Render the 3D model
    pop();

    // Fourth moon
    push();
    let x4 = 260 * this.bodySize * cos(t + 270);
    let z4 = 260 * this.bodySize * sin(t + 270);
    translate(x4, 0, z4);
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
      strokeWeight (size); 
      stroke (twinkle);
      point(0, 0, 0);
      pop();
    }
    pop();
  }

}
