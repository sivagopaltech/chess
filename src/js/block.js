module.exports = {
    getBlockData: (block) => {
        let blockData =  block.split("_");
        return {column: blockData[0], row: blockData[1]};
    },

    getForwardBlock: (blockData) => {
        let row = parseInt(blockData['row'])
        row++;
        return blockData['column']+"_"+row;
    },

    getBackwardBlock: (blockData) => {
        let row = parseInt(blockData['row'])
        row--;
        return blockData['column']+"_"+row;
    },

    getRightBlock: (blockData) => {
        let column = parseInt(blockData['column'])
        column++;
        return column+"_"+blockData['row'];
    },

    getLeftBlock: (blockData) => {
        let column = parseInt(blockData['column'])
        column--;
        return column+"_"+blockData['row'];
    },

    getForwardRightBlock: (blockData) => {
        let column = parseInt(blockData['column'])
        let row = parseInt(blockData['row'])
        row++;
        column++;
        return column+"_"+row;
    },

    getForwardLeftBlock: (blockData) => {
        let column = parseInt(blockData['column'])
        let row = parseInt(blockData['row'])
        row++;
        column--;
        return column+"_"+row;
    },

    getBackwardRightBlock: (blockData) => {
        let column = parseInt(blockData['column'])
        let row = parseInt(blockData['row'])
        row--;
        column++;
        return column+"_"+row;
    },

    getBackwardLeftBlock: (blockData) => {
        let column = parseInt(blockData['column'])
        let row = parseInt(blockData['row'])
        row--;
        column--;
        return column+"_"+row;
    },

    highlightBlock: (block) => {
        $("#"+block).css("border","2px solid blue");
    },

    hideMovableBlocks: () => {
        $("#chess-table td").css('border', "none");
    }
}