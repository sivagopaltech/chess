const express = require("express");
const socketIO = require("socket.io")
const http = require("http");

var app = express();
var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
let usercount = 0;
let groupId;
let coinColor;
let users = {};
io.on("connection", (socket) => {
    usercount++;
    if(usercount % 2 == 1) {
        coinColor = "w";
        groupId = socket.id
    } else {
        coinColor = "b";
    }
    

    let gamerData = {};
    if(coinColor == "w") {
        groupId = socket.id
        gamerData = {
            id: socket.id,
            coinColor: coinColor,
            groupId: groupId,
        }
    } else {
        gamerData = {
            id: socket.id,
            coinColor: coinColor,
            groupId: groupId,
        }
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
        io.to(users[socket.id].groupId).emit('newMessage', "The other person abandoned game you are the winner");
    });
});

app.use(express.static(__dirname+"/"));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
