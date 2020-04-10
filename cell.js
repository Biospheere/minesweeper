function Cell(i, j, x, y, size, bomb) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.size = size;

    this.bomb = bomb;
    this.neighborCount = -1;
    this.revealed = false;
    this.marked = false;
}

// Count bombs within the 8 neighbor Cells
Cell.prototype.countBombs = function () {
    let total = 0;
    for (let xoff = -1; xoff <= 1; xoff++) {
        const i = this.i + xoff;
        // Skip if outside the grid
        if (i < 0 || i >= cols) {
            continue;
        }

        for (let yoff = -1; yoff <= 1; yoff++) {
            const j = this.j + yoff;
            // Skip if outside the grid or the Cell itself
            if (j < 0 || j >= rows || (i === 0 && j === 0)) {
                continue;
            }

            if (grid[i][j].bomb) {
                total++;
            }
        }
    }
    this.neighborCount = total;
};

// Called every frame, paints the "state" of the cell onto the canvas
Cell.prototype.show = function () {
    const showBomb = function (x, y, size) {
        // TODO: Set different colors (dark design?)
        fill(127);
        // TODO: Use an image for bombs
        ellipse(x + size * 0.5, y + size * 0.5, size * 0.5);
    };

    const showRevealed = function(x, y, size, neighborCount) {
        fill(200);
        rect(x, y, size, size);
        if (neighborCount > 0) {
            textAlign(CENTER);
            fill(0);
            // TODO: Use a monospace font and adapt the text size to cellSize
            text(neighborCount, x + size * 0.5, y + size - 6);
        }
    };

    stroke(0);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    if (this.revealed) {
        if (this.bomb) {
            showBomb(this.x, this.y, this.size);
        } else {
            showRevealed(this.x, this.y, this.size, this.neighborCount);
        }
    } else if (this.marked) {
        showBomb(this.x, this.y, this.size);
    }
};

// Checks if the given x and y coordinates are within the boundaries of this Cell
Cell.prototype.contains = function (x, y) {
    return x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size;
};

// Reveals the Cell and, if it doesn't have any neighbors, calls the flood-fill function
Cell.prototype.reveal = function () {
    this.revealed = true;
    if (this.neighborCount === 0) {
        this.floodFill();
    }
};

// Flood fill algorithm: reveals all neighbour Cells (then they may call flood-fill again)
Cell.prototype.floodFill = function () {
    for (let xoff = -1; xoff <= 1; xoff++) {
        const i = this.i + xoff;
        // Skip if outside the grid
        if (i < 0 || i >= cols) {
            continue;
        }

        for (let yoff = -1; yoff <= 1; yoff++) {
            const j = this.j + yoff;
            // Skip if outside the grid or the Cell itself
            if (j < 0 || j >= rows || (i === 0 && j === 0)) {
                continue;
            }

            if (!grid[i][j].revealed) {
                grid[i][j].reveal();
            }
        }
    }
};
