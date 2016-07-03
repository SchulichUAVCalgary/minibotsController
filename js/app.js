hideElement("buttonController")
hideElement("joystickController")
hideElement("homeScreen")
showElement("homeScreen")
function hideElement(theElement)
{
    document.getElementById(theElement).style.visibility = "hidden";
}


function showElement(theElement)
{
    document.getElementById(theElement).style.visibility = "visible";
}


var canvas = document.getElementById("controllerJoystickCanvas");
var context = canvas.getContext("2d");

var count = 0;

context.fillStyle = "#FF0000";
context.fillRect(0,0,1400,400);
functReset(-1,-1);

window.onresize = function(event)
{
	functReset(-1,-1);
};

function functReset(x,y)
{
	var smallestSize = Math.min(window.innerWidth, window.innerHeight);
	context.canvas.width = smallestSize*4/5;
	context.canvas.height = smallestSize*4/5;
	drawBackground();
	drawCenter(x,y);
}

function drawBackground()
{
	var smallest = Math.min(canvas.width, canvas.height);
	context.beginPath();
    context.lineWidth = 4;
	context.arc(smallest/2, smallest/2, smallest/3, 0, 2*Math.PI);
	context.stroke();
}



function drawCenter(x,y)
{
	var smallest = Math.min(canvas.width, canvas.height);
	if (x == -1 && y == -1)
	{
		x = smallest/2;
		y = smallest/2;
	}
	context.beginPath();
    context.lineWidth = 3;
	context.arc(x, y, smallest/8, 0, 2*Math.PI);
	context.stroke();
}

var clicked = false;
var mouse = true;
document.getElementById("controllerJoystickCanvas").onmousedown = function(){
	if (!mouse) return;
    controllerDown();
};

window.onmouseup = function(){
	if (!mouse) return;
    controllerUp();
};

document.getElementById("controllerJoystickCanvas").onmousemove = function(data){
    mouse = true;
    if (!clicked) return;
    controllerMove(data);
};


var joy = document.getElementById("controllerJoystickCanvas");
joy.addEventListener("touchstart", controllerDown, false);
joy.addEventListener("touchend", controllerUp, false);
joy.addEventListener("touchcancel", controllerUp, false);
joy.addEventListener("touchmove", controllerMove, false);
joy.addEventListener("touchmove", function(){
    mouse = false;
}, false);


function controllerDown()
{
    functReset(-1,-1);
	moveRobot(0,0);
	clicked = true;
}

function controllerUp()
{
    console.log(document.getElementById("joystickController") != 'visible');
	if (document.getElementById("joystickController") == 'visible');
	{
		functReset(-1,-1);
		moveRobot(0,0);
		clicked = false;
	}
}

function controllerMove(data)
{
	var location = mousePosition(canvas,data,mouse);
	moveController(location);
}

function moveController(location)
{
	var smallest = Math.min(canvas.width, canvas.height);
	functReset(location.x, location.y);

	var forwardNoSensor = -(location.y-smallest/2)/(smallest/3);
	var rightNoSensor = (location.x-smallest/2)/(smallest/3);
	var leftMotor = 100*rightNoSensor+100*forwardNoSensor
	var rightMotor = -100*rightNoSensor+100*forwardNoSensor
	if (leftMotor>100) leftMotor = 100;
	if (leftMotor<-100) leftMotor = -100;
	if (rightMotor>100) rightMotor = 100;
	if (rightMotor<-100) rightMotor = -100;
	
    //if (count >= 10)
	//{
    if (leftMotor==null || rightMotor == null) return;
		moveRobot(leftMotor,rightMotor);
		count = 0;
	//}
	//else
	//	count++;
	
}

function mousePosition(obj, location, ismouse)
{
    var rect = obj.getBoundingClientRect();
    if (ismouse)
    {
        return {
            x: location.clientX - rect.left,
            y: location.clientY - rect.top
        } 
    }
    else //is touch
    {
        var touch = location.targetTouches[0];
        console.log(rect.left);
        return {
            x: touch.pageX - rect.left,
            y: touch.pageY - rect.top
        }
    }

}

document.getElementById("rightButton").onclick = function(){
    moveRobot(-100, 100);
};

document.getElementById("forwardButton").onclick = function(){
    moveRobot(100, 100);
};

document.getElementById("stopButton").onclick = function(){
    moveRobot(0, 0);
};

document.getElementById("leftButton").onclick = function(){
    moveRobot(100, -100);
};

document.getElementById("reverseButton").onclick = function(){
    moveRobot(-100, -100);
};

document.getElementById("goBackButton").onclick = function(){
    hideElement("buttonController");
    showElement("homeScreen");
};

document.getElementById("bottomGoBackButton").onclick = function(){
    hideElement("joystickController");
    showElement("homeScreen");
};

document.getElementById("goToButtons").onclick = function(){
    showElement("buttonController");
    hideElement("homeScreen");
};

document.getElementById("goToJoystick").onclick = function(){
    showElement("joystickController");
    hideElement("homeScreen");
};

function moveRobot(leftMotor, rightMotor)
{
    var output = "left=" + leftMotor.toString() + "&right=" + rightMotor.toString()
	$.post("/command", output, function(input){
		console.log(input);
	});
	console.log(output);
};




function postData(path, output, callback)
{
    //xhttp.open("POST", path,)
    //callback("hello")
}