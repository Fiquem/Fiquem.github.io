function loadCubeMap(base, suffix) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var faces = [["Cubemap/posx.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
                 ["Cubemap/negx.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
                 ["Cubemap/posy.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
                 ["Cubemap/negy.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
                 ["Cubemap/posz.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
                 ["Cubemap/negz.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i][1];
        var image = new Image();
        image.onload = function(texture, face, image) {
            return function() {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            }
        } (texture, face, image);
        image.src = faces[i][0];
    }
    return texture;
}

// So stolen from Anton
function create_texture_from_file (file) {
	console.log ("loading image " + file + "...");
	var texture = gl.createTexture();
	var image = new Image();
	image.onload = function () {
		gl.bindTexture (gl.TEXTURE_2D, texture);
		gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			image);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		console.log ("texture loaded from " + file);
	}
	image.src = file;
	return texture;
}