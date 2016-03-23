var toRelativeUnit = function (n, ratio) {
    return Math.floor(n / ratio);
};
var toPixel = function (n, ratio) {
    return n * ratio;
};
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.toRelativeUnit = function (ratio) {
        return {
            x: Math.floor(this.x / ratio),
            y: Math.floor(this.y / ratio)
        };
    };
    Point.prototype.add = function (p) {
        this.x = this.x + p.x;
        this.y = this.y + p.y;
    };
    return Point;
})();
var Cell = (function () {
    function Cell(x, y, color, grid) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.grid = grid;
        this.draw();
    }
    Cell.prototype.draw = function () {
        var ctx = this.grid.ctx, size = this.grid.cellSize, x = toPixel(this.x, size) + 1, y = toPixel(this.y, size) + 1;
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
        this.scaleOpt = {};
        this.cellSize = Math.round(this.scale * 5);
        this.wCells = conf.ratio[0];
        this.hCells = conf.ratio[1];
        this.zp = new Point(0, 0); // zero point - begin of ctx
        this.mode = 'draw';
        this.cells = new Array(this.wCells * this.hCells);
        this.events = {
            mouseup: function (e) { return _this.handleMouseUp(e); },
            mousedown: function (e) { return _this.handleMouseDown(e); },
            mousemove: function (e) { return _this.handleMouseMove(e); },
            touchstart: function (e) { return _this.handleTouchStart(e); },
            touchend: function (e) { return _this.handleTouchEnd(e); },
            touchmove: function (e) { return _this.handleTouchMove(e); },
            mousewheel: function (e) { return _this.handleZoom(e); },
            wheel: function (e) { return _this.handleZoom(e); },
            scroll: function (e) { return _this.handleZoom(e); }
        };
        this.draw();
        // setup events
        for (var e in this.events) {
            this.canvas.addEventListener(e, this.events[e]);
        }
    }
    Grid.prototype.draw = function () {
        var size = this.cellSize, gridWidth = toPixel(this.wCells, size), gridHeight = toPixel(this.hCells, size), zp = this.zp, ctx = this.ctx, begin = new Point(Math.max(0, zp.x % size - zp.x - size), Math.max(0, zp.y % size - zp.y - size)), end = new Point(Math.min(this.canvas.width - zp.x, gridWidth), Math.min(this.canvas.height - zp.y, gridHeight)), _begin = begin.toRelativeUnit(size), _end = end.toRelativeUnit(size);
        ctx.strokeStyle = 'lightgray';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var x = begin.x + 0.5; x <= end.x + 1; x += size) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, end.y);
        }
        for (var y = begin.y + 0.5; y <= end.y + 1; y += size) {
            ctx.moveTo(0, y);
            ctx.lineTo(end.x, y);
        }
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var x = begin.x; x <= end.x + 1; x += size) {
            if (!(x % (10 * size))) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, end.y);
            }
        }
        for (var y = begin.y; y <= end.y + 1; y += size) {
            if (!(y % (10 * size))) {
                ctx.moveTo(0, y);
                ctx.lineTo(end.x, y);
            }
        }
        ctx.stroke();
        for (var x = _begin.x, cell = void 0; x <= _end.x; x++) {
            for (var y = _begin.y; y <= _end.y; y++) {
                cell = this.cells[x + this.wCells * y];
                if (cell)
                    cell.draw();
            }
        }
    };
    Grid.prototype.setCell = function (pt, color) {
        var i = pt.x + this.wCells * pt.y;
        if (!this.cells[i]) {
            this.cells[i] = new Cell(pt.x, pt.y, color, this);
        }
        else {
            this.cells[i].setColor(color);
        }
    };
    Grid.prototype.getCell = function (x, y) {
        return this.cells[x + this.wCells * y];
    };
    Grid.prototype.zoom = function (focus, factor) {
        var oldSize = this.cellSize;
        this.scale = +Math.max(1, this.scale * factor).toFixed(2);
        this.cellSize = Math.round(this.scale * 5);
        if (this.scale >= 1) {
            var k = 1 - this.cellSize / oldSize;
            this.moveTo(Math.round((focus.x - this.zp.x) * k), Math.round((focus.y - this.zp.y) * k));
        }
        // $config[2].value = this.scale;
    };
    Grid.prototype.moveTo = function (x, y) {
        this.zp.x += x;
        this.zp.y += y;
        this.ctx.translate(x, y);
        this.redraw();
    };
    Grid.prototype.getScale = function () {
        return this.scale;
    };
    Grid.prototype.clearGrid = function () {
        var begin = new Point(0 - this.zp.x, 0 - this.zp.y), end = new Point(this.canvas.width, this.canvas.height);
        this.ctx.clearRect(begin.x, begin.y, end.x, end.y);
    };
    Grid.prototype.redraw = function () {
        this.clearGrid();
        this.draw();
    };
    Grid.prototype.inGrid = function (pt) {
        return pt.x >= 0 &&
            pt.x < this.wCells &&
            pt.y >= 0 &&
            pt.y < this.hCells;
    };
    Grid.prototype.resize = function (width, height) {
        this.ctx.translate(-this.zp.x, -this.zp.y);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.translate(this.zp.x, this.zp.y);
        this.redraw();
    };
    Grid.prototype.update = function (conf) {
        this.scale = conf.scale || this.scale;
        this.ctx = this.canvas.getContext('2d');
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
    // event hendlers
    Grid.prototype.handleMouseUp = function (e) {
        e.preventDefault();
        if (this.mode === 'draw') {
            var pt = new Point(e.clientX - this.zp.x, e.clientY - this.zp.y).toRelativeUnit(this.cellSize);
            if (this.inGrid(pt)) {
                this.setCell(pt, $colorpicker && $colorpicker.value || 'black');
            }
        }
        this.moveStart = null;
    };
    Grid.prototype.handleMouseDown = function (e) {
        var _this = this;
        e.preventDefault();
        this.moveStart = { x: e.clientX, y: e.clientY };
        var moveEnd = { x: e.clientX, y: e.clientY }, move = function () {
            if (_this.moveStart) {
                var deltaX = _this.moveStart.x - moveEnd.x, deltaY = _this.moveStart.y - moveEnd.y;
                if (deltaX || deltaY)
                    _this.moveTo(deltaX, deltaY);
                moveEnd = { x: _this.moveStart.x, y: _this.moveStart.y };
                requestAnimationFrame(move);
            }
        };
        move();
    };
    Grid.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        if (this.moveStart) {
            var pt = new Point(e.clientX - this.zp.x, e.clientY - this.zp.y).toRelativeUnit(this.cellSize);
            if (this.mode === 'draw' && this.inGrid(pt)) {
                this.setCell(pt, $colorpicker && $colorpicker.value || 'black');
            }
            else if (this.mode === 'move') {
                this.moveStart = { x: e.clientX, y: e.clientY };
            }
        }
    };
    Grid.prototype.handleTouchStart = function (e) {
        var _this = this;
        var touch = e.touches && e.touches.length <= 2 ?
            e.touches[0] : null;
        if (touch) {
            var touchPoint = new Point(touch.clientX, touch.clientY);
            this.moveStart = touchPoint;
            if (this.inGrid(touchPoint)) {
                this.setCell(touchPoint, $colorpicker && $colorpicker.value || 'black');
            }
        }
        if (this.mode === 'move') {
            var moveEnd = { x: touch.clientX, y: touch.clientY }, newDist;
            if (e.touches.length == 2) {
                var t1 = new Point(e.touches[0].clientX, e.touches[0].clientY), t2 = new Point(e.touches[1].clientX, e.touches[1].clientY);
                this.scaleOpt.dist = newDist = Grid.getDistance(t1, t2);
            }
            var move = function () {
                if (_this.moveStart) {
                    var deltaX = _this.moveStart.x - moveEnd.x, deltaY = _this.moveStart.y - moveEnd.y;
                    if (deltaX || deltaY)
                        _this.moveTo(deltaX, deltaY);
                    moveEnd = { x: _this.moveStart.x, y: _this.moveStart.y };
                    if (newDist) {
                        var factor = +(_this.scaleOpt.dist / newDist).toFixed(2);
                        _this.zoom(_this.scaleOpt.focus, factor);
                        newDist = _this.scaleOpt.dist;
                    }
                    requestAnimationFrame(move);
                }
            };
            move();
        }
    };
    Grid.prototype.handleTouchEnd = function (e) {
        this.moveStart = null;
    };
    Grid.prototype.handleTouchMove = function (e) {
        e.preventDefault();
        var touch = e.touches && e.touches.length <= 2 ?
            e.touches[0] : null;
        if (touch) {
            var pt = new Point(touch.clientX - this.zp.x, touch.clientY - this.zp.y).toRelativeUnit(this.cellSize);
            if (this.mode === 'draw' && this.inGrid(pt)) {
                this.setCell(pt, $colorpicker && $colorpicker.value || 'black');
            }
            else if (this.mode === 'move' && this.moveStart) {
                this.moveStart = { x: touch.clientX, y: touch.clientY };
            }
        }
        if (e.touches.length == 2) {
            var t1 = new Point(e.touches[0].clientX, e.touches[0].clientY), t2 = new Point(e.touches[1].clientX, e.touches[1].clientY);
            this.scaleOpt = {
                dist: Grid.getDistance(t1, t2),
                focus: Grid.getMidpoint(t1, t2)
            };
        }
    };
    Grid.prototype.handleZoom = function (e) {
        var factor = e.deltaY < 0 ? 1.25 : .8, pt = {
            x: e.clientX,
            y: e.clientY
        };
        this.zoom(pt, factor);
    };
    Grid.getDistance = function (p1, p2) {
        return +Math.sqrt(Math.pow(p1.x - p2.x, 2) +
            Math.pow(p1.y - p2.y, 2)).toFixed();
    };
    Grid.getMidpoint = function (p1, p2) {
        return new Point(Math.min(p1.x, p2.x) + Math.abs(p1.x - p2.x) / 2, Math.min(p1.y, p2.y) + Math.abs(p1.y - p2.y) / 2);
    };
    return Grid;
})();
var $canvas = document.querySelector("#canvas");
var $colorpicker = document.querySelector("#colorpicker");
var $btns = document.querySelectorAll(".actions button");
var $config = document.querySelectorAll(".config input");
// var $resetBtn = <any>document.querySelector("#reset");
$canvas.width = window.innerWidth;
$canvas.height = window.innerHeight;
var grid = new Grid({
    canvas: $canvas,
    ratio: [500, 500],
    scale: 3
});
Array.prototype.forEach.call($btns, function (el) {
    el.addEventListener('click', handleClickActionsBtn);
});
// $resetBtn.addEventListener('click', (e) => {
//     grid.update({
//         ratio: [
//             +$config[0].value,
//             +$config[1].value
//         ],
//         scale: +$config[2].value
//     })
// })
document.addEventListener('keyup', function (e) {
    e.preventDefault();
    // console.log(e.which);
    if (e.which === 17) {
        grid.mode = 'draw';
        $canvas.style.cursor = 'default';
        $btns[0].classList.add('selected');
        $btns[1].classList.remove('selected');
    }
    if (e.altKey && e.ctrlKey) {
        if (e.which === 68 || e.which === 17) {
            grid.mode = 'draw';
            $canvas.style.cursor = 'default';
            $btns[0].classList.add('selected');
            $btns[1].classList.remove('selected');
        }
        if (e.which === 77) {
            grid.mode = 'move';
            $canvas.style.cursor = 'move';
            $btns[1].classList.add('selected');
            $btns[0].classList.remove('selected');
        }
    }
});
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey) {
        grid.mode = 'move';
        $canvas.style.cursor = 'move';
        $btns[1].classList.add('selected');
        $btns[0].classList.remove('selected');
    }
});
var resizedFinished;
window.addEventListener('resize', function (e) {
    clearTimeout(resizedFinished);
    resizedFinished = setTimeout(function () {
        grid.resize(window.innerWidth, window.innerHeight);
    }, 250);
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
