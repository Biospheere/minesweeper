let grid;
let cols;
let rows;

const Countable = Object.freeze({'bombs': 1, 'marks': 2});

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Calculate the amount of cols and rows (fill half the width and height)
    const cellSize = 25;
    cols = floor(width / 2 / cellSize);
    rows = floor(height / 2 / cellSize);

    // Calculate the margin to left and top
    const xOffset = floor((width - (cellSize * cols)) / 2.0);
    const yOffset = floor((height - (cellSize * rows)) / 2.0);

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

// On every frame, render the Cells
function draw() {
    background(255);
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
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
}
