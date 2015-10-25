var toRelativeUnit = function (n, ratio) {
    return Math.floor(n / ratio);
};
var toPixel = function (n, ratio) {
    return n * ratio;
};
var Cell = (function () {
    function Cell(x, y, color, grid) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.grid = grid;
    }
    Cell.prototype.draw = function () {
        var ctx = grid.ctx, size = grid.cellSize, x = toPixel(this.x, size) + 1, y = toPixel(this.y, size) + 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, size - 1, size - 1);
    };
    Cell.prototype.setColor = function (color) {
        this.color = color;
        this.draw();
    };
    return Cell;
})();
var Grid = (function () {
    function Grid(conf) {
        var _this = this;
        this.canvas = conf.canvas;
        this.ctx = conf.canvas.getContext('2d');
        this.scale = conf.scale;
        this.cellSize = Math.floor(this.scale * 5);
        this.wCells = conf.ratio[0];
        this.hCells = conf.ratio[1];
        this.zp = { x: 0, y: 0 };
        this.mode = 'draw';
        this.cells = new Array(this.wCells * this.hCells);
        this.draw();
        // events
        this.canvas.addEventListener('mouseup', function (e) { return _this.handleMouseUp(e); });
        this.canvas.addEventListener('mousedown', function (e) { return _this.handleMouseDown(e); });
        this.canvas.addEventListener('mousemove', function (e) { return _this.handleMouseMove(e); });
        this.canvas.addEventListener('mousewheel', function (e) { return _this.handleScroll(e); });
    }
    Grid.transformedPoint = function (x, y) {
        return { x: x, y: y };
    };
    Grid.prototype.draw = function () {
        var width = toPixel(this.wCells, this.cellSize), height = toPixel(this.hCells, this.cellSize), size = this.cellSize, x, y;
        this.ctx.beginPath();
        for (x = 0.5; x < width + size; x += size) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
        }
        for (y = 0.5; y < height + size; y += size) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
        }
        this.ctx.strokeStyle = 'lightgray';
        this.ctx.stroke();
        this.cells.forEach(function (cell) {
            if (cell)
                cell.draw();
        });
    };
    Grid.prototype.setCell = function (x, y, color) {
        if (!this.cells[x + this.wCells * y]) {
            this.cells[x + this.wCells * y] = new Cell(x, y, color, this);
        }
        else {
            this.cells[x + this.wCells * y].setColor(color);
        }
        this.redraw();
    };
    Grid.prototype.getCell = function (x, y) {
        return this.cells[x + this.wCells * y];
    };
    Grid.prototype.zoom = function (pt, zoomDirection) {
        var delta = zoomDirection ? 0.25 : -0.25;
        this.scale += delta;
        this.scale = Math.max(1, this.scale);
        this.cellSize = Math.floor(this.scale * 5);
        this.redraw();
    };
    Grid.prototype.drag = function (e) {
        if (this.dragStart) {
            // console.log(e.offsetX - this.dragStart.x, e.offsetY - this.dragStart.y);
            // this.zp.x += e.offsetX - this.dragStart.x;
            // this.zp.y += e.offsetY - this.dragStart.y;
            this.zp.x += e.movementX;
            this.zp.y += e.movementY;
            // console.log(this.zp);
            this.clearGrid();
            this.ctx.translate(e.movementX, e.movementY);
            // console.log(e);
            this.redraw();
        }
    };
    Grid.prototype.getScale = function () {
        return this.scale;
    };
    Grid.prototype.clearGrid = function () {
        this.ctx.clearRect(0 - this.zp.x, 0 - this.zp.y, this.canvas.width, this.canvas.height);
    };
    Grid.prototype.redraw = function () {
        this.clearGrid();
        this.draw();
    };
    Grid.prototype.inGrid = function (x, y) {
        return x >= 0 &&
            x < this.wCells &&
            y >= 0 &&
            y < this.hCells;
    };
    // event hendlers
    Grid.prototype.handleMouseUp = function (e) {
        var x, y;
        if (this.mode === 'draw') {
            x = toRelativeUnit(e.offsetX - this.zp.x, this.cellSize);
            y = toRelativeUnit(e.offsetY - this.zp.y, this.cellSize);
            if (this.inGrid(x, y)) {
                this.setCell(x, y, colorpicker.value);
            }
        }
        else {
            this.dragStart = null;
        }
        return e.preventDefault() && false;
    };
    Grid.prototype.handleMouseDown = function (e) {
        if (this.mode === 'move') {
            this.dragStart = { x: e.offsetX, y: e.offsetY };
        }
    };
    Grid.prototype.handleMouseMove = function (e) {
        if (e.which === 1) {
            if (this.mode === 'draw') {
                this.handleMouseUp(e);
            }
            else {
                this.drag(e);
            }
        }
    };
    Grid.prototype.handleScroll = function (e) {
        var pt = {
            x: e.offsetX,
            y: e.offsetY
        };
        this.zoom(pt, e.wheelDelta > 0);
    };
    return Grid;
})();
var canvas = document.querySelector("#canvas");
var colorpicker = document.querySelector("#colorpicker");
var $btns = document.querySelectorAll(".actions button");
var grid = new Grid({
    canvas: canvas,
    ratio: [70, 60],
    scale: 1.5
});
Array.prototype.forEach.call($btns, function (el) {
    el.addEventListener('click', handleClickActionsBtn);
});
document.addEventListener('keyup', function (e) {
    e.preventDefault();
    if (e.altKey && e.ctrlKey) {
        if (e.which === 68) {
            grid.mode = 'draw';
            canvas.style.cursor = 'default';
            $btns[0].classList.add('selected');
            $btns[1].classList.remove('selected');
        }
        if (e.which === 77) {
            grid.mode = 'move';
            canvas.style.cursor = 'move';
            $btns[1].classList.add('selected');
            $btns[0].classList.remove('selected');
        }
    }
});
function handleClickActionsBtn(e) {
    grid.mode = e.currentTarget.id;
    if (!hasClass(e.currentTarget, 'selected')) {
        grid.mode = e.currentTarget.id;
        // console.log(grid.mode);
        toggleClass($btns, 'selected');
    }
}
function toggleClass(elements, cls) {
    Array.prototype.forEach.call(elements, function (el) {
        if (hasClass(el, cls)) {
            el.classList.remove(cls);
        }
        else {
            el.classList.add(cls);
        }
    });
}
function hasClass(el, cls) {
    return Array.prototype.indexOf.call(el.classList, cls) > -1;
}
