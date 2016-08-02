var images = {};
var defaultX = {};
var defaultY = {};
var X = {};
var Y = {};
var context = document.getElementById('canvas').getContext("2d");
var numResources = 5;
var loadedCounter = 0;
var fps = 20;

var food = [
  "tofu",
  "carrot",
  "meat",
  "onion",
  "mushroom"
];
var chaos = [
  "orange",
  "jello",
  "sushi",
  "pizza",
  "octopus"
];
var organs = [
  "brain",
  "liver",
  "heart",
  "eye",
  "arm"
];
var srcs = [food, chaos, organs];
var srcid = 0;

var nabesrc = []; // store names from srcs[srcid]
var nabe = [];  // image object
var soupColor = 95;

var isDragging = false;
var dragTarget = null;

//initial loading
function init(srcid) {
  //console.log(srcs[Number(srcid)]);
  for (i in srcs[srcid]){
    images[i] = new Image();
    images[i].onload = function() {
      loadedCounter += 1;
      if(loadedCounter === numResources) {
        var init = setInterval(redraw, 1000 / fps);
      }
    }
    images[i].src = "images/" + srcs[srcid][i] + ".png";
    //console.log(i + srcs[i] + images[i].src);

    for (i in nabesrc){
      nabe[i] = new Image();
      nabe[i].src = "images/" + nabesrc[i] + ".png";
    }
  }
}

function changeImg(dir) {
  srcid += dir;
  switch (srcid) {
    case -1:
    srcid = srcs.length - 1;
    break;
    case 3:
    srcid = 0;
    break;
  }
  console.log(srcid);
  init(srcid);
}

function drawSoup(centerX, centerY, width, height, light) {
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
  context.fillStyle = "hsl(34, 54%," + light + "%)";
  context.fill();
  context.closePath();  
}

function drawDefault(soupColor) {
  //set canvas size to window size
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;

  // clears canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawSoup(canvas.width/5*2, canvas.height/10*5.2, canvas.width/1.1, canvas.width/2.2, 10);  //  pot outline
  drawSoup(canvas.width/5*2, canvas.height/10*6, canvas.width/1.3, canvas.width/2, 10);  //  pot bottom
  drawSoup(canvas.width/5*1, canvas.height/10*5, canvas.width/2, canvas.width/4, 10);  //  pot left handle
  drawSoup(canvas.width/5*3, canvas.height/10*5, canvas.width/2, canvas.width/4, 10);  //  pot right handle
  drawSoup(canvas.width/5*2, canvas.height/10*5, canvas.width/1.2, canvas.width/2.5, soupColor);  // soup
  for (i in images) {
    defaultX[i] = canvas.width/10*9;
    defaultY[i] = canvas.height/6*i;
    //context.drawImage(images[i], X[dragTarget], Y[dragTarget]);
  }
}

function redraw() {
  drawDefault(soupColor);
  for (i in images) {
    if (i != dragTarget){
      X[i] = defaultX[i];
      Y[i] = defaultY[i];
      context.drawImage(images[i], X[i], Y[i]); // stand-by ingredients size
    }
    else {    // ingredient currently being dragged
      context.drawImage(images[i], X[i], Y[i]);
    }
  }
  for (i in nabe) {
    context.drawImage(nabe[i], X[i], Y[i]);
  }
}

// end drag
var mouseUp = function(e) {
  //  adding ingredients into the pot
  if (context.isPointInPath(X[dragTarget], Y[dragTarget])){
    defaultX[dragTarget] = X[dragTarget];
    defaultY[dragTarget] = Y[dragTarget];
    nabesrc.push(srcs[srcid][dragTarget]);
    //console.log(nabe);
    soupColor -= srcid * 10;
  }
  
  //clearInterval(intervalId);
  isDragging = false;
  dragTarget = null;
};

// begin drag
var mouseDown = function(e) {
  //console.log("mouse: " + e.clientX + ", " + e.clientY);
  for (i in images) {
    //console.log(images[i] + X[i] + Y[i]);
    //console.log("natural: " + images[i].naturalWidth + images[i].naturalHeight)
      // hit check whether cursor is on the image
      if (e.clientX >= X[i] &&
        e.clientX <= (X[i] + images[i].naturalWidth) &&
        e.clientY >= Y[i] &&
        e.clientY <= (Y[i] + images[i].naturalHeight)
        ) {
        dragTarget = i;
      isDragging = true;
        //var intervalId = setInterval(redraw, 1000 / fps);
        //console.log("down: " + dragTarget);
        break;
      }
    }
  }

// end drag on mouse out of canvas
var mouseOut = function(e) {
  mouseUp(e);
}

// during drag
var mouseMove = function(e) {
  if (isDragging) {
    for (var i in images) {
      if (i == dragTarget) {
        X[i] = e.clientX - images[i].naturalWidth / 2;
        Y[i] = e.clientY - images[i].naturalHeight / 2;
      }
      else {
        X[i] = defaultX[i];
        Y[i] = defaultY[i];
      }

      //console.log(i + ": " + X[i] + ", " + Y[i]);
      //context.drawImage(images[i], X[i], Y[i]);
    }
  }
}

init(srcid);

// make canvas listen for events (can add multiple events unlike HTML)
canvas.addEventListener('mousedown', function(e){mouseDown(e);}, false);
canvas.addEventListener('mousemove', function(e){mouseMove(e);}, false);
canvas.addEventListener('mouseup',   function(e){mouseUp(e);},   false);
canvas.addEventListener('mouseout',  function(e){mouseOut(e);},  false);