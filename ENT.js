let sw, sh; 
let padU; 
let playerI;
let playI;
let myFont, myFont2, myFont3;
let mX, mY;
let speedI, pitchI, playStateI; 
let button;


var easycam,
    state = {
      distance: 1500, //final distance
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

  
  sw= window.innerWidth;
  sh= window.innerHeight;
  padU = 10; 

  createCanvas(sw, sh, WEBGL);
  setAttributes('antialias', true);

  easycam = createEasyCam();


  easycam.setState(state, 3000); // animate to state in 1 second

  // set initial camera state
  easycam.state_reset = state;   // state to use on reset

  
  //easycam.setRotationConstraint = [true, true, true];   
  //easycam.setRotationConstraint(true, true, true);   
  easycam.setDistanceMin(333);
  easycam.setDistanceMax(3333);



  mX= 0.;
  mY= 0.;
  speedI= 1.;

  playStateI= 0;
  pitchI= 1.;
 
  let bcol = color(200, 0, 0, 10);
  let col = color(0, 200, 0, 200);


  playButton = createButton('play');
  playButton.position(sw/2-60, sh-padU*6);
  playButton.style('width', '120px');
  playButton.style('height', '30px');
  playButton.style('background-color', bcol);
  playButton.style('color', col);


  playButton.mousePressed( playPause);


  // use the loaded font
  textFont(myFont2);
  textSize(21);
  //stroke(0,255,0);
  //strokeWeight(1);

 // song is ready to play during setup() because it was loaded during preload

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

  camRotX = camRot[1]*0.1+0.00;
  camRotY = camRot[2]*0.1+.034;

  let world_dist= easycam.getDistance();
  let level = map( world_dist, 3300, 333, 0, 1, true);
 

  speedI = map( camRot[1], -1, 1, -1, 3, true);
  pitchI = map( camRot[2], -1, 1, -12, 12, true);

  playerI.setVolume(level);
  playerI.rate(speedI);

  //easycam.rotateY(world_angle);

  push();
  var r = (sin(frameCount * 0.01) * 0.5 + 0.5) * 255;
  var g = r - (sin(frameCount * 0.02) * 0.5 + 0.5) * 255;
  var b = 255-r-g;
  ambientMaterial(r,g,b);
 // translate(0,0, 30 + sin(frameCount * 0.05) * 40);
 // rotateZ(frameCount * 0.02);

 // rotateY(PI/4);
  rotateY(frameCount * camRotY*playStateI);
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
        text("SpeedI:",panelX+35,panelY+25+20);
       
       /* text("Center:  ",panelX+35,panelY+25+20);
        text("Rotation:",panelX+35,panelY+25+40);
        text("Framerate:",panelX+35,panelY+25+60);
        text("camRotX:",panelX+35,panelY+25+80);
        text("camRotY:",panelX+35,panelY+25+100);
        text("pitchI:",panelX+35,panelY+25+140);*/

        // Render the state numbers
        fill(255,0,0);
        text(nfs(state.distance, 1, 2),panelX+140,panelY+25);
        text(nfs (speedI ,    1, 10),panelX+120,panelY+25+20);

/*        text(nfs(state.center,   1, 2),panelX+120,panelY+25+20);
        text(nfs(state.rotation, 1, 3),panelX+140,panelY+25+40);
        text(nfs (frameRate(),    1, 2),panelX+160,panelY+25+60);
        text(nfs (camRotX ,    1, 10),panelX+160,panelY+25+80);
        text(nfs (camRotY,    1, 10),panelX+160,panelY+25+100);
        text(nfs (playStateI,    1, 10),panelX+160,panelY+25+140);*/


      easycam.endHUD();

  }

  function windowResized() {

    sw= window.innerWidth;
    sh= window.innerHeight;

    resizeCanvas(sw, sh);
    easycam.setViewport([0,0,sw, sh]);

  }


  /// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {


  // do some stuff
  //return false;

}

function playPause(){
if(!playerI.isPlaying()){
playerI.loop();
playButton.html("pause");
//easycam.setInterpolatedRotation([0., 0., 0., 0.], playStateI, 200);
playStateI = 1;

}else{
playerI.pause();
playButton.html("play");
playStateI= easycam.getRotation()
//easycam.setRotation(Dw.Rotation.create({angles_xyz:[0.0001,0.,0.]}), 2000);
playStateI = 0;

}

}