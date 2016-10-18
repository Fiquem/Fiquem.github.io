var cam_pos = [0.0, 0.0, 10.0];
var cam_orient = [0.0,0.0,1.0,0.0];
var right = [1,0,0];
var up = [0,1,0];
var forward = [0,0,-1];
var pitch = 0;
var yaw = 0;

function update_cam() {
    // they see me rollin' wait no they don't
    forward = [(Math.sin(ONE_DEG_IN_RAD*yaw))*(Math.cos(ONE_DEG_IN_RAD*pitch)),
        (-Math.sin(ONE_DEG_IN_RAD*pitch)),
        (-Math.cos(ONE_DEG_IN_RAD*yaw))*(Math.cos(ONE_DEG_IN_RAD*pitch))];
    right = [Math.cos(ONE_DEG_IN_RAD*yaw),0,Math.sin(ONE_DEG_IN_RAD*yaw)];

    // pitch * yaw * translation
    V = mult_mat4_mat4 (
	mult_mat4_mat4 (
		rotate_x_deg (identity_mat4 (), pitch),
		rotate_y_deg (identity_mat4 (), yaw)
		),
	translate_mat4 (identity_mat4(), [-cam_pos[0], -cam_pos[1], -cam_pos[2]])
	);
}