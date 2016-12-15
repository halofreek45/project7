var screen = document.getElementById("screen")
var namespace = "http://www.w3.org/2000/svg"
var colorSelector = document.getElementById("colorSelect");
var color = "red";
var shapeSelector = document.getElementById("shapeSelect");
var shape = "square";
var sizeSelector = document.getElementById("sizeSelect");
var size = 10;
var customColor = document.getElementById("customColor");
var customSize = document.getElementById("customSize");
var toggleDraw = false;
var erase = false;
var rainbowArray = ["#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf", "#00ffff", "#00bfff", "#0080ff", "#0040ff", "#0000ff", "#4000ff", "#8000ff", "#bf00ff", "#ff00ff", "	#ff00bf", "#ff0080", "#ff0040", "#ff0000"];
var rainbowIndex = 0;
var undoArray = [];
var currentUndo = [];
var lineX1;
var lineX2;
var lineY1;
var lineY2;
var drawingLine = false;

// utility function
function transformPoint(event) {
    var pt = screen.createSVGPoint()
    pt.x = event.x;
    pt.y = event.y;
    var mousept = pt.matrixTransform(screen.getScreenCTM().inverse())
    return mousept
}

// Step 2: drawSquare and drawCircle functions
function drawSquare(canvas, x, y, size, color, evaluation) {
    var rectangle = document.createElementNS(namespace, "rect")
    rectangle.setAttribute("x", x);
    rectangle.setAttribute("y", y);
    rectangle.setAttribute("width", size);
    rectangle.setAttribute("height", size);
    rectangle.setAttribute("fill", color);
if(evaluation) {
  currentUndo.push(rectangle);
}
    canvas.appendChild(rectangle);
}

function drawLine(canvas, x1, x2, y1, y2, width, color, evaluation) {
    var line = document.createElementNS(namespace, "line")
    line.setAttribute("x1", x1);
    line.setAttribute("x2", x2);
    line.setAttribute("y1", y1);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke-width", width);
    line.setAttribute("stroke", color);
if(evaluation) {
  currentUndo.push(line);
}
    canvas.appendChild(line);
}

function drawCircle(canvas, xpos, ypos, radius, color, evaluation) {
    var circle = document.createElementNS(namespace, "circle");
    circle.setAttribute("cx", xpos);
    circle.setAttribute("cy", ypos);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", color);
    if(evaluation) {
      currentUndo.push(circle);
    }
    canvas.appendChild(circle);
}

// Step 3: Event listeners
document.addEventListener("mousedown", function(e) {
  var pt = transformPoint(e);
  toggleDraw = true;
  if(shape == "line") {
    if(drawingLine == false) {
      lineX1 = pt.x;
      lineY1 = pt.y;
      drawingLine = true;
    }
    else if(drawingLine) {
      lineX2 = pt.x;
      lineY2 = pt.y;
      drawLine(screen, lineX1, lineX2, lineY1, lineY2, size, color, true);
      drawingLine = false;
      lineX1 = 0;
      lineX2 = 0;
      lineY1 = 0;
      lineY2 = 0;
    }
  }
  else {
    lineX1 = 0;
    lineX2 = 0;
    lineY1 = 0;
    lineY2 = 0;
  }
})

document.addEventListener("mouseup", function(e) {
toggleDraw = false;
})

document.addEventListener("mousemove", function(e) {
  var pt = transformPoint(e, screen);
    if(toggleDraw == true) {
      if(erase) {
        if(shape == "square") {
          drawSquare(screen, pt.x, pt.y, size, "white", false);
        }
        else {
          drawCircle(screen, pt.x, pt.y, size, "white", false);
        }
      }
      else {
        if(color == "rainbow") {
          if(shape == "square") {
            drawSquare(screen, pt.x, pt.y, size, rainbowArray[rainbowIndex], true);
          }
          else {
            drawCircle(screen, pt.x, pt.y, size, rainbowArray[rainbowIndex], true);
          }
          if(rainbowIndex == rainbowArray.length) {
            rainbowIndex = 0;
          }
          else {
            rainbowIndex++
          }
          console.log(rainbowIndex)
        }
        else if(shape == "square") {
          drawSquare(screen, pt.x, pt.y, size, color, true);
        }
        else {
          drawCircle(screen, pt.x, pt.y, size, color, true);
        }
      }
    }
    if (currentUndo.length > 0 && toggleDraw == false) {
        undoArray.push(currentUndo);
        currentUndo = [];
    }
})

document.addEventListener("keydown", function(e) {
  if(e.keyCode == 189) {
    if(erase) {
      erase = false;
    }
    else {
      erase = true;
    }
  }
  if(e.keyCode == 187) {
    var undoIndex = undoArray.length - 1;
    var currentArray = undoArray[undoIndex];

    for (var i = 0; i < currentArray.length; i++) {
      screen.removeChild(currentArray[i])
    }
    undoArray.pop(undoIndex)
  }
})

shapeSelector.addEventListener("mouseup", function(e) {
  shape = shapeSelector.value;
})
sizeSelector.addEventListener("mouseup", function(e) {
  size = sizeSelector.value;
})
colorSelector.addEventListener("mouseup", function(e) {
  color = colorSelector.value;
})

customColor.addEventListener("keyup", function(e) {
  color = customColor.value;
})
customSize.addEventListener("keyup", function(e) {
  size = customSize.value;
})
