const mapWeight = 300;
const mapHeight = 600;
const numberOfRows = 20;
const numberOfCols = 10;
const cellSize = mapWeight / numberOfCols;
const borderSize = 0.2;

const zType = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
]

const sType = [
    [0, 2, 2],
    [2, 2, 0],
    [0, 0, 0],
]

const iType = [
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0],
]

const lType = [
    [4, 0, 0],
    [4, 0, 0],
    [4, 4, 0],
]

const jType = [
    [0, 0, 5],
    [0, 0, 5],
    [0, 5, 5],
]

const oType = [
    [6, 6],
    [6, 6],
]

const tType = [
    [0, 7, 0],
    [7, 7, 7],
    [0, 0, 0],
]

const blockColors = [
    'limegreen',
    'darkorange',
    'mediumorchid',
    'dodgerblue',
    'orangered',
    'cornflowerblue',
    'tomato',
]

const blockTypes = {
    zType,
    sType,
    iType,
    lType,
    jType,
    oType,
    tType,
}

class Block {
    constructor(cells, x, y) {
        this.cells = cells;
        this.position = { x, y };
        this.isAlive = true;
    }

    findCollison(field) {
        const { x, y } = this.position
        this.cells.forEach((rows, i) => {
            rows.forEach((cell, j) => {
                if (cell && ((y + i >= numberOfRows) || field[y + i][x + j])) {
                    this.isAlive = false;
                    return
                }
            })
        })
    }
}

const checkCanMove = () => {
    return true;
}

const { requestAnimationFrame } = window;
const fps = 24;
const timeToMoveDown = 500;

let counterOfF = 0;
let prevTime = 0;
let prevPosition = { x: 0, y: 0 };
let prevBlockCells = [[]];

const render = (game, block, time) => {
    if (!block) {
        const arrOfTypes = Object.values(blockTypes);
        const blockType = arrOfTypes[arrOfTypes.length * Math.random() | 0];
        const x = ((numberOfCols - blockType.length) / 2) | 0;
        block = new Block(blockType, x, 0)
        prevPosition = { x, y: 0 };
    }

    const { ctx, field } = game;
    const { position } = block;

    if (time - prevTime > 1000 / fps) {
        counterOfF++;
        if (counterOfF === (fps * timeToMoveDown) / 1000) {
            counterOfF = 0;
            if (block && block.isAlive) {
                position.y++;
            } else {
                block = null;
            }
        }
    }

    prevTime = time;

    insertIntoArray(prevBlockCells, field, prevPosition.y, prevPosition.x, true);

    const canMove = checkCanMove(block, field);
    if (!canMove) {
        position.x = prevPosition.x;
        block.cells = prevBlockCells;
    }

    block.findCollison(field);
    if (block.isAlive) {
        insertIntoArray(block.cells, field, position.y, position.x);
        drawField(field, ctx);
        prevPosition = Object.assign({}, position);
        prevBlockCells = [].concat(block.cells);
    }

    requestAnimationFrame((time) => render(game, block, time));

}

const insertIntoArray = (childArr, parrentArr, row, col, clearMode) => {
    let i = 0;
    while(i < childArr.length) {
        let j = 0;
        while(j < childArr[i].length) {
            parrentArr[row + i][col + j] = !clearMode
                ? childArr[i][j]
                    ? childArr[i][j]
                    : parrentArr[row + i][col + j]
                : childArr[i][j]
                    ? 0
                    : parrentArr[row + i][col + j]
            j++
        }
        i++
    }
}

const generateField = (rows, cols) => {
    const field = Array.from({length: rows},
        () => Array.from({length: cols}, () => 0))
}

window.onload = () => {
    const canvas = document.getElementById('map');
    const ctx = canvas.getContext('2d');
    const game = {
        ctx, 
        field: generateField(numberOfRows+4, numberOfCols),
    }
    render(game)
}
