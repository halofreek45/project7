var screen = document.getElementById("screen")
var namespace = "http://www.w3.org/2000/svg"
var colorSelect = document.getElementById("colorSelect").value;
var shapeSelect = document.getElementById("shapeSelect").value;
var sizeSelect = document.getElementById("sizeSelect").value;
var toggleDraw = false;
var erase = false;

// utility function
function transformPoint(event) {
    var pt = screen.createSVGPoint()
    pt.x = event.x
    pt.y = event.y
    var mousept = pt.matrixTransform(screen.getScreenCTM().inverse())
    return mousept
}

// Step 2: drawSquare and drawCircle functions
function drawSquare(canvas, x, y, size, color) {
    var rectangle = document.createElementNS(namespace, "rect")
    rectangle.setAttribute("x", x);
    rectangle.setAttribute("y", y);
    rectangle.setAttribute("width", size);
    rectangle.setAttribute("height", size);
    rectangle.setAttribute("fill", color);
    canvas.appendChild(rectangle);
}

function drawCircle(canvas, xpos, ypos, radius, color) {
    var circle = document.createElementNS(namespace, "circle");
    circle.setAttribute("cx", xpos);
    circle.setAttribute("cy", ypos);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", color);
    canvas.appendChild(circle);
}

function checkSelections() {
  colorSelect = document.getElementById("colorSelect").value;
  shapeSelect = document.getElementById("shapeSelect").value;
  sizeSelect = document.getElementById("sizeSelect").value;
}

// Step 3: Event listeners
document.addEventListener("mousedown", function(e) {
  toggleDraw = true;
})

document.addEventListener("mouseup", function(e) {
toggleDraw = false;
})

document.addEventListener("mousemove", function(e) {
  checkSelections();
  var pt = transformPoint(e, screen);
    if(toggleDraw == true) {
      if(erase) {
        if(shapeSelect == "square") {
          drawSquare(screen, pt.x, pt.y, sizeSelect, "white");
        }
        else {
          drawCircle(screen, pt.x, pt.y, sizeSelect, "white");
        }
      }
      else {
        if(shapeSelect == "square") {
          drawSquare(screen, pt.x, pt.y, sizeSelect, colorSelect);
        }
        else {
          drawCircle(screen, pt.x, pt.y, sizeSelect, colorSelect);
        }
      }
    }
})

document.addEventListener("keydown", function(e) {
  if(e.keyCode == 69) {
    if(erase) {
      erase = false;
    }
    else {
      erase = true;
    }
  }
})
