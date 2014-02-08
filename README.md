puff.js
=============

Floating circles animation. Check it out here http://s4nch3z.me/wp-content/uploads/2014/02/puff.html

This is how you start it:
Native JS
```html
<script type="text/javascript" src="puff.min.js"></script>
<script type="text/javascript">
	function init() {
    	if (arguments.callee.done) return;
    	arguments.callee.done = true;
    	if (_timer) clearInterval(_timer);
    	puff().startAnimation();
	};
	if (document.addEventListener) {
  	document.addEventListener("DOMContentLoaded", init, false);
	}
	if (/WebKit/i.test(navigator.userAgent)) {
  		var _timer = setInterval(function() {
    		if (/loaded|complete/.test(document.readyState)) {
      			init();
    		}
  		}, 10);
	}
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
	window.onload = init;
</script>
```

jQuery
```html
<script type="text/javascript" src="puff.min.js"></script>
<script type="text/javascript">
	$(document).ready() {
		puff().startAnimation();
	}
</script>
```

You can also play with settings by passing json to ```puff()``` constructor.

```json
{
	"fps": 30,
	"densityK": 30000,
	"rMin": 4,
	"rMax": 125,
	"rVelMax": 0.05,
	"opacityMin": 0,
	"blurHorizonMin": 0.7,
	"blurHorizonMax": 0.9,
	"blurHorizonOpacity": 0.8,
	"blurOpacityMax": 0.5,
	"circleColor": "#FFFFFF",
	"backgroundColor": "#0AC3DA"
}
```