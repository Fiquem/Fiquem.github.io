var gl;
var sp, sp_cube;
var canvas;
var canvas_w;
var canvas_h;
var M, V, P;
var inv_V, inv_M;
var cow_rotation_mat;
var M_loc, V_loc, P_loc;
var M_cube_loc, V_cube_loc, P_cube_loc;
var M_reflect_loc, V_reflect_loc, P_reflect_loc, inv_V_reflect_loc;
var cubemap_tex;
var pointerlock;
var spawned_objs = [];
var framebuffer;
var theta = 0;
//var img = "../textures/ground.png";
//var basic_tex;
var cube_obj, sphere_obj;

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

    // Comments like this fuck up shaders so be careful!

    var vs = load_text_from_file("shaders/basic.vert");
    var fs = load_text_from_file("shaders/basic.frag");
    var fragmentShader = getShader(gl, fs, "frag");
    var vertexShader = getShader(gl, vs, "vert");
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

    var vs_cube = load_text_from_file("shaders/cubemap.vert");
    var fs_cube = load_text_from_file("shaders/cubemap.frag");
    fragmentShader = getShader(gl, fs_cube, "frag");
    vertexShader = getShader(gl, vs_cube, "vert");
    sp_cube = gl.createProgram();
    gl.attachShader(sp_cube, vertexShader);
    gl.attachShader(sp_cube, fragmentShader);
    gl.bindAttribLocation (sp_cube, 0, "vp");
    gl.linkProgram (sp_cube);
    if (!gl.getProgramParameter(sp_cube, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    M_cube_loc = gl.getUniformLocation (sp_cube, "M");
    P_cube_loc = gl.getUniformLocation (sp_cube, "P");
    V_cube_loc = gl.getUniformLocation (sp_cube, "V");

    var vs_reflect = load_text_from_file("shaders/reflect.vert");
    var fs_reflect = load_text_from_file("shaders/reflect.frag");
    fragmentShader = getShader(gl, fs_reflect, "frag");
    vertexShader = getShader(gl, vs_reflect, "vert");
    sp_reflect = gl.createProgram();
    gl.attachShader(sp_reflect, vertexShader);
    gl.attachShader(sp_reflect, fragmentShader);
    gl.bindAttribLocation (sp_reflect, 0, "vp");
    gl.bindAttribLocation (sp_reflect, 1, "vt");
    gl.bindAttribLocation (sp_reflect, 2, "vn");
    gl.linkProgram (sp_reflect);
    if (!gl.getProgramParameter(sp_reflect, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    M_reflect_loc = gl.getUniformLocation (sp_reflect, "M");
    P_reflect_loc = gl.getUniformLocation (sp_reflect, "P");
    V_reflect_loc = gl.getUniformLocation (sp_reflect, "V");
    inv_V_reflect_loc = gl.getUniformLocation (sp_reflect, "inv_V");



    dynamicCubemap = gl.createTexture(); // Create the texture object for the reflection map
    
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubemap);  // create storage for the reflection map images
    for (i = 0; i < 6; i++)
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    framebuffer = gl.createFramebuffer();  // crate the framebuffer that will draw to the reflection map
    gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);  // select the framebuffer, so we can attach the depth buffer to it
    var depthBuffer = gl.createRenderbuffer();   // renderbuffer for depth buffer in framebuffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // so we can create storage for the depthBuffer
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 2048, 2048);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);



    cubemap_tex = loadCubeMap();

    gl.cullFace (gl.BACK);
    gl.frontFace (gl.CCW);
    //gl.enable (gl.CULL_FACE);
    gl.enable (gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.clearColor(0.7, 0.7, 0.7, 1.0);

    // events
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousemove = handleMouseMovement;
    document.onmousedown = handleMouseDown;

    //basic_tex = create_texture_from_file (img);

    cube_obj = load_text_from_file("meshes/cubemap.obj");
    cube_obj = cube_obj.split("\n");
    sphere_obj = load_text_from_file("meshes/sphere.obj");
    sphere_obj = sphere_obj.split("\n");

    parse_obj_into_vbos ( cube_obj );

    main_loop();
}

function create_dynamic_cubemap(model) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0,0,2048,2048);  //match size of the texture images
    P = perspective (90.0, 1.0, 1, 2000.0);

    // All scene is cubes
    parse_obj_into_vbos ( cube_obj );

    V = mult_mat4_mat4 (scale (identity_mat4(), [-1,-1,1]), model);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, dynamicCubemap, 0);
    draw_scene ();

    V = mult_mat4_mat4 (rotate_y_deg (scale (identity_mat4(), [-1,-1,1]), -90), model);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, dynamicCubemap, 0);
    draw_scene ();

    V = mult_mat4_mat4 (rotate_y_deg (scale (identity_mat4(), [-1,-1,1]), 180), model);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, dynamicCubemap, 0);
    draw_scene ();

    V = mult_mat4_mat4 (rotate_y_deg (scale (identity_mat4(), [-1,-1,1]), 90), model);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, dynamicCubemap, 0);
    draw_scene ();

    V = mult_mat4_mat4 (rotate_x_deg (identity_mat4(), 90), model);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, dynamicCubemap, 0);
    draw_scene ();

    V = mult_mat4_mat4 (rotate_x_deg (identity_mat4(), -90), model);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, dynamicCubemap, 0);
    draw_scene ();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubemap);
    gl.generateMipmap( gl.TEXTURE_CUBE_MAP );
}

function draw_scene () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // CUBE
    gl.disable (gl.DEPTH_TEST);
    gl.useProgram (sp_cube);
    M = translate_mat4 (identity_mat4(), cam_pos);
    gl.uniformMatrix4fv (M_cube_loc, gl.FALSE, new Float32Array (M));
    gl.uniformMatrix4fv (V_cube_loc, gl.FALSE, new Float32Array (V));
    gl.uniformMatrix4fv (P_cube_loc, gl.FALSE, new Float32Array (P));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap_tex);
    draw (sp_cube);
    gl.enable (gl.DEPTH_TEST);

    // COWCUBE
    gl.useProgram (sp);
    M = rotate_y_deg (translate_mat4 (translate_mat4 (scale (identity_mat4(), [5,5,5]), [0,0,-10]), [0,5*Math.sin(theta/100.0),2*Math.sin(theta/100.0)]), theta);
    gl.uniformMatrix4fv (M_loc, gl.FALSE, new Float32Array (M));
    gl.uniformMatrix4fv (V_loc, gl.FALSE, new Float32Array (V));
    gl.uniformMatrix4fv (P_loc, gl.FALSE, new Float32Array (P));
    draw (sp);
    M = rotate_x_deg (translate_mat4 (translate_mat4 (scale (identity_mat4(), [5,5,5]), [5,5,-15]), [Math.sin(theta/100.0),-5*Math.cos(theta/100.0),0]), theta);
    gl.uniformMatrix4fv (M_loc, gl.FALSE, new Float32Array (M));
    draw (sp);
}

function main_loop () {
    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // OH GOD DYNAMIC CUBEMAP
    create_dynamic_cubemap (identity_mat4 ());

    gl.viewport(0,0,canvas.clientWidth,canvas.clientHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    handleKeys();
    update_cam();
    inv_V = inverse_mat4 (V);
    P = perspective (45.0, (canvas_w/canvas_h), 0.1, 2000.0);

    theta += 1.0;

    draw_scene();

    // SPAWNED_OBJS
    gl.useProgram (sp_reflect);
    gl.uniformMatrix4fv (V_reflect_loc, gl.FALSE, new Float32Array (V));
    gl.uniformMatrix4fv (P_reflect_loc, gl.FALSE, new Float32Array (P));
    gl.uniformMatrix4fv (inv_V_reflect_loc, gl.FALSE, new Float32Array (inv_V));
    for (var i = 0; i < spawned_objs.length; i++)
    {
        M = translate_mat4 (scale (identity_mat4(), [2,2,2]), spawned_objs[i]);
        gl.uniformMatrix4fv (M_reflect_loc, gl.FALSE, new Float32Array (M));

        // OH GOD DYNAMIC CUBEMAP
        create_dynamic_cubemap (inverse_mat4 (M));

        // all spawns are spheres 
        parse_obj_into_vbos ( sphere_obj );

        gl.viewport(0,0,canvas.clientWidth,canvas.clientHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubemap);
        draw (sp_reflect);
    }

    window.requestAnimationFrame (main_loop, canvas);
}

function draw (shader) {
    gl.useProgram (shader);
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
