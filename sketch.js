
let playerI;
var playButtonI; 

function preload() {
  playerI = loadSound('https://uc82093857bd98be53ea5c957826.dl.dropboxusercontent.com/cd/0/inline/BuRqhcyTE2opXL97-Phvc_qDz2FukaiueX6s_xjvHF5UR-2M2LmGI7ALT3NG2BYzD7k1tEON7YZ21YNN0fndTnQTBIAuXvq0_HolI5ozxKCxQRn0mrSGTlHAu_wrWShbBMCfrYt2XVMZDIUmK9JQ_4lNtbnX3jaCtMNYNHISJD5xpw/file#');
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
