
let playerI;
let playI;
let myFont, myFont2, myFont3;


var easycam,
    state = {
      distance: 1008,
      center  : [5, 3, -13],
      rotation: [0.3, -0.4, -0.1, 0.85]
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
  easycam.setState(state, 1000); // animate to state in 1 second
  easycam.state_reset = state;   // state to use on reset


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
  lights();
  sphere(100);
  
  // 2D screen-aligned rendering section
  easycam.beginHUD();

	let state = easycam.getState();

  
	  // Render the background box for the HUD
    noStroke();
    //fill(0);
   // rect(panelX,panelY,20,300);
    fill(0,0,255, 200); // a bit of transparency
    rect(panelX+20,panelY,580,100);

        // Render the labels
        fill(0,255,0);
        text("Distance:",panelX+35,panelY+25);
        text("Center:  ",panelX+35,panelY+25+20);
        text("Rotation:",panelX+35,panelY+25+40);
        text("Framerate:",panelX+35,panelY+25+60);

        // Render the state numbers
        fill(255,0,0);
        text(nfs(state.distance, 1, 2),panelX+140,panelY+25);
        text(nfs(state.center,   1, 2),panelX+120,panelY+25+20);
        text(nfs(state.rotation, 1, 3),panelX+140,panelY+25+40);
        text(nfs (frameRate(),    1, 2),panelX+160,panelY+25+60);

      easycam.endHUD();

  }

  function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    
  }

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}



