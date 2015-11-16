var _this = this;
;
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !_this.requestAnimationFrame; ++x) {
        _this.requestAnimationFrame = _this[vendors[x] + 'RequestAnimationFrame'];
        _this.cancelAnimationFrame = _this[vendors[x] + 'CancelAnimationFrame'] ||
            _this[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!_this.requestAnimationFrame)
        _this.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = _this.setTimeout(function () { return callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!_this.cancelAnimationFrame) {
        _this.cancelAnimationFrame = function (id) { return clearTimeout(id); };
    }
})();
