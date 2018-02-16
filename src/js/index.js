const boardBuilder = require("./boardBuilder");
const block = require("./block");
let currentPieceColor;
$(function(){
    boardBuilder.buildChessBoard();
    boardBuilder.arrangeCoins(); 
    $("#chess-table td").click(function(){
        var blockId = $(this).attr('id');
        if(checkIfPieceExists(blockId)) {
            block.hideMovableBlocks();
            setMovableBlocks(blockId);
        }
    });
});

function setMovableBlocks(blockId) {
    var pieceData = getPieceData(blockId);
    var piece = pieceData['piece'];
    currentPieceColor = pieceData['color'];
    if(piece == "R") {
        getRookBlocks(blockId);
    } else if(piece == "H") {
        getHorseMoves(blockId);
    } else if(piece == "B") {
        getBishopBlocks(blockId);
    } else if(piece == "Q") {
        getRookBlocks(blockId);
        getBishopBlocks(blockId);
    } else if(piece == "K") {
        getRookBlocks(blockId, 1);
        getBishopBlocks(blockId, 1);
    } else if(piece == "P") {
        getPawnBlocks(blockId);
    }
}

function getPawnBlocks(blockId) {
    if(currentPieceColor == 'w') {
        var blockData = block.getBlockData(blockId);
        var steps = 1;
        if(blockData['row'] == 2) { 
            var steps = 2;
        }
        moveForward(blockId, steps);
    } else {
        var blockData = block.getBlockData(blockId);
        var steps = 1;
        if(blockData['row'] == 7) { 
            var steps = 2;
        }
        moveBackward(blockId, steps);
    }
}

function getRookBlocks(blockId, isKing) {
    var blockData = block.getBlockData(blockId);
    var maxSteps = getStraightSteps(blockData, isKing);
    makeStraightSteps(blockId, maxSteps);
}

function getBishopBlocks(blockId, isKing) {
    var blockData = block.getBlockData(blockId);
    var maxSteps = getCrossSteps(blockData, isKing);
    makeCrossSteps(blockId, maxSteps);
}

function moveForward(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardBlock(blockData);
    markBlocks(nextBlock, steps, moveForward);
}

function markBlocks(blockId, steps, callback){
    if(!checkIfPieceExists(blockId)) {
        block.highlightBlock(blockId);
        steps--;
        if(steps) {
            callback(blockId, steps) 
        }
    } else {
        checkForMove(blockId);
    }
}

function moveBackward(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        block.highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveBackward(nextBlock, steps) 
        }
    } else {
        checkForMove(nextBlock);
    }
}

function moveRight(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getRightBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        block.highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveRight(nextBlock, steps) 
        }
    } else {
        checkForMove(nextBlock);
    }
}

function moveLeft(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getLeftBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        block.highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveLeft(nextBlock, steps) 
        }
    } else {
        checkForMove(nextBlock);
    }
}

function moveForwardRight(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardRightBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        block.highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveForwardRight(nextBlock, steps) 
        }
    } else {
        checkForMove(nextBlock);
    }
}

function moveForwardLeft(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardLeftBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        block.highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveForwardLeft(nextBlock, steps) 
        }
    } else {
        checkForMove(nextBlock);
    }
}

function moveBackwardRight(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardRightBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        block.highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveBackwardRight(nextBlock, steps) 
        }
    } else {
        checkForMove(nextBlock);
    }
}

function moveBackwardLeft(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardLeftBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        block.highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveBackwardLeft(nextBlock, steps) 
        }
    } else {
        checkForMove(nextBlock);
    }
}

function checkIfPieceExists(blockId) {
    if($("#"+blockId).find('i.fa').length){
        return true;
    } 
    return false;
}

function getPieceData(blockId) {
    var pieceData =  $("#"+blockId).find('i.fa').attr('id').split("_");
    return {color: pieceData[0], piece: pieceData[1]};
}



function getStraightSteps(blockData, isKing){
    var maxSteps = {};
    var row = parseInt(blockData['row']);
    var column = parseInt(blockData['column']);
    maxSteps['F'] = 8 - row;
    maxSteps['B'] = row - 1;
    maxSteps['R'] = 8 - column;
    maxSteps['L'] = column - 1;
    if(typeof isKing !== "undefined" && isKing == 1) {
        maxSteps = getKingSteps(maxSteps);
    }
    return maxSteps;
}

function getCrossSteps(blockData, isKing){
    var maxSteps = {};
    var row = parseInt(blockData['row']);
    var column = parseInt(blockData['column']);
    if(row < column) {
        maxSteps['FR'] = 8-column;
        maxSteps['FL'] = column-1;
    } else {
        maxSteps['FR'] = 8 - row;
        maxSteps['FL'] = row - 1;
    }

    if(row < column) {
        maxSteps['BR'] = 8 - row;
        maxSteps['BL'] = row - 1;
    } else {
        maxSteps['BR'] = 8 - column;
        maxSteps['BL'] = column - 1;
    }
    if(typeof isKing !== "undefined" && isKing == 1) {
        maxSteps = getKingSteps(maxSteps);
    }
    return maxSteps;
}

function getHorseMoves(blockId) {
    var blockData = block.getBlockData(blockId);
    var row = parseInt(blockData['row']);
    var column = parseInt(blockData['column']);
    if(column+2 <= 8){
        if(row+1 <=8) {
            var nextBlock = (column+2)+"_"+(row+1);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }   
        }
        if(row-1 >= 1) {
            var nextBlock = (column+2)+"_"+(row-1);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }   
        }
    }
    if(column-2 >= 1){
        if(row+1 <=8) {
            var nextBlock = (column-2)+"_"+(row+1);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }   
        }
        if(row-1 >= 1) {
            var nextBlock = (column-2)+"_"+(row-1);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }   
        }
    }

    if(row+2 <= 8){
        if(column+1 <=8) {
            var nextBlock = (column+1)+"_"+(row+2);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }   
        }
        if(column-1 >= 1) {
            var nextBlock = (column-1)+"_"+(row+2);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }  
        }
    }
    if(row-2 >= 1){
        if(column+1 <=8) {
            var nextBlock = (column+1)+"_"+(row-2);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }   
        }
        if(column-1 >= 1) {
            var nextBlock = (column-1)+"_"+(row-2);
            if(!checkIfPieceExists(nextBlock)) {
                block.highlightBlock(nextBlock);
            } else {
                checkForMove(nextBlock);
            }   
        }
    }
}

function getKingSteps(maxSteps){
    for(var key in maxSteps) {
        if(maxSteps[key]) {
            maxSteps[key] = 1;
        }
    }
    return maxSteps;
}

function makeStraightSteps(blockId, maxSteps) {
    if(maxSteps['F']) {
        moveForward(blockId, maxSteps['F']);
    }

    if(maxSteps['B']) {
        moveBackward(blockId, maxSteps['B']);
    }

    if(maxSteps['R']) {
        moveRight(blockId, maxSteps['R']);
    }

    if(maxSteps['L']) {
        moveLeft(blockId, maxSteps['L']);
    }
}

function makeCrossSteps(blockId, maxSteps) {
    if(maxSteps['FR']) {
        moveForwardRight(blockId, maxSteps['FR']);
    }

    if(maxSteps['BR']) {
        moveBackwardRight(blockId, maxSteps['BR']);
    }

    if(maxSteps['FL']) {
        moveForwardLeft(blockId, maxSteps['FL']);
    }

    if(maxSteps['BL']) {
        moveBackwardLeft(blockId, maxSteps['BL']);
    }
}

function checkForMove(blockId) {
    var piece = getPieceData(blockId);
    if(currentPieceColor != piece['color']) {
        block.highlightBlock(blockId);
    }
}