$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    // my color assigned by the server
    var myColor = false;

    // keep track of other players
    var max_id = 0;
    var players = [ ];
    var player_killed_by = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('ws://emma-fyp.netsoc.tcd.ie:8088');

    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('Choose name:');
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'color') { // first response from the server with user's color
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } else if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (var i=0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                           json.data[i].color, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') { // it's a single message
            input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text,
                       json.data.color, new Date(json.data.time));

        } else if (json.type === 'player_coords') {

            // If first instance, create player mesh
            var new_player = true;
	     for (var x in player_meshes){
	         if (player_meshes.hasOwnProperty(x) && x === json.data.name){
                    new_player = false;
	         }
	     }
            if (json.data.name != "false" && json.data.name != myName && new_player) {
                console.log(json.data.name);
                var g = new THREE.BoxGeometry( 20, 20, 20 );
                var m = new THREE.MeshBasicMaterial( { color: 0xFF91FF } );
                player_meshes[json.data.name] = new THREE.Mesh( g, m );
                scene.add( player_meshes[json.data.name] );
                var tex = get_player_name_texture(json.data.name);
                g = new THREE.PlaneGeometry( text_canvas.width, text_canvas.height);
                m = new THREE.MeshBasicMaterial( { map: tex, transparent: true } );
                m.side = THREE.DoubleSide;
                player_name_meshes[json.data.name] = new THREE.Mesh( g, m );
                scene.add( player_name_meshes[json.data.name] );
            }
            all_players[json.data.name] = json.data.coords;
        } else if (json.type === 'disco') {
            console.log(json.data + " has disco'd");
            scene.remove( player_meshes[json.data] );
            scene.remove( player_name_meshes[json.data] );
            delete player_meshes[json.data];
            delete player_name_meshes[json.data];
            delete all_players[json.data];
            delete all_players_kd[json.data];

        } else if (json.type === 'player_kd') {
            if (json.data.name != "false") {
                all_players_kd[json.data.name] = json.data.kd;
                display_player_stats();
            }
        } else if (json.type === 'player_shot') {
            console.log(json.data.shooter + " shot " + json.data.shootee);
            if (json.data.shootee === myName) {
                move_player.x = (all_players[json.data.shootee][0] - all_players[json.data.shooter][0])/50;
                move_player.z = (all_players[json.data.shootee][2] - all_players[json.data.shooter][2])/50;
                //console.log("Should move by " + move_player.x + ", " + move_player.z);
                myHealth--;
                if (!myHealth) {
                    console.log("You were killed by " + json.data.shooter);
                    player_killed_by = json.data.shooter;
                }
                display_player_stats();
            }
        } else if (json.type === 'player_kill') {
            console.log(json.data.killer + " killed " + json.data.killee);
            if (json.data.killer === myName) {
                myKills++;
                display_player_stats();
            }

        } else if (json.type === 'name-ref') {
            input.removeAttr('disabled'); // let the user write another message
            addMessage('Server', 'Name is taken, try again!', 'red', new Date(json.data));
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };

    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(JSON.stringify({type: 'chat', message: msg}));
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');

            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to communicate '
                                                 + 'with the WebSocket server.');
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.append('<p><span style="color:' + color + '">' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
        var elem = document.getElementById('content');
        elem.scrollTop = elem.scrollHeight;
    }

    /**
     * Emma don't fuck this up
     */
    setInterval(function() {
        connection.send(JSON.stringify({type: 'player_coords', coords: cam_pos}));
        connection.send(JSON.stringify({type: 'player_kd', kd: [myKills, myDeaths]}));
        while (player_shots.length) connection.send(JSON.stringify({type: 'player_shot', shot: player_shots.shift()}));
        if (player_killed_by != false) {
            connection.send(JSON.stringify({type: 'player_death', killer: player_killed_by}));
            player_killed_by = false;
        }
    }, 10);
});
