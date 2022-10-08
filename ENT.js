
let playerI;
let playI;
let myFont, myFont2, myFont3;
let mX, mY;

var easycam,
    state = {
      distance: 500, //final distance
      center  : [0, 0, 0],
      rotation: [-90., 0., 0., 0.]
    },
    panelX=0, panelY=20;


document.oncontextmenu = () => false; // no right click

//var playButtonI; 

function preload() {
  myFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf');
  myFont2 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');
  myFont3 = loadFont('fonts/Monoton-Regular.ttf');

 playerI = loadSound('https://dl.dropboxusercontent.com/s/0ynj027z1lui2xj/04%20Spherical%20Drops.mp3?raw=1');
}

function setup() {

  
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  setAttributes('antialias', true);

  easycam = createEasyCam();

  // set initial camera state
  easycam.state_reset = state;   // state to use on reset
  easycam.setRotationConstraint = [true, true, true];   
  //easycam.setRotationConstraint(true, true, true);   
  easycam.setDistanceMin(333);
  easycam.setDistanceMax(3333);



  mX= 0.;
  mY= 0.;
  
  // use the loaded font
  textFont(myFont2);
  textSize(21);
  //stroke(0,255,0);
  //strokeWeight(1);

 //playerI.loop();// song is ready to play during setup() because it was loaded during preload

  background(0, 0, 0);
} 

function draw(){


	background(0);
  noStroke();

  lights();

  fill(100, 110, 0);

  let camRot = easycam.getRotation();
  let camRotX = 0.;
  let camRotY = 150;

  camRotX = mY*0.1+0.00;
  camRotY = mX*0.1+.034;

  let world_dist= easycam.getDistance();
  let level = map( world_dist, 3300, 333, 0, 1, true);
 

  let speedI = map( camRot[1], -1, 1, -2, 2, true);
  let pitchI = map( camRot[2], -1, 1, -12, 12, true);

  

  //easycam.rotateY(world_angle);

  push();
  var r = (sin(frameCount * 0.01) * 0.5 + 0.5) * 255;
  var g = r - (sin(frameCount * 0.02) * 0.5 + 0.5) * 255;
  var b = 255-r-g;
  ambientMaterial(r,g,b);
 // translate(0,0, 30 + sin(frameCount * 0.05) * 40);
 // rotateZ(frameCount * 0.02);

 // rotateY(PI/4);
  rotateY(frameCount * camRotY);
  rotateX(frameCount * camRotX);

  sphere(80, 7, 7);
  rotateX(PI*.4);
  torus(120, 7, 6, 7);
  pop();

 




  // 2D screen-aligned rendering section
  easycam.beginHUD();

	let state = easycam.getState();

  
	  // Render the background box for the HUD
    noStroke();
    //fill(0);
   // rect(panelX,panelY,20,300);
   // fill(0,0,255, 255); // a bit of transparency
   // rect(panelX+20,panelY,580,100);

        // Render the labels
        fill(0,255,0);
        text("Distance:",panelX+35,panelY+25);
        text("Center:  ",panelX+35,panelY+25+20);
        text("Rotation:",panelX+35,panelY+25+40);
        text("Framerate:",panelX+35,panelY+25+60);
        text("camRotX:",panelX+35,panelY+25+80);
        text("camRotY:",panelX+35,panelY+25+100);
        text("speedI:",panelX+35,panelY+25+120);
        text("pitchI:",panelX+35,panelY+25+140);

        // Render the state numbers
        fill(255,0,0);
        text(nfs(state.distance, 1, 2),panelX+140,panelY+25);
        text(nfs(state.center,   1, 2),panelX+120,panelY+25+20);
        text(nfs(state.rotation, 1, 3),panelX+140,panelY+25+40);
        text(nfs (frameRate(),    1, 2),panelX+160,panelY+25+60);
        text(nfs (mX ,    1, 10),panelX+160,panelY+25+80);
        text(nfs (mY,    1, 10),panelX+160,panelY+25+100);
        text(nfs (speedI ,    1, 10),panelX+160,panelY+25+120);
        text(nfs (pitchI,    1, 10),panelX+160,panelY+25+140);


      easycam.endHUD();

  }

  function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);

  }

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}



function mouseDragged() {
  
  mX= map(mouseX, 0, window.innerWidth, -1, 1, true); 
  mY= map(mouseY, 0, window.innerHeight, 1, -1, true);  


  }