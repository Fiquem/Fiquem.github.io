<?php

$vs = file_get_contents("../shaders/basic.vert");
$vs = str_replace("\n","",$vs);
$fs = file_get_contents("../shaders/basic.frag");
$fs = str_replace("\n","",$fs);

$cow_obj = file_get_contents("../meshes/SPACECOW.obj");
$cow_obj = explode("\n",$cow_obj);
$cow_obj = json_encode($cow_obj);

?>

var gl;
var sp;
var canvas;
var canvas_w;
var canvas_h;
var M, V, P;
var cow_rotation_mat;
var M_loc, V_loc, P_loc;

function getShader(gl, script, type) {
    var shaderScript = script;

    var shader;
    if (type == "frag") shader = gl.createShader(gl.FRAGMENT_SHADER);
    else if (type == "vert") shader = gl.createShader(gl.VERTEX_SHADER);
    else return null;

    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function main() {
    canvas = document.getElementById("outline-canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas_w = canvas.clientWidth;
    canvas_h = canvas.clientHeight;
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.clientWidth;
    gl.viewportHeight = canvas.clientHeight;

    var fragmentShader = getShader(gl, "<?php echo $fs ?>", "frag");
    var vertexShader = getShader(gl, "<?php echo $vs ?>", "vert");
    sp = gl.createProgram();
    gl.attachShader(sp, vertexShader);
    gl.attachShader(sp, fragmentShader);
    gl.bindAttribLocation (sp, 0, "vp");
    gl.bindAttribLocation (sp, 1, "vt");
    gl.bindAttribLocation (sp, 2, "vn");
    gl.linkProgram (sp);
    if (!gl.getProgramParameter(sp, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    M_loc = gl.getUniformLocation (sp, "M");
    P_loc = gl.getUniformLocation (sp, "P");
    V_loc = gl.getUniformLocation (sp, "V");

    gl.cullFace (gl.BACK);
    gl.frontFace (gl.CCW);
    //gl.enable (gl.CULL_FACE);
    gl.enable (gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.clearColor(0.7, 0.7, 0.7, 1.0);

    // events
    document.onkeypress = handleKeyPress;

    // rotate with click
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    // rotate with touch
    canvas.addEventListener("touchstart", handleTouchStart, false);
    canvas.addEventListener("touchend", handleTouchEnd, false);
    canvas.addEventListener("touchcancel", handleTouchEnd, false);
    canvas.addEventListener("touchleave", handleTouchEnd, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);

    // rotate with gamepad
    window.addEventListener("gamepadconnected", gamepadInit, false);
    window.addEventListener("gamepaddisconnected", gamepadDisco, false);

    cow_rotation_mat = identity_mat4 ();

    main_loop();
}

function main_loop () {
    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram (sp);
    V = translate_mat4 (identity_mat4(), [0, 0, -175]);
    P = perspective (45.0, (canvas_w/canvas_h), 0.1, 2000.0);

    parse_obj_into_vbos ( <?php echo $cow_obj; ?> );

    // it's above origin, so move down before rotation
    // no need to move back up after, camera follows it down
    M = mult_mat4_mat4(cow_rotation_mat, translate_mat4 (identity_mat4(), [0, -125, -50]));

    gl.uniformMatrix4fv (M_loc, gl.FALSE, new Float32Array (M));
    gl.uniformMatrix4fv (V_loc, gl.FALSE, new Float32Array (V));
    gl.uniformMatrix4fv (P_loc, gl.FALSE, new Float32Array (P));

    if(gamepad != undefined) {
      gamepadCheck(gamepad);
      gamepadRotate(gamepad);
    }

    draw ();

    window.requestAnimationFrame (main_loop, canvas);
}

function draw () {
    gl.useProgram (sp);
    gl.bindBuffer (gl.ARRAY_BUFFER, vbo_vp);
    gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer (gl.ARRAY_BUFFER, vbo_vt);
    gl.vertexAttribPointer (1, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer (gl.ARRAY_BUFFER, vbo_vn);
    gl.vertexAttribPointer (2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (0);
    gl.enableVertexAttribArray (1);
    gl.enableVertexAttribArray (2);
    gl.drawArrays (gl.TRIANGLES, 0, pc);
    gl.disableVertexAttribArray (0);
    gl.disableVertexAttribArray (1);
    gl.disableVertexAttribArray (2);
}