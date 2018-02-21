const block = require("./block"); 
var globals = require('./globals'); 

const forward = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardBlock(blockData);
    markBlocks(nextBlock, steps, forward);
}

const backward = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardBlock(blockData);
    markBlocks(nextBlock, steps, backward);
}

const right = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getRightBlock(blockData);
    markBlocks(nextBlock, steps, right);
}

const left = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getLeftBlock(blockData);
    markBlocks(nextBlock, steps, left);
}

const forwardRight = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardRightBlock(blockData);
    markBlocks(nextBlock, steps, forwardRight);
}

const forwardLeft = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardLeftBlock(blockData);
    markBlocks(nextBlock, steps, forwardLeft);
}

const backwardRight = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardRightBlock(blockData);
    markBlocks(nextBlock, steps, backwardRight);
}

const backwardLeft = (blockId, steps) => {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardLeftBlock(blockData);
    markBlocks(nextBlock, steps, backwardLeft);
}

const markBlocks = (blockId, steps, callback) => {
    if(globals.currentPiece !== "P") {
        if(!block.checkIfPieceExists(blockId)) {
            block.highlightBlock(blockId);
            steps--;
            if(steps) {
                callback(blockId, steps) 
            }
        } else {
            checkForMove(blockId, callback);
        }
    } else {
        checkPawnMove(blockId, steps, callback);
    }
}

const checkPawnMove = (blockId, steps, callback) => {
    if(!block.checkIfPieceExists(blockId) && 
        (callback.name == "forward" || callback.name == "backward")) {
        block.highlightBlock(blockId);
        steps--;
        if(steps) {
            callback(blockId, steps) 
        }
    } else if(block.checkIfPieceExists(blockId) && 
        !(callback.name == "forward" || callback.name == "backward")) {
        block.highlightBlock(blockId);
    }
     
}

const checkForMove = (blockId, callback) => {
    var piece = block.getPieceData(blockId);
    if(globals.currentPieceColor != piece['color']) {
        block.highlightBlock(blockId);
    }
}

const pawnSteps = (blockId, steps) => {
    if(globals.currentPieceColor == 'w') {
        forward(blockId, steps);
        forwardRight(blockId, 1);
        forwardLeft(blockId, 1);
    } else {
        backward(blockId, steps);
        backwardRight(blockId, 1);
        backwardLeft(blockId, 1);
    }
}


const straightSteps = (blockId, maxSteps) => {
    if(maxSteps['F']) {
        forward(blockId, maxSteps['F']);
    }

    if(maxSteps['B']) {
        backward(blockId, maxSteps['B']);
    }

    if(maxSteps['R']) {
        right(blockId, maxSteps['R']);
    }

    if(maxSteps['L']) {
        left(blockId, maxSteps['L']);
    }
}

const  crossSteps = (blockId, maxSteps) => {
    if(maxSteps['FR']) {
        forwardRight(blockId, maxSteps['FR']);
    }

    if(maxSteps['BR']) {
        backwardRight(blockId, maxSteps['BR']);
    }

    if(maxSteps['FL']) {
        forwardLeft(blockId, maxSteps['FL']);
    }

    if(maxSteps['BL']) {
        backwardLeft(blockId, maxSteps['BL']);
    }
}

module.exports = {crossSteps, pawnSteps}; 