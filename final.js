var images = {};
var defaultX = {};
var defaultY = {};
var X = {};
var Y = {};
var context = document.getElementById('canvas').getContext('2d');
var numResources = 5;
var loadedCounter = 0;
var fps = 15;

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
var ingX = [];
var ingY = [];

var isDragging = false;
var dragTarget = null;

//initial loading
function init(srcid) {
  //console.log(srcs[Number(srcid)]);
  for (i in srcs[srcid]){
    images[i] = new Image();
    images[i].onload = function() {
      loadedCounter += 1;
      if (loadedCounter === numResources) {
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
    case srcs.length:
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
      context.drawImage(images[i], X[i], Y[i]); // stand-by ingredients size
    }
  }
  if (canvas.width >= 1024) {
    for (i in nabe) {
      var shake = Math.floor(Math.random()*(95-soupColor)/5);
      context.drawImage(nabe[i], canvas.width/6 + ingX[i] - shake, canvas.height/5 + ingY[i] - shake, 150, 150);
      //context.drawImage(nabe[i], 0, 0, 100, ingY[i]/4, canvas.width/4 + ingX[i] - shake, canvas.height/4 + ingY[i] - shake, 100, ingY[i]/4);
      //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    }
  }
  else if (canvas.width > 767) {
    for (i in nabe) {
      var shake = Math.floor(Math.random()*(95-soupColor)/5);
      context.drawImage(nabe[i], canvas.width/4 + ingX[i] - shake, canvas.height/4 + ingY[i] - shake, 100, 100);
      //context.drawImage(nabe[i], 0, 0, 100, ingY[i]/4, canvas.width/4 + ingX[i] - shake, canvas.height/4 + ingY[i] - shake, 100, ingY[i]/4);
      //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    }
  }
  else {
    for (i in nabe) {
      var shake = Math.floor(Math.random()*(95-soupColor)/5);
      context.drawImage(nabe[i], canvas.width/10 + ingX[i]/5*2 - shake, canvas.height/4 + 75 + ingY[i]/7*2 - shake, 50, 50);
      //context.drawImage(nabe[i], 0, 0, 100, ingY[i]/4, canvas.width/10 + ingX[i]/2 - shake, canvas.height/4 + 100 + ingY[i]/3 - shake, 50, ingY[i]/8);
      //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    }
  }
}

// end drag
var mouseUp = function(e) {
  //  adding ingredients into the pot
  if (context.isPointInPath(X[dragTarget], Y[dragTarget])){
    defaultX[dragTarget] = X[dragTarget];
    defaultY[dragTarget] = Y[dragTarget];
    nabesrc.push(srcs[srcid][dragTarget]);
    console.log("nabe "+nabe);
    console.log("srcs[srcid] "+srcs[srcid]);
    console.log("dragTarget "+dragTarget);
    console.log("srcs[srcid][dragTarget] "+srcs[srcid][dragTarget]);
    soupColor -= srcid * 10;
    if (soupColor <= 0) {
      soupColor = 0;
    }
  };

  ingX.push(Math.floor(Math.random()*canvas.width/130)*50);  //0~400
  ingY.push(Math.floor(Math.random()*canvas.height/120)*50);  //0~300
  
  isDragging = false;
  dragTarget = null;
  init(srcid);
}

// begin drag
var touchStart = function(e) {
  //console.log("e: " + e);
  //console.log("e.touches[0]: " + e.touches[0]);
  //console.log("e.touches[0].client: " + e.touches[0].clientX + ", " + e.touches[0].clientY);
  for (i in images) {
    //console.log(images[i] + X[i] + Y[i]);
    //console.log("natural: " + images[i].naturalWidth + images[i].naturalHeight)
      // hit check whether cursor is on the image
      if (e.touches[0].clientX >= X[i] &&
        e.touches[0].clientX <= (X[i] + images[i].naturalWidth) &&
        e.touches[0].clientY >= Y[i] &&
        e.touches[0].clientY <= (Y[i] + images[i].naturalHeight)
        ) {
        dragTarget = i;
      isDragging = true;
      break;
    }
  }
};

// begin drag
var mouseDown = function(e) {
  //console.log("e: " + e);
  //console.log("e.touches[0]: " + e.touches[0]);
  //console.log("e.touches[0].client: " + e.touches[0].clientX + ", " + e.touches[0].clientY);
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
      break;
    }
  }
};

// end drag on mouse out of canvas
var mouseOut = function(e) {
  mouseUp(e);
};

// during drag
var touchMove = function(e) {
  if (isDragging) {
    for (var i in images) {
      if (i == dragTarget) {
        X[i] = e.touches[0].clientX - images[i].naturalWidth / 2;
        Y[i] = e.touches[0].clientY - images[i].naturalHeight / 2;
      }
      else {
        X[i] = defaultX[i];
        Y[i] = defaultY[i];
      }
    }
  }
};

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
    }
  }
};

init(srcid);

// make canvas listen for events (can add multiple events unlike HTML)
canvas.addEventListener('mousedown', function(e){mouseDown(e);}, false);
canvas.addEventListener('mousemove', function(e){mouseMove(e);}, false);
canvas.addEventListener('mouseup',   function(e){mouseUp(e);},   false);
canvas.addEventListener('mouseout',  function(e){mouseOut(e);},  false);

canvas.addEventListener('touchstart', function(e){touchStart(e);}, false);
canvas.addEventListener('touchmove', function(e){touchMove(e);}, false);
canvas.addEventListener('touchend',   function(e){mouseUp(e);},   false);