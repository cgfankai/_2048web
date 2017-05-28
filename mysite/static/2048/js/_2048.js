/**
 * Created by fankai on 2017/5/27.
 */
var board = [];
var hasConflicte = [];
var score = 0;
var documentWidth = window.screen.availWidth;
var documentHeight = window.screen.availHeight;
if(documentHeight / 2 < documentWidth){
    documentWidth = documentHeight/2;
}
var gridContainerWidth = 0.92 * documentWidth;
var cellSideLength = 0.18 * documentWidth;
var cellSpace = 0.04 * documentWidth;
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

function prepareForMobile() {
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', gridContainerWidth * 0.02);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', cellSideLength * 0.02);
}
$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function noSpace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}
function showNumberWithAnimation(i, j, randomNumber) {
    var theNumberCell = $('#number-cell-' + i + '-' + j);
    theNumberCell.css('background-color', getNumberBackgroundColor(randomNumber));
    theNumberCell.css('color', getNumberColor(randomNumber));
    theNumberCell.text(randomNumber);
    theNumberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50)
}
function generateOneNumber() {
    if (noSpace(board)) {
        return false;
    }
    //随机一个位置
    var blankPos = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                blankPos.push({
                    x: i,
                    y: j
                })
            }
        }
    }
    var randomIndex = parseInt(Math.floor(Math.random() * blankPos.length));
    var randomX = blankPos[randomIndex].x;
    var randomY = blankPos[randomIndex].y;
    //随机一个数字
    var randomNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机的位置上显示随机数字
    board[randomX][randomY] = randomNumber;
    showNumberWithAnimation(randomX, randomY, randomNumber);
    return true;
}
function newgame() {
    //初始化棋盘格
    init();
    //在随机的两个格子里生成数字
    generateOneNumber();
    generateOneNumber();
    score = 0;
    updateScore(0);
}


function init() {
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        hasConflicte[i] = [];
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
            board[i][j] = 0;
            hasConflicte[i][j] = false;
        }
    }
    updateBoardView();
}


function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicte[i][j] = false;
        }
    }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

function getPosTop(i, j) {
    return cellSpace + i * (cellSpace + cellSideLength);
}
function getPosLeft(i, j) {
    return cellSpace + j * (cellSpace + cellSideLength);
}


function showMoveAnimation(formX, fromY, toX, toY) {
    var numberCell = $('#number-cell-' + formX + '-' + fromY);
    numberCell.animate({
        top: getPosTop(toX, toY),
        left: getPosLeft(toX, toY)
    }, 200);
}
function updateScore(score) {
    $("#score").text(score);
}
function moveLeft() {
    if (canMoveLeft(board)) {
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 0; k < j; k++) {
                        if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if (board[i][k] == board[i][j] && !hasConflicte[i][k] && noBlockHorizontal(i, k, j, board)) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add
                            board[i][k] = board[i][j] + board[i][k];
                            board[i][j] = 0;
                            score += board[i][k];
                            updateScore(score);
                            hasConflicte[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout('updateBoardView()', 300);
        return true;
    } else {
        return false;
    }
}

function moveUp() {
    if (canMoveUp(board)) {
        for (var col = 0; col < 4; col++) {
            for (var row = 1; row < 4; row++) {
                if (board[row][col] != 0) {
                    for (var k = 0; k < row; k++) {
                        if (board[k][col] == 0 && noBlockVertical(col, k, row, board)) {
                            showMoveAnimation(row, col, k, col);
                            board[k][col] = board[row][col];
                            board[row][col] = 0;
                            continue;
                        } else if (board[k][col] == board[row][col] && noBlockVertical(col, k, row, board) && !hasConflicte[k][col]) {
                            showMoveAnimation(row, col, k, col);
                            board[k][col] = board[row][col] + board[k][col];
                            board[row][col] = 0;
                            score += board[k][col];
                            updateScore(score);
                            hasConflicte[k][col] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout('updateBoardView()', 300);
        return true;
    } else {
        return false;
    }
}
function moveDown() {
    if (canMoveDown(board)) {
        for (var col = 0; col < 4; col++) {
            for (var row = 2; row >= 0; row--) {
                if (board[row][col] != 0) {
                    for (var k = 3; k > row; k--) {
                        if (board[k][col] == 0 && noBlockVertical(col, row, k, board)) {
                            showMoveAnimation(row, col, k, col);
                            board[k][col] = board[row][col];
                            board[row][col] = 0;
                            continue;
                        } else if (board[k][col] == board[row][col] && noBlockVertical(col, row, k, board) && !hasConflicte[k][col]) {
                            showMoveAnimation(row, col, k, col);
                            board[k][col] = board[row][col] + board[k][col];
                            board[row][col] = 0;
                            score += board[k][col];
                            updateScore(score);
                            hasConflicte[k][col] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout('updateBoardView()', 300);
        return true;
    } else {
        return false;
    }
}
function moveRight() {
    if (canMoveRight(board)) {
        for (var row = 0; row < 4; row++) {
            for (var col = 2; col >= 0; col--) {
                if (board[row][col] != 0) {
                    for (var k = 3; k > col; k--) {
                        if (board[row][k] == 0 && noBlockHorizontal(row, col, k, board)) {
                            //move
                            showMoveAnimation(row, col, row, k);
                            board[row][k] = board[row][col];
                            board[row][col] = 0;
                            continue;
                        }
                        else if (board[row][k] == board[row][col] && noBlockHorizontal(row, col, k, board) && !hasConflicte[row][k]) {
                            //move
                            showMoveAnimation(row, col, row, k);
                            //add
                            board[row][k] = board[row][col] + board[row][k];
                            board[row][col] = 0;
                            score += board[row][k];
                            updateScore(score);
                            hasConflicte[k][col] = true;
                            continue;
                        }
                    }
                }
            }
        }

        setTimeout('updateBoardView()', 300);
        return true;
    } else {
        return false;
    }
}
function gameOver() {
    alert('game Over!')
}
function isGameOver() {
    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}
function noMove(board) {
    if (canMoveRight(board) || canMoveDown(board) || canMoveLeft(board) || canMoveUp(board)) {
        return false;
    }
    return true;
}
function getNumberBackgroundColor(number) {
    switch (number) {
        case 2:
            return '#eee4da';
            break;
        case 4:
            return '#ede0c8';
            break;
        case 8:
            return '#f2b179';
            break;
        case 16:
            return '#f59563';
            break;
        case 32:
            return '#f67c5f';
            break;
        case 64:
            return '#f65e3b';
            break;
        case 128:
            return '#edcf72';
            break;
        case 256:
            return '#edcc61';
            break;
        case 512:
            return '#9c0';
            break;
        case 1024:
            return '#33b5e5';
            break;
        case 2048:
            return '#09c';
            break;
        case 4096:
            return '#a6c';
            break;
        case 8192:
            return '#93c';
            break;
    }
    return 'black';
}
function getNumberColor(number) {
    if (number <= 4) {
        return '#776e65';
    }
    return 'white';
}
function canMoveUp(board) {
    for (var col = 0; col < 4; col++) {
        for (var row = 1; row < 4; row++) {
            if (board[row][col] != 0 && (board[row - 1][col] == 0 || board[row - 1][col] == board[row][col])) {
                return true;
            }
        }
    }
    return false;
}
function canMoveDown(board) {
    for (var col = 0; col < 4; col++) {
        for (var row = 0; row < 3; row++) {
            if (board[row][col] != 0 && (board[row + 1][col] == 0 || board[row + 1][col] == board[row][col])) {
                return true;
            }
        }
    }
    return false;
}
function canMoveRight(board) {
    for (var row = 0; row < 4; row++) {
        for (var col = 2; col >= 0; col--) {
            if (board[row][col] != 0 && (board[row][col + 1] == 0 || board[row][col + 1] == board[row][col])) {
                return true;
            }
        }
    }
    return false;
}
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0 && (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])) {
                return true;
            }
        }
    }
    return false;
}
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) {
            return false;
        }
    }
    return true;
}
function noBlockVertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) {
            return false;
        }
    }
    return true;
}
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37://left
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            event.preventDefault();
            break;
        case 38://up
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            event.preventDefault();
            break;
        case 39://right
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            event.preventDefault();
            break;
        case 40://down
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            event.preventDefault();
            break;
        default :
            break;
    }
});
document.addEventListener('touchstart', function (event) {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});
document.addEventListener('touchmove', function (event) {
    event.preventDefault();
});
document.addEventListener('touchend', function (event) {
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;
    var deltaX = endX - startX;
    var deltaY = endY - startY;
    if(Math.abs(deltaX) < 0.2 * documentWidth && Math.abs(deltaY) < 0.3 * documentWidth){
        return;
    }

    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        if (deltaX > 0) {
            //moveRight
            if (moveRight()) {
                setTimeout('generateOneNumber()', 310);
                setTimeout('isGameOver()', 400);
            }
        } else {
            //moveLeft
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 310);
                setTimeout('isGameOver()', 400);
            }
        }
    } else {
        if (deltaY > 0) {
            //moveDown
             if (moveDown()) {
                setTimeout('generateOneNumber()', 310);
                setTimeout('isGameOver()', 400);
            }
        } else {
            //moveUp
            if (moveUp()) {
                setTimeout('generateOneNumber()', 310);
                setTimeout('isGameOver()', 400);
            }
        }
    }
});