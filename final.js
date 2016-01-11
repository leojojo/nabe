var images = {};
var context = document.getElementById('canvas').getContext("2d");
var charX = 450;
var charY = 400;
var totalResources = 4;
var numResourcesLoaded = 0;
var fps = 30;

var isMouseDown = false;
var lastX = 0;
var lastY = 0;
var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

function loadImage(name) {
  images[name] = new Image();
  images[name].onload = function() { 
    resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {
  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
    setInterval(redraw, 1000 / fps);
  }
}

function drawSoup(centerX, centerY, width, height) {
  context.beginPath();
  context.moveTo(centerX, centerY - height/2);
  context.bezierCurveTo(
      centerX + width/2, centerY - height/2,
      centerX + width/2, centerY + height/2,
      centerX, centerY + height/2);
  context.bezierCurveTo(
      centerX - width/2, centerY + height/2,
      centerX - width/2, centerY - height/2,
      centerX, centerY - height/2);
  context.fillStyle = "linen";
  context.fill();
  context.closePath();  
}

function redraw() {
  var x = charX;
  var y = charY;

  canvas.width = canvas.width; // clears the canvas 

  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;

  drawSoup(canvas.width/2, canvas.height/2, 1200, 600);
  context.drawImage(images["tofu"], x + 40, y - 42);
  context.drawImage(images["carrot"], x, y);
  context.drawImage(images["mushroom"], x, y - 50);
  context.drawImage(images["meat"], x - 15, y - 42);
}

function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function onDown(e) {
  if ( !_touch ) {
    canvas.addEventListener( "mousemove", onMove, false );
    canvas.addEventListener( "mouseout", onUp, false );
    document.body.style.cssText = "cursor: move";
  }  else {
    canvas.addEventListener( "touchmove", onMove, false );
  }
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);
  lastX = mouseX;
  lastY = mouseY;
  isMouseDown = true;
}

function onUp(e){
  if ( !_touch ) {
    canvas.removeEventListener( "mousemove", onDown );
    canvas.removeEventListener( "mouseout", onUp );
    document.body.style.cssText = "cursor: auto";

    canvas.addEventListener( "mousedown", onDown, false );
    canvas.addEventListener( "mouseup", onUp, false );
  } else {
    canvas.removeEventListener( "touchmove", onMove );

    canvas.addEventListener( "touchstart", onDown, false );
    canvas.addEventListener( "touchend", onUp, false );
  }

  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);
  isMouseDown = false;
}

function onMove ( e ) {
  var v;
  if ( !!target ) {
    v = new Sankaku.Vector2D( e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop );
    target.setX( v.x - offset.x );
    target.setY( v.y - offset.y );
  }
}

loadImage("tofu");
loadImage("carrot");
loadImage("mushroom");
loadImage("meat");
