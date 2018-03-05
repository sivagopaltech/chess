const boardBuilder = require("./boardBuilder");
const block = require("./block");
const steps = require("./steps");
const globals = require('./globals');
import io from 'socket.io-client';
const moveMsg = "It's your turn, Please make a move";
const waitMsg = "Waiting for other player to move!";

var socket = io();
socket.on('connect', () => {
    console.log(socket.io.engine.id);
});

socket.on('start', function(data){
    globals.start = data.start;
    $(".overlay").hide();
});

socket.on('winner', function(data){
    alert("The other player abandoned the game! You are the winner.");
});

socket.on('gameData', function(gameData){
    console.log(gameData);
    globals.start = gameData.start;
    if(gameData.coinColor == 'b') {
        $("#chess-block").addClass('black-board');
        globals.opponentColor = "w"
        
    } else {
        globals.opponentColor = "b";
    }   
    globals.coinColor = gameData.coinColor;
    globals.id = gameData.id;
    globals.groupId = gameData.groupId;
    $("#head-block").html(`Yor ID: ${gameData.userId} | Your Group: ${gameData.vGroup}`);
    if(gameData.coinColor === 'w') {
        $("#msg-block").html(moveMsg);
    } else {
        $("#msg-block").html(waitMsg);
    }
});

socket.on('completeStep', function(step){
    $("#"+step.targetBlockId).html($("#"+step.currentBlockId).html());
    $("#"+step.currentBlockId).html("");
    block.hideMovableBlocks();
    globals.player = step.player;
    var curr_col_row = step.currentBlockId.split("_");
    var tar_col_row = step.targetBlockId.split("_");
    $("#"+step.coinColor+"-step").append(`<li>${boardBuilder.columns[curr_col_row[0]]}${curr_col_row[1]} - ${boardBuilder.columns[tar_col_row[0]]}${tar_col_row[1]}</li>`);
    if(globals.coinColor === step.player) {
        $("#msg-block").html(moveMsg);
    } else {
        $("#msg-block").html(waitMsg);
    }
});

$(function(){
    boardBuilder.buildChessBoard();
    boardBuilder.arrangeCoins(); 
    $("#chess-table td").click(function(){
        console.log('here');
        var blockId = $(this).attr('id');
        if($(this).hasClass('mark') && globals.start 
            && (globals.player == globals.coinColor) 
            && (globals.currentPieceColor == globals.coinColor)) {
                console.log('here1');
                socket.emit('proposeStep', {
                    currentBlockId: globals.currentBlockId,
                    targetBlockId: blockId,
                    player: globals.opponentColor,
                    groupId: globals.groupId,
                    coinColor: globals.coinColor,
                    currentPiece: globals.currentPiece,
                }, (err) => {
                    console.log(err);
                });
        } else {
            console.log('here2');
            if(block.checkIfPieceExists(blockId)) {
                block.hideMovableBlocks();
                steps.setMovableBlocks(blockId);
            } else {
                block.hideMovableBlocks();
            }
        }      
    });
});



