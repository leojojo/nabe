var images = {};
var context = document.getElementById('canvas').getContext("2d");
var charX = 450;
var charY = 400;
var totalResources = 5;
var loadedCounter = 0;
var fps = 30;

var srcs = [
  "tofu",
  "carrot",
  "meat",
  "onion",
  "mushroom"
];

var isDragging = false;

for (i in srcs){
  images[i] = new Image();
  images[i].onload = function() { 
    loadedCounter += 1;
    if(loadedCounter === totalResources) {
      setInterval(redraw, 1000 / fps);
    }
  }
  images[i].src = "images/" + srcs[i] + ".png";
  console.log(i + srcs[i] + images[i].src);
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

  canvas.width = canvas.width;  // clears the canvas 

  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;

  drawSoup(canvas.width/5*2, canvas.height/2, 1200, 600);
  for (i in images){
    context.drawImage(images[i], canvas.width/5*4, canvas.height/6*i);
  }
}

/*
// $B%I%i%C%03+;O(B
var mouseDown = function(e) {
  // $B%I%i%C%03+;O0LCV(B
  var posX = parseInt(e.clientX - canvas.offsetLeft);
  var posY = parseInt(e.clientY - canvas.offsetTop);

  for (var i = images.length - 1; i >= 0; i--) {
    // $BEv$?$jH=Dj!J%I%i%C%0$7$?0LCV$,2hA|$NHO0OFb$K<}$^$C$F$$$k$+!K(B
    if (posX >= images[i].drawOffsetX &&
        posX <= (images[i].drawOffsetX + images[i].drawWidth) &&
        posY >= images[i].drawOffsetY &&
        posY <= (images[i].drawOffsetY + images[i].drawHeight)
       ) {
      dragTarget = i;
      isDragging = true;
      break;
    }
  }
}

// $B%I%i%C%0=*N;(B
var mouseUp = function(e) {
  isDragging = false;
};

// canvas$B$NOH$+$i30$l$?(B
var mouseOut = function(e) {
  mouseUp(e);
}

// $B%I%i%C%0Cf(B
var mouseMove = function(e) {
  // $B%I%i%C%0=*N;0LCV(B
  var posX = parseInt(e.clientX - canvas.offsetLeft);
  var posY = parseInt(e.clientY - canvas.offsetTop);

  if (isDragging) {
    // canvas$BFb$r0lC6%/%j%"(B
    context.clearRect(0, 0, canvas.width, canvas.height);

    var x = 0;
    var y = 0;
    for (var i in images) {
      if (i == dragTarget) {
        x = posX - images[i].drawWidth / 2;
        y = posY - images[i].drawHeight / 2;

        // $B%I%i%C%0$,=*N;$7$?;~$N>pJs$r5-21(B
        images[i].drawOffsetX = x;
        images[i].drawOffsetY = y;
      } else {
        x = images[i].drawOffsetX;
        y = images[i].drawOffsetY;
      }

      // $B2hA|$rIA2h(B
      context.drawImage(images["tofu"], canvas.width/5*4, canvas.height/6);
      context.drawImage(images["carrot"], canvas.width/5*4, canvas.height/6*2);
      context.drawImage(images["mushroom"], canvas.width/5*4, canvas.height/6*3);
      context.drawImage(images["meat"], canvas.width/5*4, canvas.height/6*4);
      context.drawImage(images["onion"], canvas.width/5*4, canvas.height/6*5);
    }
  }
}
*/

// canvas$B$K%$%Y%s%HEPO?(B
canvas.addEventListener('mousedown', function(e){mouseDown(e);}, false);
canvas.addEventListener('mousemove', function(e){mouseMove(e);}, false);
canvas.addEventListener('mouseup',   function(e){mouseUp(e);},   false);
canvas.addEventListener('mouseout',  function(e){mouseOut(e);},  false);
