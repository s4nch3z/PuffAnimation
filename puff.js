/**
* The MIT License (MIT)
* 
* Copyright (c) 2011 Alexander Prokopyev
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var puff = function(settings) {
    var param = {
         fps: 30,
         densityK: 30000,
         rMin: 4,
         rMax: 125,
         rVelMax: 0.05,
         opacityMin: 0,
         opacityMax: 1,
         blurHorizonMin: 0.7,
         blurHorizonMax: 0.9,
         blurHorizonOpacity: 0.8,
         blurOpacityMax: 0.5,
         circleColor: "#FFFFFF",
         backgroundColor: "#0AC3DA"
    };

    if (typeof(settings) !== 'undefined' && settings !== null && settings !== '') {
        param = JSON.parse(settings);
    }

    var then = Date.now(),
        interval = 1000 / param.fps,
        num = Math.ceil(screen.width * screen.height / param.densityK),
        circles = null,
        canvas = null,
        context = null,
        animating = false;

    /**
     * @constructor
     */
    var circle = function(x, y, r, rVel, opacity, color) {
        var that = this;
        that.x = x;
        that.y = y;
        that.r = r;
        that.rVel = rVel;
        that.opacity = param.opacityMin;
        if (randomFromTo(0, 4) == 0) {
            that.blur = true;
            that.opacityMax = param.blurOpacityMax;
            that.color0 = color;
            that.color1 = RGBtoRGBA(color, param.blurHorizonOpacity);
            that.color2 = RGBtoRGBA(color, 0);
            that.blurHorizon = randomFromToFloat(param.blurHorizonMin, param.blurHorizonMax);
        } else {
            that.blur = false;
            that.opacityMax = opacity;
            that.color = color;
        }
        that.goingUp = true;
    };

    var randomFromTo = function(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    };

    var randomFromToFloat = function(from, to) {
        return (Math.random() * (to - from) + from);
    };

    var generateObject = function() {
        return new circle(
            randomFromTo(0, screen.width),
            randomFromTo(0, screen.height),
            randomFromTo(param.rMin, param.rMax),
            randomFromToFloat(0, param.rVelMax),
            randomFromToFloat(param.opacityMin, param.opacityMax),
            param.circleColor
        );
    };

    var initObjects = function() {
        circles = [];
        for(var n = 0; n < num; n++) {
            circles.push(generateObject());
        }
    };

    var updateObjects = function() {
        for (var n = 0; n < num; n++) {
            circles[n].r += circles[n].rVel;
            if (circles[n].goingUp) {
                circles[n].opacity += 0.01;
            } else {
                circles[n].opacity -= 0.01;
            }
            if (circles[n].opacity > circles[n].opacityMax) {
                circles[n].goingUp = false;
            }
            if (circles[n].opacity < param.opacityMin) {
                circles[n].goingUp = true;
                circles[n] = generateObject();
            }
        }
    };

    var canvasSupport = function() {
        return !!document.createElement('canvas').getContext;
    };

    var RGBtoRGBA = function(c, a){
        c = c.replace(/^\s*#|\s*$/g, '');
        if (c.length == 3) {
            c = c.replace(/(.)/g, '$1$1');
        }
        var g = parseInt(c.substr(2, 2), 16).toString();
        var b = parseInt(c.substr(4, 2), 16).toString();
        var r = parseInt(c.substr(0, 2), 16).toString();

        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    };

    var startAnimation = function() {
        if (circles.length > 0) {
            animating = true;
            if (drawFrame !== undefined) {
                drawFrame();
            }
            animationLoop();
        }
    };

    var stopAnimation = function() {
        animating = false;
    };

    var animationLoop = function(){
        var now = Date.now();
        var delta = now - then;
        if (delta > interval) {
            then = now - (delta % interval);
            drawFrame();
        }
        if (animating) {
            requestAnimFrame(function(){
                animationLoop();
            });
        }
    };

    var drawFrame = function() {
        updateObjects();
        canvas.width = canvas.width;
        context.fillStyle = param.backgroundColor;
        context.globalAlpha = 1;
        context.fillRect(0, 0, screen.width, screen.height);
        for (var n = 0; n < num; n++) {
            context.beginPath();
            context.globalAlpha = circles[n].opacity;
            if (circles[n].blur) {
                var radgrad = context.createRadialGradient(circles[n].x, circles[n].y, 0, circles[n].x, circles[n].y, circles[n].r);
                radgrad.addColorStop(0, circles[n].color0);
                radgrad.addColorStop(circles[n].blurHorizon, circles[n].color1);
                radgrad.addColorStop(1, circles[n].color2);
                context.fillStyle = radgrad;
                context.fillRect(circles[n].x - circles[n].r, circles[n].y - circles[n].r, circles[n].r + circles[n].r, circles[n].r + circles[n].r);
            } else {
                context.fillStyle = circles[n].color;
                context.arc(circles[n].x, circles[n].y, circles[n].r, 0, Math.PI + Math.PI, false);
                context.fill();
            }
        }
    };

    var requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 30);
            };
    })(null);

    if (canvasSupport()) {
        if(typeof(Storage)!== 'undefined' && typeof(sessionStorage.puff) !== 'undefined'
            && sessionStorage.puff !== null && sessionStorage.puff !== ''
            && sessionStorage.puff !== 'null' && sessionStorage.puff !== 'undefined') {
            circles = JSON.parse(sessionStorage.puff);
            num = circles.length;
        } else {
            initObjects();
        }
        window.onbeforeunload = function() {
            if(typeof(Storage) !== 'undefined' && typeof(circles) !== 'undefined'
                && circles !== null && circles.length > 0) {
                sessionStorage.puff = JSON.stringify(circles);
            }
        };
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', screen.width.toString());
        canvas.setAttribute('height', screen.height.toString());
        canvas.setAttribute('style', 'display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; z-index: -2147483648 !important; visibility: visible !important; border: none !important; outline: none !important; margin: 0 !important; padding: 0 !important;');
        document.body.appendChild(canvas);
        context = canvas.getContext('2d');
    } else {
        document.getElementsByTagName('body')[0].style.backgroundColor = param.backgroundColor;
    }

    return {
        startAnimation: startAnimation,
        stopAnimation: stopAnimation
    };
};
