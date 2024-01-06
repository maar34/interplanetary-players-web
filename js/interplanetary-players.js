


let sw, sh; // window size
let padX; // gui separation
var btW, btH, sliderW, sliderH, initSpeed;
let trackI, filterI; // track 1 -  
let font1; // font variable
let playStateI;
var regenValue; 
let params; // url parameters
let levelI, worldI_dist, cardColor;
let tempID, xDifference, yDifference;
let loadingBar, loadP;
let xSlider, ySlider, zSlider;
let xData, yData, zData, xDataNorm, yDataNorm, zDataNorm;
let easyX, easyY;
let bcol, col;
let freq, back;
let t1, t2, t3, t4, t5, t6, t7, t8;
let t11, t12, t13, t14, t15, t16, t17, t18;
var game, deck, suit, loadDeck, exoData;
let cam1;
let portrait;
let notDOM;
let device;
let inputX, inputY, inputZ;
let wMinD = 333;
let wMaxD = 1544;
let index, increasing; // Inicializar el índice


let worldI_speed = 1.0;

var numSamples = 1024;
// Array of amplitude values (-1 to +1) over time.
var samples = [];

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
  engine: "",
  xTag: "",
  yTag: "",
  zTag: ""
}
document.oncontextmenu = () => false; // no right click

var easycam,
  state = {
    distance: 388, //final distance
    center: [0, 0, 0],
    rotation: [1., 0., 0., 0.],
  },
  panelX = 30, panelY = 45;

document.oncontextmenu = () => false; // no right click

function preload() {

  params = getURLParams();

  game = loadJSON("data/" + params.g + ".json");

  font1 = loadFont('fonts/Orbitron-VariableFont_wght.ttf');

  exoData = loadJSON("data/exoplanetData.json");
 
  regenValue = 0.0;

}

document.body.onclick = () => {
  context.resume();
}
// prevent screen movement on touchstart event
document.body.addEventListener('touchstart', function (e) {
  if (e.target == document.body) {
    e.preventDefault();
  }
}, { passive: false });

function setup() {


  initVariables();
  xData = 1;
  yData = 0;
  xDataNorm = 1;
  yDataNorm = 0;

  index = 0; 
  increasing = true; 

  playStateI = 0;
  worldI_dist = 940;

  bcol = color(0, 0, 0, 10);
  col = color(255, 0, 0);

  if (params.s == 0) {
    card = game.A[params.c];
  };
  if (params.s == 1) {
    card = game.B[params.c];
  };
  if (params.s == 2) {
    card = game.C[params.c];
  };
  worldI_speed = card.speed;

  //print (card.engine); 
  xDifference = (card.xTag[2] - card.xTag[1]) > 10;
  yDifference = (card.yTag[2] - card.yTag[1]) > 10;


  createDom();

  // Create Canvas - Always the landscape.  
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  setAttributes('antialias', true);

  easycam = createEasyCam();
  easycam.setState(state, 3000); // animate to state in 3 second
  easycam.setDistanceMin(wMinD);
  easycam.setDistanceMax(wMaxD);
  easycam.state_reset = state;
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

function draw() {
  
  if (playStateI == 1) background(0, 0, 0);

  noStroke();
  lights();
  const wsize = 1.2
  if (loadP) loadGUI();

  //Planet and Background color (back from Sliders)
  push();
  // translate (0., 0., -666.);
  normalMaterial();
  easycam.rotateY(playStateI * easyY);
  easycam.rotateX(playStateI * easyX);

  sphere(80, 6, 6);
  rotateX(PI * .4);
  torus(120 * wsize, 7 * wsize, 6, 7);

  translate(- 260, 0., 0.);
  sphere(15, 6, 6);

  translate(520, 0., 0.);
  sphere(15, 6, 6);

  translate(- 260, - 260., 0.);
  sphere(15, 6, 6);

  translate(- 0, 520., 0.);
  sphere(15, 6, 6);
  //translate (0., 0., 666.);

  pop();

  noFill();
  stroke(cardColor);

  easycam.beginHUD();

  if (playStateI == 0) fill(0, 0, 0, .8);

  const margin = 3.3;
  strokeWeight(3.);
  beginShape();
  vertex(margin + 0, margin + 0);
  vertex(sw * .86, margin + 0);
  vertex(sw - margin, sh * .14);
  vertex(sw - margin, sh - margin);
  vertex(sw * .14, sh - margin);
  vertex(margin + 0,  sh - margin );
  vertex(margin + 0, margin + 0);
  endShape();


  easycam.endHUD();

  // REGENERATIVE UPDATES 

  regenUpdates();




}





function regenUpdates(){


  if ( regenValue > 0 ){

    let speedAmount = 1; // choose a normalized speed inside 8 regenButton variations 
  
  
    if (increasing) {
      index += speedAmount * 0.0001; // Aumentar el índice
      if (index >= 0.99) {
          index = 0.99;
          increasing = false; // Cambiar la dirección
      }
  } else {
      index -= speedAmount * 0.0001; // Disminuir el índice
      if (index <= 0.00999) {
          index = 0.00999;
          increasing = true; // Cambiar la dirección
      }
  }
  
  }
  

  switch (regenValue) {
    case 0:
        break;
    case 1:
      
    let result = interpolateTransitData(exoData, index); 

      speedAmount = result.normalizedBJD;
 

      xSlider.value(speedAmount*255.);
      xInput();
      ySlider.value(result.normalizedB*255.);
      yInput();
      zSlider.value(result.normalizedDuration*255);
      zInput();

      t15.html(result.transitDate);
      t16.html(nfs(result.b, 1, 2));
      t17.html(nfs(result.duration, 1, 2));
        break;
    case 2:
        break;
    case 3:
        break;
    case 4:
        break;
    case 5:
        break;
    case 6:
        break;
    case 7:
        break;
}


}






function regenLogic() {

  regenValue = (regenValue + 1) % 8; // This will cycle regenValue from 0 to 7
 // result = normalizeAndInterpolate(exoData, (regenValue/10)); // 
 // console.log(result);

  switch (regenValue) {
      case 0:
          regenButton.html('&#9842;');
          break;
      case 1:
          regenButton.html('&#9843;');

          break;
      case 2:
          regenButton.html('&#9844;');
          break;
      case 3:
          regenButton.html('&#9845;');
          break;
      case 4:
          regenButton.html('&#9846;');
          break;
      case 5:
          regenButton.html('&#9847;');
          break;
      case 6:
          regenButton.html('&#9848;');
          break;
      case 7:
          regenButton.html('&#9849;');
          break;
  }
}


function playPause() {

  notDOM = false;

  let messageEvent;


  if (playStateI == 0) {

    playButton.html('II');
    context.resume();
    messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [1]);
    messageEvent2 = new RNBO.MessageEvent(RNBO.TimeNow, "play", [1]);
    messageEvent3 = new RNBO.MessageEvent(RNBO.TimeNow, "play", [1]);
    device.scheduleEvent(messageEvent2);
    device.scheduleEvent(messageEvent3);
    playStateI = 1;

  } else {

    messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "play", [0]);

    playButton.style('transform', 'rotate(0deg)');
    playButton.html('&#9655');
    playStateI = 0;

  }
  device.scheduleEvent(messageEvent);
 // xInput();

//  xSlider.value(xSlider.value());
//  xInput();

}

function xB() {
  notDOM = false;
  xSlider.value(128.);
  xInput();

}

function yB() {
  notDOM = false;
  ySlider.value(128.);  
  yInput();
}

function zB() {
  notDOM = false;
  zSlider.value(128.);
  zInput();
}

function loaded() {

  loadP = false;


  xSlider.show();
  ySlider.show();
  zSlider.show();
  playButton.show();
  regenButton.show();
  xButton.show();
  yButton.show();
  zButton.show();

  guiData();

  //trackI.disconnect();
  //trackI.connect(filterI);

}

function errorLoadingAudio(_error) {

  let p = createP(_error);
  p.style('font-size', '16px');
  p.position(10, 0);

}

function loadingAudio(_loadingN) {

  loadingBar = _loadingN;
  loadP = true;

}


function createDom() {

  let domColor = color (card.col1);
  let domAlpha = color (card.col1); 
  domAlpha.setAlpha(190);

  // create buttons and sliderss
  playButton = createButton('&#9655');
  playButton.position( -11 , innerHeight * .84);

  playButton.style('width',  btW+ 'px');
  playButton.style('height',  btH + 'px' );
  playButton.style('background-color', domColor);

  playButton.style('color', domAlpha);
  playButton.style('font-size', '2rem');
  playButton.style('border', 'none');
  playButton.style('background', 'none');
  playButton.mousePressed(playPause);
  playButton.mouseReleased(releaseDOM);
  playButton.touchEnded(releaseDOM);

  // create buttons and sliderss
  regenButton = createButton('&#9842');
  regenButton.position( btW*.75 , innerHeight * .84);

  regenButton.style('width',  btW+ 'px');
  regenButton.style('height',  btH + 'px' );
  regenButton.style('background-color', domColor);

  regenButton.style('color', domAlpha);
  regenButton.style('font-size', '2rem');
  regenButton.style('border', 'none');
  regenButton.style('background', 'none');
  regenButton.mousePressed(regenLogic);
  regenButton.mouseReleased(releaseDOM);
  regenButton.touchEnded(releaseDOM);

  xButton = createButton('&#11042');
  xButton.style('width', btW + 'px');
  xButton.style('height', btH + 'px');
  xButton.style('background-color', domColor);
  xButton.style('color', domAlpha);
  xButton.style('font-size', '3rem');
  xButton.style('border', 'none');
  xButton.style('background', 'none');
  xButton.mousePressed(xB);
  xButton.touchStarted(xB);
  xButton.mouseReleased(releaseDOM);
  xButton.touchEnded(releaseDOM);
  //xButton.addClass("crosshair");

  yButton = createButton('&#11042');
  yButton.style('width', btW + 'px');
  yButton.style('height', btH + 'px');
  yButton.style('background-color', domColor);
  yButton.style('color', domAlpha);
  yButton.style('font-size', '3rem');
  yButton.style('border', 'none');
  yButton.style('background', 'none');
  yButton.mousePressed(yB);
  yButton.touchStarted(yB);
  yButton.mouseReleased(releaseDOM);
  yButton.touchEnded(releaseDOM);
  //yButton.addClass("crosshair");

  zButton = createButton('&#11042');
  zButton.style('width', btW + 'px');
  zButton.style('height', btH + 'px');
  zButton.style('background-color', domColor);
  zButton.style('color', domAlpha);
  zButton.style('font-size', '3rem');
  zButton.style('border', 'none');
  zButton.style('background', 'none');
  zButton.mousePressed(zB);
  zButton.touchStarted(zB);
  zButton.mouseReleased(releaseDOM);
  zButton.touchEnded(releaseDOM);
  //zButton.addClass("crosshair");

  xButton.position(innerWidth * .5 - (btW * .5), innerHeight * .8);
  yButton.position(-11., innerHeight * .37);
  zButton.position(innerWidth * .7, innerHeight * .37);


  // create sliders

  initSpeed = map(float((card.speed)), float(card.minSpeed), float(card.maxSpeed), 0., 255.);
  xSlider = createSlider(0., 255, 128);
  xSlider.style('width', sliderW + 'px');
  xSlider.addClass("slider");
  // xSlider.style('height', sliderH+'px');
  xSlider.input(xInput);
  xSlider.mousePressed(pressDOM);
  xSlider.touchStarted(pressDOM);
  xSlider.mouseReleased(releaseDOM);
  xSlider.touchEnded(releaseDOM);

  //   myElement.style('background', domColor); // this change only the line color*/
  // xSlider.style('::-webkit-slider-thumb:background', 'red');
  // xSlider.style('background', 'rgba(0, 0, 0, 0)');
  // myClass.style(`::-webkit-slider-thumb { background: ${domColor}; }`);


  ySlider = createSlider(0, 255, 128);
  ySlider.style('width', sliderW + 'px');
  ySlider.style('transform', 'rotate(-90deg)');
  ySlider.addClass("slider");
  ySlider.style('height', sliderH+'px');
  ySlider.input(yInput);
  ySlider.mousePressed(pressDOM);
  ySlider.touchStarted(pressDOM);
  ySlider.mouseReleased(releaseDOM);
  ySlider.touchEnded(releaseDOM);


  zSlider = createSlider(0, 255, 128);
  zSlider.style('width', sliderW + 'px');
  zSlider.style('height', sliderH+'px');
  zSlider.style('transform', 'rotate(-90deg)');
  zSlider.addClass("slider");
  zSlider.input(zInput);
  zSlider.mousePressed(pressDOM);
  zSlider.touchStarted(pressDOM);
  zSlider.mouseReleased(releaseDOM);
  zSlider.touchEnded(releaseDOM);

  xSlider.hide();
  ySlider.hide();
  zSlider.hide();
  playButton.hide();
  regenButton.hide();

  xButton.hide();
  yButton.hide();
  zButton.hide();

  xSlider.position(innerWidth * .5 - (sliderW * .5), innerHeight * .8);
  ySlider.position(0, innerHeight * .4);
  zSlider.position(innerWidth * 0.7- (sliderW * .5), innerHeight * .4);

}

function updateDom() {

  sw = window.innerWidth;
  sh = window.innerHeight;

  sliderW = sw * .6;
  sliderH = sliderW * .11;

  // move buttons
  playButton.position( -11 , innerHeight * .84);
  regenButton.position( btW , innerHeight * .84);
  xButton.position(innerWidth * .5 - (btW * .5), innerHeight * .8);
  yButton.position(-11., innerHeight * .34);
  zButton.position(innerWidth * .7, innerHeight * .34);

  // move sliders
  xSlider.position(innerWidth * .5 - (sliderW * .5), innerHeight * .8);
  ySlider.position(0, innerHeight * .4);
  zSlider.position(innerWidth * 0.7- (sliderW * .5), innerHeight * .4);

}

function pressDOM() {
  notDOM = false;
}
function releaseDOM() {
  notDOM = true;

}


function xInput() {

  inputX.value = xSlider.value();
  xData = map(xSlider.value(), 0., 255., float(card.xTag[1]), float(card.xTag[2]));
  // if (card.xTag[0] == "Speed") worldI_speed = xData; 
  t6.html(nfs(xData, 1, 2));
  xDataNorm = map(xData, float(card.xTag[1]), float(card.xTag[2]), -1., 1.);

  if (xDifference) {
    yDataNorm = map(yData, float(card.yTag[1]), float(card.yTag[2]), -1., 1.);
    easyY = xDataNorm * -0.077;
  } else {
    easyY = xData * -0.077;
  }

}

function yInput() {

  inputY.value = ySlider.value();
  yData = map(ySlider.value(), 0., 255., float(card.yTag[1]), float(card.yTag[2]));
  t7.html(nfs(yData, 1, 2));

  // if the range in x axe is greter than 10 (xDifference) then animate planet with normalized value, else use the normal value - this exception works nice with speed and non simetrical parameters
  if (yDifference) {
    yDataNorm = map(yData, float(card.yTag[1]), float(card.yTag[2]), -1., 1.);
    easyX = yDataNorm * -0.077;
  } else {
    easyX = yData * -0.077;
  }


}

function zInput() {

  if (zSlider.value() <= 127.) {
    worldI_dist = map(zSlider.value(), 0., 127., wMaxD, wMinD);
  } else {
    worldI_dist = map(zSlider.value(), 127., 255., wMinD, wMaxD);
  }
  easycam.setDistance(worldI_dist, 1.);

  inputZ.value = zSlider.value();

  t5.html(nfs(worldI_dist, 1, 2));

  zData = map(zSlider.value(), 0., 255., float(card.zTag[1]), float(card.zTag[2]));
  t8.html(nfs(zData, 1, 2));


}



function xOutput() {
  if (!loadP) {
    var startX = easycam.mouse.curr[0];
    var deltaX = map(startX, 0., sw, 0., 255.);
    inputX.value = deltaX;

    xSlider.value(deltaX);
    xData = map(xSlider.value(), 0., 255., float(card.xTag[1]), float(card.xTag[2]));
    // if the range in x axe is greter than 10 (xDifference) then animate planet with normalized value, else use the normal value - this exception works nice with speed and non simetrical parameters
    if (xDifference) {
      yDataNorm = map(yData, float(card.yTag[1]), float(card.yTag[2]), -1., 1.);
      easyX = yDataNorm * -0.077;
    } else {
      easyX = yData * -0.077;
    }



    //  if (card.xTag[0] == "Speed") worldI_speed = xData; 
    t6.html(nfs(xData, 1, 2));



  }
}

function yOutput() {
  if (!loadP) {

    var startY = easycam.mouse.curr[1];
    var deltaY = map(startY, 0., sh, 255., 0.);
    ySlider.value(deltaY);
    inputY.value = ySlider.value();
    yData = map(ySlider.value(), 0., 255., float(card.yTag[1]), float(card.yTag[2]));
    yDataNorm = map(yData, float(card.yTag[1]), float(card.yTag[2]), -1., 1.);

    t7.html(nfs(yData, 1, 2));

  }
}

function zOutput(delta) {
  if (!loadP) {

    var zDelta = zSlider.value() + delta;
    inputZ.value = zDelta;
    zSlider.value(zDelta);

    if (zSlider.value() <= 127.) {
      worldI_dist = map(zSlider.value(), 0., 127., wMaxD, wMinD);
    } else {
      worldI_dist = map(zSlider.value(), 127., 255., wMinD, wMaxD);
    }
    t5.html(nfs(worldI_dist, 1, 2));
    easycam.setDistance(worldI_dist, 1.);

    var zData = map(zSlider.value(), 0., 255., float(card.zTag[1]), float(card.zTag[2]));
    t8.html(nfs(zData, 1, 2));



  }
}


function guiData() {

  let offset = 3.;
  let textColor = card.col1;

  // Render the labels

  t1 = createP('Distance:');
  t1.position(padX * offset, padY * offset);
  t1.style('color', textColor);

  t2 = createP(card.xTag[0] + ":");
  t2.position(padX * offset, padY * offset + 20);
  t2.style('color', textColor);

  t3 = createP(card.yTag[0] + ":");
  t3.position(padX * offset, padY * offset + 40);
  t3.style('color', textColor);

  t4 = createP(card.zTag[0] + ":");
  t4.position(padX * offset, padY * offset + 60);
  t4.style('color', textColor);

  t5 = createP();
  t5.html(worldI_dist);
  t5.position(padX * offset + 90, padY * offset);
  t5.style('color', textColor);

  t6 = createP();
  t6.html(nfs("0", 1, 2));
  t6.position(padX * offset + 130, padY * offset + 20);
  t6.style('color', textColor);

  t7 = createP("0");
  t7.position(padX * offset + 130, padY * offset + 40);
  t7.style('color', textColor);

  t8 = createP("0");
  t8.position(padX * offset + 130, padY * offset + 60);
  t8.style('color', textColor);

  t11 = createP(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pX1']+ ":");
  t11.position(padX * offset, padY * offset+80);
  t11.style('color', textColor);

  t12 = createP(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pY1'] + ":");
  t12.position(padX * offset, padY * offset + 100);
  t12.style('color', textColor);

  t13 = createP(exoData['Kepler-47']['Maar_World']['parameter_descriptions']['pZ1'] + ":");
  t13.position(padX * offset, padY * offset + 120);
  t13.style('color', textColor);

  
  t15 = createP();
  t15.html(worldI_dist);
  t15.position(padX * offset + 90, padY * offset+80);
  t15.style('color', textColor);

  t16 = createP();
  t16.html(nfs("0", 1, 2));
  t16.position(padX * offset + 130, padY * offset + 100);
  t16.style('color', textColor);

  t17 = createP("0");
  t17.position(padX * offset + 130, padY * offset + 120);
  t17.style('color', textColor);


}

function loadGUI() {
  ///// LOADING TEXTS 
  textAlign(CENTER);
  let tempF = frameRate() % 30.;
  if (tempF > 15.) {
    fill(0, 0, 255);
  } else {
    fill(255, 0, 0);
  }
  if (loadingBar == 1) {
    translate(0., 0., -666.);

    text("Receiving Sound Waves", 0, -sh * .34 - padY * 4);
    text("please wait, unmute device...", 0, -sh * .34 - padY * 1);
    translate(0., 0., 666.);

  } else {
    text("", 0, -padY * 13);
  }
}

function windowResized() {

  initVariables();
  resizeCanvas(sw, sh);
  updateDom();
  easycam.setViewport([0, 0, sw, sh]);

}

function touchStarted() {

}
function touchMoved() {
  if (notDOM) {
    xOutput();
    yOutput();
  }

  //print(notDOM); 

}



function mousePressed() {

}

function mouseWheel(event) {

  zOutput(-event.delta * .1);

}

function doubleClicked() {
  xB();
  yB();
  zB();
}

function initVariables() {

  sw = window.innerWidth;
  sh = window.innerHeight;
  padX = sw / 77.;
  padY = sh / 100.;
  btW = sw * .15;
  btH = sw * .15;
  sliderW = sw * .6;
  sliderH = sliderW * .11;
  startX = 0;
  startY = 0;
  notDOM = true;

}


async function createRNBO() {

  try {

    const patchExportURL = "export/" + card.engine;

    // Create AudioContext
    let WAContext = window.AudioContext || window.webkitAudioContext;
    context = new WAContext();

    let rawPatcher = await fetch(patchExportURL);
    let patcher = await rawPatcher.json();
    device = await RNBO.createDevice({ context, patcher }); // seems we need to access the default exports via .default

    device.node.connect(context.destination);
    loadAudioBuffer(context);

    // Connect With Parameters

    inputX = device.parametersById.get("inputX");
    inputY = device.parametersById.get("inputY");
    inputZ = device.parametersById.get("inputZ");
    //    print ("I am A2")
  } catch (error) {
    console.log(error);
    errorLoadingAudio(error);
  }

}

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


async function loadAudioBuffer(_context) {

  loadingAudio(1);
  context = _context;

  let audioBuf
  try {
    let audioURL;

    if (navigator.connection) {
      const speed = navigator.connection.downlink;
      audioURL = speed > 1 ? card.mp3file : card.wavfile;

    } else {
      audioURL = card.mp3file;
    }
    
    try {
      const fileResponse = await fetch(audioURL, {
        cache: 'reload'
      });
      
      if (!fileResponse.ok) {
        throw new Error("Network response was not OK");
        errorLoadingAudio("Network response was not OK");

      }
      // Load our sample as an ArrayBuffer;
      const arrayBuf = await fileResponse.arrayBuffer();
      //  console.log(arrayBuf);

      // Decode the received Data as an AudioBuffer
      audioBuf = await context.decodeAudioData(arrayBuf);
      // Set the DataBuffer on the device
      await device.setDataBuffer("world1", audioBuf);

    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      errorLoadingAudio(error);

    }

    loaded();

  } catch (error) {
    console.log(error);
    errorLoadingAudio(error);
  }


}

