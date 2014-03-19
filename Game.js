;(function(exports) {
	var Game = function(_settings) {

		this.speedString = '';
		this.speedWait = 3;
		this.speedWaitMax = this.speedWait;
		this.monkey = false;
		this.monkeyString = "";

		this.restart = function() {

			this.state = "beginning";
			this.lastState = "";

			this.monkeyString = "";

			this.inEl = document.getElementById(_settings.input);
			this.outEl = document.getElementById(_settings.output);
			this.playerEl = document.getElementById(_settings.player);

			this.frame = 0;

			this.typewriter = new Typewriter();

			this.opt = {};
			for(var i = 1; i <= 4; i++) {
				this.opt[i] = {
					element: document.getElementById(_settings.options[i - 1]),
					callback: null,
					enabled: false
				};
				this.opt[i].element.onclick = function(j) {
					return function() {
						return game.keyListener(48 + j);
					};
				}(i);
			}

			this.outEl.onclick = function() {
				this.typewriter.finish();
			}.bind(this);

			this.player = new Player(this);

			this.setOptions({});
		};
	};

	Game.prototype.speedThrough = function(speedString) {
		if (speedString === "") {
			this.speedString = "1";
			this.monkey = true;
		} else if (speedString == "Infinity") {
			this.speedString = "1";
			this.monkey = "Infinity";
		} else {
			this.speedString = speedString;
		}
		
		this.typewriter.finish();
	};

	Game.prototype.updatePlayer = function() {
		var str = '';
		str += '<p><span class="heavy">Name:</span><br  />' + this.player.name + '</p>';
		str += '<p><span class="heavy">Location:</span><br />' + this.player.location + '</p>';
		str += '<p><span class="heavy">Inventory:</span><br />';
		if (this.player.inventory.length === 0) {
			str += 'No Items';
		} else {
			str += '<ul>';
			this.player.inventory.forEach(function(item) {
				if (typeof(this.player.items[item]) == "string") {
					str += '<li>' + this.player.items[item] + '</li>';
				} else if (typeof(this.player.items[item]) == "object") {
					str += '<li>' + this.player.items[item].displayString() + '</li>';
				} else{
					throw new Error("Inventory Error: item not object nor string", item);
				}
			}.bind(this));
			str += '</ul>';
		}
		str += '</p>';
		this.playerEl.innerHTML = str;
	};

	Game.prototype.loop = function() {
		this.player.inventory.forEach(function(item) {
			if(this.player.items[item].loop !== undefined) {
				var dirty = this.player.items[item].loop();
				if (dirty) {
					this.updatePlayer();
				}
			}
		}.bind(this));
		if (this.speedString.length) {
			if (this.speedWait > 0) {
				this.speedWait -= 1;
			} else{
				this.speedWait = this.speedWaitMax;
				this.opt[parseInt(this.speedString.charAt(0),10)].element.click();
				this.monkeyString += this.speedString.charAt(0);
				this.speedString = this.speedString.slice(1);
				if (this.monkey) {
					this.speedString += parseInt(Math.random() * 4, 10) + 1;
				}
			}
		}
		if (this.lastState != this.state) {

			console.log(this.lastState, " -> ", this.state);

			if (this.script[this.lastState] && this.script[this.lastState].callback) {
				this.script[this.lastState].callback.call(this);
			}
			if (!this.script[this.state]) {
				if(this.monkey == "Infinity" && this.monkey) {
					console.log(this.monkeyString);
					this.restart();
				} else if(this.monkey) {
					console.log(this.monkeyString);
					this.monkeyString = "";
					this.speedString = "";
					this.monkey = false;
				} else {
					this.outEl.innerHTML = "Not Yet Written: " + this.state;
					this.setOptions({
						1: {
							text: "Return to last state",
							callback: (function(lastState) {
								return function() {
									this.lastState = this.state;
									this.setState(lastState);
								};
							})(this.lastState)
						}
					});
					this.lastState = this.state;
				}
				return;
			}

			if (this.script[this.state].callfore) {
				this.script[this.state].callfore.call(this);
			}

			if (this.script[this.state].color) {
				this.outEl.style.color = this.script[this.state].color;
			} else{
				this.outEl.style.color = "green";
			}

			if (this.script[this.state].location) {
				this.player.location = this.script[this.state].location;
				this.updatePlayer();
			}
			if (this.script[this.state].options) {
				this.typewriter.push({
					element: this.outEl,
					stringObjects: this.script[this.state].text,
					delay: 1,
					callback: function(element) {
						var i = 1;
						var options = {};
						this.script[this.state].options.forEach(function(option) {
							if ((option.condition && option.condition()) || !option.condition) {
								options[i] = option;
								var _callback = option.callback || function(){};
								options[i].callback = function() {
									//copy existing callback function
									_callback.apply(this, []);
									this.setState(option.state);
								};
								i++;
							}
						});
						this.setOptions(options);
					},
					debugMode: this.speedString.length > 0
				});
			}

			this.lastState = this.state;
		}


		if (this.script[this.state] && this.script[this.state].loop) {
			this.script[this.state].loop.call(this);
		}

		this.typewriter.loop();

		this.frame += 1;
	};

	Game.prototype.setState = function(newState, reset) {
		if (!reset) this.reset();
		this.state = newState;
		this.stateChange = true;
		this.player.visit(this.state);
	};

	Game.prototype.reset = function() {
		this.frame = -1;
		this.outEl.innerHTML = "";
		this.setOptions({});
	};

	Game.prototype.setOptions = function(options) {
		options = options || {};
		for(var i = 1; i <= 4; i++) {
			if (!options[i]) {
				this.opt[i].enabled = false;
				this.opt[i].element.style.visibility = "hidden";
			} else{
				this.opt[i].enabled = true;
				this.opt[i].element.style.visibility = "";
				document.getElementById("option" + i + "-text").innerHTML = options[i].text;
				this.opt[i].callback = options[i].callback;
			}
		}
	};

	Game.prototype.keyListener = function(keyCode) {
		var key = keyCode - 48; //"1"
		if (this.opt[key] && this.opt[key].enabled && this.opt[key].callback) {
			this.opt[key].callback.call(this, this.opt[key].element);
		} else if (key == 144) { // "~"
			this.typewriter.finish();
		}
	};

	var _get = function(url, callback) {
		var oReq = new XMLHttpRequest();
		oReq.onload = function(a) {
			if (callback) {
				callback.call(this, a.target.response);
			} else {
				console.log("Error: No callback available!");
			}
			//no error handling....
		};
		oReq.open("get", url, true);
		oReq.send();
	};

	exports.Game = Game;
})(this);
