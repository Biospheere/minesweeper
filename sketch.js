const cellSize = 30;

let cols, rows;

let xOffset, yOffset;

let grid;

const Countable = Object.freeze({'bombs': 1, 'marks': 2});

const Colors = Object.freeze({'darkGrey': '#181f1e', 'lightGrey': '#263534', 'turquoise': '#00cc66', 'red': '#fe346e'});

let running = false;
let startTime, endTime;

let clickStarted;
let clickedI, clickedJ;
const longPressDuration = 500; // In milliseconds

let regularFont, boldFont;

function preload() {
    regularFont = loadFont('assets/IBMPlexMono-Regular.ttf');
    boldFont = loadFont('assets/IBMPlexMono-Bold.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Calculate the amount of cols and rows (fill half the width and height)
    cols = floor(width / 2.0 / cellSize);
    rows = floor(height / 2.0 / cellSize);

    // Calculate the margin to left and top
    xOffset = floor((width - (cellSize * cols)) / 2.0);
    yOffset = floor((height - (cellSize * rows)) * 2.0 / 3);

    // Fill the grid with Cells
    grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            const x = xOffset + i * cellSize;
            const y = yOffset + j * cellSize;
            // Probability of a bomb: 20%
            const bomb = Math.random() < 0.2;
            grid[i][j] = new Cell(i, j, x, y, cellSize, bomb);
        }
    }

    // Make "non-bomb" Cells count its neighbor bombs after all Cells have been set
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (!grid[i][j].bomb) {
                grid[i][j].neighborBombCount = grid[i][j].count(Countable.bombs);
            }
        }
    }
}

function windowResized() {
    setup();
    running = false;
    startTime = undefined;
    endTime = undefined;
}

function getBombsLeftAmount() {
    let amount = 0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].bomb && !grid[i][j].marked) {
                amount++;
            }
        }
    }
    return amount;
}

// Renders every frame
function draw() {
    // Check if mouse was long-pressed
    if (clickStarted && +new Date() - clickStarted > longPressDuration) {
        // Reset long-press "measuring"
        clickStarted = undefined;
        // If Cell is not revealed, it can be marked/unmarked
        if (!grid[clickedI][clickedJ].revealed) {
            grid[clickedI][clickedJ].marked = !grid[clickedI][clickedJ].marked;
        }
    }

    // Background color
    background(Colors.darkGrey);

    // 404 background
    const text404 = '404';
    let centerX = width / 2, centerY = yOffset - height / 6;
    let fontSize = floor(cellSize * 1.5);
    const bounds = boldFont.textBounds(text404, centerX, centerY, fontSize);
    noStroke();
    fill(Colors.turquoise);
    const padding = floor(cellSize / 10.0);
    rect(bounds.x - padding, bounds.y - 2 * padding, bounds.w + 2 * padding, bounds.h + 2 * padding);

    // 404 text
    fill(Colors.darkGrey);
    textFont(boldFont);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    text(text404, centerX, centerY - bounds.h / 2);

    // Error messages
    fontSize = floor(cellSize / 2.0);
    centerY1 = yOffset - height / 8;
    centerY2 = centerY1 + floor(1.5 * fontSize);
    fill(Colors.turquoise);
    textFont(regularFont);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    text(errorMessage1, centerX, centerY1);
    text(errorMessage2, centerX, centerY2);

    const showInfoBox = function (x, y, size, letter) {
        // Box
        noStroke();
        fill(Colors.lightGrey);
        const padding = floor(size / 10.0);
        rect(x + padding, y + padding, size - 2 * padding, size - 2 * padding);

        // Digit
        fill(Colors.turquoise);
        const sizeHalf = floor(size / 2.0);
        textFont(regularFont);
        textSize(sizeHalf);
        textAlign(CENTER, CENTER);
        text(letter, x + sizeHalf, y + sizeHalf - padding);
    };

    // show amount of bombs left (only if there is enough space)
    const bombsLeftString = getBombsLeftAmount().toString();
    if (height > 750) {
        for (let i = 0; i < bombsLeftString.length; i++) {
            const bombsLeftLetter = bombsLeftString[i];
            const x = xOffset + i * cellSize;
            const y = yOffset - 2 * cellSize;
            showInfoBox(x, y, cellSize, bombsLeftLetter)
        }
    }

    const millisToString = function (millis) {
        const totalSeconds = floor(millis / 1000.0);

        const minutes = floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const minsString = minutes.toString().length > 1 ? minutes.toString() : '0' + minutes.toString();
        const secsString = seconds.toString().length > 1 ? seconds.toString() : '0' + seconds.toString();

        return minsString + ':' + secsString;
    };

    // show time passed
    const lastTime = running ? +new Date() : endTime;
    const timePassedString = startTime ? millisToString(lastTime - startTime) : '00:00';
    // Only if there is enough space
    if (height > 750 && cols > bombsLeftString.length + timePassedString.length) {
        for (let i = 0; i < timePassedString.length; i++) {
            const timePassedLetter = timePassedString[i];
            const x = width - xOffset - (timePassedString.length - i) * cellSize;
            const y = yOffset - 2 * cellSize;
            showInfoBox(x, y, cellSize, timePassedLetter)
        }
    }

    // Cells
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    // Minesweeper text
    noStroke();
    fill(Colors.turquoise);
    fontSize = floor(cellSize / 1.5);
    centerY = yOffset + (rows + 1) * cellSize;
    textFont(regularFont);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    text('MINESWEEPER', centerX, centerY);
}

// Prevent context menu from appearing within the grid
document.oncontextmenu = function (event) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                event.preventDefault();
                return;
            }
        }
    }
};

// If touch is supported, mouse clicks are sometimes also triggered
// This ugly workaround prevents mouse clicks after touch clicks were recognized
let touchPressed = false, touchReleased = false;

function touchStarted() {
    touchPressed = true;
    performPress();
}

function touchEnd() {
    touchReleased = true;
    performRelease();
}

function mousePressed() {
    // Skips the mouse press after touch start
    if (touchPressed) {
        touchPressed = false;
    } else {
        performPress();
    }
}

function mouseReleased() {
    // Skips the mouse release after touch end
    if (touchReleased) {
        touchReleased = false;
    } else {
        performRelease();
    }
}

// Register every mouse press, so long-presses can be recognized
function performPress() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                if (!running) {
                    running = true;
                    startTime = +new Date();
                }

                clickStarted = +new Date();
                clickedI = i;
                clickedJ = j;
                return;
            }
        }
    }
}

// Mouse press LEFT reveals a Cell (or its neighbors) if it's not a bomb, RIGHT marks a Cell
function performRelease() {
    // If the game is not running anymore or
    // .. if the mouse press time was reset by draw() due to a long-press, ignore the release for further actions
    if (!running || !clickStarted) {
        return;
    }
    clickStarted = undefined;

    // Actual click
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                if (mouseButton === LEFT) {
                    // When left-clicking a marked Cell, nothing happens
                    if (grid[i][j].marked) {
                        return;
                    }

                    // If Cell is a bomb, the game is over
                    if (grid[i][j].bomb) {
                        gameOver();
                        // If Cell is not revealed, reveal it
                    } else if (!grid[i][j].revealed) {
                        grid[i][j].reveal();
                        // If Cell is revealed already, reveal its neighbors
                    } else {
                        // If mark count matches with bomb count but marks have been set incorrectly, the game is over
                        if (!grid[i][j].revealNeighbors()) {
                            gameOver();
                        }
                    }
                } else if (mouseButton === RIGHT) {
                    // If Cell is not revealed, it can be marked/unmarked
                    if (!grid[i][j].revealed) {
                        grid[i][j].marked = !grid[i][j].marked;
                    }
                }
                return;
            }
        }
    }
}

// Game Over reveals all Cells manually
function gameOver() {
    running = false;
    endTime = +new Date();
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
}
