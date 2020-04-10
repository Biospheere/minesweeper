const cellSize = 30;

let cols, rows;

let xOffset, yOffset;

let grid;

const Countable = Object.freeze({'bombs': 1, 'marks': 2});

const Colors = Object.freeze({'darkGrey': '#181f1e', 'lightGrey': '#263534', 'turquoise': '#00cc66', 'red': '#fe346e'});

let running = false;
let startTime, endTime;

let regularFont, boldFont;
function preload() {
    regularFont = loadFont('assets/IBMPlexMono-Regular.ttf');
    boldFont = loadFont('assets/IBMPlexMono-Bold.ttf');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('display', 'block');

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
    // Background color
    background(Colors.darkGrey);

    // 404 background
    const text404 = '404';
    const centerX = width / 2, centerY = yOffset - height / 6;
    const fontSize = floor(cellSize * 1.5);
    const bounds = boldFont.textBounds(text404, centerX, centerY, fontSize);
    noStroke();
    fill(Colors.turquoise);
    const padding = floor(cellSize / 10.0);
    rect(bounds.x - padding, bounds.y - padding, bounds.w + 2 * padding, bounds.h + 2 * padding);

    // 404 text
    fill(Colors.darkGrey);
    textFont(boldFont);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    text(text404, centerX, centerY - bounds.h / 2);

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

    // show amount of bombs left
    const bombsLeftString = getBombsLeftAmount().toString();
    for (let i = 0; i < bombsLeftString.length; i++) {
        const bombsLeftLetter = bombsLeftString[i];
        const x = xOffset + i * cellSize;
        const y = yOffset - 2 * cellSize;
        showInfoBox(x, y, cellSize, bombsLeftLetter)
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
    for (let i = 0; i < timePassedString.length; i++) {
        const timePassedLetter = timePassedString[i];
        const x = width - xOffset - (timePassedString.length - i) * cellSize;
        const y = yOffset - 2 * cellSize;
        showInfoBox(x, y, cellSize, timePassedLetter)
    }

    // Cells
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
}

// Prevent context menu from appearing
document.oncontextmenu = function (event) {
    event.preventDefault();
};

// Mouse press LEFT reveals a Cell if it's not a bomb, RIGHT marks a Cell
function mousePressed() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                if (!running) {
                    running = true;
                    startTime = +new Date();
                }

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
