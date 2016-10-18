// mouse vars
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

// touch vars
var touchDown = false;
var lastTouchX = null;
var lastTouchY = null;

// gamepad vars
var axes_thresh = 0.25;
var timestamp = 0.0;
var gamepad;
var hasGP = false;
// FF
function gamepadInit(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
  gamepad = e.gamepad;
  console.log(gamepad);
}
function gamepadDisco(e) {
  console.log("no gamepad :(");
}
// Chrome
window.setInterval(function() {
  if(navigator.getGamepads()[0]) {
    if(!hasGP) {
      hasGP = true;
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        navigator.getGamepads()[0].index, navigator.getGamepads()[0].id,
        navigator.getGamepads()[0].buttons.length, navigator.getGamepads()[0].axes.length);
      gamepad = navigator.getGamepads()[0];
      console.log(gamepad);
    }
  }
}, 50);

// common vars
var deltaX = 0.0;
var deltaY = 0.0;
var pitch = 0.0;
var yaw = 0.0;
var sensitivity = 1.0;


function handleMouseDown(event)
{
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp(event)
{
  mouseDown = false;
}

function handleMouseMove(event)
{
  if (!mouseDown) return;
  var newX = event.clientX;
  var newY = event.clientY;
  deltaX = (newX - lastMouseX)/sensitivity;
  deltaY = (newY - lastMouseY)/sensitivity;
  pitch += deltaY;
  pitch = pitch > 360 ? pitch - 360 : pitch;
  yaw += deltaX;
  yaw = yaw > 360 ? yaw - 360 : yaw;
  cow_rotation_mat =
    mult_mat4_mat4 (
      rotate_x_deg (identity_mat4 (), pitch),
      rotate_y_deg (identity_mat4 (), yaw)
    );
  lastMouseX = newX;
  lastMouseY = newY;
}


function handleTouchStart(event)
{
  touchDown = true;
  lastTouchX = event.changedTouches[0].pageX;
  lastTouchY = event.changedTouches[0].pageY;
}

function handleTouchEnd(event)
{
  touchDown = false;
}

function handleTouchMove(event)
{
  if (!touchDown) return;
  var newX = event.changedTouches[0].pageX;
  var newY = event.changedTouches[0].pageY;
  deltaX = (newX - lastTouchX)/(sensitivity*10.0);
  deltaY = (newY - lastTouchY)/(sensitivity*10.0);
  pitch += deltaY;
  pitch = pitch > 360 ? pitch - 360 : pitch;
  yaw += deltaX;
  yaw = yaw > 360 ? yaw - 360 : yaw;
  cow_rotation_mat =
    mult_mat4_mat4 (
      rotate_x_deg (identity_mat4 (), pitch),
      rotate_y_deg (identity_mat4 (), yaw)
    );
  lastTouchX = newX;
  lastTouchY = newY;
}


function gamepadRotate(pad) {
  if (pad.axes[0] > axes_thresh || pad.axes[1] > axes_thresh ||
    pad.axes[0] < (-axes_thresh) || pad.axes[1] < (-axes_thresh))
  {
    deltaX = pad.axes[0]*2;
    deltaY = pad.axes[1]*2;
    pitch += deltaY;
    pitch = pitch > 360 ? pitch - 360 : pitch;
    yaw += deltaX;
    yaw = yaw > 360 ? yaw - 360 : yaw;
    cow_rotation_mat =
      mult_mat4_mat4 (
        rotate_x_deg (identity_mat4 (), pitch),
        rotate_y_deg (identity_mat4 (), yaw)
      );
  }
}

function gamepadCheck(pad) {
  for (var i = 0; i < pad.axes.length; i++)
  {
    if (pad.axes[i] > axes_thresh) console.log(i);
  }
  for (var i = 0; i < pad.buttons.length; i++)
  {
    if (pad.buttons[i].pressed) console.log(i);
  }
}

function handleKeyPress(e) {
  //console.log(e.keyCode);
  //console.log(gamepad);
}