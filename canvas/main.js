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
        this.cellSize = Math.round(this.scale * 5);
        this.wCells = conf.ratio[0];
        this.hCells = conf.ratio[1];
        this.zp = { x: 0, y: 0 }; // zero point - begin of ctx
        this.mode = 'draw';
        this.cells = new Array(this.wCells * this.hCells);
        this.events = {
            mouseup: function (e) { return _this.handleMouseUp(e); },
            mousedown: function (e) { return _this.handleMouseDown(e); },
            mousemove: function (e) { return _this.handleMouseMove(e); },
            mousewheel: function (e) { return _this.handleScroll(e); }
        };
        this.draw();
        // events
        for (var e in this.events) {
            this.canvas.addEventListener(e, this.events[e]);
        }
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
        var delta = zoomDirection ? 1.25 : .8;
        var oldSize = this.cellSize;
        this.scale = +Math.max(1, this.scale * delta).toFixed(1);
        this.cellSize = Math.round(this.scale * 5);
        if (this.scale >= 1) {
            this.moveStart = true;
            this.move(Math.round((pt.x - this.zp.x) * (1 - this.cellSize / oldSize)), Math.round((pt.y - this.zp.y) * (1 - this.cellSize / oldSize)));
            this.moveStart = null;
        }
        $config[2].value = this.scale;
    };
    Grid.prototype.move = function (x, y) {
        if (this.moveStart) {
            this.zp.x += x;
            this.zp.y += y;
            this.clearGrid();
            this.ctx.translate(x, y);
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
            this.moveStart = null;
        }
        return e.preventDefault() && false;
    };
    Grid.prototype.handleMouseDown = function (e) {
        if (this.mode === 'move') {
            this.moveStart = { x: e.offsetX, y: e.offsetY };
        }
    };
    Grid.prototype.handleMouseMove = function (e) {
        if (e.which === 1) {
            if (this.mode === 'draw') {
                this.handleMouseUp(e);
            }
            else {
                this.move(e.movementX, e.movementY);
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
    Grid.prototype.update = function (conf) {
        this.scale = conf.scale || this.scale;
        this.cellSize = Math.round(this.scale * 5);
        this.wCells = conf.ratio[0];
        this.hCells = conf.ratio[1];
        this.cells = new Array(this.wCells * this.hCells);
        this.clearGrid();
        this.ctx.translate(-this.zp.x, -this.zp.y);
        this.zp.x = 0;
        this.zp.y = 0;
        this.redraw();
    };
    Grid.prototype.destroy = function () {
        this.clearGrid();
        this.cells.length = 0;
        this.ctx.translate(-this.zp.x, -this.zp.y);
        for (var e in this.events) {
            this.canvas.removeEventListener(e, this.events[e]);
        }
    };
    return Grid;
})();
var canvas = document.querySelector("#canvas");
var colorpicker = document.querySelector("#colorpicker");
var $btns = document.querySelectorAll(".actions button");
var $config = document.querySelectorAll(".config input");
var $resetBtn = document.querySelector("#reset");
var grid = new Grid({
    canvas: canvas,
    ratio: [
        +$config[0].value,
        +$config[1].value
    ],
    scale: +$config[2].value
});
Array.prototype.forEach.call($btns, function (el) {
    el.addEventListener('click', handleClickActionsBtn);
});
$resetBtn.addEventListener('click', function (e) {
    grid.update({
        ratio: [
            +$config[0].value,
            +$config[1].value
        ],
        scale: +$config[2].value
    });
});
document.addEventListener('keyup', function (e) {
    e.preventDefault();
    // console.log(e.which);
    if (e.which === 17) {
        grid.mode = 'draw';
        canvas.style.cursor = 'default';
        $btns[0].classList.add('selected');
        $btns[1].classList.remove('selected');
    }
    if (e.altKey && e.ctrlKey) {
        if (e.which === 68 || e.which === 17) {
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
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey) {
        grid.mode = 'move';
        canvas.style.cursor = 'move';
        $btns[1].classList.add('selected');
        $btns[0].classList.remove('selected');
    }
});
function handleClickActionsBtn(e) {
    grid.mode = e.currentTarget.id;
    if (!hasClass(e.currentTarget, 'selected')) {
        grid.mode = e.currentTarget.id;
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
