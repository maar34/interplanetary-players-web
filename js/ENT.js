


let sw, sh; // window size
let padX; // gui separation
var btW, btH, sliderW, sliderH, initSpeed; 
let trackI, filterI; // track 1 -  
let font1; // font variable
let playStateI; 
let params; // url parameters
let levelI, worldI_dist, cardColor; 
let tempID;
let loadingBar, loadP; 
let xSlider, ySlider, zSlider;
let bcol, col; 
let freq, back; 
let t1, t2, t3, t4, t5, t6, t7, t8, t11; 
var game, deck, suit, loadDeck;
let cam1; 
let portrait;
let deltaX, startX, startY;
let notDOM; 
let device;
let paramX, paramY, paramZ; 

let trackI_speed = 1.0; 
var numSamples = 1024;
// Array of amplitude values (-1 to +1) over time.
var samples = [];

var card = {
  id:"",
  filename:"",
  initTime:"",
  endTime:"",
  speed:"",
  minSpeed:"",
  maxSpeed:"",
  col1:"",
  col2:"",
  engine:""
}
document.oncontextmenu = () => false; // no right click

var easycam,
    state = {
      distance: 388, //final distance
      center  : [0, 0, 0],
      rotation: [1., 0., 0., 0.],
    },
    panelX=30, panelY=45;

document.oncontextmenu = () => false; // no right click

function preload() {

    params = getURLParams();
  
    game = loadJSON("data/"+params.g+".json");
  
    font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');

   
  
  }

  document.body.onclick = () => {
    context.resume();
  }
   // prevent screen movement on touchstart event
   document.body.addEventListener('touchstart', function(e) {
    if (e.target == document.body) {
      e.preventDefault();
    }
  }, {passive: false});

function setup() {
    
    initVariables();
 
    playStateI= 0;
    worldI_dist =940;

    bcol = color(0, 0, 0, 10);
    col = color(255, 0, 0);

    if(params.s==0){
        card = game.A[params.c]; 
    };
    if(params.s==1){
        card = game.B[params.c];
    };     
    if(params.s==2){
        card = game.C[params.c];
    };
    trackI_speed = card.speed;

    //print (card.engine); 

    createDom(); 

    // Create Canvas - Always the landscape.  
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    setAttributes('antialias', true);

    easycam = createEasyCam();
    easycam.setState(state, 3000); // animate to state in 3 second
    easycam.setDistanceMin(333);
    easycam.setDistanceMax(1544);
    easycam.state_reset =  state;
    easycam.setPanScale(0.0);
    easycam.setPanScale(.02);
    
    //easycam.removeMouseListeners();


    cardColor = color(card.col1); 

    // Use the selected Font 

    textFont(font1);
    textSize(27);
    createRNBO();    

//    loadingAudio(0);
  }

  function draw(){
   if(playStateI==1)background(0, 0, 0);
    noStroke();
    lights();
    const wsize= 1.2
   

    if (loadP)loadGUI();

      //Planet and Background color (back from Sliders)
    push();
   // translate (0., 0., -666.);

    normalMaterial();

    rotateY((frameCount* trackI_speed *playStateI)*0.077);
  
    sphere(80, 6, 6);
    rotateX(PI*.4);
    torus(120*wsize, 7*wsize, 6, 7);
  
    translate (- 260, 0., 0.);
    sphere(15, 6, 6);
  
    translate ( 520, 0., 0.);
    sphere(15, 6, 6);
  
    translate ( - 260, - 260., 0.);
    sphere(15, 6, 6);
  
    translate ( - 0, 520., 0. );
    sphere(15, 6, 6);
    //translate (0., 0., 666.);

    pop();
    noFill(); 
    stroke(cardColor);

    easycam.beginHUD();

    if(playStateI==0)fill(0, 0, 0, .8);

    const margin = 33; 
    strokeWeight(3.);
    beginShape();
    vertex(margin+0, margin+0);
    vertex(sw*.86,margin+0);
    vertex(sw-margin, sh*.14);
    vertex(sw-margin, sh-margin);
    vertex(sw*.14, sh-margin);
    vertex(margin+0, margin+sh*.86);
    vertex(margin+0, margin+0);
    endShape();


    easycam.endHUD();

}


function playPause(){

    notDOM = false; 

    let messageEvent;


    if(playStateI==0){

      playButton.html('II');     
     messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [1]);

      playStateI = 1;
  
    }else{
  
      messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [0]);

      playButton.style('transform', 'rotate(0deg)');
      playButton.html('&#9655');
      playStateI = 0;

    }
    device.scheduleEvent(messageEvent);
    xInput();

    
  }

  function xB(){
    notDOM = false; 
    xSlider.value(initSpeed);
    xInput();

  }

  function yB(){
    notDOM = false; 
    ySlider.value(127);
    yInput();
  }

  function zB(){
    notDOM = false; 
    zSlider.value(197);
    zInput();
  }

  function loaded (){

    loadP = false; 
  

    xSlider.show();
    ySlider.show();
    zSlider.show();
    playButton.show();
    xButton.show();
    yButton.show();
    zButton.show();

    guiData();

    //trackI.disconnect();
    //trackI.connect(filterI);

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
  
    let domColor = card.col1; 
    // create buttons

    playButton = createButton('&#9655');
    playButton.position(sw*.45, 34);
    playButton.style('width', btW+'px');
    playButton.style('height', btH+'px');
    playButton.style('background-color', domColor);
    playButton.style('color', domColor);
    playButton.style('font-size', '2.5rem');
    playButton.style('border', 'none');
    playButton.style('background', 'none');
    playButton.mousePressed(playPause);
    playButton.mouseReleased(releaseDOM);
    playButton.touchEnded(releaseDOM);
    //playButton.addClass("crosshair");

    xButton = createButton('&#x2609');
    xButton.position(innerWidth*.5-(btW*.5),innerHeight*.8);

    xButton.style('width', btW+'px');
    xButton.style('height', btH+'px');
    xButton.style('background-color', domColor);
    xButton.style('color', domColor);
    xButton.style('font-size', '2.5rem');
    xButton.style('border', 'none');
    xButton.style('background', 'none');
    xButton.mousePressed(xB);
    xButton.touchStarted(xB);
    xButton.mouseReleased(releaseDOM);
    xButton.touchEnded(releaseDOM);
    //xButton.addClass("crosshair");

    yButton = createButton('&#x2609');
    yButton.position(-11., innerHeight*.44);
    yButton.style('width', btW+'px');
    yButton.style('height', btH+'px');
    yButton.style('background-color', domColor);
    yButton.style('color', domColor);
    yButton.style('font-size', '2.5rem');
    yButton.style('border', 'none');
    yButton.style('background', 'none');
    yButton.mousePressed(yB);
    yButton.touchStarted(yB);
    yButton.mouseReleased(releaseDOM);
    yButton.touchEnded(releaseDOM);
    //yButton.addClass("crosshair");

    zButton = createButton('&#x2609');
    zButton.position(sw*.8, innerHeight*.44);
    zButton.style('width', btW+'px');
    zButton.style('height', btH+'px');
    zButton.style('background-color', domColor);
    zButton.style('color', domColor);
    zButton.style('font-size', '2.5rem');
    zButton.style('border', 'none');
    zButton.style('background', 'none');
    zButton.mousePressed(zB);
    zButton.touchStarted(zB);
    zButton.mouseReleased(releaseDOM);
    zButton.touchEnded(releaseDOM);
    //zButton.addClass("crosshair");
    
    // create sliders
  
    initSpeed = map (float((card.speed)), float(card.minSpeed), float(card.maxSpeed), 0., 255.);
    xSlider = createSlider(0., 255, initSpeed);
    xSlider.position(sw*.5-(sliderW*.5), sh*.8);
    xSlider.style('width', sliderW+'px');
    xSlider.addClass("slider");
   // xSlider.style('height', sliderH+'px');
    xSlider.input(xInput);
    xSlider.mousePressed(pressDOM);
    xSlider.touchStarted(pressDOM);
    xSlider.mouseReleased(releaseDOM);
    xSlider.touchEnded(releaseDOM);

    //   myElement.style('background', domColor); // this change only the line color*/
    //xSlider.style('::-webkit-slider-thumb:background', 'red');
    //xSlider.style('background', 'rgba(0, 0, 0, 0)');
   // myClass.style(`::-webkit-slider-thumb { background: ${domColor}; }`);


    ySlider = createSlider(0, 255, 127);
    ySlider.position(0 , sh*.5);
    ySlider.style('width', sliderW+'px');
    ySlider.style('transform', 'rotate(-90deg)');
    ySlider.addClass("slider");
  //  ySlider.style('height', sliderH+'px');
    ySlider.input(yInput);
    ySlider.mousePressed(pressDOM);
    ySlider.touchStarted(pressDOM);
    ySlider.mouseReleased(releaseDOM);
    ySlider.touchEnded(releaseDOM);


    zSlider = createSlider(0, 255, 197);
    zSlider.position(sw*.55, sh*.5);
    zSlider.style('width', sliderW+'px');
   

    //zSlider.style('height', padY+'px');
    zSlider.addClass("slider");
    zSlider.style('transform', 'rotate(-90deg)');
    zSlider.input(zInput);
    zSlider.mousePressed(pressDOM);
    zSlider.touchStarted(pressDOM);
    zSlider.mouseReleased(releaseDOM);
    zSlider.touchEnded(releaseDOM);

    xSlider.hide();
    ySlider.hide();
    zSlider.hide();
    playButton.hide();
    xButton.hide();
    yButton.hide();
    zButton.hide();


  }

  function updateDom(){
  
    // move buttons
  
    playButton.position(innerWidth*.5-(btW), 34);
    xButton.position(innerWidth*.5-(btW*.5),innerHeight*.8);
    yButton.position(-11., innerHeight*.44);
    zButton.position(sw*.8, innerHeight*.44);

    // move sliders
    
    xSlider.position(sw*.5-(sliderW*.5), sh*.8);
    ySlider.position(0 , sh*.5);
    zSlider.position(sw*.55, sh*.5);

  }

  function pressDOM(){
    notDOM = false; 
  }
  function releaseDOM(){
    notDOM = true; 

  }


  function xInput(){
    trackI_speed = map (xSlider.value(), 0., 255., float(card.minSpeed), float(card.maxSpeed));
    paramX.value = trackI_speed;

      
    //trackI.rate(trackI_speed);
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
   //filterI.freq(freq);
   paramY.value = freq;

  }

  function zInput(){
    
    levelI = map (zSlider.value(), 0., 255., 0., 1.);
    paramZ.value = levelI;
    worldI_dist = map (zSlider.value(), 0., 255., 1544., 333.);
    t5.html(nfs (worldI_dist,    1, 2));
    easycam.setDistance(worldI_dist, 11.);
  }



  function xOutput(){
    if (!loadP){
    startX = easycam.mouse.curr[0]; 
    deltaX = map (startX, 0., sw, 0., 256.);
    //print('deltaX'+ deltaX); 

    xSlider.value(deltaX);
    trackI_speed = map (xSlider.value(), 0., 255., float(card.minSpeed), float(card.maxSpeed));
    paramX.value = trackI_speed;
    t6.html(nfs (trackI_speed, 1, 2));
  }
}

  function yOutput(){
    if (!loadP){

    startY = easycam.mouse.curr[1]; 
    deltaY = map (startY, 0., sh, 256., 0.);
    paramY = deltaY; 

    /*
   // print('deltay'+deltaY); 
    ySlider.value(deltaY);
    if ( ySlider.value() >= 127.){
      freq = map(ySlider.value(), 127., 255., 20., 5000.);
      back = map(ySlider.value(), 127., 255., 0., 255.);
    }else{
      freq = map(ySlider.value(), 127., 0., 20., 5000.);
      back = map(ySlider.value(), 127., 0., 0., 255.);
    }
    */
   //  filterI.freq(freq);
  }
}

function zOutput(){
  if (!loadP){

  var levelIT = map (easycam.getDistance(), 1544., 333., 0., 1.);
  paramZ.value = levelIT;
  var zSlidValue = map (levelIT, 0., 1., 0., 255.);
  
  t5.html(nfs (easycam.getDistance(), 1, 2));    
  zSlider.value(zSlidValue);
  }
}


function guiData(){
    
    let offset = 5.;
    let textColor = card.col1; 

    // Render the labels

    t1 = createP('Distance:');
    t1.position(padX*offset,padY*offset);
    t1.style('color', textColor);

    t2 = createP('Speed:');
    t2.position(padX*offset,padY*offset+20);
    t2.style('color', textColor);

    t3 = createP('Min-Speed:');
    t3.position(padX*offset,padY*offset+40);
    t3.style('color', textColor);

    t4 = createP('Max-Speed:');
    t4.style('color', textColor);
    t4.position(padX*offset,padY*offset+60);

    t5 = createP();
    t5.html(worldI_dist);
    t5.position(padX*offset+90,padY*offset);
    t5.style('color', textColor);

    t6 = createP();
    t6.html(nfs (trackI_speed,    1, 2));
    t6.position(padX*offset+70,padY*offset+20);
    t6.style('color', textColor);

    t7 = createP(card.minSpeed);
    t7.position(padX*offset+105,padY*offset+40);
    t7.style('color', textColor);

    t8 = createP(card.maxSpeed);
    t8.position(padX*offset+110,padY*offset+60);
    t8.style('color', textColor);

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
  if (loadingBar == 1){
    translate (0., 0., -666.);

    text("Receiving Sound Waves", 0, -sh*.34-padY*4);
    text("please wait, unmute device...",0, -sh*.34-padY*1);
    translate (0., 0., 666.);

  }else{
  text("", 0, -padY*13);
  }
}

function windowResized() {

    initVariables(); 
    resizeCanvas(sw, sh);
    updateDom();
    easycam.setViewport([0,0,sw, sh]);

}

function touchStarted() {

}
function touchMoved() {
  if (notDOM){
    xOutput();
    yOutput();
    }

//print(notDOM); 

}



function mousePressed(){


 }

 function mouseWheel(){

  zOutput();

 }

 /*function doubleClicked() {
  xSlider.value(initSpeed);
  ySlider.value(127);
  zSlider.value(127);
  xInput();
  yInput();
  zInput();
}*/

 function initVariables(){

  sw= window.innerWidth;
  sh= window.innerHeight;
  padX = sw/77.; 
  padY = sh/100.; 
  btW = sw*.1;
  btH = sw*.1;
  sliderW = sw*.5;
  sliderH = sliderW*.11;
  startX = 0; 
  startY = 0; 
  notDOM = true; 

 }


 async function createRNBO(){

  const patchExportURL = "export/"+card.engine;

  // Create AudioContext
  let WAContext = window.AudioContext || window.webkitAudioContext;
  context = new WAContext();
  
  let rawPatcher = await fetch(patchExportURL);
  let patcher = await rawPatcher.json();
  device = await RNBO.createDevice({ context, patcher }); // seems we need to access the default exports via .default

  device.node.connect(context.destination);
/*
  const param = device.parametersById.get("audioLevel");

  param.changeEvent.subscribe((v) => {
    wsize = v;
  });*/
  print ("I am A1")

      loadAudioBuffer(context);

        // Connect With Parameters

         paramX = device.parametersById.get("paramX");
         paramY = device.parametersById.get("paramY");
         paramZ = device.parametersById.get("paramZ");
         print ("I am A2")


}


async function loadAudioBuffer(_context){
  loadingAudio(1);

  context = _context; 
	// Load our sample as an ArrayBuffer;
	const fileResponse = await fetch(card.filename);
	const arrayBuf = await fileResponse.arrayBuffer();
  print ("I am 1")

	// Decode the received Data as an AudioBuffer
	const audioBuf = await context.decodeAudioData(arrayBuf);
  print ("I am 2")


	// Set the DataBuffer on the device
	await device.setDataBuffer("world1", audioBuf);
  print ("I am 3")

  loaded(); 
  print ("I am 4")

 
}


