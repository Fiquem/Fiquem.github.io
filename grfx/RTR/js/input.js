var keys_down = {};
var rot_speed = 0.1;
var speed = 100.0;
var x,y;

function handleKeyDown(event) {
    var code = event.keyCode || event.key;
    keys_down[code] = true;
}

function handleKeyUp(event) {
    var code = event.keyCode || event.key;
    keys_down[code] = false;
    //console.log(event.keyCode);
}

function handleMouseMovement(e) {
    if(pointerlock)
    {
        x = e.movementX ||
            e.mozMovementX ||
            e.webkitMovementX ||
            0;
        y = e.movementY ||
            e.mozMovementY ||
            e.webkitMovementY ||
            0;

        yaw += x*rot_speed;
        if ((pitch < 90 && y > 0) || (pitch > -90 && y < 0)) pitch += y*rot_speed;
    }
}

function handleMouseDown(e) {
    spawned_objs.push(
        [cam_pos[0]+(10.0*forward[0]),
         cam_pos[1]+(10.0*forward[1]),
         cam_pos[2]+(10.0*forward[2])]
        );
}

function handleKeys() {
    // WASD - cam move
    if (keys_down[87])
        move(cam_pos, forward, 1, 0.1);
    if (keys_down[65])
        move(cam_pos, right, -1, 0.1);
    if (keys_down[83])
        move(cam_pos, forward, -1, 0.1);
    if (keys_down[68])
        move(cam_pos, right, 1, 0.1);
}

function move (obj, axis, dir, speed) {
	if (((dir * axis[0] * speed) > 0) || ((dir * axis[0] * speed) < 0))
		obj[0] += dir * axis[0] * speed;
	if (((dir * axis[1] * speed) > 0) || ((dir * axis[1] * speed) < 0))
		obj[1] += dir * axis[1] * speed;
	if (((dir * axis[2] * speed) > 0) || ((dir * axis[2] * speed) < 0))
		obj[2] += dir * axis[2] * speed;
}