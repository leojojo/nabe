var images = {};
var defaultX = {};
var defaultY = {};
var X = {};
var Y = {};
var context = document.getElementById('canvas').getContext("2d");
var numResources = 5;
var loadedCounter = 0;
var fps = 20;
var set = 0;

var food = [
  "tofu",
  "carrot",
  "meat",
  "onion",
  "mushroom"
];
var organs = [
  "brain",
  "lung",
  "heart",
  "eye",
  "hand"
];
var srcs = [food, organs];

var isDragging = false;
var dragTarget = null;

//initial loading
function init(srcs) {
  for (i in srcs){
    images[i] = new Image();
    images[i].onload = function() {
      loadedCounter += 1;
      if(loadedCounter === numResources) {
        var init = setInterval(redraw, 1000 / fps);
      }
    }
    images[i].src = "images/" + srcs[i] + ".png";
//console.log(i + srcs[i] + images[i].src);
  }
}

function changeImg() {
  set = (set >= srcs.length) ? 0 : set + 1;
  init(srcs[set]);
}

function drawSoup(centerX, centerY, width, height, color) {
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
  context.fillStyle = color;
  context.fill();
  context.closePath();  
}

function drawDefault() {
  //set canvas size to window size
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;

  // clears canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawSoup(canvas.width/5*2, canvas.height/10*6, 1200, 500, String("linen"));
  for (i in images){
    defaultX[i] = canvas.width/10*9;
    defaultY[i] = canvas.height/6*i;
  }
}

function redraw() {
  drawDefault();
  for (i in images){
    if (i != dragTarget){
      X[i] = defaultX[i];
      Y[i] = defaultY[i];
      context.drawImage(images[i], X[i], Y[i]);
    }
  }
}

// begin drag
var mouseDown = function(e) {
  console.log("mouse: " + e.clientX + ", " + e.clientY);
  for (i in images) {
    console.log(images[i] + X[i] + Y[i]);
    console.log("natural: " + images[i].naturalWidth + images[i].naturalHeight)
      // hit check whether cursor is on the image
      if (e.clientX >= X[i] &&
          e.clientX <= (X[i] + images[i].naturalWidth) &&
          e.clientY >= Y[i] &&
          e.clientY <= (Y[i] + images[i].naturalHeight)
         ) {
        dragTarget = i;
        isDragging = true;
        var intervalId = setInterval(redraw, 1000 / fps);
        console.log("down: " + dragTarget);
        break;
      }
  }
}

// end drag
var mouseUp = function(e) {
  //if (X[dragTaget] = hittest nabe)
  isDragging = false;
  dragTarget = null;
  clearInterval(intervalId);
};

// end drag on mouse out of canvas
var mouseOut = function(e) {
  mouseUp(e);
}

// during drag
var mouseMove = function(e) {
  if (isDragging) {
    // clears canvas
    //context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i in images) {
      if (i == dragTarget) {
        X[i] = e.clientX - images[i].naturalWidth / 2;
        Y[i] = e.clientY - images[i].naturalHeight / 2;
      }
      else {
        X[i] = defaultX[i];
        Y[i] = defaultY[i];
      }

      console.log(i + ": " + X[i] + ", " + Y[i]);
      context.drawImage(images[i], X[i], Y[i]); //uncomment for shabby dragging
    }
  }
}

init(food);

// make canvas listen for events (can add multiple events unlike HTML)
canvas.addEventListener('mousedown', function(e){mouseDown(e);}, false);
canvas.addEventListener('mousemove', function(e){mouseMove(e);}, false);
canvas.addEventListener('mouseup',   function(e){mouseUp(e);},   false);
canvas.addEventListener('mouseout',  function(e){mouseOut(e);},  false);
