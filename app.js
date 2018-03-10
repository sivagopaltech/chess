const compression = require('compression');
const express = require("express");
const socketIO = require("socket.io")
const http = require("http");

var port = process.env.PORT || 3000;
var app = express();
app.use(compression());
var server = http.createServer(app);
var io = socketIO(server);
let usercount = 2;
let groupId;
let coinColor;
let vGrouop;
let users = {};
io.on("connection", (socket) => {
    
    if(usercount % 2 == 1 && groupId) {
        if(typeof socket.adapter.rooms[groupId] === "undefined") {
            usercount++;
        }
    }
    
    if(usercount % 2 == 0) {
        coinColor = "w";
        groupId = socket.id;
        vGroup = usercount;
    } else {
        coinColor = "b";
    }
    usercount++;

    let gamerData = {
        id: socket.id,
        coinColor: coinColor,
        groupId: groupId,
        vGroup: vGroup,
        userId: usercount
    }
    users[socket.id] = gamerData;
    socket.join(groupId);
    socket.emit('gameData', gamerData);
    if(coinColor == "b") {
        io.to(groupId).emit('start', {start:1});
    }
    
    socket.on("proposeStep", (step, callback) => {
        io.to(step.groupId).emit('completeStep', step);
    });
    

    socket.on("disconnect", () => {
        io.to(users[socket.id].groupId).emit('winner', {left:1});
    });
});


app.use(express.static(__dirname+"/"));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
