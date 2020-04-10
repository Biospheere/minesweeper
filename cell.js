function Cell(i, j, x, y, size, bomb) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.size = size;

    this.bomb = bomb;
    this.neighborBombCount = -1;
    this.revealed = false;
    this.marked = false;
}

// Returns all neighbors of this Cell
Cell.prototype.getNeighbors = function () {
    const neighbors = [];
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

            neighbors.push(grid[i][j]);
        }
    }
    return neighbors;
};

// Count bombs or marks within the 8 neighbor Cells
Cell.prototype.count = function (countable) {
    let total = 0;
    for (let neighbor of this.getNeighbors()) {
        if (countable === Countable.bombs && neighbor.bomb) {
            total++;
        } else if (countable === Countable.marks && neighbor.marked) {
            total++;
        }
    }
    return total;
};

// Called every frame, paints the "state" of the cell onto the canvas
Cell.prototype.show = function () {
    const showBox = function (x, y, size) {
        noStroke();
        fill(Colors.lightGrey);
        const padding = size / 10;
        rect(x + padding, y + padding, size - 2 * padding, size - 2 * padding);
    };

    const showX = function (x, y, size) {
        stroke(Colors.red);
        noFill();
        line(x + size / 3, y + size / 3, x + size * 2 / 3, y + size * 2 / 3);
        line(x + size * 2 / 3, y + size / 3, x + size / 3, y + size * 2 / 3);
    };

    const showDigit = function (x, y, size, neighborBombCount) {
        noStroke();
        fill(Colors.turquoise);
        textSize(size / 2);
        textAlign(CENTER, CENTER);
        text(neighborBombCount, x + size / 2, y + size / 2);
    };

    if ((this.revealed && this.bomb) || this.marked) {
        showBox(this.x, this.y, this.size);
        showX(this.x, this.y, this.size);
    } else if (!this.revealed) {
        showBox(this.x, this.y, this.size);
    } else if (this.neighborBombCount > 0) {
        showDigit(this.x, this.y, this.size, this.neighborBombCount);
    }
};

// Checks if the given x and y coordinates are within the boundaries of this Cell
Cell.prototype.contains = function (x, y) {
    return x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size;
};

// Reveals the Cell and, if it doesn't have any neighbors, calls the flood-fill function
Cell.prototype.reveal = function () {
    this.revealed = true;
    if (this.neighborBombCount === 0) {
        this.floodFill();
    }
};

// Flood fill algorithm: reveals all neighbor Cells (then they may call flood-fill again)
Cell.prototype.floodFill = function () {
    for (let neighbor of this.getNeighbors()) {
        if (!neighbor.revealed) {
            neighbor.reveal();
        }
    }
};

// Checks if bomb-neighbors were marked correctly
Cell.prototype.neighborMarksCorrect = function () {
    for (let neighbor of this.getNeighbors()) {
        if (neighbor.marked && !neighbor.bomb || !neighbor.marked && neighbor.bomb) {
            return false;
        }
    }
    return true;
};

// If all neighbor bombs have been marked correctly, reveal all neighbor Cells
Cell.prototype.revealNeighbors = function () {
    const markedNeighborsCount = this.count(Countable.marks);
    // If the counts don't match, this function will do nothing and return success
    if (markedNeighborsCount !== this.neighborBombCount) {
        return true;
    }

    // If the counts match but the marks weren't set correctly, return no success
    if (!this.neighborMarksCorrect()) {
        return false;
    }

    // Otherwise, reveal the neighbors that are not already revealed
    for (let neighbor of this.getNeighbors()) {
        if (!neighbor.bomb && !neighbor.revealed) {
            neighbor.reveal();
        }
    }
    return true;
};
