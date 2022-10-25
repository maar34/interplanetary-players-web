let sw, sh; // window size
let padU; // gui separation
let trackI; // track 1 -  
let font1; // font variable
let playStateI; 
let params; // url parameters
let trackI_speed; 

var card = {
  id:"",
  filename:"",
  initTime:"",
  endTime:"",
  speed:"",
  minSpeed:"",
  maxSpeed:"",
  col1:"",
  col2:""
}
var pCard = {
  id:"",
  filename:"",
  initTime:"",
  endTime:"",
  speed:"",
  minSpeed:"",
  maxSpeed:"",
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



}

function setup() {

  getAudioContext().suspend();   // mimics the autoplay policy

  card = deck.skys1[1]; // here we update the actual card
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
  //easycam.state_reset =  state;

  //easycam.setRotationConstraint = [.31, .4, .41];   
  //easycam.setRotationConstraint(true, true, true);   
  easycam.setDistanceMin(333);
  easycam.setDistanceMax(3333);

 

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

  card.id = params.id;

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
  //let camRotX = 0.;
  //let camRotY = 150;


 // camRotX = camRot[1]*0.1+0.00;
 camRotY = camRot[2]*float(card.speed)+.034;

  let world_dist= easycam.getDistance();
 // let camSpeed = camRot[2]*float(card.speed); 

  let level = map( world_dist, 3300, 333, 0, 1, true);
  trackI_speed = map( camRot[2], -1, 1, float(card.minSpeed), float(card.maxSpeed), true);

  trackI.setVolume(level);
  trackI.rate(trackI_speed);

  rotateY((frameCount*playStateI*trackI_speed)*0.1);


  push();
  var r = (sin(frameCount * 0.001) * 0.5 + 0.5) * 255;
  var g = r - (sin(frameCount * 0.002) * 0.5 + 0.5) * 255;
  var b = 255-r-g;
  ambientMaterial(r,g,b);

  //rotateY(frameCount * camRotY*playStateI);
  //rotateX(frameCount * camRotX*playStateI);

  //state.rotation[0] = frameCount * camRotY*playStateI;

  sphere(80, 7, 7);
  rotateX(PI*.4);
  torus(120, 7, 6, 7);

  var r = (sin(frameCount * 0.001) * 1.5 + 1.5) * 255;
  var g = r - (sin(frameCount * 0.002) * 1.5 + 1.5) * 255;
  var b = 255-r-g;
  ambientMaterial(r,g,b);


  translate (- 260, 0., 0.);

  sphere(15, 7, 7);

  translate ( 520, 0., 0.);
  sphere(15, 7, 7);

  translate ( - 260, - 260., 0.);
  sphere(15, 7, 7);

  translate ( - 0, 520., 0. );
  sphere(15, 7, 7);

  pop();

  easycam.beginHUD();

  let state = easycam.getState();

  
    // Render the background box for the HUD
    noStroke();


        // Render the labels
        fill(0,255,0);
        text("Distance:",panelX+35,panelY+25);
        text("Speed:",panelX+35,panelY+25+20);
        text("Min-Speed:",panelX+35,panelY+25+40);
        text("Max-Speed:",panelX+35,panelY+25+60);

       
        text(params.id, panelX+35,panelY+25+40);

        // Render the state numbers
        fill(255,0,0);
        text(nfs(state.distance, 1, 2),panelX+140,panelY+25);
        text(nfs (trackI_speed ,    1, 10),panelX+120,panelY+25+20);
        text(nfs(card.minSpeed, 1, 2),panelX+160,panelY+25+40);
        text(nfs (card.maxSpeed ,    1, 10),panelX+160,panelY+25+60);

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

  trackI.pause();
  trackI.pause();
  trackI.pause();
  trackI.pause();
  trackI.pause();//need to repeat to be sure that this happens 

  playButton.html("play");
  playStateI = 0;

}

}

function reload (){
  
  trackI = loadSound(card.filename, loaded);


}


