


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
let deltaX, startX, startY;
let notDOM; 
let device;
let param1, param2, param3, audioLevel; 


var analyzer;
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
  col2:""
}

var easycam,
    state = {
      distance: 940, //final distance
      center  : [0, 0, 0],
      rotation: [1., 0., 0., 0.],
    },
    panelX=30, panelY=45;

document.oncontextmenu = () => false; // no right click

function preload() {

    params = getURLParams();
  
    game = loadJSON("data/"+params.g+".json");
  
    font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');

    ///TEMP 
    loadingAudio();
  
  }

async function setup() {


    
    initVariables();
 
    playStateI= 0;
    worldI_dist =940;

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
   

    // Create Canvas - Always the landscape.  
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    setAttributes('antialias', true);

    easycam = createEasyCam();
    easycam.setState(state, 3000); // animate to state in 3 second
    easycam.setDistanceMin(333);
    easycam.setDistanceMax(1544);
    easycam.state_reset =  state;
    easycam.setPanScale(0.0);

    // easycam.removeMouseListeners();
    easycam.setPanScale(.02);

   // LOAD AUDIO ENGINE 
  //  trackI = loadSound(card.filename, loaded, errorLoadingAudio,loadingAudio);
  //  trackI.playMode('restart');
    
		//analyzer = new p5.Amplitude(.88);

   // filterI = new p5.HighPass();
    trackI_speed = card.speed;
    //analyzer.setInput(filterI);

    //arcoiris();

    createDom(); 

    // Use the selected Font 

    textFont(font1);
    textSize(27);
    loaded(); 

    createRNBO();    


  }

  function draw(){
   if(playStateI==1)background(0, 0, 0);
    noStroke();
    lights();

    var level = 1.; //analyzer.getLevel();
    var wsize = 1; //map (audioLevel, 0., 1., 1., 2.33);

    if (loadP)loadGUI();

      //Planet and Background color (back from Sliders)
    push();

    normalMaterial();

    rotateY((frameCount* trackI_speed *playStateI)*0.077);
  
    sphere(80, 7, 7);
    rotateX(PI*.4);
    torus(120*wsize, 7*wsize, 6, 7);
  
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

  easycam.beginHUD();

 if(playStateI==0)fill(0, 0, 0, .8);

  strokeWeight(4.);
  beginShape();
  vertex(0, 0);
  vertex(sw*.89, 0);
  vertex(sw, sh*.11);
  vertex(sw, sh);
  vertex(sw*.11, sh);
  vertex(0, sh*.89);
  vertex(0, 0);
  endShape();


  easycam.endHUD();

}


function playPause(){

    notDOM = false; 


    let messageEvent;


    if(playStateI==0){

      playButton.html('II');
     // playButton.style('transform', 'rotate(305deg)');
     
     messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [1]);

      playStateI = 1;
  
    }else{
  
      messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [0]);

      playButton.style('transform', 'rotate(0deg)');
      playButton.html('&#9655');
      playStateI = 0;

    }
    device.scheduleEvent(messageEvent);
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
    zSlider.value(127);
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
  
    // create buttons

    playButton = createButton('&#9655');
    playButton.position(sw*.45, 34);
    playButton.style('width', btW+'px');
    playButton.style('height', btH+'px');
    playButton.style('background-color', bcol);
    playButton.style('color', 'lawngreen');
    playButton.style('font-size', '2.5rem');
    playButton.style('border', 'none');
    playButton.style('background', 'none');
    playButton.mousePressed(playPause);
   // playButton.touchStarted(playPause);
    playButton.mouseReleased(releaseDOM);
    playButton.touchEnded(releaseDOM);
    playButton.addClass("crosshair");

    xButton = createButton('&#x2609');
    //xButton.position(innerWidth*.5-(btW*.5), sh*.7);
    xButton.position(innerWidth*.5-(btW*.5),innerHeight*.8);

    xButton.style('width', btW+'px');
    xButton.style('height', btH+'px');
    xButton.style('background-color', bcol);
    xButton.style('color', 'lawngreen');
    xButton.style('font-size', '2.5rem');
    xButton.style('border', 'none');
    xButton.style('background', 'none');
    xButton.mousePressed(xB);
    xButton.touchStarted(xB);
    xButton.mouseReleased(releaseDOM);
    xButton.touchEnded(releaseDOM);
    xButton.addClass("crosshair");

    yButton = createButton('&#x2609');
    yButton.position(-11., innerHeight*.44);
    yButton.style('width', btW+'px');
    yButton.style('height', btH+'px');
    yButton.style('background-color', bcol);
    yButton.style('color', 'lawngreen');
    yButton.style('font-size', '2.5rem');
    yButton.style('border', 'none');
    yButton.style('background', 'none');
    yButton.mousePressed(yB);
    yButton.touchStarted(yB);
    yButton.mouseReleased(releaseDOM);
    yButton.touchEnded(releaseDOM);
    yButton.addClass("crosshair");

    zButton = createButton('&#x2609');
    zButton.position(sw*.8, innerHeight*.44);
    zButton.style('width', btW+'px');
    zButton.style('height', btH+'px');
    zButton.style('background-color', bcol);
    zButton.style('color', 'lawngreen');
    zButton.style('font-size', '2.5rem');
    zButton.style('border', 'none');
    zButton.style('background', 'none');
    zButton.mousePressed(zB);
    zButton.touchStarted(zB);
    zButton.mouseReleased(releaseDOM);
    zButton.touchEnded(releaseDOM);
    zButton.addClass("crosshair");
    
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

    zSlider = createSlider(0, 255, 127);
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
   

    param1.value = trackI_speed;

      
    //trackI.rate(trackI_speed);
    //t6.html(nfs (trackI_speed,    1, 2));

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
   param2.value = freq;

  }

  function zInput(){
    levelI = map (zSlider.value(), 0., 255., 0., 1.);
   // trackI.setVolume(levelI);
    worldI_dist = map (zSlider.value(), 0., 255., 1544., 333.);
    t5.html(nfs (worldI_dist,    1, 2));
    easycam.setDistance(worldI_dist, 33.);

    param3.value = levelI;

  }



  function xOutput(){

    startX = easycam.mouse.curr[0]; 

    deltaX = map (startX, 0., sw, 0., 256.);
    //print('deltaX'+ deltaX); 

    xSlider.value(deltaX);
    trackI_speed = map (xSlider.value(), 0., 255., float(card.minSpeed), float(card.maxSpeed));
   // trackI.rate(trackI_speed);
    t6.html(nfs (trackI_speed,    1, 2));
  
}

  function yOutput(){

    startY = easycam.mouse.curr[1]; 
    deltaY = map (startY, 0., sh, 256., 0.);

   // print('deltay'+deltaY); 

    ySlider.value(deltaY);
    if ( ySlider.value() >= 127.){
      freq = map(ySlider.value(), 127., 255., 20., 5000.);
      back = map(ySlider.value(), 127., 255., 0., 255.);
    }else{
      freq = map(ySlider.value(), 127., 0., 20., 5000.);
      back = map(ySlider.value(), 127., 0., 0., 255.);
    }
  
   //  filterI.freq(freq);
}

function zOutput(){
  var levelIT = map (easycam.getDistance(), 1544., 333., 0., 1.);
  //trackI.setVolume(levelIT);
  var zSlidValue = map (levelIT, 0., 1., 0., 255.);
  
  t5.html(nfs (easycam.getDistance(), 1, 2));    
  zSlider.value(zSlidValue);
  
}


function guiData(){
    
    let offset = 3.;
    //translate (-width*offset, -height*offset, 0.);
    //noStroke();


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

    // t6 = createP(trackI_speed);
     t6 = createP("temp");

    t6.position(padX*offset+70,padY*offset+20);

     t7 = createP(card.minSpeed);
    t7.position(padX*offset+105,padY*offset+40);

     t8 = createP(card.maxSpeed);
    t8.position(padX*offset+110,padY*offset+60);

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
    
    text("Receiving Sound Waves",0, sh*.3-padX*6);
    text("please wait, unmute device...",0, sh*.3-padX*.5);

  }else{
      text("Decoding Sound Waves,", 0, sh*.3-padX*6);
  text("please wait, unmute device >>>", 0, sh*.3-padX*.5);

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
  padX = sw/100.; 
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

  const patchExportURL = "export/patch.export.json";

  // Create AudioContext
  let WAContext = window.AudioContext || window.webkitAudioContext;
  context = new WAContext();
  
  let rawPatcher = await fetch("export/patch.export.json");
  let patcher = await rawPatcher.json();

  document.body.onclick = () => {
    context.resume();
  }
  device = await RNBO.createDevice({ context, patcher }); // seems we need to access the default exports via .default

  device.node.connect(context.destination);


      // (Optional) Fetch the dependencies
      let dependencies = [];
      try {
          const dependenciesResponse = await fetch("export/dependencies.json");
          dependencies = await dependenciesResponse.json();
  
          // Prepend "export" to any file dependenciies
          dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
      } catch (e) {}
  

  
      // (Optional) Load the samples
      if (dependencies.length)
          await device.loadDataBufferDependencies(dependencies);
  
        // Connect With Parameters

         param1 = device.parametersById.get("param1");
         param2 = device.parametersById.get("param2");
         param3 = device.parametersById.get("param3");

         audioLevel = device.parametersById.get("audioLevel");

         print (audioLevel);
  // With ParameterNotificationSetting.All, the device AND the parameter emit an event when we change the value
/*
device.parameterChangeEvent.subscribe((v) => {
	console.log(`ParameterChangeEvent: ${v}`);
});
*/

};