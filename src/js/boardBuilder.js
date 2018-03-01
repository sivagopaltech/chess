const columns = {1:'a', 2:'b', 3:'c', 4:'d', 5:'e', 6:'f', 7:'g', 8:'h'};
const rows = [8, 7, 6, 5, 4, 3, 2, 1];
const pieces = {
    R: "<i class='fa fa-chess-rook' id='R'></i>",
    H: "<i class='fa fa-chess-knight' id='H'></i>",
    B: "<i class='fa fa-chess-bishop' id='B'></i>",
    Q: "<i class='fa fa-chess-queen' id='Q'></i>",
    K: "<i class='fa fa-chess-king' id='K'></i>",
    P: "<i class='fa fa-chess-pawn' id='P'></i>"
}
let chessMatrix = []; 
let chessBoard = "";
let cls = 'black';

const buildChessBoard = () => {
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
    $("#chess-table").html(chessBoard);
    // $("#chess-table td").height($("#chess-table td").width());
}

const arrangeCoins = () => {
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
    for(var block in chessMatrix) {
        if(chessMatrix[block] != 0) {
            var blockData = chessMatrix[block].split("_");
            $("#"+block).html(pieces[blockData[1]]);
            $("#"+block+" i").addClass(blockData[0]);
            $("#"+block+" i").attr('id',chessMatrix[block]);
        }
    }
}

module.exports = {buildChessBoard, arrangeCoins, columns}