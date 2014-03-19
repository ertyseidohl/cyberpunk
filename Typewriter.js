;(function(exports) {
var Typewriter = function() {
	this.queue = [];
};

var coerceFormat = function(strArr) {
	return strArr.map(function(str) {
		var obj = {
			text: '',
			contain: 'p',
			font: 'courier new',
			stringIndex: 0,
			appear: 'letter'
		};
		if (typeof(str) == "function") {
			str = str.call(this);
		}
		if (typeof(str) == "object") {
			obj.text = str.text || obj.text;
			obj.color = str.color || obj.color;
			obj.appear = str.appear || obj.appear;
			obj.contain = str.contain || obj.contain;
			obj.font = str.font || obj.font;
		} else if (typeof(str) == "string") {
			obj.text = str;
		}
		return obj;
	}).filter(function(obj) {
		return obj.text.length > 0;
	});
};

Typewriter.prototype.push = function(options) {
	//REQUIRED: element, stringObjects
	//OPTIONAL: delay, callback, debugMode
	var that = this;
	this.queue.push({
		"element": options.element,
		"stringObjects": coerceFormat(options.stringObjects),
		"delay": options.delay || 1,
		delayPassed: 0,
		objectsIndex: 0,
		loop: that.typeFunction,
		done: false,
		finish: options.debugMode || false,
		"callback": options.callback || function(){}
	});
};

Typewriter.prototype.clear = function() {
	this.queue = [];
};

Typewriter.prototype.finish = function() {
	this.queue.forEach(function(a) {
		a.finish = true;
	});
};

Typewriter.prototype.typeFunction = function() {
	if (this.done) return;
	this.delayPassed += 1;
	while(this.delayPassed == this.delay || (this.finish && !this.done)) {
		var obj = this.stringObjects[this.objectsIndex];
		this.delayPassed = 0;
		if (obj.stringIndex === 0) {
			this.el = document.createElement(obj.contain);
			if (obj.color) this.el.style.color = obj.color;
			if (obj.font) this.el.style.fontFamily = obj.font;
			this.element.appendChild(this.el);
		}
		if (obj.stringIndex == obj.text.length) {
			this.objectsIndex ++;
			obj.stringIndex = 0;
			if (this.objectsIndex == this.stringObjects.length) this.done = true;
		} else{
			if (obj.appear == "letter") {
				this.el.innerHTML += obj.text[obj.stringIndex];
				obj.stringIndex ++;
			} else if (obj.appear == "word") {
				console.log("todo");
			} else if (obj.appear == "all") {
				this.el.innerHTML += obj.text;
				obj.stringIndex += obj.text.length;
			} else{
				throw new Error("The 'appear' value is incorrect. Text was: " + obj.text);
			}
		}
	}
};

Typewriter.prototype.loop = function() {
	for(var i = 0; i < this.queue.length; i++) {
		this.queue[i].loop();
		if (this.queue[i].done) {
			if (this.queue[i].callback !== undefined) {
				this.queue[i].callback.call(game, this.queue[i]);
			}
			this.queue.splice(i, 1);
			i -= 1;
		}
	}
};
exports.Typewriter = Typewriter;
})(window);
