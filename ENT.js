let sw, sh; // window size
let padX; // gui separation
var btW, btH, sliderW, sliderH; 
let trackI, filterI; // track 1 -  
let font1; // font variable
let playStateI; 
let params; // url parameters
let trackI_speed, levelI; 
let tempID;
let loadingBar, loadP; 
let xSlider, ySlider, zSlider;
let bcol, col; 


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


var game, deck, loadDeck;

var easycam,
    state = {
      distance: 1500, //final distance
      center  : [0, 0, 0],
      rotation: [1., 0., 0., 0.],
    },
    panelX=30, panelY=45;

document.oncontextmenu = () => false; // no right click

//var playButtonI; 

function preload() {

  params = getURLParams();

  game = loadJSON("data/"+params.g+".json");

  font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');

}

function setup() {

  getAudioContext().suspend();   // mimics the autoplay policy

  
  // Initialize global variables 

  sw= window.innerWidth;
  sh= window.innerHeight;
  padX = sw/80.; 
  padY = sh/80.; 

  bcol = color(0, 0, 0, 10);
  col = color(255, 0, 0);


  btW = 80.;
  btH = 80.;
  sliderW = sw*.34;
  sliderH = sh*.055;

if(params.d==0){
      card = game.skys0[params.c]; 
};
if(params.d==1){
      card = game.skys00[params.c]; 
};     
if(params.d==2){
      card = game.skys000[params.c];
};

  print (card);


  trackI = loadSound(card.filename, loaded, errorLoadingAudio,loadingAudio);
  trackI.playMode('restart');
  filterI = new p5.HighPass();

  createCanvas(sw, sh, WEBGL);
  setAttributes('antialias', true);

  easycam = createEasyCam();
  easycam.setState(state, 3000); // animate to state in 3 second

  playStateI= 0;
  

  // set initial camera state

 // easycam.setDistanceMin(333);
 // easycam.setDistanceMax(3333);
  easycam.state_reset =  state;
 // easycam.removeMouseListeners();
  easycam.setPanScale(.02);

 
  createDom(); 


// use the loaded font
  textFont(font1);
  textSize(21);

} 

function draw(){

  noStroke();
  lights();

  fill(100, 110, 0);

  let world_dist= easycam.getDistance();
  
  trackI_speed = map (xSlider.value(), 0., 255., float(card.minSpeed), float(card.maxSpeed));
  levelI = map (zSlider.value(), 0., 255., 0., 1.);
  world_dist = map (zSlider.value(), 0., 255., 3333., 333.);


  trackI.setVolume(levelI);
  trackI.rate(trackI_speed);


  rotateY((frameCount*trackI_speed*playStateI)*0.077);
  
  easycam.setDistance(world_dist, 33.);
  

  // update sliders if easycam changes 

  //let world_dist2= easycam.getDistance();
  //let distanceUpdate = map (world_dist2,  3333., 333.,0., 255.);
  //zSlider.value(distanceUpdate);
  
  //let camRot = easycam.getRotation();
  //let rot_2 = map (camRot[2], -1., 1., 0., 255.);

  // let trackI_speed2 = map (levelI_2, 0., 1., 0., 255.);
  //xSlider.value(trackI_speed2);


  let freq, back; 

// ySlider mapping with 0 at the center 

if ( ySlider.value() >= 127.){
    freq = map(ySlider.value(), 127., 255., 20., 5000.);
    back = map(ySlider.value(), 127., 255., 0., 77.);

  }else{
    freq = map(ySlider.value(), 127., 0., 20., 5000.);
    back = map(ySlider.value(), 127., 0., 0., 77.);

  }
   filterI.freq(freq);

//Planet and Background color (back from ySlider)
  push();
  var r = (sin(frameCount * 0.001) * 0.5 + 0.5) * 255;
  var g = r - (sin(frameCount * 0.002) * 0.5 + 0.5) * 255;
  var b = 255-r-g;
  ambientMaterial(r,g,b);

  background(back, back, r);

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

  // Draw Data 

  easycam.beginHUD();

  let state = easycam.getState();
    // Render the background box for the HUD
    noStroke();

        // Render the labels
        fill(255, 0, 0);
        text("Distance:",panelX,panelY);
        text("Speed:",panelX,panelY+20);
        text("Min-Speed:",panelX,panelY+40);
        text("Max-Speed:",panelX,panelY+60);

       if (loadP){

        let tempF = frameRate()%30.; 
        if (tempF>15.){
        fill(0, 0,255);
          }else{
        fill(255, 0,0);
        }
 //       text(nfs (loadingBar*100., 1, 1), panelX+360,panelY+180);
       if (loadingBar < .99){
        text("Receiving Sound Waves",padX*4, sh-padX*6);
        text("please wait, unmute device...",padX*4, sh-padX*3);

       }else{
 
      text("Decoding Sound Waves,",padX*4, sh-padX*6);
      text("please wait, unmute device >>>",padX*4, sh-padX*3);

       }
      }
        // Render the state numbers
        fill(255,0,0);
        text(nfs(state.distance, 1, 3),panelX+110,panelY);
        text(nfs (trackI_speed ,    1, 3),panelX+90,panelY+20);
        text(nfs(card.minSpeed, 1, 3),panelX+150,panelY+40);
        text(nfs (card.maxSpeed ,    1, 3),panelX+150,panelY+60);

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

function loaded (){

  loadP = false; 

  xSlider.show();
  ySlider.show();
  zSlider.show();
  playButton.show();

  trackI.disconnect();
  trackI.connect(filterI);

}

function errorLoadingAudio (){
  
  let p = createP('errorLoadingAudio');
  p.style('font-size', '16px');
  p.position(10, 0);
  
}

function loadingAudio (_loadingN){
    
  loadingBar = _loadingN; 
  loadP = true; 

}


function createDom(){

  // create buttons

  playButton = createButton('play');

  playButton.position(sw-(btW+panelX), panelY-20);
  playButton.style('width', btW+'px');
  playButton.style('height', btW+'px');
  playButton.style('background-color', bcol);
  playButton.style('color', col);
  
  // create sliders

  var initSpeed = map (float((card.speed)), float(card.minSpeed), float(card.maxSpeed), 0., 255.);

  xSlider = createSlider(0., 255, initSpeed);
  xSlider.position(sw*.5-sliderW*.5, sh-sliderH*4);
  xSlider.style('width', sliderW+'px');
  xSlider.style('height', sliderH+'px');

  ySlider = createSlider(0, 255, 127);
  ySlider.position(sw*.5-sliderW*.5, sh-sliderH*3);
  ySlider.style('width', sliderW+'px');
  ySlider.style('height', sliderH+'px');

  zSlider = createSlider(0, 255, 127);
  zSlider.position(sw*.5-sliderW*.5, sh-sliderH*2);
  zSlider.style('width', sliderW+'px');
  zSlider.style('height', sliderH+'px');
  
  xSlider.hide();
  ySlider.hide();
  zSlider.hide();
  playButton.hide();

  playButton.mousePressed( playPause);


}
