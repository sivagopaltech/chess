$(function(){
    var columns = {1:'a', 2:'b', 3:'c', 4:'d', 5:'e', 6:'f', 7:'g', 8:'h'};
    var rows = [8, 7, 6, 5, 4, 3, 2, 1];
    var pieces = {};
    pieces['R'] = "<i class='fa fa-chess-rook' id='R'></i>";
    pieces['H'] = "<i class='fa fa-chess-knight' id='H'></i>";
    pieces['B'] = "<i class='fa fa-chess-bishop' id='B'></i>";
    pieces['Q'] = "<i class='fa fa-chess-queen' id='Q'></i>";
    pieces['K'] = "<i class='fa fa-chess-king' id='K'></i>";
    pieces['P'] = "<i class='fa fa-chess-pawn' id='P'></i>";
    var chessMatrix = []; 
    var chessBoard = "";
    var cls = 'black';

    
    rows.forEach(function(r){
        cls = (cls == 'black')?'white':'black';
        chessBoard += "<tr>";
        Object.keys(columns).forEach(function(c){
            if(r == 2) {
                chessMatrix[c+"_"+r] = "w_P";
            } else if(r == 7) {
                chessMatrix[c+"_"+r] = "b_P";
            } else {
                chessMatrix[c+"_"+r] = 0;
                chessMatrix[c+"_"+r] = 0;
            }
            chessBoard += "<td class='"+c+r+" "+cls+"' id='"+c+"_"+r+"' data-block='"+columns[c]+r+"'></td>";
            cls = (cls == 'black')?'white':'black';
        });
        chessBoard += "</tr>";
    });
    chessMatrix['1_8'] = chessMatrix['8_8'] = "b_R";
    chessMatrix['1_1'] = chessMatrix['8_1'] = 'w_R';
    chessMatrix['2_8'] = chessMatrix['7_8'] = "b_H";
    chessMatrix['2_1'] = chessMatrix['7_1'] = 'w_H';
    chessMatrix['3_8'] = chessMatrix['6_8'] = 'b_B';
    chessMatrix['3_1'] = chessMatrix['6_1'] = 'w_B';
    chessMatrix['4_6'] = "b_Q";
    chessMatrix['4_8'] = 'b_Q';
    chessMatrix['4_1'] = 'w_Q';
    chessMatrix['5_8'] = 'b_K';
    chessMatrix['5_1'] = 'w_K';
    $("#chess-table").html(chessBoard);
    $("#chess-table td").height($("#chess-table td").width());
    for(var block in chessMatrix) {
        if(chessMatrix[block] != 0) {
            var blockData = chessMatrix[block].split("_");
            $("#"+block).html(pieces[blockData[1]]);
            $("#"+block+" i").addClass(blockData[0]);
            $("#"+block+" i").attr('id',chessMatrix[block]);
        }
    }

    $("#chess-table td").click(function(){
        var block = $(this).attr('id');
        if(checkIfPieceExists(block)) {
            hideMovableBlocks();
            var pieceData = getPieceData(block);
            getMovingBlock(pieceData['piece'], block);
        }
    });
    
    
});

function getMovingBlock(piece, block) {
    if(piece == "R") {
        getRookBlocks(block);
    } else if(piece == "H") {

    } else if(piece == "B") {
        getBishopBlocks(block);
    } else if(piece == "Q") {
        getRookBlocks(block);
        getBishopBlocks(block);
    } else if(piece == "K") {
        getRookBlocks(block, isKing);
        getBishopBlocks(block, isKing);
    } else if(piece == "P") {
        getPawnBlocks(block);
    }
}

function getPawnBlocks(block) {
    var pieceData = getPieceData(block);
    if(pieceData['color'] == 'w') {
        var blockData = getBlockData(block);
        var steps = 1;
        if(blockData['row'] == 2) { 
            var steps = 2;
        }
        moveForward(block, steps);
    } else {
        var blockData = getBlockData(block);
        var steps = 1;
        if(blockData['row'] == 7) { 
            var steps = 2;
        }
        moveBackward(block, steps);
    }
}

function getRookBlocks(block, isKing) {
    var blockData = getBlockData(block);
    var maxSteps = getStraightSteps(blockData, isKing);
    makeStraightSteps(block, maxSteps);
}

function getBishopBlocks(block) {
    var blockData = getBlockData(block);
    var maxSteps = getCrossSteps(blockData, isKing);
    makeCrossSteps(block, maxSteps);
}

function moveForward(block, steps) {
    var blockData = getBlockData(block);
    var nextBlock = getForwardBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveForward(nextBlock, steps) 
        }
    }
}

function moveBackward(block, steps) {
    var blockData = getBlockData(block);
    var prevBlock = getBackwardBlock(blockData);
    if(!checkIfPieceExists(prevBlock)) {
        highlightBlock(prevBlock);
        steps--;
        if(steps) {
            moveBackward(prevBlock, steps) 
        }
    }
}

function moveRight(block, steps) {
    var blockData = getBlockData(block);
    var nextBlock = getRightBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveRight(nextBlock, steps) 
        }
    }
}

function moveLeft(block, steps) {
    var blockData = getBlockData(block);
    var prevBlock = getLeftBlock(blockData);
    if(!checkIfPieceExists(prevBlock)) {
        highlightBlock(prevBlock);
        steps--;
        if(steps) {
            moveLeft(prevBlock, steps) 
        }
    }
}

function moveForwardRight(block, steps) {
    var blockData = getBlockData(block);
    var nextBlock = getForwardRightBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveForwardRight(nextBlock, steps) 
        }
    }
}

function moveForwardLeft(block, steps) {
    var blockData = getBlockData(block);
    var nextBlock = getForwardLeftBlock(blockData);
    if(!checkIfPieceExists(nextBlock)) {
        highlightBlock(nextBlock);
        steps--;
        if(steps) {
            moveForwardLeft(nextBlock, steps) 
        }
    }
}

function moveBackwardRight(block, steps) {
    var blockData = getBlockData(block);
    var prevBlock = getBackwardRightBlock(blockData);
    if(!checkIfPieceExists(prevBlock)) {
        highlightBlock(prevBlock);
        steps--;
        if(steps) {
            moveBackwardRight(prevBlock, steps) 
        }
    }
}

function moveBackwardLeft(block, steps) {
    var blockData = getBlockData(block);
    var prevBlock = getBackwardLeftBlock(blockData);
    if(!checkIfPieceExists(prevBlock)) {
        highlightBlock(prevBlock);
        steps--;
        if(steps) {
            moveBackwardLeft(prevBlock, steps) 
        }
    }
}

function checkIfPieceExists(block) {
    if($("#"+block).find('i.fa').length){
        return true;
    } 
    return false;
}

function getPieceData(block) {
    var pieceData =  $("#"+block).find('i.fa').attr('id').split("_");
    return {color: pieceData[0], piece: pieceData[1]};
}

function getBlockData(block) {
    var blockData =  block.split("_");
    return {column: blockData[0], row: blockData[1]};
}

function getForwardBlock(blockData) {
    var row = parseInt(blockData['row'])
    row++;
    return blockData['column']+"_"+row;
}

function getBackwardBlock(blockData) {
    var row = parseInt(blockData['row'])
    row--;
    return blockData['column']+"_"+row;
}

function getRightBlock(blockData) {
    var column = parseInt(blockData['column'])
    column++;
    return column+"_"+blockData['row'];
}

function getLeftBlock(blockData) {
    var column = parseInt(blockData['column'])
    column--;
    return column+"_"+blockData['row'];
}

function getForwardRightBlock(blockData) {
    var column = parseInt(blockData['column'])
    var row = parseInt(blockData['row'])
    row++;
    column++;
    return column+"_"+row;
}

function getForwardLeftBlock(blockData) {
    var column = parseInt(blockData['column'])
    var row = parseInt(blockData['row'])
    row++;
    column--;
    return column+"_"+row;
}

function getBackwardRightBlock(blockData) {
    var column = parseInt(blockData['column'])
    var row = parseInt(blockData['row'])
    row--;
    column++;
    return column+"_"+row;
}

function getBackwardLeftBlock(blockData) {
    var column = parseInt(blockData['column'])
    var row = parseInt(blockData['row'])
    row--;
    column--;
    return column+"_"+row;
}

function highlightBlock(block) {
    $("#"+block).css("border","2px solid blue");
}

function hideMovableBlocks() {
    $("#chess-table td").css('border', "none");
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

function getKingSteps(maxSteps){
    for(var key in maxSteps) {
        if(maxSteps[key]) {
            maxSteps[key] = 1;
        }
    }
    return maxSteps;
}

function makeStraightSteps(block, maxSteps) {
    if(maxSteps['F']) {
        moveForward(block, maxSteps['F']);
    }

    if(maxSteps['B']) {
        moveBackward(block, maxSteps['B']);
    }

    if(maxSteps['R']) {
        moveRight(block, maxSteps['R']);
    }

    if(maxSteps['L']) {
        moveLeft(block, maxSteps['L']);
    }
}

function makeCrossSteps(block, maxSteps) {
    if(maxSteps['FR']) {
        moveForwardRight(block, maxSteps['FR']);
    }

    if(maxSteps['BR']) {
        moveBackwardRight(block, maxSteps['BR']);
    }

    if(maxSteps['FL']) {
        moveForwardLeft(block, maxSteps['FL']);
    }

    if(maxSteps['BL']) {
        moveBackwardLeft(block, maxSteps['BL']);
    }
}