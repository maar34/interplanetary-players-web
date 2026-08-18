// Screen and GUI dimensions
let sw, sh; // window size
let cellWidth, cellHeight; // gui separation

// Button and slider dimensions
var btW, btH;

// Data and parameters
let params; // URL parameters
let worldI_dist, cardColor; // Level index, world distance, card color

let xData, yData, zData, xDataNorm, yDataNorm, zDataNorm; // Data arrays and their normalized versions
let easyX, easyY; // Simplified X, Y values for visualization 

// GUI and Visual elements
let bodyRenderer, proxyServerUrl, playbackDataManager, playbackData; // Declare the bodyRenderer variable

let model00, model01; 
let body00, body01; 
let bodyColor; 

let font1; // font variable
let loadP =true; 
let t1, t2, t3, t4, t5, t6, t7, t8;
let t11, t12, t13, t14, t15, t16, t17, t18;
let showText = "Receiving Sound Waves \n Unmute device \n & \n Turn on IP engine"; 

let notDOM; // Non-DOM element
let device; // Device information
let canvas; 

let regenIcon, initialPlayIcon, playIcon, pauseIcon, centerIcon; // Icons for control elements
var regenValue; // regen button number state 

let knobs = [];
let ksteps = 255;  // Number of discrete ksteps
let ksensitivity = 0.9;  // kSensitivity for knob movement
let klabels = ["X", "Y", "Z"]; // kLabels for the knobs
let knobSpacing; // Spacing between knobs
let domAlpha, domColor2; 

let sliders = [];
let ssteps = 255;  // Number of discrete ssteps
let ssensitivity = 0.9;  // sSensitivity for snob movement
let slabels = ["Gain"]; // sLabels for the snobs
let sliderSpacing= 0; // Spacing between knobs

let bodySize; 

// Game and deck variables
var game, deck, suit, loadDeck, exoData;

// Input and interaction
let inputX, inputY, inputZ, inputGain;
let wMinD = 600;
let wMaxD = 1700;
let index, increasing; // Inicializar el índice
let prevTouchX = 0, prevTouchY = 0;

// Audio channels and analysis
let playStateI; // Play state index
let isFirstPlay = true; // Flag to track the first play button press

let amplitud = 0;
let xx = 0;
let yy = 0;

// TIME, related to Dates and Transits 

let lastUpdateTime = Date.now();
let lastOrbitUpdateTime = lastUpdateTime;

var card = {
  id: "",
  wavfile: "",
  mp3file: "",
  initTime: "",
  endTime: "",
  speed: "",
  minSpeed: "",
  maxSpeed: "",
  col1: "",
  col2: "",
  iconSet:"", 
  engine: "",
  xTag: "",
  yTag: "",
  zTag: ""
}
document.oncontextmenu = () => false; // no right click

var easycam,
  state = {
    distance: 1000, //final distance
    center: [0, 0, 0],
    rotation: [1., 0., 0., 0.],
  },
  panelX = 30, panelY = 45;

document.oncontextmenu = () => false; // no right click

function preload() {

  params = getURLParams();

  game = loadJSON("data/" + params.g + ".min.json");

  font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');

  exoData = loadJSON("data/exoplanetData.min.json");
 
  regenValue = 0.0;

  model00 = loadModel('media/077899da693f__Design_a_3D_model_.obj', true); // Load your 3D model in preload
  body00 = loadImage('media/077899da693f__Design_a_3D_model__texture_kd.jpg'); // Load your texture image
  model01 = loadModel('media/9508c22b65db__A_3D_scene_depicti.obj', true); // Load your 3D model in preload
  body01 = loadImage('media/9508c22b65db__A_3D_scene_depicti_texture_kd.jpg'); // Load your texture image


}

// prevent screen movement on touchstart event
document.body.addEventListener('touchstart', function (e) {
  if (e.target == document.body) {
    e.preventDefault();

  }
}, { passive: false });

function setup() {

    // Create Canvas - Always the landscape.  
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  setAttributes('antialias', true);
  frameRate(30); 

  angleMode(DEGREES); 

  
  bodyRenderer = new BodyRenderer(bodySize);
  proxyServerUrl = 'http://161.35.206.36:3000'; // Use the IP or domain of your backend server

  playbackDataManager = new PlaybackDataManager();
  playerId = 232341; // Example playerId



  initVariables();
  xDataNorm = 1.;
  yDataNorm = 0.;
  index = 0; 
  increasing = true; 

  playStateI = 0;
 // worldI_dist = 940;

  setCurrentIndexToToday();
    
  
  // load Cards

  if (params.s == 0) {
    card = game.A[params.c];
  };  
  if (params.s == 1) {
    card = game.B[params.c];
  };
  if (params.s == 2) {
    card = game.C[params.c];
  };

  easycam = createEasyCam();
  easycam.setState(state, 3000); // animate to state in 3 second
  easycam.setDistanceMin(wMinD);
  easycam.setDistanceMax(wMaxD);
  easycam.state_reset = state;
  easycam.setPanScale(0.0);
  easycam.setPanScale(.02);
  easycam.removeMouseListeners();

  
  cardColor = color(card.col1);

  // Use the selected Font 

  
  textFont(font1);
  textSize(8);
  initSliders(); 
  initKnobs(); 

  createDom();
  
  // Example usage



}  
function draw() {




  background(0, 0, 0);
  noStroke();

  if (loadP) loadingGUI(showText);


  easycam.rotateY(playStateI * easyY);
  easycam.rotateX(playStateI * easyX);

  colorMode(HSB, 360, 100, 100); 
  bodyRenderer.renderBody();
  bodyRenderer.renderMoons();
  bodyRenderer.stars();
  colorMode(RGB); 


  drawHUD();

  if (regenValue != 0) regenUpdates();
}


function drawHUD() {
  easycam.beginHUD();
  noFill();
  stroke(cardColor);

  const margin = 3.3;
  strokeWeight(1.5);
  beginShape();
  vertex(margin, margin);
  vertex(sw * 0.86, margin);
  vertex(sw - margin, sh * 0.14);
  vertex(sw - margin, sh - margin);
  vertex(sw * 0.14, sh - margin);
  vertex(margin, sh - margin);
  vertex(margin, margin);
  endShape();

  if (!loadP) {
    draw3DGUI();
  } else {
    drawOverlay();
  }
  
  easycam.endHUD();
}

function draw3DGUI() {
  knobs.forEach((knob) => {
    drawKnob(knob);
  });

  sliders.forEach((slider) => {
    drawSlider(slider);
  });
}

function drawKnob(knob) {
  let angleY = map(knob.valueY, 0, ksteps - 1, 0, 360, true);
  stroke(regenValue > 0 ? domColor2 : cardColor);

  push();
  strokeWeight(0.5);
  translate(knob.x, knob.y);
  rotateZ(angleY);
  fill(0, 50);
  sphere(knob.size * 0.5, 7, 7); // Draw a sphere for the knob
  rotateZ(90);
  strokeWeight(3);
  line(knob.size * 0.5, 0, 0, 0);
  pop();
}

function drawSlider(slider) {
  push();
  stroke(cardColor);
  translate(slider.x, slider.y, slider.z);

  if (slider.isDragging) {
    cone(10, slider.sliderHeight, 10); // Draw a thin, flat box as the slider track
  }
  
  translate(0, slider.sliderValue, 0);
  fill(0, 50);
  rotateX(180);
  rotateY(slider.sliderValue * .5);
  cone(slider.handleRadius, slider.handleHeight, 7); // Draw a cone as the handle

  pop();
}

function drawOverlay() {
  fill(0, 0, 0, 1); // RGBA: Black with 50% transparency (127 is half of 255)
  noStroke();
  rect(0, 0, sw, sh); // Cover the entire canvas
}



///////// BUTTONS LOGIC //////// 

function regenUpdates(){
  

  switch (regenValue) {
    case 0:
    break;
    case 1:
      trans(1); // 1 minute ~ 1 day
    break;
    case 2:
      trans(60); // 1 earth second ~ 1 earth day
    break;
    case 3:
      trans(1200); // 50 earth milisecond ~ 1 earth day
    break;
    case 4:
      trans(6000); // 15 earth miliseconds ~ 1 earth day
    break;
    case 5:
    orb(1)
    break;
    case 6:
      orb(60)
    break;
    case 7:
      orb(6000)
    break;

}


}

function trans(amp) {
  // Get the current time in milliseconds
  let currentTime = Date.now();

  // Calculate elapsed time in milliseconds since the last update
  let elapsedTimeInMillis = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;

  // Convert elapsed time to a fraction of a day
  // There are 86,400,000 milliseconds in a day
  let incrementPerDay = elapsedTimeInMillis / 172800000;

  // Scale the increment by the amp value
  let scaledIncrement =  incrementPerDay * amp;

  // Update the index based on the scaled increment
  if (increasing) {
      index += scaledIncrement;
      if (index >= 0.99) {
          index = 0.99;
          increasing = false;
      }
  } else {
      index -= scaledIncrement;
      if (index <= 0.01) {
          index = 0.01;
          increasing = true;
      }
  }
  let result = interpolateTransitData(exoData, index);

  let targetX = index * 255;
  let targetY = result.normalizedB * 255;
  let targetZ = result.normalizedDuration * 255;


  // Function to interpolate towards a target value
  function interpolate(currentValue, targetValue) {
      if (Math.abs(targetValue - currentValue) > 1) {
          return currentValue + (targetValue - currentValue) * 0.1; // Adjust the 0.1 as needed
      } else {
          return targetValue;
      }
  }

  // Update xData, yData, and zData
  xData = interpolate(xData, targetX);
  yData = interpolate(yData, targetY);
  zData = interpolate(zData, targetZ);

  // Update inputs
  xInput();
  yInput();
  zInput();

  setKnobValue(knobs[0], 50, xData, 50);
  setKnobValue(knobs[1], 50, yData, 50);
  setKnobValue(knobs[2], 50, zData, 50);

  t15.html(result.transitDate);
  t16.html(nfs(result.b, 1, 2));
  t17.html(nfs(result.duration, 1, 2));
}


function orb(amp) {
  // Get the current time in milliseconds
  let currentTime = Date.now();

  // Calculate elapsed time in milliseconds since the last update
  let elapsedTimeInMillis = currentTime - lastOrbitUpdateTime;
  lastOrbitUpdateTime = currentTime;

  // Convert elapsed time to a fraction of a day
  // There are 86,400,000 milliseconds in a day
  let incrementPerDay = elapsedTimeInMillis / 172800000;

  // Scale the increment by the amp value
  let scaledIncrement = incrementPerDay * amp;

  // Update the index based on the scaled increment
  index += scaledIncrement;
  index = index % 1;  // Ensure index loops within the range [0, 1)

  const orbitData = generateOrbitData(exoData, index);

  let targetX = orbitData.d.orbitPosition * 255;
  let targetY = orbitData.c.orbitPosition * 255;
  let targetZ = orbitData.b.orbitPosition * 255;

  // Function to interpolate towards a target value
  function interpolate(currentValue, targetValue) {
      if (Math.abs(targetValue - currentValue) > 1) {
          return currentValue + (targetValue - currentValue) * 0.1; // Adjust the 0.1 as needed
      } else {
          return targetValue;
      }
  }

  // Update xData, yData, and zData
  xData = interpolate(xData, targetX);
  yData = interpolate(yData, targetY);
  zData = interpolate(zData, targetZ);

  // Update inputs
  xInput();
  yInput();
  zInput();

  setKnobValue(knobs[0], 50, xData, 50); // Set the first knob's values
  setKnobValue(knobs[1], 50, yData, 50); // Set the second knob's values
  setKnobValue(knobs[2], 50, zData, 50); // Set the third knob's values

  t15.html(nfs(orbitData.d.dayInOrbit, 1, 2));
  t16.html(nfs(orbitData.b.dayInOrbit, 1, 2));
  t17.html(nfs(orbitData.c.dayInOrbit, 1, 2));
}




function regenLogic() {

  regenValue = (regenValue + 1) % 8; // This will cycle regenValue from 0 to 7
 // result = normalizeAndInterpolate(exoData, (regenValue/10)); // 
 // console.log(result);

  switch (regenValue) {
      case 0:
          regenButton.html('&#9842;');
          t11.html("");
          t12.html("");
          t13.html("");
          t15.html("");
          t16.html("");
          t17.html("");
          t21.html("A playground for improvisation and deep listening");
          t22.html("0");
          t0.html("Jam");
          t22.style('color', domAlpha); // Section Number

         // t22.style('color', textColor);

          break;
      case 1:

          regenButton.html('&#9843;');
          t11.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX1']+ ":");
          t12.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY1']+ ":");
          t13.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ1']+ ":");
          t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['General']);
          t22.html("1");
          t0.html("Transit I");
          t22.style('color', domColor2); // Section Number

          break;
      case 2:
          regenButton.html('&#9844;');
          t11.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX1']+ ":");
          t12.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY1']+ ":");
          t13.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ1']+ ":");
          t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['General']);
          t22.html("2");
          t0.html("Transit II");
          t22.style('color', domColor2); // Section Number

          break;
      case 3:
          regenButton.html('&#9845;');
          t11.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX1']+ ":");
          t12.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY1']+ ":");
          t13.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ1']+ ":");
          t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['General']);
          t22.html("3");
          t0.html("Transit III");
          t22.style('color', domColor2); // Section Number

          break;
      case 4:

          regenButton.html('&#9846;');
          t11.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX1']+ ":");
          t12.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY1']+ ":");
          t13.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ1']+ ":");
          t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['General']);
          t22.html("4");
          t0.html("Transit IIII");
          t22.style('color', domColor2); // Section Number


          break;
      case 5:
          regenButton.html('&#9847;');
          t11.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX2']+ ":");
          t12.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY2']+ ":");
          t13.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ2']+ ":");
          t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_description']);
          t22.html("5");
          t0.html("Orbits V");
          t22.style('color', domColor2); // Section Number

          break;
      case 6:
          regenButton.html('&#9848;');
          t11.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX2']+ ":");
          t12.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY2']+ ":");
          t13.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ2']+ ":");
          t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_description']);
          t22.html("6");
          t0.html("Orbits VI");
          t22.style('color', domColor2); // Section Number

          break;
      case 7:
          regenButton.html('&#9849;');
          t11.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX2']+ ":");
          t12.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY2']+ ":");
          t13.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ2']+ ":");
          t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_description']);
          t22.html("7");
          t0.html("Orbits VII");
          t22.style('color', domColor2); // Section Number

          break;
  }
}

async function playPause() {
  notDOM = false;

  if (isFirstPlay) {
    createRNBO();
  }

  if (context.state === 'suspended') {
    if (isFirstPlay) {
      console.log('Handling first play');
      handleFirstPlay();
    }

    await context.resume().then(() => {
      playButton.attribute('src', playIcon);
      showText = "All engines are running \n press play to start";

    }).catch(err => {
      console.log('Failed to resume AudioContext:', err);
    });

    if (context.state === 'suspended') {
      setTimeout(tryResumeContext, 100);
    } else {
      console.log('Context resumed successfully');
    }
  } else {
    if (isFirstPlay) {
      handleFirstPlay();
    }
    togglePlayState();
  }
}

async function handleFirstPlay() {

  playButton.attribute('src', initialPlayIcon);
  isFirstPlay = false;
  loadP = true;
  
  guiData();
  guiDataStyle(cellWidth, cellHeight); 
  setKnobValueY(knobs[0], 127, 500);
  setKnobValueY(knobs[1], 127, 500);
  setKnobValueY(knobs[2], 127, 500);
}

function togglePlayState() {
  if (!device || !RNBO) {
   //console.log('Error: device or RNBO is not defined.');
   showText = "All engines are running \n press play to start";
   playButton.attribute('src', initialPlayIcon);
    return;
  }

  if (playStateI == 0 && context.state === 'running') {

    if (loadP){
      regenButton.show();
      xButton.show();
      yButton.show();
      zButton.show();
      setKnobValueY(knobs[0], 127, 500);
      setKnobValueY(knobs[1], 127, 500);
      setKnobValueY(knobs[2], 127, 500);
      loadP = false;

    }


    try {
      let messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [1]);
      device.scheduleEvent(messageEvent);
      playStateI = 1;

      playButton.attribute('src', pauseIcon);

    } catch (err) {
      console.log('Failed to schedule play event:', err);
    }

  } else {
    try {
      let messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [0]);
      device.scheduleEvent(messageEvent);
      //easycam.attachMouseListeners();
      playButton.attribute('src', initialPlayIcon);

      context.suspend().catch(err => {
        console.log('Failed to suspend AudioContext:', err);
      });

      playStateI = 0;
    } catch (err) {
      console.log('Failed to schedule stop event:', err);
    }
  }
}



function xB() {


  switch (regenValue) {
    case 0:
      notDOM = false;
      setKnobValueY(knobs[0], 127, 500);      
      t21.html("X Balance");
      break;
    case 1:

      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Transit_s1']);

      break;
    case 2:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Transit_s2']);

      break;
    case 3:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Transit_s3']);

      break;
    case 4:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Transit_s4']);

      break;
    case 5:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s5x']);
      break;

    case 6:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s6x']);
      break;

    case 7: 
    
    t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s7x']);

      break;


  }



}

function yB() {


  switch (regenValue) {
    case 0:
      notDOM = false;
      setKnobValueY(knobs[1], 127., 500); 
      t21.html("Y Balance");
      break;
    case 1:
    case 2:
    case 3:
    case 4:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['b']);

      break;

      case 5:
        t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s5y']);
        break;
  
      case 6:
        t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s6y']);
        break;
  
      case 7: 
      
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s7y']);
  
        break;

  }

}

function zB() {


  switch (regenValue) {
    case 0:
      notDOM = false;
      setKnobValueY(knobs[2], 127., 500);  
      t21.html("Z Balance");
    
      break;
      case 1:

      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Duration_s1']);

      break;
    case 2:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Duration_s2']);

      break;
    case 3:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Duration_s3']);

      break;
    case 4:
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['Duration_s4']);

      break;
      case 5:
        t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s5z']);
        break;
  
      case 6:
        t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s6z']);
        break;
  
      case 7: 
      
      t21.html(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['orbital_s7z']);
  
        break;
  }


}


function errorLoadingAudio(_error) {

  let p = createP(_error);
  p.style('font-size', '16px');
  p.position(10, 0);

}



/////// USER INTERACTION AND GUI FUNCTIONS ///////// 

function createDom() {

  let domColor = color (card.col1);
  domAlpha = color (card.col1); 
  domAlpha.setAlpha(190);

  domColor2 = color(0, 255, 128);


  centerIcon = 'icons/' + nf(card.iconSet, 2) + '_center.svg';

  xButton = createImg(centerIcon, 'Play Button', '&#11042');
  xButton.style('width', btW + 'px');
  xButton.style('height', btH + 'px');
  xButton.style('background-color', domColor);
  xButton.style('color', domAlpha);
  xButton.style('border', 'none');
  xButton.style('background', 'none');
  xButton.style('-webkit-touch-callout', 'none'); // Disable long-press callout on iOS
  xButton.mousePressed(xB);
  xButton.touchStarted(xB);
  xButton.mouseReleased(releaseDOM);
  xButton.touchEnded(releaseDOM);
  //xButton.addClass("crosshair");

  yButton = createImg(centerIcon, 'Play Button', '&#11042');
  yButton.style('width', btW + 'px');
  yButton.style('height', btH + 'px');
  yButton.style('background-color', domColor);
  yButton.style('color', domAlpha);
  yButton.style('border', 'none');
  yButton.style('background', 'none');
  yButton.style('-webkit-touch-callout', 'none'); // Disable long-press callout on iOS
  yButton.mousePressed(yB);
  yButton.touchStarted(yB);
  yButton.mouseReleased(releaseDOM);
  yButton.touchEnded(releaseDOM);
  //yButton.addClass("crosshair");

  zButton = createImg(centerIcon, 'Play Button', '&#11042');
  zButton.style('width', btW + 'px');
  zButton.style('height', btH + 'px');
  zButton.style('background-color', domColor);
  zButton.style('color', domAlpha);
  zButton.style('border', 'none');
  zButton.style('background', 'none');
  zButton.style('-webkit-touch-callout', 'none'); // Disable long-press callout on iOS
  zButton.mousePressed(zB);
  zButton.touchStarted(zB);
  zButton.mouseReleased(releaseDOM);
  zButton.touchEnded(releaseDOM);
  //zButton.addClass("crosshair");

  initialPlayIcon = 'icons/' + nf(card.iconSet, 2) + '_on-off.svg';
  playIcon = 'icons/' + nf(card.iconSet, 2) + '_play.svg';

  // create buttons and sliderss
  playButton = createImg(initialPlayIcon, 'Play Button', '&#9655');
  pauseIcon = 'icons/' + nf(card.iconSet, 2) + '_pause.svg';

  playButton.style('width',  btW+ 'px');
  playButton.style('height', btH + 'px' );
  playButton.style('background-color', domColor);
  playButton.style('color', domAlpha);
  playButton.style('border', 'none');
  playButton.style('background', 'none');
  playButton.style('-webkit-touch-callout', 'none'); // Disable long-press callout on iOS
  playButton.mousePressed(playPause);
  playButton.touchStarted(playPause);
  playButton.mouseReleased(releaseDOM);
  playButton.touchEnded(releaseDOM);

  // create buttons and sliderss

  regenIcon = 'icons/' + nf(card.iconSet, 2) + '_regen.svg';

  regenButton = createImg(regenIcon, 'Regen Button', '&#9842');

  regenButton.style('width', btW+'px');
  regenButton.style('height',btH+'px');
  regenButton.style('border', 'none');
  regenButton.style('background', 'none');
  regenButton.style('-webkit-touch-callout', 'none'); // Disable long-press callout on iOS
  regenButton.mousePressed(regenLogic);
  regenButton.touchStarted(regenLogic);
  regenButton.mouseReleased(releaseDOM);
  regenButton.touchEnded(releaseDOM);

  updateButtonPositions();

  regenButton.hide();

  xButton.hide();
  yButton.hide();
  zButton.hide();

}



function xInput() {
  if (!inputX) {
    return;
  }
  inputX.value = xData;
  let xDataM = map(xData, 0, ksteps - 1, float(card.xTag[1]), float(card.xTag[2]));
  t6.html(nfs(xDataM, 1, 2));
  easyY = xDataM * -0.0077;
}

function yInput() {
  if (!inputY) {
    return;
  }
  inputY.value = yData;
  let yDataM = map(yData, 0, ksteps - 1, float(card.yTag[1]), float(card.yTag[2]));
  t7.html(nfs(yDataM, 1, 2));
  easyX = yDataM * -0.00077;
}

function zInput() {
  if (!inputZ) {
    return;
  }
  if (zData <= (ksteps - 1)/2) {
    worldI_dist = map(zData, 0., (ksteps - 1)/2, wMaxD, wMinD, true);
  } else {
    worldI_dist = map(zData, (ksteps - 1)/2, (ksteps - 1), wMinD, wMaxD, true);
  }
  easycam.setDistance(worldI_dist, 200);

  inputZ.value = zData;
  t5.html(nfs(worldI_dist, 1, 2));
  let zDataV = map(zData, 0., 255., float(card.zTag[1]), float(card.zTag[2]));
  t8.html(nfs(zDataV, 1, 2));
}

function gainInput() {

  inputGain.value = inputGain; 
}



function guiData() {
  // Render the labels
  t1 = createP('Distance:');
  t2 = createP(card.xTag[0] + ":");
  t3 = createP(card.yTag[0] + ":");
  t4 = createP(card.zTag[0] + ":");
  t5 = createP();
  t5.html(worldI_dist);
  t6 = createP();

  // Ensure the value passed to nfs is a number
  let formattedNumber = nfs(parseFloat("0.00"), 1, 2);
  t6.html(formattedNumber);

  t7 = createP("0");
  t8 = createP("0");
  t11 = createP("");
  t12 = createP("");
  t13 = createP("");
  t15 = createP();
  t15.html("");
  t16 = createP();
  t16.html("");
  t17 = createP("");
  t21 = createP(''); // Hint
  t22 = createP('0');
  t0 = createP('Jam'); // Section Title
  
}

function guiDataStyle(cellWidth, cellHeight) {
  let offset = 1;
  let yoffset = cellHeight;
  let textColor = card.col1;
  let black = color(0);

  if (sw > sh) {
    yoffset = cellHeight * 0.5;
  }

  // Calculate guiTextSize based on a combination of windowWidth and windowHeight
  let guiTextSize = min(windowWidth, windowHeight) * 0.027; 

  // Set positions and styles for column 1 elements (t1, t2, t3, t4)
  let col1Elements = [t1, t2, t3, t4, t11, t12, t13];
  col1Elements.forEach((elem, index) => {
    let x = cellWidth * offset;
    let y = index * cellHeight * 0.5 + guiTextSize + yoffset;
    elem.position(x, y);
    elem.style('color', textColor);
    elem.style('font-size', guiTextSize + 'px');
  });

  // Set positions and styles for column 2 elements (t5, t6, t7, t8)
  let col2Elements = [t5, t6, t7, t8, t15, t16, t17];
  col2Elements.forEach((elem, index) => {
    let x = 3.5 * cellWidth * offset; // Position for the second column
    let y = index * cellHeight * 0.5 + guiTextSize + yoffset;
    elem.position(x, y);
    elem.style('color', textColor);
    elem.style('font-size', guiTextSize + 'px');
  });

  t0.style('color', domColor2);
  t0.style('width', 6 * btW + 'px');
  t0.attribute('align', 'center');
  t0.position(sw * 0.5 - 3 * btW, guiTextSize);
  t0.style('font-size', guiTextSize + 10 + 'px');

  t21.style('background-color', black);
  t21.style('color', domColor2);

  t21.style('width', 6 * btW + 'px');
  t21.attribute('align', 'center');
  t21.position(sw * 0.5 - 3 * btW, sh * 0.2);
  t21.style('font-size', guiTextSize + 'px'); // Hint

  t22.style('background-color', black);
  t22.style('color', textColor); // Section Number

  t22.style('width', btW + 'px');
  t22.attribute('align', 'center');
  t22.position(sw - (cellWidth + cellHeight), sh - cellHeight);  
  t22.style('font-size', guiTextSize + 'px');
}


function loadingGUI(showText) {
  ///// LOADING TEXTS 

  textAlign(CENTER);


  fill(cardColor); 
  translate(0., -30., 150.*bodySize);
  text(showText, 0, 0);
  translate(0., 30., -150.*bodySize); 

}

function windowResized() {
  initVariables();
  resizeCanvas(sw, sh);
  guiDataStyle (cellWidth, cellHeight); 
  easycam.setViewport([0, 0, sw, sh]);
  translateKnobs();
  translateSliders();
}


function pressDOM() {
  notDOM = false;

}
function releaseDOM() {

//  easycam.attachMouseListeners();
  notDOM = true;
  if (!loadP) t21.html("");
 // attachMouseListeners();

}


function mousePressed() {

  const songName = 'Song A'; // Get actual song name
  const artistName = 'Artist A'; // Get actual artist name
  const playCount = 1; // Example count
  const playDuration = 25;
  const system_rightascension = 123.45; // Example value
  const system_declination = 67.89; // Example value
  const userId = 'user1'; // Example userId
  const playerId = 232341; 

  playbackDataManager.savePlaybackData(userId, playerId, songName, artistName, playCount, playDuration, system_rightascension, system_declination);

  playbackData = playbackDataManager.getPlaybackData(playerId);
  if (playbackData.length > 0) {
    // Initialize player with retrieved data
    console.log('Initialize player with:', playbackData);
  }

  print (playbackData);
  knobs.forEach(knob => {
    knob.isDragging = dist(mouseX, mouseY, knob.x, knob.y) < knob.size / 2;
  });

  sliders.forEach(slider => {
    let d = dist(mouseX, mouseY, slider.x, slider.y + slider.sliderValue);
    if (d < slider.handleRadius) {
      slider.isDragging = true;
      pressDOM();
    }
  });

  return false; // Prevent default behavior and stop propagation
}

function touchStarted() {
  prevTouchX = touches[0].x;
  prevTouchY = touches[0].y;

  knobs.forEach(knob => {
    knob.isDragging = dist(touches[0].x, touches[0].y, knob.x, knob.y) < knob.size / 2;
  });

  sliders.forEach(slider => {
    let d = dist(touches[0].x, touches[0].y, slider.x, slider.y + slider.sliderValue);
    if (d < slider.handleRadius) {
      slider.isDragging = true;
      pressDOM();
    }
  });

  return false; // Prevent default behavior and stop propagation
}



function mouseDragged() {
  knobs.forEach((knob, index) => {
    if (dist(mouseX, mouseY, knob.x, knob.y) < knob.size * 0.75) {
      knob.isDragging = true;
      updateKnobValue(knob, mouseX, mouseY);
      pressDOM();
    }
  });
  sliders.forEach(slider => {
    if (slider.isDragging) {
      slider.sliderValue = constrain(mouseY - slider.y, -slider.sliderHeight / 2, slider.sliderHeight / 2);
      inputGain.value = map(slider.sliderValue, slider.sliderHeight / 2, -220, 0., 1.);
    }
  });
}


// Mouse Wheel Function
function mouseWheel(event) {
  pressDOM();

  knobs.forEach(knob => {
    if (dist(mouseX, mouseY, knob.x, knob.y) < knob.size / 2) {
      let deltaZ = event.delta * ksensitivity;
      knob.valueZ = constrain(knob.valueZ - deltaZ, 0, ksteps - 1);
      worldI_dist = map(knob.valueZ, 0, ksteps - 1, wMinD, wMaxD); // Update worldI_dist for Z knob
    }
  });
}

function mouseReleased() {
  knobs.forEach(knob => knob.isDragging = false);
  sliders.forEach(slider => slider.isDragging = false);
}

function touchEnded() {
  knobs.forEach(knob => knob.isDragging = false);
  sliders.forEach(slider => slider.isDragging = false);

  return false; // Prevent default behavior and stop propagation
}




function touchMoved() {
  // Update knobs based on touch movement
  knobs.forEach(knob => {
    if (knob.isDragging) {
      updateKnobValue(knob, touches[0].x, touches[0].y);
    }
  });

  sliders.forEach(slider => {
    if (slider.isDragging) {
      slider.sliderValue = constrain(touches[0].y - slider.y, -slider.sliderHeight / 2, slider.sliderHeight / 2);
      inputGain.value = map(slider.sliderValue, slider.sliderHeight / 2, -slider.sliderHeight / 2, 0., 1.);
    }
  });

  prevTouchX = touches[0].x;
  prevTouchY = touches[0].y;

  return false; // Prevent default behavior
}





function doubleClicked() {
 // xB();
 // yB();
 // zB();
 // t21.html("");

}

function initVariables() {

  sw = window.innerWidth;
  sh = window.innerHeight;

  let baseCols = 10; 
  let cellSize = min(width, height) / baseCols;
  let cols = floor(width / cellSize); // Adjust columns based on aspect ratio
  let rows = floor(height / cellSize); // Adjust rows based on aspect ratio

  xData = 127.;
  yData = 127.;
  zData = 127.; 


 // Recalculate button and cell dimensions
  cellWidth = sw / cols;
  cellHeight = sh / rows;
  btW = cellHeight;
  btH = cellHeight;

  knobSpacing = (cellWidth+cellHeight)*1.1;


  bodySize = (cellWidth + cellHeight) * 0.0067; // planet rings and moon size multiplier
  bodyRenderer.setBodySize(bodySize);

  notDOM = true;

    const  aspect = sw / sh; 

    if (sh>sw) {

      wMinD = 600*aspect;
      wMaxD = 1700*aspect;
      fovy= 2 * atan(sh / 2 / wMaxD);
      perspective(fovy, aspect);

    }else{
      perspective(45, aspect);
      wMinD = 1000/aspect;
      wMaxD = 2000/aspect;
      fovy= 2 * atan(sh / 2 / wMaxD);
      perspective(fovy, aspect);
    }

}
function initSliders(){

  let startX = window.innerWidth*.9;
  let startY = window.innerHeight*.5;

  // Initialize three sliders
  for (let i = 0; i < 1; i++) {
    sliders.push({
      x: startX + i * sliderSpacing,
      y: startY,
      z: 0,  // Initial Z position
      sliderHeight: (cellHeight)*4,
      sliderValue: -127,
      sliderMin: 0,
      sliderMax: 127,
      isDragging: false,
      handleHeight: btH,
      handleRadius: btW*.5
    });
}



}


function initKnobs(){

  let startX = window.innerWidth*.5-knobSpacing;
  let startY = window.innerHeight*.75;

  // Initialize three knobs
  for (let i = 0; i < klabels.length; i++) {
    knobs.push({
      x: startX + i * knobSpacing,
      y: startY,
      z: 0,  // Initial Z position
      size: (cellWidth+cellHeight)*.77,
      valueX: 127,
      valueY: 127,
      valueZ: 127  // Initial Z value
    });


}
}

function updateKnobValue(knob, currentX, currentY) {

  let deltaX, deltaY;


  if (touches.length > 0) { // If it's a touch event
    deltaX = currentX - prevTouchX;
    deltaY = currentY - prevTouchY;
  } else { // If it's a mouse event
    deltaX = currentX - pmouseX;
    deltaY = currentY - pmouseY;
  }

  knob.valueX -= deltaX * ksensitivity;
  knob.valueY -= deltaY * ksensitivity;

  // Constrain the values within the valid range
  knob.valueX = constrain(knob.valueX, 0, ksteps - 1);
  knob.valueY = constrain(knob.valueY, 0, ksteps - 1);

  // Update xData, yData, zData based on knob values
  if (knob === knobs[0]) { // If it's the X knob
    xData = knob.valueY;
    xInput();
  } else if (knob === knobs[1]) { // If it's the Y knob
    yData = knob.valueY;
    yInput();
  } else if (knob === knobs[2]) { // If it's the Z knob
    zData = knob.valueY;
    zInput();
  }
}


function setKnobValueY(knob, newValueY, interpolationTimeInMillis) {

  // Calculate the amount to change per frame
  let totalFrames = (interpolationTimeInMillis / 1000) * frameRate();
  let changePerFrame = (newValueY - knob.valueY) / totalFrames;

  // Create a function to incrementally update the knob's value
  function interpolateKnobValue() {
    // Check if the knob is close enough to the target value
    if (Math.abs(knob.valueY - newValueY) > Math.abs(changePerFrame)) {
      knob.valueY += changePerFrame;

      // Constrain the value within the valid range
      knob.valueY = constrain(knob.valueY, 0, ksteps - 1);

      // Update the associated data and UI
      updateKnobRelatedData(knob);

      // Continue interpolation in the next frame
      setTimeout(interpolateKnobValue, 1000 / frameRate);
    } else {
      // Set the final value and update
      knob.valueY = newValueY;
      updateKnobRelatedData(knob);
    }
  }

  // Start the interpolation process
  interpolateKnobValue();
}

function updateKnobRelatedData(knob) {
  if (knob === knobs[0]) { 
    xData = knob.valueY;
    xInput();
  } else if (knob === knobs[1]) {
    yData = knob.valueY;
    yInput();
  } else if (knob === knobs[2]) {
    zData = knob.valueY;
    zInput();
  }
}


function setKnobValue(knob, newXValue, newYValue, newZValue) {
  // Update the knob values
  knob.valueX = newXValue;
  knob.valueY = newYValue;
  knob.valueZ = newZValue;

  // Constrain the values within the valid range
  knob.valueX = constrain(knob.valueX, 0, ksteps - 1);
  knob.valueY = constrain(knob.valueY, 0, ksteps - 1);
  knob.valueZ = constrain(knob.valueZ, 0, ksteps - 1);

  // You can call the input functions to update any related data or UI elements
  // For example, if the knob values are tied to certain parameters or UI elements:
  if (knob === knobs[0]) { // If it's the X knob
    xData = knob.valueY;
    xInput(); // Update any related UI or data
  } else if (knob === knobs[1]) { // If it's the Y knob
    yData = knob.valueY;
    yInput(); // Update any related UI or data
  } else if (knob === knobs[2]) { // If it's the Z knob
    zData = knob.valueY;
    zInput(); // Update any related UI or data
  }
}


function updateButtonPositions() {
  if (!canvas || !canvas.elt) {
      console.error('Canvas is not defined');
      return;
  }

  let offsetY =  cellHeight; // Adjust the Y offset

  knobs.forEach((knob, index) => {
    let screenX =  knob.x - cellWidth*.5;
    let screenY =  offsetY + knob.y;

    if (index === 0 ) {
      xButton.position(screenX, screenY);
    } else if (index === 1) {
      yButton.position(screenX, screenY);
    } else if (index === 2) {
      zButton.position(screenX, screenY);
    }
  });

  playButton.position( cellWidth , sh-cellHeight*2);
  regenButton.position( sw-(cellWidth+cellHeight) , sh-cellHeight*2);  



  playButton.style('width',  btW+ 'px');
  playButton.style('height',  btH + 'px');
  
  regenButton.style('width',  btW+ 'px');
  regenButton.style('height',  btH + 'px' );

 
  }


    function translateSliders() {

      let sstartX = window.innerWidth*.9;
      let sstartY = window.innerHeight*.5;



      // Update sliders position
      for (let i = 0; i < 1; i++) {
          sliders[i].x = sstartX + i;
          sliders[i].y = sstartY;
          sliders[i].z = 0;  // Initial Z position
          sliders[i].sliderHeight = (cellHeight)*4;
          sliders[i].sliderValue = -124;
          sliders[i].sliderMin = 0;
          sliders[i].sliderMax = 127;
          sliders[i].isDragging = false;
          sliders[i].handleHeight = btH;
          sliders[i].handleRadius = btW*.5;

    }  
  }

  function translateKnobs() {
    let kstartX = window.innerWidth * 0.5 - knobSpacing;
    let kstartY = window.innerHeight * 0.75;
  
    // Calculate knobSize
    let knobSize = (cellWidth + cellHeight) * 0.77;
  
    // Update existing knobs
    for (let i = 0; i < knobs.length; i++) {
      knobs[i].x = kstartX + i * knobSpacing;
      knobs[i].y = kstartY;
      knobs[i].size = knobSize;
    }
  
    xButton.style('width', btW + 'px');
    xButton.style('height', btH + 'px');
  
    yButton.style('width', btW + 'px');
    yButton.style('height', btH + 'px');
  
    zButton.style('width', btW + 'px');
    zButton.style('height', btH + 'px');
  
    updateButtonPositions();
    
  }

///DATA///////





////////// AUDIO ENGINE ///////// 

async function createRNBO() {
  try {
    
    const patchExportURL = "export/" + card.engine;
    let WAContext = window.AudioContext || window.webkitAudioContext;
    context = new WAContext();

    let rawPatcher = await fetch(patchExportURL);
    
    let patcher = await rawPatcher.json();
    device = await RNBO.createDevice({ context, patcher });
    

    device.node.connect(context.destination);
    
    await loadAudioBuffer(context);

    inputX = device.parametersById.get("inputX");
    inputY = device.parametersById.get("inputY");
    inputZ = device.parametersById.get("inputZ");
    inputGain = device.parametersById.get("inputGain");

    const centerValue = (ksteps - 1) / 2;
    inputX.value = map(centerValue, 0, ksteps - 1, parseFloat(card.xTag[1]), parseFloat(card.xTag[2]));
    inputY.value = map(centerValue, 0, ksteps - 1, parseFloat(card.yTag[1]), parseFloat(card.yTag[2]));
    inputZ.value = map(centerValue, 0, ksteps - 1, parseFloat(card.zTag[1]), parseFloat(card.zTag[2]));
    inputGain.value = map(0, -220, 220, 0, 1);

    knobs[0].valueY = centerValue;
    knobs[1].valueY = centerValue;
    knobs[2].valueY = centerValue;
    sliders[0].sliderValue = 0;

    showText = "Main engine \n start sequence initiated \n press again";

    // ev is of type MessageEvent, which has a tag and a payload
    device.messageEvent.subscribe((ev) => {
      if (ev.tag === "amp") {
          // Check if ev.payload is a float
          if (typeof ev.payload === 'number') {
              amplitud = ev.payload;
          } else {
              console.error('Unexpected payload format:', ev.payload);
          }
      }
    });

  } catch (error) {
    console.log('Error creating RNBO:', error);
    errorLoadingAudio(error);
  }
}

async function loadAudioBuffer(_context) {
  context = _context;
  let audioBuf;

  try {
    let audioURL;

    if (navigator.connection) {
      const speed = navigator.connection.downlink;
      audioURL = speed > 1 ? card.mp3file : card.wavfile;
    } else {
      audioURL = card.mp3file;
    }

    const fileResponse = await fetch(audioURL, { cache: 'reload' });

    if (!fileResponse.ok) {
      throw new Error("Network response was not OK");
    }

    const arrayBuf = await fileResponse.arrayBuffer();

    if (!(arrayBuf instanceof ArrayBuffer)) {
      throw new Error("Fetched data is not a valid ArrayBuffer");
    }

    audioBuf = await context.decodeAudioData(arrayBuf);
    await device.setDataBuffer("world1", audioBuf);
  } catch (error) {
    console.log('Error loading audio buffer:', error);
    errorLoadingAudio(error);
  }
}

////////// EXOPLANET DATA ///////// 
function interpolateTransitData(transitData, index) {
  const transits = transitData['Kepler-47']['Maar_World']['transits'];
  const numTransits = transits.length;

  // Calculate the positions in the array based on the index
  const pos = index * (numTransits - 1);
  const lowerIndex = Math.floor(pos);
  const upperIndex = Math.ceil(pos);
  const t = pos - lowerIndex; // Fractional part for interpolation

  // Handling edge cases
  if (lowerIndex === upperIndex || upperIndex >= numTransits) {
      return {
          ...transits[lowerIndex],
          exactTransitDate: julianToDate(transits[lowerIndex].BJD)
      };
  }

  const lowerTransit = transits[lowerIndex];
  const upperTransit = transits[upperIndex];

  // Linear interpolation function
  const interpolate = (start, end, t) => (1 - t) * start + t * end;

  // Interpolating BJD and converting to exact date
  const interpolatedBJD = interpolate(lowerTransit.BJD, upperTransit.BJD, t) + 2455000;
  const exactTransitDate = julianToDate(interpolatedBJD);

  // Interpolated values
  return {
      normalizedB: interpolate(lowerTransit.Normalized_b, upperTransit.Normalized_b, t),
      normalizedDuration: interpolate(lowerTransit.Normalized_Duration_hrs, upperTransit.Normalized_Duration_hrs, t),
      b: interpolate(lowerTransit.b, upperTransit.b, t),
      duration: interpolate(lowerTransit.Duration_hrs, upperTransit.Duration_hrs, t),
      transitDate: exactTransitDate,
      normalizedBJD: interpolate(lowerTransit.Normalized_BJD, upperTransit.Normalized_BJD, t)
  };
}


function generateOrbitData(json, index) {
  // Calculate the sine wave position and day in orbit for a planet
  function getOrbitData(orbitalPeriod, index) {
    // Normalize the index by the orbital period
    const normalizedIndex = index * orbitalPeriod;
    const phase = (normalizedIndex % orbitalPeriod) / orbitalPeriod * 2 * Math.PI;
    const orbitPosition = (Math.sin(phase) + 1) / 2;
    const dayInOrbit = normalizedIndex % orbitalPeriod;
    return { dayInOrbit, orbitPosition };
  }

  // Get the orbital periods
  const periodB = json["Kepler-47"]["Planets"]["Kepler-47 b"]["orbital_period_days"];
  const periodC = json["Kepler-47"]["Planets"]["Kepler-47 c"]["orbital_period_days"];
  const periodD = json["Kepler-47"]["Planets"]["Kepler-47 d"]["orbital_period_days"];

  return {
    "b": getOrbitData(periodB, index),
    "c": getOrbitData(periodC, index * periodC / periodB), // scale index for planet C
    "d": getOrbitData(periodD, index * periodD / periodB)  // scale index for planet D
  };
}


function gregorianToJulian(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  let A = Math.floor(year / 100);
  let B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function julianToDate(julian) {
  // Adding 2,455,000 back to the provided BJD
  const jd = julian + 0.5;

  const Z = Math.floor(jd);
  const F = jd - Z;
  let A = Z;
  if (Z >= 2299161) {
      const alpha = Math.floor((Z - 1867216.25) / 36524.25);
      A += 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = (E < 14) ? E - 1 : E - 13;
  const year = (month > 2) ? C - 4716 : C - 4715;

  return `${Math.floor(day)}-${month}-${year}`;
  
}

function setCurrentIndexToToday() {
    const transits = exoData['Kepler-47']['Maar_World']['transits'];
    const numTransits = transits.length;

    // Calculate today's BJD
    const today = new Date();
    const todayBJD = gregorianToJulian(today.getFullYear(), today.getMonth() + 1, today.getDate()) - 2455000;

    // Find the nearest past and future transits
    let pastTransitIndex = 0;
    let futureTransitIndex = numTransits - 1;
    for (let i = 0; i < numTransits; i++) {
        if (transits[i].BJD < todayBJD) {
            pastTransitIndex = i;
        } else {
            futureTransitIndex = i;
            break;
        }
    }

    // Calculate the exact index for today
    const pastBJD = transits[pastTransitIndex].BJD;
    const futureBJD = transits[futureTransitIndex].BJD;
    const t = (todayBJD - pastBJD) / (futureBJD - pastBJD);
    index = (pastTransitIndex + t) / (numTransits - 1);

    // Adjust the index to fit within the range
    index = Math.max(0, Math.min(index, numTransits - 1));

    return index; // This is the normalized index for today
}

