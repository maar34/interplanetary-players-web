
let playerI;
var playButtonI; 

function preload() {
  playerI = loadSound('https://dl.dropboxusercontent.com/s/0ynj027z1lui2xj/04%20Spherical%20Drops.mp3?raw=1');
}

function setup() {
  createCanvas(710, 200);
  playerI.loop();// song is ready to play during setup() because it was loaded during preload
  playButtonI = createButton("play");
playButtonI.mousePressed(tooglePlaying);
  
  background(0, 255, 0);
}


function tooglePlaying(){
  if(!playerI.isPlaying()){
  playerI.play();
  playerI.setVolume(0.77);
  playButtonI.html("pause");
  
}else{
  playerI.pause();
  playButtonI.html("play");
}
}
function mousePressed() {
  if (playerI.isPlaying()) {
    // .isPlaying() returns a boolean
    // playerI.pause(); // .play() will resume from .pause() position
    background(255, 0, 0);
  } else {
    // playerI.play();
    background(0, 255, 0);
  }
}
