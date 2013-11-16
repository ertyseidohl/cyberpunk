;(function(exports){
var Typewriter = function(){
	this.queue = [];

	this.push = function(element, stringObjects, delay, callback){
		stringObjects = __(stringObjects);
		var that = this;
		this.queue.push({
			"element": element,
			"stringObjects": stringObjects,
			"delay": delay,
			delayPassed: 0,
			objectsIndex: 0,
			loop: that.typeFunction,
			done: false,
			finish: false,
			"callback": callback
		});
	};

	this.finish = function(){
		this.queue.forEach(function(a){
			a.finish = true;
		});
	}

	this.typeFunction = function(){
		if(this.done) return;
		this.delayPassed += 1;
		while(this.delayPassed == this.delay || (this.finish && !this.done)){
			var obj = this.stringObjects[this.objectsIndex];
			this.delayPassed = 0;
			if(obj.stringIndex == 0){
				this.el = document.createElement(obj.contain);
				if(obj.color) this.el.style.color = obj.color;
				if(obj.font) this.el.style.fontFamily = obj.font;
				this.element.appendChild(this.el);
			}
			if(obj.stringIndex == obj.text.length){
				this.objectsIndex ++;
				obj.stringIndex = 0;
				if(this.objectsIndex == this.stringObjects.length) this.done = true;
			} else{
				if(obj.appear == "letter"){
					this.el.innerHTML += obj.text[obj.stringIndex];
					obj.stringIndex ++;
				} else if(obj.appear == "word"){
					console.log("todo");
				} else if(obj.appear == "all"){
					this.el.innerHTML += obj.text;
					obj.stringIndex += obj.text.length;
				} else{
					throw new Error("The 'appear' value is incorrect (index.js, 231). Text was: " + obj.text);
				}
			}
		}
	};

	this.loop = function(){
		for(var i = 0; i < this.queue.length; i++){
			this.queue[i].loop();
			if(this.queue[i].done){
				if(this.queue[i].callback != undefined){
					this.queue[i].callback.call(game, this.queue[i]);
				}
				this.queue.splice(i, 1);
				i -= 1;
			}
		}
	};
}
exports.Typewriter = Typewriter;
})(window);
