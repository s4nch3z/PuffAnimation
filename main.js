/**
 * Created by Alexander Prokopyev.
 * User: Sanchez
 * Date: 6/5/11
 * Time: 1:54 AM
 * To change this template use File | Settings | File Templates.
 */


var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
var densityK = 30000;
var rMin = 4;
var rMax = 125;
var rVelMax = 0.05;
var opacityMin = 0;
var opacityMax = 1;
var blurHorizonMin = 0.7;
var blurHorizonMax = 0.9;
var blurHorizonOpacity = 0.8;
var blurOpacityMax = 0.5;
var viewportWidth  = screen.width;
var viewportHeight = screen.height;
var num = Math.ceil(viewportWidth * viewportHeight / densityK);
var circleColor = '#FFFFFF';
var backgroundColor = '#0AC3DA';
var circles = null;
var radgrad = null;
var background = null;
var canvas = null;


function pageLoaded(){
    if (canvasSupport()) {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'background');
        canvas.setAttribute('width', viewportWidth);
        canvas.setAttribute('height', viewportHeight);
        canvas.setAttribute('class', 'background');
        document.body.appendChild(canvas);
        
        var context = canvas.getContext("2d");

        var scene = new anim('background');

		if(typeof(Storage)!== "undefined" && typeof(localStorage.s4nch3z_me_bg) !== "undefined"
			&& localStorage.s4nch3z_me_bg !== null && localStorage.s4nch3z_me_bg !== ""
			&& localStorage.s4nch3z_me_bg !== "null" && localStorage.s4nch3z_me_bg !== "undefined") {
			circles = JSON.parse(localStorage.s4nch3z_me_bg);
			num = circles.length;
  		} else {
	        initObjects();
	    }
        
        scene.setDrawStage(function(){
            //console.log(kin.getFps());
            updateObjects();
            scene.clear();
            context.fillStyle = backgroundColor;
            context.globalAlpha = 1;
            context.fillRect(0, 0, viewportWidth, viewportHeight);
            for (var n = 0; n < num; n++) {
                context.beginPath();
                context.globalAlpha = circles[n].opacity;
                if (circles[n].blur) {
                    radgrad = context.createRadialGradient(circles[n].x, circles[n].y, 0, circles[n].x, circles[n].y, circles[n].r);
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
        });

        scene.startAnimation();

    } else {
        document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;
    }
}

function Circle(x, y, r, rVel, opacity, color){
    this.x = x;
    this.y = y;
    this.r = r;
    this.rVel = rVel;
    this.opacity = opacityMin;
    if (randomFromTo(0, 4) == 0) {
        this.blur = true;
        this.opacityMax = blurOpacityMax;
        this.color0 = color;
        this.color1 = RGBtoRGBA(color, blurHorizonOpacity);
        this.color2 = RGBtoRGBA(color, 0);
        this.blurHorizon = randomFromToFloat(blurHorizonMin, blurHorizonMax);
    } else {
        this.blur = false;
        this.opacityMax = opacity;
        this.color = color;
    }
    this.goingUp = true;
}

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function randomFromToFloat(from, to){
    return (Math.random() * (to - from) + from);
}

function generateObject(){
    return new Circle(
        randomFromTo(0, viewportWidth),
        randomFromTo(0, viewportHeight),
        randomFromTo(rMin, rMax),
        randomFromToFloat(0, rVelMax),
        randomFromToFloat(opacityMin, opacityMax),
        circleColor
    );
}

function initObjects(){
    circles = [];
    for(var n = 0; n < num; n++) {
        circles.push(generateObject());
    }
}

function updateObjects(){
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
        if (circles[n].opacity < opacityMin) {
            circles[n].goingUp = true;
            circles[n] = generateObject();
        }
    }
}


function canvasSupport() {
  return !!document.createElement('canvas').getContext;
}

function RGBtoRGBA(r, g, b, a){
    if ((b == void 0) && (typeof r == 'string')) {
        r = r.replace(/^\s*#|\s*$/g, '');
        var alpha = 1;
        if (r.length == 3) {
            r = r.replace(/(.)/g, '$1$1');
        }
        if (typeof g != 'undefined') {
            alpha = g;
        }
        g = parseInt(r.substr(2, 2), 16);
        b = parseInt(r.substr(4, 2), 16);
        r = parseInt(r.substr(0, 2), 16);
    }

    if (typeof a != 'undefined') {
        alpha = a;
    }
    
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

/**
 * KineticJS 2d JavaScript Library v1.0.0
 * http://www.kineticjs.com/
 * Copyright 2011, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: July 31 2011
 *
 * Copyright (C) 2011 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var anim = function(canvasId){
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.drawStage = undefined;

    this.t = 0;
    this.timeInterval = 0;
    this.startTime = 0;
    this.lastTime = 0;
    this.frame = 0;
    this.animating = false;

    window.requestAnimFrame = (function(callback){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
    })();
};
anim.prototype.clear = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
anim.prototype.setDrawStage = function(func){
    this.drawStage = func;
};
anim.prototype.drawStage = function(){
    if (this.drawStage !== undefined) {
        this.drawStage();
    }
};
anim.prototype.startAnimation = function(){
    this.animating = true;
    var date = new Date();
    this.startTime = date.getTime();
    this.lastTime = this.startTime;

    if (this.drawStage !== undefined) {
        this.drawStage();
    }

    this.animationLoop();
};
anim.prototype.stopAnimation = function(){
    this.animating = false;
};
//anim.prototype.getFps = function(){
//    return this.timeInterval > 0 ? 1000 / this.timeInterval : 0;
//};
anim.prototype.animationLoop = function(){
	now = Date.now();
	delta = now - then;
	
    var that = this;
    //this.frame++;
    //var date = new Date();
    //var thisTime = date.getTime();
    //this.timeInterval = thisTime - this.lastTime;
    //this.t += this.timeInterval;
    //this.lastTime = thisTime;
	
	if (delta > interval) {
		then = now - (delta % interval);	
		if (this.drawStage !== undefined) {
        	this.drawStage();
    	}
	}
    
    if (this.animating) {
        requestAnimFrame(function(){
            that.animationLoop();
        });
    }
};

// Dean Edwards/Matthias Miller/John Resig
function init() {
    if (arguments.callee.done) return;
    arguments.callee.done = true;
    if (_timer) clearInterval(_timer);
    pageLoaded();
};
/* for Mozilla/Opera9 */
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", init, false);
}
/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) {
  var _timer = setInterval(function() {
    if (/loaded|complete/.test(document.readyState)) {
      init();
    }
  }, 10);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
  var script = document.getElementById("__ie_onload");
  script.onreadystatechange = function() {
    if (this.readyState == "complete") {
      init(); // call the onload handler
    }
  };
/*@end @*/


/* for other browsers */
window.onload = init;

window.onbeforeunload = function() {
	if(typeof(Storage)!=="undefined") {
		localStorage.s4nch3z_me_bg = JSON.stringify(circles);
  	}
}
