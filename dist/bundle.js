/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    getBlockData: function getBlockData(block) {
        var blockData = block.split("_");
        return { column: blockData[0], row: blockData[1] };
    },

    getForwardBlock: function getForwardBlock(blockData) {
        var row = parseInt(blockData['row']);
        row++;
        return blockData['column'] + "_" + row;
    },

    getBackwardBlock: function getBackwardBlock(blockData) {
        var row = parseInt(blockData['row']);
        row--;
        return blockData['column'] + "_" + row;
    },

    getRightBlock: function getRightBlock(blockData) {
        var column = parseInt(blockData['column']);
        column++;
        return column + "_" + blockData['row'];
    },

    getLeftBlock: function getLeftBlock(blockData) {
        var column = parseInt(blockData['column']);
        column--;
        return column + "_" + blockData['row'];
    },

    getForwardRightBlock: function getForwardRightBlock(blockData) {
        var column = parseInt(blockData['column']);
        var row = parseInt(blockData['row']);
        row++;
        column++;
        return column + "_" + row;
    },

    getForwardLeftBlock: function getForwardLeftBlock(blockData) {
        var column = parseInt(blockData['column']);
        var row = parseInt(blockData['row']);
        row++;
        column--;
        return column + "_" + row;
    },

    getBackwardRightBlock: function getBackwardRightBlock(blockData) {
        var column = parseInt(blockData['column']);
        var row = parseInt(blockData['row']);
        row--;
        column++;
        return column + "_" + row;
    },

    getBackwardLeftBlock: function getBackwardLeftBlock(blockData) {
        var column = parseInt(blockData['column']);
        var row = parseInt(blockData['row']);
        row--;
        column--;
        return column + "_" + row;
    },

    checkIfPieceExists: function checkIfPieceExists(blockId) {
        if ($("#" + blockId).find('i.fa').length) {
            return true;
        }
        return false;
    },

    highlightBlock: function highlightBlock(block) {
        $("#" + block).addClass("mark");
    },

    hideMovableBlocks: function hideMovableBlocks() {
        $("#chess-table td").removeClass("mark");
    },

    getPieceData: function getPieceData(blockId) {
        var pieceData = $("#" + blockId).find('i.fa').attr('id').split("_");
        return { color: pieceData[0], piece: pieceData[1] };
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Globals = {
    currentPieceColor: "",
    currentPiece: "",
    currentBlockId: "",
    coinColor: "",
    player: "w",
    id: "",
    groupId: "",
    opponentColor: "",
    start: 0
};
module.exports = Globals;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var boardBuilder = __webpack_require__(3);
var block = __webpack_require__(0);
var steps = __webpack_require__(4);
var globals = __webpack_require__(1);

var socket = io();
socket.on('connect', function () {
    console.log(socket.io.engine.id);
});

socket.on('start', function (data) {
    globals.start = data.start;
});

socket.on('gameData', function (gameData) {
    console.log(gameData);
    globals.start = gameData.start;
    if (gameData.coinColor == 'b') {
        $("#chess-block").addClass('black-board');
        globals.opponentColor = "w";
    } else {
        globals.opponentColor = "b";
    }
    globals.coinColor = gameData.coinColor;
    globals.id = gameData.id;
    globals.groupId = gameData.groupId;
});

socket.on('completeStep', function (step) {
    $("#" + step.targetBlockId).html($("#" + step.currentBlockId).html());
    $("#" + step.currentBlockId).html("");
    block.hideMovableBlocks();
    globals.player = step.player;
    var curr_col_row = step.currentBlockId.split("_");
    var tar_col_row = step.targetBlockId.split("_");
    $("#" + step.coinColor + "-step").append("<li>" + boardBuilder.columns[curr_col_row[0]] + curr_col_row[1] + " - " + boardBuilder.columns[tar_col_row[0]] + tar_col_row[1] + "</li>");
});

$(function () {
    boardBuilder.buildChessBoard();
    boardBuilder.arrangeCoins();
    $("#chess-table td").click(function () {
        var blockId = $(this).attr('id');
        if ($(this).hasClass('mark') && globals.start && globals.player == globals.coinColor && globals.currentPieceColor == globals.coinColor) {
            socket.emit('proposeStep', {
                currentBlockId: globals.currentBlockId,
                targetBlockId: blockId,
                player: globals.opponentColor,
                groupId: globals.groupId,
                coinColor: globals.coinColor,
                currentPiece: globals.currentPiece
            }, function (err) {
                console.log(err);
            });
        } else {
            if (block.checkIfPieceExists(blockId)) {
                block.hideMovableBlocks();
                steps.setMovableBlocks(blockId);
            } else {
                block.hideMovableBlocks();
            }
        }
    });
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var columns = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' };
var rows = [8, 7, 6, 5, 4, 3, 2, 1];
var pieces = {
    R: "<i class='fa fa-chess-rook' id='R'></i>",
    H: "<i class='fa fa-chess-knight' id='H'></i>",
    B: "<i class='fa fa-chess-bishop' id='B'></i>",
    Q: "<i class='fa fa-chess-queen' id='Q'></i>",
    K: "<i class='fa fa-chess-king' id='K'></i>",
    P: "<i class='fa fa-chess-pawn' id='P'></i>"
};
var chessMatrix = [];
var chessBoard = "";
var cls = 'black';

var buildChessBoard = function buildChessBoard() {
    rows.forEach(function (r) {
        cls = cls == 'black' ? 'white' : 'black';
        chessBoard += "<tr>";
        Object.keys(columns).forEach(function (c) {
            if (r == 2) {
                chessMatrix[c + "_" + r] = "w_P";
            } else if (r == 7) {
                chessMatrix[c + "_" + r] = "b_P";
            } else {
                chessMatrix[c + "_" + r] = 0;
                chessMatrix[c + "_" + r] = 0;
            }
            chessBoard += "<td class='" + c + r + " " + cls + "' id='" + c + "_" + r + "' data-block='" + columns[c] + r + "'></td>";
            cls = cls == 'black' ? 'white' : 'black';
        });
        chessBoard += "</tr>";
    });
    $("#chess-table").html(chessBoard);
    // $("#chess-table td").height($("#chess-table td").width());
};

var arrangeCoins = function arrangeCoins() {
    chessMatrix['1_8'] = chessMatrix['8_8'] = "b_R";
    chessMatrix['1_1'] = chessMatrix['8_1'] = 'w_R';
    chessMatrix['2_8'] = chessMatrix['7_8'] = "b_H";
    chessMatrix['2_1'] = chessMatrix['7_1'] = 'w_H';
    chessMatrix['3_8'] = chessMatrix['6_8'] = 'b_B';
    chessMatrix['3_1'] = chessMatrix['6_1'] = 'w_B';
    chessMatrix['4_8'] = 'b_Q';
    chessMatrix['4_1'] = 'w_Q';
    chessMatrix['5_8'] = 'b_K';
    chessMatrix['5_1'] = 'w_K';
    // chessMatrix['5_5'] = 'w_Q';
    $("#chess-table").html(chessBoard);
    $("#chess-table td").height($("#chess-table td").width());
    for (var block in chessMatrix) {
        if (chessMatrix[block] != 0) {
            var blockData = chessMatrix[block].split("_");
            $("#" + block).html(pieces[blockData[1]]);
            $("#" + block + " i").addClass(blockData[0]);
            $("#" + block + " i").attr('id', chessMatrix[block]);
        }
    }
};

module.exports = { buildChessBoard: buildChessBoard, arrangeCoins: arrangeCoins, columns: columns };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var block = __webpack_require__(0);
var mark = __webpack_require__(5);
var globals = __webpack_require__(1);

function setMovableBlocks(blockId) {
    var pieceData = block.getPieceData(blockId);
    var piece = globals.currentPiece = pieceData['piece'];
    globals.currentPieceColor = pieceData['color'];
    globals.currentBlockId = blockId;
    if (piece == "R") {
        getRookBlocks(blockId);
    } else if (piece == "H") {
        getHorseBlocks(blockId);
    } else if (piece == "B") {
        getBishopBlocks(blockId);
    } else if (piece == "Q") {
        getRookBlocks(blockId);
        getBishopBlocks(blockId);
    } else if (piece == "K") {
        getRookBlocks(blockId, 1);
        getBishopBlocks(blockId, 1);
    } else if (piece == "P") {
        getPawnBlocks(blockId);
    }
}

function getPawnBlocks(blockId) {
    var blockData = block.getBlockData(blockId);
    if (globals.currentPieceColor == 'w') {
        var steps = 1;
        if (blockData['row'] == 2) {
            var steps = 2;
        }
        mark.pawnSteps(blockId, steps);
    } else {
        var steps = 1;
        if (blockData['row'] == 7) {
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

function getStraightSteps(blockData, isKing) {
    var maxSteps = {};
    var row = parseInt(blockData['row']);
    var column = parseInt(blockData['column']);
    maxSteps['F'] = 8 - row;
    maxSteps['B'] = row - 1;
    maxSteps['R'] = 8 - column;
    maxSteps['L'] = column - 1;
    if (typeof isKing !== "undefined" && isKing == 1) {
        maxSteps = getKingSteps(maxSteps);
    }
    return maxSteps;
}

function getCrossSteps(blockData, isKing) {
    var maxSteps = {};
    var row = parseInt(blockData['row']);
    var column = parseInt(blockData['column']);
    if (row < column) {
        maxSteps['FR'] = 8 - column;
        maxSteps['FL'] = column - 1;
        maxSteps['BR'] = 8 - row;
        maxSteps['BL'] = row - 1;
    } else {
        maxSteps['FR'] = 8 - row;
        maxSteps['FL'] = row - 1;
        maxSteps['BR'] = 8 - column;
        maxSteps['BL'] = column - 1;
    }
    if (typeof isKing !== "undefined" && isKing == 1) {
        maxSteps = getKingSteps(maxSteps);
    }
    return maxSteps;
}

function getHorseBlocks(blockId) {
    var blockData = block.getBlockData(blockId);
    mark.horseSteps(blockData);
}

function getKingSteps(maxSteps) {
    for (var key in maxSteps) {
        if (maxSteps[key]) {
            maxSteps[key] = 1;
        }
    }
    return maxSteps;
}

module.exports = { setMovableBlocks: setMovableBlocks };

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var block = __webpack_require__(0);
var globals = __webpack_require__(1);

var forward = function forward(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardBlock(blockData);
    markBlocks(nextBlock, steps, forward);
};

var backward = function backward(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardBlock(blockData);
    markBlocks(nextBlock, steps, backward);
};

var right = function right(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getRightBlock(blockData);
    markBlocks(nextBlock, steps, right);
};

var left = function left(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getLeftBlock(blockData);
    markBlocks(nextBlock, steps, left);
};

var forwardRight = function forwardRight(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardRightBlock(blockData);
    markBlocks(nextBlock, steps, forwardRight);
};

var forwardLeft = function forwardLeft(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getForwardLeftBlock(blockData);
    markBlocks(nextBlock, steps, forwardLeft);
};

var backwardRight = function backwardRight(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardRightBlock(blockData);
    markBlocks(nextBlock, steps, backwardRight);
};

var backwardLeft = function backwardLeft(blockId, steps) {
    var blockData = block.getBlockData(blockId);
    var nextBlock = block.getBackwardLeftBlock(blockData);
    markBlocks(nextBlock, steps, backwardLeft);
};

var markBlocks = function markBlocks(blockId, steps, callback) {
    if (globals.currentPiece !== "P") {
        if (!block.checkIfPieceExists(blockId)) {
            block.highlightBlock(blockId);
            steps--;
            if (steps) {
                callback(blockId, steps);
            }
        } else {
            checkForMove(blockId, callback);
        }
    } else {
        checkPawnMove(blockId, steps, callback);
    }
};

var checkPawnMove = function checkPawnMove(blockId, steps, callback) {
    if (!block.checkIfPieceExists(blockId) && (callback.name == "forward" || callback.name == "backward")) {
        block.highlightBlock(blockId);
        steps--;
        if (steps) {
            callback(blockId, steps);
        }
    } else if (block.checkIfPieceExists(blockId) && !(callback.name == "forward" || callback.name == "backward")) {
        block.highlightBlock(blockId);
    }
};

var checkForMove = function checkForMove(blockId, callback) {
    var piece = block.getPieceData(blockId);
    if (globals.currentPieceColor != piece['color']) {
        block.highlightBlock(blockId);
    }
};

var pawnSteps = function pawnSteps(blockId, steps) {
    if (globals.currentPieceColor == 'w') {
        forward(blockId, steps);
        forwardRight(blockId, 1);
        forwardLeft(blockId, 1);
    } else {
        backward(blockId, steps);
        backwardRight(blockId, 1);
        backwardLeft(blockId, 1);
    }
};
var horseSteps = function horseSteps(blockData) {
    var row = parseInt(blockData['row']);
    var column = parseInt(blockData['column']);
    if (column + 2 <= 8) {
        if (row + 1 <= 8) {
            var nextBlock = column + 2 + "_" + (row + 1);
            markBlocks(nextBlock, 1);
        }
        if (row - 1 >= 1) {
            var nextBlock = column + 2 + "_" + (row - 1);
            markBlocks(nextBlock, 1);
        }
    }
    if (column - 2 >= 1) {
        if (row + 1 <= 8) {
            var nextBlock = column - 2 + "_" + (row + 1);
            markBlocks(nextBlock, 1);
        }
        if (row - 1 >= 1) {
            var nextBlock = column - 2 + "_" + (row - 1);
            markBlocks(nextBlock, 1);
        }
    }

    if (row + 2 <= 8) {
        if (column + 1 <= 8) {
            var nextBlock = column + 1 + "_" + (row + 2);
            markBlocks(nextBlock, 1);
        }
        if (column - 1 >= 1) {
            var nextBlock = column - 1 + "_" + (row + 2);
            markBlocks(nextBlock, 1);
        }
    }
    if (row - 2 >= 1) {
        if (column + 1 <= 8) {
            var nextBlock = column + 1 + "_" + (row - 2);
            markBlocks(nextBlock, 1);
        }
        if (column - 1 >= 1) {
            var nextBlock = column - 1 + "_" + (row - 2);
            markBlocks(nextBlock, 1);
        }
    }
};

var straightSteps = function straightSteps(blockId, maxSteps) {
    if (maxSteps['F']) {
        forward(blockId, maxSteps['F']);
    }

    if (maxSteps['B']) {
        backward(blockId, maxSteps['B']);
    }

    if (maxSteps['R']) {
        right(blockId, maxSteps['R']);
    }

    if (maxSteps['L']) {
        left(blockId, maxSteps['L']);
    }
};

var crossSteps = function crossSteps(blockId, maxSteps) {
    if (maxSteps['FR']) {
        forwardRight(blockId, maxSteps['FR']);
    }

    if (maxSteps['BR']) {
        backwardRight(blockId, maxSteps['BR']);
    }

    if (maxSteps['FL']) {
        forwardLeft(blockId, maxSteps['FL']);
    }

    if (maxSteps['BL']) {
        backwardLeft(blockId, maxSteps['BL']);
    }
};

module.exports = { straightSteps: straightSteps, crossSteps: crossSteps, pawnSteps: pawnSteps, horseSteps: horseSteps };

/***/ })
/******/ ]);