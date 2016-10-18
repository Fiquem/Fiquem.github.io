// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 8088;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];

var names = new Array();
var coords = new Array();
var kd = new Array();
var shots = [];
var kills = [];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    var userName = false;
    var userColor = false;

    console.log((new Date()) + ' Connection accepted.');

    // send back chat history
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }

    // user sent some message
    connection.on('message', function(message) {
        try {
            var data = JSON.parse(message.utf8Data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        if (message.type === 'utf8') { // accept only text
            if (data.type === 'chat') {
                if (userName === false) { // first message sent by user is their name
                    // remember user name
                    if (names[htmlEntities(data.message)] === 1) {
                        console.log("Name refused");
                        connection.sendUTF(JSON.stringify({ type:'name-ref', data: (new Date()).getTime() }));
                    } else if (htmlEntities(data.message) === false) {
                        // do nothing, user isn't registered to play yet
                    } else {
                        names[htmlEntities(data.message)] = 1;
                        userName = htmlEntities(data.message);
                        // get random color and send it back to the user
                        userColor = colors.shift();
                        connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
                        console.log((new Date()) + ' User is known as: ' + userName
                                    + ' with ' + userColor + ' color.');
                    }

                } else { // log and broadcast the message
                    console.log((new Date()) + ' Received Message from '
                                + userName + ': ' + data.message);
                
                    // we want to keep history of all sent messages
                    var obj = {
                        time: (new Date()).getTime(),
                        text: htmlEntities(data.message),
                        author: userName,
                        color: userColor
                    };
                    history.push(obj);
                    history = history.slice(-100);

                    // broadcast message to all connected clients
                    var json = JSON.stringify({ type:'message', data: obj });
                    for (var i=0; i < clients.length; i++) {
                        clients[i].sendUTF(json);
                    }
                }
            } else if (data.type === 'player_coords') {
                coords[userName] = data.coords;
            } else if (data.type === 'player_kd') {
                kd[userName] = data.kd;
            } else if (data.type === 'player_shot') {
                //console.log(userName + " shot " + data.shot);
                var obj = {
                    shooter: userName,
                    shootee: data.shot
                };
                shots.push(obj);
            } else if (data.type === 'player_death') {
                //console.log(userName + " killed by " + data.killer);
                var obj = {
                    killer: data.killer,
                    killee: userName
                };
                kills.push(obj);
            } else {
                console.log("Undefined message: " + data);
            }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        if (userName !== false && userColor !== false) {
            names[userName] = 0;
            coords[userName] = [0,0,0];

            // tell everyone to stop tracking this player
            var json = JSON.stringify({ type: 'disco', data: userName });
            for (var i=0; i < clients.length; i++) {
                clients[i].sendUTF(json);
            }

            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
            // push back user's color to be reused by another user
            colors.push(userColor);
        }
    });


    // Send coords to everyone!
    setInterval(function() {
        for (var name in coords){
            if (coords.hasOwnProperty(name) && names[name] != 0){
                var obj = {
                    name: name,
                    coords: coords[name]
                };
                for (var i=0; i < clients.length; i++)
                    clients[i].send(JSON.stringify({type: 'player_coords', data: obj}));
            }
        }
        for (var name in kd){
            if (kd.hasOwnProperty(name) && names[name] != 0){
                var obj = {
                    name: name,
                    kd: kd[name]
                };
                for (var i=0; i < clients.length; i++)
                    clients[i].send(JSON.stringify({type: 'player_kd', data: obj}));
            }
        }
        while (shots.length) {
            var current_shot = shots.shift();
            for (var i=0; i < clients.length; i++)
                clients[i].send(JSON.stringify({type: 'player_shot', data: current_shot}));
        }
        while (kills.length) {
            var current_kill = kills.shift();
            for (var i=0; i < clients.length; i++)
                clients[i].send(JSON.stringify({type: 'player_kill', data: current_kill}));
        }
    }, 10);


});

