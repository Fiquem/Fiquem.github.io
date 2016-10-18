<html>
	<head>
		<title>Emma 'fiquem' Carrigan</title>

		<script type="text/javascript" src="js/ammo.js"></script>
		<script type="text/javascript" src="js/three.min.js"></script>
		<script type="text/javascript" src="js/controls/PointerLockControls.js"></script>

		<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>

		<script type="text/javascript" src="js/multiplayer.js"></script>

		<style>
			#content
			{
				font-family: helvetica;
				font-size: 15px;
				color: #FFFFFF;
				text-align: left;
				position: absolute;
				bottom: 65px;
				height: 30%;
				width: 75%;
				overflow-y: scroll;
				overflow-x: hidden;
				background: rgba(0, 0, 0, 0.3);
				left: 50%;
				transform: translate(-50%, 0);
			}
			#input
			{
				position: absolute;
				bottom:20px;
				padding:15px;
				width:75%;
				left: 50%;
				transform: translate(-50%, 0);
			}
		</style>

		<script>
			$(document).keypress(function (event) {
				if (event.which == 114) {
					respawn();
				}
			});

			var tabDown = false;
			var enterDown = false;
			$(document).keydown(function (event) {
				if (event.which == 13) {
					if(!enterDown) {
						enterDown = true;
						$(document.getElementById("Websockets")).toggle();
						var elem = document.getElementById('content');
						elem.scrollTop = elem.scrollHeight;
						$("#input").focus();
					}
					event.stopImmediatePropagation();
					event.stopPropagation();
					event.preventDefault();
				}
				if (event.which == 9) {
					if(!tabDown) {
						tabDown = true;
						$(document.getElementById("player_score")).toggle();
					}
					event.stopImmediatePropagation();
					event.stopPropagation();
					event.preventDefault();
				}
			});

			$(document).keyup(function (event) {
				if (event.which == 9) {
					if(tabDown) {
						tabDown = false;
						$(document.getElementById("player_score")).toggle();
					}
					event.stopImmediatePropagation();
					event.stopPropagation();
					event.preventDefault();
				}
				if (event.which == 13) enterDown = false;
			});
		</script>

	</head>
	<body style="margin: 0; overflow: hidden;">
		<canvas id="text" style="display: none;"></canvas>
		<canvas id="crosshair" style="position: absolute;"></canvas>
		<div id="Websockets" style="display: none;">
			<div id="content"></div>
			<input type="text" id="input" placeholder="Enter name, press enter, begin chatting!">
		</div>
	</body>

	<!-- Crosshair -->
	<script>
		var crosshair_canvas = document.getElementById("crosshair");
		crosshair_canvas.width = window.innerWidth;
		crosshair_canvas.height = window.innerHeight;
		var ctx = crosshair_canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#AA1111';
		ctx.moveTo(window.innerWidth/2 - 10,window.innerHeight/2);
		ctx.lineTo(window.innerWidth/2 + 10,window.innerHeight/2);
		ctx.stroke();
		ctx.moveTo(window.innerWidth/2,window.innerHeight/2 - 10);
		ctx.lineTo(window.innerWidth/2,window.innerHeight/2 + 10);
		ctx.stroke();
		/*ctx.moveTo(window.innerWidth/2 - 10,window.innerHeight/2);
		ctx.lineTo(window.innerWidth/2 - 5,window.innerHeight/2);
		ctx.stroke();
		ctx.moveTo(window.innerWidth/2 + 5,window.innerHeight/2);
		ctx.lineTo(window.innerWidth/2 + 10,window.innerHeight/2);
		ctx.stroke();
		ctx.moveTo(window.innerWidth/2,window.innerHeight/2 - 10);
		ctx.lineTo(window.innerWidth/2,window.innerHeight/2 - 5);
		ctx.stroke();
		ctx.moveTo(window.innerWidth/2,window.innerHeight/2 + 5);
		ctx.lineTo(window.innerWidth/2,window.innerHeight/2 + 10);
		ctx.stroke();*/
	</script>

	<!-- Player Name as Texture Init -->
	<script>
		var text_canvas = document.getElementById("text");
		var ctx = text_canvas.getContext("2d");
		var textSize = 12;
		ctx.font = textSize+"px monospace";	// This determines the size of the text and the font family used

		function getPowerOfTwo(value, pow) {
			var pow = pow || 1;
			while(pow<value)
				pow *= 2;
			return pow;
		}

		function get_player_name_texture (name) {
		    text_canvas.width = getPowerOfTwo(ctx.measureText(name).width);
		    text_canvas.height = getPowerOfTwo(textSize*2);

		    // These have to happen after sizes are set for some reason
		    ctx.fillStyle = "#FFFFFF"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
		    ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
		    ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom

		    ctx.fillText(name, text_canvas.width/2, text_canvas.height/2);

		    var canvasTexture = new THREE.Texture(text_canvas);
		    canvasTexture.needsUpdate = true;

		    return canvasTexture;
		}
	</script>

    <script>

        var scene, camera, renderer;
        var geometry, material, mesh;
        var stats;

        var all_players = new Array();
        var player_meshes = new Array();
        var player_name_meshes = new Array();
        var cam_pos = [0,0,0];
        var myName = false;
        var myHealth = 100;
        var myKills = 0;
        var myDeaths = 0;
        var all_players_kd = new Array();
        var player_shots = [];
        var move_player = new THREE.Vector3();

        var physicsWorker = new Worker('js/worker.js');
        var colours = [0x123456, 0x987654, 0xaabbcc, 0xfedbeb, 0x01649f, 0xcd7f64];
        var boxSize = 10;
        var boxes = [];
        var NUM = 10;

        // Ask the browser to lock the pointer
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
        document.body.onclick = function() {
            document.body.requestPointerLock();
        }

        var pointerlockchange = function ( event ) {
            if ( document.pointerLockElement === document.body|| document.mozPointerLockElement === document.body|| document.webkitPointerLockElement === document.body) {
                controls.enabled = true;
            } else {
                controls.enabled = false;
            }
        }

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        var moveForward = false;
        var moveBackward = false;
        var moveLeft = false;
        var moveRight = false;

        var prevTime = performance.now();
        var velocity = new THREE.Vector3();

        init();
        animate();

        function init() {

            scene = new THREE.Scene();

            // add white ambient lighting
            var ambientLight = new THREE.AmbientLight(0x444444);
            scene.add(ambientLight);
      
            // directional lighting
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(0, 5, 5).normalize();
            scene.add(directionalLight);

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 20000 );
            controls = new THREE.PointerLockControls( camera );
            controls.getObject().position.y = 100;
            controls.getObject().position.z = 100;

            scene.add( controls.getObject() );

		var onKeyDown = function ( event ) {
			switch ( event.keyCode ) {
				case 87: // w
					moveForward = true;
					break;
				case 65: // a
					moveLeft = true; break;
				case 83: // s
					moveBackward = true;
					break;
				case 68: // d
					moveRight = true;
					break;
				case 32: // space
					if ( canJump === true ) velocity.y = 300;
					canJump = false;
					break;
			}
		};

		var onKeyUp = function ( event ) {
			switch( event.keyCode ) {
				case 87: // w
					moveForward = false;
					break;
				case 65: // a
					moveLeft = false;
					break;
				case 83: // s
					moveBackward = false;
					break;
				case 68: // d
					moveRight = false;
					break;
			}
		};

		var timeout;
		var onMouseDown = function ( event ) {
			timeout = setInterval(function(){
			var vector = new THREE.Vector3( 0 , 0 , -1 );
			vector.unproject(camera);
			var rayCam = new THREE.Ray(controls.getObject().position, vector.sub(controls.getObject().position).normalize() );
			var rayCaster = new THREE.Raycaster(rayCam.origin, rayCam.direction);

			var player_meshes_array = [];
			var player_names_array = new Array();
			for (var x in player_meshes){
				if (player_meshes.hasOwnProperty(x) && x != "false"){
					player_meshes_array[player_meshes_array.length++] = player_meshes[x];
					player_names_array[player_meshes[x].id] = x;
				}
			}

			var intersects = rayCaster.intersectObjects(boxes);

			if (intersects.length) {
				intersects[ 0 ].object.material.wireframe = true;
			}

			var intersects = rayCaster.intersectObjects(player_meshes_array);

			if (intersects.length) {
				//intersects[ 0 ].object.material.wireframe = true;
				for (var x in player_names_array){
					if (player_names_array.hasOwnProperty(x) && x != "false" && parseInt(x) === intersects[0].object.id){
						player_shots.push(player_names_array[x]);
					}
				}
			}
			}, 50);
		};

		var onMouseUp = function ( event ) {
			clearInterval(timeout);
		};

		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );
		document.addEventListener( 'mousedown', onMouseDown, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

		// floor

		geometry = new THREE.PlaneGeometry( 500, 500, 4, 4 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random(), 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random(), 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random(), 0.75, Math.random() * 0.25 + 0.75 );
		}

		material = new THREE.MeshPhongMaterial( { vertexColors: THREE.VertexColors } );
		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		// boxes

		for (var i = 0; i < NUM; i++) {
			material = new THREE.MeshPhongMaterial({ color: colours[Math.floor((Math.random()*100)%6)] });
			geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize);
			boxes[i] = new THREE.Mesh( geometry, material );
			scene.add(boxes[i]);
		}

		// skybox

		var imagePrefix = "textures/Maskonaive/";
		var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
		var imageSuffix = ".jpg";
		var skyGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );	
		var materialArray = [];
		for (var i = 0; i < 6; i++)
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		scene.add( skyBox );


            container = document.createElement( 'div' );
            document.body.appendChild( container );

            renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            // Worker
            physicsWorker.onmessage = function(event) {
              var data = event.data;
              if (data.objects.length != NUM) return;
              for (var i = 0; i < NUM; i++) {
                var physicsObject = data.objects[i];
                boxes[i].position.x = physicsObject[0];
                boxes[i].position.y = physicsObject[1];
                boxes[i].position.z = physicsObject[2];
                boxes[i].quaternion.x = physicsObject[3];
                boxes[i].quaternion.y = physicsObject[4];
                boxes[i].quaternion.z = physicsObject[5];
                boxes[i].quaternion.w = physicsObject[6];
                //renderObject.rotation = quaternion.toEuler();
              }
              currFPS = data.currFPS;
              allFPS = data.allFPS;z
            };
            physicsWorker.postMessage(NUM);

            init_player_stats();

            /*stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            container.appendChild( stats.domElement );*/

        }

        function animate() {

            requestAnimationFrame( animate );

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if ( moveForward ) velocity.z -= 1500.0 * delta;
		if ( moveBackward ) velocity.z += 1500.0 * delta;

		if ( moveLeft ) velocity.x -= 1500.0 * delta;
		if ( moveRight ) velocity.x += 1500.0 * delta;

		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );

		if ( move_player.x != 0 ) {
			controls.getObject().translateOnAxis(new THREE.Vector3(1,0,0),move_player.x);
			move_player.x--;
			if ( move_player.x < 0 ) move_player.x = 0;
		}
		if ( move_player.z != 0 ) {
			controls.getObject().translateOnAxis(new THREE.Vector3(0,0,1),move_player.z);
			move_player.z--;
			if ( move_player.z < 0 ) move_player.z = 0;
		}

		if ( controls.getObject().position.y < 10 ) {

			velocity.y = 0;
			controls.getObject().position.y = 10;

			canJump = true;

		}

		prevTime = time;

		cam_pos = [controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z];
		draw_players(all_players);

            renderer.render( scene, camera );

            //stats.update();

        }

	function draw_players (ps) {
	    for (var x in ps){
	        if (ps.hasOwnProperty(x) && x != myName && x != "false"){
                   player_meshes[x].position.set(ps[x][0], ps[x][1], ps[x][2]);
                   player_name_meshes[x].position.set(ps[x][0], ps[x][1]+20, ps[x][2]);
                   player_name_meshes[x].rotation.x = controls.getObject().rotation.x;
                   player_name_meshes[x].rotation.y = controls.getObject().rotation.y;
                   player_name_meshes[x].rotation.z = controls.getObject().rotation.z;
	        }
	    }
	}

	function respawn () {
	    controls.getObject().position.x = 0;
	    controls.getObject().position.y = 100;
	    controls.getObject().position.z = 100;
	    velocity.x = 0;
	    velocity.y = 0;
	    velocity.z = 0;
	    myHealth = 100;
	    myDeaths++;
	    display_player_stats();
	}

	function init_player_stats () {
	    var stats = document.createElement('div');
	    stats.id = 'player_stats';
	    stats.style.position = 'absolute';
	    stats.innerHTML = "Health: " + myHealth + "<br>Kills: " + myKills + "<br>Deaths: " + myDeaths;
	    stats.style.top = 10 + 'px';
	    stats.style.left = 10 + 'px';
	    stats.style.fontFamily = 'helvetica';
	    stats.style.fontSize = 24 + 'px';
	    stats.style.textShadow = "\
			-1px -1px 0 #000,\
			1px -1px 0 #000,\
			-1px 1px 0 #000,\
			1px 1px 0 #000";
	    stats.style.color = "#FFFFFF";
	    document.body.appendChild(stats);

	    var score = document.createElement('div');
	    score.id = 'player_score';
	    score.style.position = 'absolute';
	    score.innerHTML = "<center>SCORE</center>";
	    score.style.top = 100 + 'px';
	    score.style.left = '50%';
	    score.style.bottom = '300px';
	    score.style.width = '50%';
	    score.style.height = '50%';
           score.style.transform = 'translate(-50%, 0)';
	    score.style.display = 'none';
	    score.style.fontFamily = 'helvetica';
	    score.style.fontSize = 32 + 'px';
	    score.style.textShadow = "\
			-1px -1px 0 #000,\
			1px -1px 0 #000,\
			-1px 1px 0 #000,\
			1px 1px 0 #000";
	    score.style.color = "#AAAAAA";
	    score.style.background = "rgba(100,100,100,0.5)";
	    var player_kd = document.createElement('table');
	    player_kd.id = 'player_kd';
	    player_kd.width = '100%';
	    player_kd.innerHTML = "<tr width=\"100%\"><th width=\"50%\">Player</th><th width=\"25%\">Kills</th><th width=\"25%\">Deaths</th></tr>";
	    player_kd.style.fontFamily = 'helvetica';
	    player_kd.style.fontSize = 16 + 'px';
	    player_kd.style.textShadow = "\
			-1px -1px 0 #000,\
			1px -1px 0 #000,\
			-1px 1px 0 #000,\
			1px 1px 0 #000";
	    player_kd.style.color = "#DDDDDD";
	    score.appendChild(player_kd);
	    document.body.appendChild(score);
	}

	function display_player_stats () {
	    if (!myHealth) respawn ();
	    else {
	        var stats = document.getElementById('player_stats');
	        stats.innerHTML = "Health: " + myHealth + "<br>Kills: " + myKills + "<br>Deaths: " + myDeaths;
		 stats = document.getElementById('player_kd');
	        stats.innerHTML = "<tr width=\"100%\"><th width=\"50%\">Player</th><th width=\"25%\">Kills</th><th width=\"25%\">Deaths</th></tr>";
	        for (var x in all_players_kd){
	            if (all_players_kd.hasOwnProperty(x) && x != "false"){
	                stats.innerHTML += "<tr width=\"100%\"><td width=\"50%\">" + x + "</td><td width=\"25%\">" + all_players_kd[x][0] + "</td><td width=\"25%\">" + all_players_kd[x][1] + "</td></tr>";
	            }
	        }
	    }
	}

    </script>

</html>
