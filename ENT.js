let sw, sh; // window size
let padX; // gui separation
var btW, btH, sliderW, sliderH, initSpeed; 
let trackI, filterI; // track 1 -  
let font1; // font variable
let playStateI; 
let params; // url parameters
let trackI_speed, levelI, worldI_dist; 
let tempID;
let loadingBar, loadP; 
let xSlider, ySlider, zSlider;
let bcol, col; 
let freq, back; 
let t1, t2, t3, t4, t5, t6, t7, t8, t11; 
var game, deck, loadDeck;
let cam1; 
let portrait;


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

function preload() {

    params = getURLParams();
  
    game = loadJSON("data/"+params.g+".json");
  
    font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');
  
  }

  function setup() {

    getAudioContext().suspend();   // mimics the autoplay policy

  // Initialize global variables 

    initVariables();
 

  playStateI= 0;
  worldI_dist =800;


  bcol = color(0, 0, 0, 10);
  col = color(255, 0, 0);




    if(params.d==0){
        card = game.skys0[params.c]; 
    };
    if(params.d==1){
        card = game.skys00[params.c]; 
    };     
    if(params.d==2){
        card = game.skys000[params.c];
    };
   
    createDom(); 

    // Create Canvas - Always the landscape.  
        createCanvas(window.innerWidth, window.innerHeight, WEBGL);

        setAttributes('antialias', true);

    cam1 = createCamera();
    cam1.setPosition(0, 0, worldI_dist);
    //cam1.lookAt(0, 0, 0);
    //cam1.ortho();
    setCamera(cam1);

    trackI = loadSound(card.filename, loaded, errorLoadingAudio,loadingAudio);
    trackI.playMode('restart');
    filterI = new p5.HighPass();
    trackI_speed = card.speed;
    
    // Use the selected Font 

    textFont(font1);
    textSize(21);

  }

  function draw(){
    background(back, 0, 0);

    noStroke();
    lights();
    fill(255, 255, 255);

  if (loadP)loadGUI();

      //Planet and Background color (back from ySlider)
    push();
    var r = (sin(frameCount * 0.001) * 0.5 + 0.5) * 255;
    var g = r - (sin(frameCount * 0.002) * 0.5 + 0.5) * 255;
    var b = 255-r-g;
    ambientMaterial(r,g,b);

    fill(r, g, b);

    rotateY((frameCount*trackI_speed*playStateI)*0.077);
  
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

    noFill(); 

    
    stroke(0, 255, 0);
    //(translate (-sw*.5, -sh*.5, cam1.eyeZ-sw*.77);
    
//    rect (0, 0, sw , sh);
/*scale (.88);


noFill();

beginShape();
vertex(sw, sh);
vertex(sw, sh);
vertex(sw, 0+padX*4);
vertex(sw-padX*4, 0);
vertex(0, 0);
vertex(0, sh-sliderW);
vertex(0+sliderW, sh);
vertex(sw-padX*3, sh);
curveVertex(sw, sh);
vertex(sw, sh);

endShape();
*/

//orbitControl();
}


  function playPause(){


    if(!trackI.isPlaying()){
      userStartAudio();  // mimics the autoplay policy
      playButton.html('II');
     // playButton.style('transform', 'rotate(305deg)');

      playStateI = 1;
      trackI.loop();
  
    }else{
  
      trackI.pause();
      trackI.pause();
      trackI.pause();
      trackI.pause();
      trackI.pause();//need to repeat to be sure that this happens 
      playButton.style('transform', 'rotate(0deg)');
      playButton.html('&#9655');
      playStateI = 0;

    }
  
  }

  function loaded (){

    loadP = false; 
  
    xSlider.show();
    ySlider.show();
    zSlider.show();
    playButton.show();
    guiData();

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
  
    playButton = createButton('&#9655');
    playButton.position(sw*.5, sh*.9);
    //playButton.style('width', btW+'px');
    //playButton.style('height', btH+'px');
    playButton.style('background-color', bcol);
    playButton.style('color', 'lawngreen');
    playButton.style('font-size', '2.5rem');
    playButton.style('border', 'none');
    playButton.style('background', 'none');

    
    // create sliders
  
    initSpeed = map (float((card.speed)), float(card.minSpeed), float(card.maxSpeed), 0., 255.);
  
    xSlider = createSlider(0., 255, initSpeed);
    xSlider.position(sw*.5-(sliderW*.5), sh*.8);
    xSlider.style('width', sliderW+'px');

    xSlider.addClass("slider");

   // xSlider.style('height', sliderH+'px');

    xSlider.input(xInput);
    

    ySlider = createSlider(0, 255, 127);
    ySlider.position(0., sh*.5);
    ySlider.style('width', sliderW+'px');
    ySlider.style('transform', 'rotate(-90deg)');

    ySlider.addClass("slider");


  //  ySlider.style('height', sliderH+'px');

    ySlider.input(yInput);

    zSlider = createSlider(0, 255, 127);
    zSlider.position(sw*.6, sh*.5);
    zSlider.style('width', sliderW+'px');
    //zSlider.style('height', padY+'px');
    zSlider.addClass("slider");
    zSlider.style('transform', 'rotate(-90deg)');
    zSlider.input(zInput);

    
    xSlider.hide();
    ySlider.hide();
    zSlider.hide();
    playButton.hide();
    playButton.mousePressed( playPause);
  

  }

  function updateDom(){
  
    // move buttons
  
    playButton.position(sw*.5, sh*.9);
    
    // move sliders
    
    xSlider.position(sw*.5-(sliderW*.5), sh*.8);

    ySlider.position(0 , sh*.5);

    zSlider.position(sw*.8, sh*.5);

  }

  function xInput(){
    trackI_speed = map (xSlider.value(), 0., 255., float(card.minSpeed), float(card.maxSpeed));
    trackI.rate(trackI_speed);
    t6.html(nfs (trackI_speed,    1, 2));

  }

  function yInput(){
  // ySlider mapping with 0 at the center 
  if ( ySlider.value() >= 127.){
    freq = map(ySlider.value(), 127., 255., 20., 5000.);
    back = map(ySlider.value(), 127., 255., 0., 255.);
  }else{
    freq = map(ySlider.value(), 127., 0., 20., 5000.);
    back = map(ySlider.value(), 127., 0., 0., 255.);
  }

   filterI.freq(freq);
   print (freq); 


  }

  function zInput(){
    levelI = map (zSlider.value(), 0., 255., 0., 1.);
    trackI.setVolume(levelI);
    worldI_dist = map (zSlider.value(), 0., 255., 3333., 333.);
    t5.html(nfs (worldI_dist,    1, 2));

    cam1.setPosition(0, 0, worldI_dist);
    setCamera(cam1);

  }

  function guiData(){
    
    let offset = 3.;

    translate (-width*offset, -height*offset, 0.);

    //noStroke();
    textFont(font1);
    textSize(21);

    // Render the labels

     t1 = createP('Distance:');
    t1.position(padX*offset,padY*offset);

     t2 = createP('Speed:');
    t2.position(padX*offset,padY*offset+20);

     t3 = createP('Min-Speed:');
    t3.position(padX*offset,padY*offset+40);

     t4 = createP('Max-Speed:');
    t4.position(padX*offset,padY*offset+60);

    t5 = createP();
    t5.html(worldI_dist);

    t5.position(padX*offset+90,padY*offset);

     t6 = createP(trackI_speed);
    t6.position(padX*offset+70,padY*offset+20);

     t7 = createP(card.minSpeed);
    t7.position(padX*offset+105,padY*offset+40);

     t8 = createP(card.maxSpeed);
    t8.position(padX*offset+110,padY*offset+60);




        // Render the state numbers

/*
  //let state = easycam.getState();
    // Render the background box for the HUD
    noStroke();

        // Render the labels
        fill(255, 0, 0);
        text("Distance:",padX,padY, map (worldI_dist, 3333., 333., 333., 33.));
        text("Speed:",padX,padY+20);
        text("Min-Speed:",padX,padY+40);
        text("Max-Speed:",padX,padY+60);


 
 
        // Render the state numbers
        fill(255,0,0);
        text(nfs(1, 1, 3),padX+110,padY);
        text(nfs (trackI_speed ,    1, 3),padX+90,padY+20);
        text(nfs(card.minSpeed, 1, 3),padX+150,padY+40);
        text(nfs (card.maxSpeed ,    1, 3),padX+150,padY+60);

*/

  }

  function loadGUI (){
    ///// LOADING TEXTS 
    textAlign(CENTER);
    let tempF = frameRate()%30.; 
    if (tempF>15.){
    fill(0, 0,255);
      }else{
    fill(255, 0,0);
    }
  //       text(nfs (loadingBar*100., 1, 1), panelX+360,panelY+180);
  if (loadingBar < .99){
    
    text("Receiving Sound Waves",0, sh*.5-padX*6);
    text("please wait, unmute device...",0, sh*.5-padX*3);

  }else{
      text("Decoding Sound Waves,", 0, sh*.5-padX*6);
  text("please wait, unmute device >>>", 0, sh*.5-padX*3);

  }
}

function windowResized() {

    initVariables(); 
    resizeCanvas(sw, sh);
    updateDom();

}


function touchMoved() {
  // do some stuff
  var lef, rig, dow, up; 
  var lef = sw*.2; 
  var rig = sw*.8; 
  var dow = sh*.2; 
  var up = sh*.8; 

  if (mouseX>lef&&mouseX<rig){
    if (mouseY>dow&&mouseY<up){
     // return false;

  }

}

function logslider(position) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;

  // The result should be between 100 an 10000000
  var minv = Math.log(100);
  var maxv = Math.log(10000000);

  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);

  return Math.exp(minv + scale*(position-minp));
}


}


function mousePressed(){

 }

 function doubleClicked() {
  xSlider.value(initSpeed);
  ySlider.value(127);
  zSlider.value(127);
  xInput();
  yInput();
  zInput();
}

 function initVariables(){

  sw= window.innerWidth;
  sh= window.innerHeight;

  padX = sw/80.; 
  padY = sh/80.; 
  btW = sw*.2;
  btH = sw*.2;
  sliderW = sw*.4;
  sliderH = sliderW*.25;


 }