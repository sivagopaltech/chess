const block = require("./block");
const mark = require("./mark");
var globals = require('./globals');

function setMovableBlocks(blockId) {
    var pieceData = block.getPieceData(blockId);
    let piece = globals.currentPiece = pieceData['piece'];
    globals.currentPieceColor = pieceData['color'];
    globals.currentBlockId = blockId;
    if(piece == "R") {
        getRookBlocks(blockId);
    } else if(piece == "H") {
        getHorseBlocks(blockId);
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
    var blockData = block.getBlockData(blockId);
    if(globals.currentPieceColor == 'w') {
        var steps = 1;
        if(blockData['row'] == 2) { 
            var steps = 2;
        }
        mark.pawnSteps(blockId, steps);
    } else {
        var steps = 1;
        if(blockData['row'] == 7) { 
            var steps = 2;
        }
        mark.pawnSteps(blockId, steps);
    }
}

function getRookBlocks(blockId, isKing) {
    var blockData = block.getBlockData(blockId);
    var maxSteps = getStraightSteps(blockData, isKing);
    mark.straightSteps(blockId, maxSteps);
}

function getBishopBlocks(blockId, isKing) {
    var blockData = block.getBlockData(blockId);
    var maxSteps = getCrossSteps(blockData, isKing);
    mark.crossSteps(blockId, maxSteps);
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
        maxSteps['BR'] = 8 - row;
        maxSteps['BL'] = row - 1;
    } else {
        maxSteps['FR'] = 8 - row;
        maxSteps['FL'] = row - 1;
        maxSteps['BR'] = 8 - column;
        maxSteps['BL'] = column - 1;
    }
    if(typeof isKing !== "undefined" && isKing == 1) {
        maxSteps = getKingSteps(maxSteps);
    }
    return maxSteps;
}

function getHorseBlocks(blockId) {
    var blockData = block.getBlockData(blockId);
    mark.horseSteps(blockData); 
}

function getKingSteps(maxSteps){
    for(var key in maxSteps) {
        if(maxSteps[key]) {
            maxSteps[key] = 1;
        }
    }
    return maxSteps;
}

module.exports = {setMovableBlocks}