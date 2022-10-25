let sw, sh; // window size
let padU; // gui separation
let trackI; // track 1 -  
let font1; // font variable
let playStateI; 
let params; 
let id ;
var card = {
  id:"",
  filename:"",
  initTime:"",
  endTime:"",
  speed:"",
  col1:"",
  col2:""
}
var pCard = {
  id:"",
  filename:"",
  initTime:"",
  endTime:"",
  speed:"",
  col1:"",
  col2:""
}

var deck;

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

  params = getURLParams();

  deck = loadJSON("data/334.json")

  font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');

  getAudioContext().suspend();   // mimics the autoplay policy


}

function setup() {

  
  card = deck.skys1[2]; // here we update the actual card
  pCard = deck.skys1[4]; // here we update the previous actual card


  print("this is the loaded card", card);
  print("this is the loaded previous card", pCard);


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

 
  card.speed= 1.;

  playStateI= 0;
 
  let bcol = color(200, 0, 0, 10);
  let col = color(0, 200, 0, 200);


  playButton = createButton('play');
  playButton.position(sw/2-60, sh-padU*6);
  playButton.style('width', '120px');
  playButton.style('height', '30px');
  playButton.style('background-color', bcol);
  playButton.style('color', col);

  playButton.hide();


  playButton.mousePressed( playPause);

  // use the loaded font
  textFont(font1);
  textSize(21);

  id = params.id;

 reload();
///
 trackI.playMode('restart');

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

  card.speed = map( camRot[1], -1, 1, -1, 3, true);

  trackI.setVolume(level);

  if (card.speed != 0.0){
  trackI.rate(card.speed);

}

  push();
  var r = (sin(frameCount * 0.001) * 0.5 + 0.5) * 255;
  var g = r - (sin(frameCount * 0.002) * 0.5 + 0.5) * 255;
  var b = 255-r-g;
  ambientMaterial(r,g,b);

  rotateY(frameCount * camRotY*playStateI);
  rotateX(frameCount * camRotX*playStateI);

  sphere(80, 7, 7);
  rotateX(PI*.4);
  torus(120, 7, 6, 7);
  pop();

  easycam.beginHUD();

  let state = easycam.getState();

  
    // Render the background box for the HUD
    noStroke();


        // Render the labels
        fill(0,255,0);
        text("Distance:",panelX+35,panelY+25);
        text("Speed:",panelX+35,panelY+25+20);
       
        text(params.id, panelX+35,panelY+25+40);

        // Render the state numbers
        fill(255,0,0);
        text(nfs(state.distance, 1, 2),panelX+140,panelY+25);
        text(nfs (card.speed ,    1, 10),panelX+120,panelY+25+20);


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

function loaded (){

  playButton.show();


}

function playPause(){
if(playButton.html()=="play"){
userStartAudio();  // mimics the autoplay policy
playButton.html("pause");

//easycam.setInterpolatedRotation([0., 0., 0., 0.], playStateI, 200);
playStateI = 1;
trackI.loop();

}else{
 userStartAudio();  // mimics the autoplay policy

trackI.pause();
trackI.pause();
trackI.pause();//need to repeat to be sure that this happens 

playButton.html("play");
playStateI = 0;

}

}

function reload (){
  
  trackI = loadSound(card.filename, loaded);

 print(deck);
 print(deck.skys1[2].filename);

}