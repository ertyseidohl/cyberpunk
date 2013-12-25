;(function(exports){

	var __ = function(strArr){
		return strArr.map(function(str){
			var obj = {
				text: '',
				contain: 'p',
				font: 'courier new',
				stringIndex: 0,
				appear: 'letter'
			}
			if(typeof(str) == "function"){
				str = str.call(this);
			}
			if(typeof(str) == "object"){
				obj.text = str.text || obj.text;
				obj.color = str.color || obj.color;
				obj.appear = str.appear || obj.appear;
				obj.contain = str.contain || obj.contain;
				obj.font = str.font || obj.font;
			} else if(typeof(str) == "string"){
				obj.text = str;
			}
			obj.text = obj.text.replace('__NAME__', game.player.name).replace('__NAME_UC__', game.player.name.toUpperCase());
			return obj;
		}).filter(function(obj){
			return obj.text.length > 0;
		})
	}

	var Player = function() {
		this.inventory = {};
		this.name = '';
		this.location = '';
		this.events = {};
	};

	Player.prototype.happen = function(evt){
		if(!evt) throw new Error("Event Error: evt is not an object");
		console.log("HAPPEN " + evt);
		this.events[evt] = true;
	};

	Player.prototype.get = function(item){
		if(!item) throw new Error("Inventory Error: item is not an object");
		console.log("GOT " + item);
		if(this.has(item)) throw new Error ("Inventory Error: Player already has " + item);
		this.inventory[item] = true;
		game.updatePlayer();
	};

	Player.prototype.has = function(item){
		return this.inventory[item] == true || this.events[item] == true;
	};

	var Game = function(_settings){

		this.restart = function(){

			this.state = "beginning";
			this.lastState = "";

			this.inEl = document.getElementById(_settings.input);
			this.outEl = document.getElementById(_settings.output);
			this.playerEl = document.getElementById(_settings.player);

			this.frame = 0;

			this.typewriter = new Typewriter();

			this.opt = {};
			for(var i = 1; i <= 4; i++){
				this.opt[i] = {
					element: document.getElementById(_settings.options[i - 1]),
					callback: null,
					enabled: false
				};
				this.opt[i].element.onclick = function(){game.keyListener(48 + i)};
			}

			this.player = new Player();

			this.setOptions({});
			this.flow();
		}
	}

	Game.prototype.updatePlayer = function(){
		var s = '';
		s += '<p><span class="heavy">Name:</span><br  />' + this.player.name + '</p>';
		s += '<p><span class="heavy">Location:</span><br />' + this.player.location + '</p>';
		s += '<p><span class="heavy">Inventory:</span><br />';
		if(this.player.inventory.length == 0){
			s += 'No Items';
		} else {
			s += '<ul>';
			for(var item in this.player.inventory){
				s += '<li>' + item + '</li>';
			};
			s += '</ul>';
		}
		s += '</p>';
		this.playerEl.innerHTML = s;
	}

	Game.prototype.loop = function(){
		if(this.lastState != this.state){

			console.log(this.lastState, " -> ", this.state);

			if(this.script[this.lastState] && this.script[this.lastState].callback){
				this.script[this.lastState].callback.call(this);
			}

			if(!this.script[this.state]){
				this.outEl.innerHTML = "Not Yet Written: " + this.state;
				this.setOptions({
					1: {
						text: "Return to last state",
						callback: (function(lastState){
							return function(){
								this.lastState = this.state;
								this.setState(lastState);
							}
						})(this.lastState)
					}
				});
				this.lastState = this.state;
				return;
			}

			if(this.script[this.state].checkpoint){
				this.checkCheckpoint(this.script[this.state].checkpoint);
			}

			if(this.script[this.state].callfore){
				this.script[this.state].callfore.call(this);
			}

			if(this.script[this.state].color){
				this.outEl.style.color = this.script[this.state].color;
			} else{
				this.outEl.style.color = "green";
			}

			if(this.script[this.state].location){
				this.player.location = this.script[this.state].location;
				this.updatePlayer();
			}
			if(this.script[this.state].options){
				this.typewriter.push(
					this.outEl,
					this.script[this.state].text,
					1,
					function(element){
						var i = 1;
						var options = {};
						this.script[this.state].options.forEach(function(a){
							if((a.condition && a.condition()) || !a.condition){
								options[i] = a;
								if(!a.callback){
									options[i].callback = function(){
										this.setState(a.state);
									};
								}
								i++;
							}
						});
						this.setOptions(options);
					}
				);
			}

			this.lastState = this.state;
		}


		if(this.script[this.state] && this.script[this.state].loop){
			this.script[this.state].loop.call(this);
		}

		this.typewriter.loop();

		this.frame += 1;
	}

	Game.prototype.setState = function(newState, reset){
		if(!reset) this.reset();
		this.state = newState;
		this.stateChange = true;
	}

	Game.prototype.reset = function(){
		this.frame = -1;
		this.outEl.innerHTML = "";
		this.setOptions({});
	}

	Game.prototype.flow = function(){
		var height = document.body.clientHeight;
		var inHeight = 100;
		var outHeight = height - 20 - 20 - 10 - 10 - 4 - 40 - inHeight;
		this.outEl.style.height = outHeight + "px";
		this.inEl.style.height = inHeight + "px";
		this.playerEl.style.height = outHeight + inHeight + 10 + 10 + 1 + "px";
	};

	Game.prototype.setOptions = function(options){
		options = options || {};
		for(var i = 1; i <= 4; i++){
			if(!options[i]){
				this.opt[i].enabled = false;
				this.opt[i].element.style.visibility = "hidden";
			} else{
				this.opt[i].enabled = true;
				this.opt[i].element.style.visibility = "";
				document.getElementById("option" + i + "-text").innerHTML = options[i].text;
				this.opt[i].callback = options[i].callback;
			}
		}
	}

	Game.prototype.keyListener = function(keyCode){
		var key = keyCode - 48; //"1"
		if(this.opt[key] && this.opt[key].enabled && this.opt[key].callback){
			this.opt[key].callback.call(this, this.opt[key].element);
		} else if(key == 144){ // "~"
			this.typewriter.finish();
		}
	}

	Game.prototype.checkCheckpoint = function(checkpoint){
		console.log("Checkpoint Reached: " + this.state);

		for(var item in this.items){
			var req = checkpoint.player_required_inventory.indexOf(item) !== -1;
			var opt = checkpoint.player_optional_inventory.indexOf(item) !== -1;
			var inv = this.player.has(item);
			if(!req && !opt && inv) throw new Error("Checkpoint Error! Inevntory item '" + item + "' not required or optional at " + this.state);
			if(req && !inv) throw new Error("Checkpoint Error! Inventory item '" + item + "' required but not found at " + this.state);
		};
		for(var evt in this.events){
			var req = checkpoint.player_required_events.indexOf(evt) !== -1;
			var opt = checkpoint.player_optional_events.indexOf(evt) !== -1;
			var done = this.player.has(evt);
			if(!req && !opt && done) throw new Error("Checkpoint Error! Event '" + evt + "' not required or optional at " + this.state);
			if(req && !done) throw new Error("Checkpoint Error! Event '" + evt + "' required but not found at " + this.state);
		};
	}

	Game.prototype.goToCheckpoint = function(checkpoint){
		this.typewriter.clear();
		this.player = new Player();
		this.reset();
		for (var item in checkpoint.player_optional_inventory){
			this.player.get(checkpoint.player_optional_inventory[item]);
		}
		for (var item in checkpoint.player_required_inventory){
			this.player.get(checkpoint.player_required_inventory[item]);
		}
		for (var evt in checkpoint.player_optional_events){
			this.player.happen(checkpoint.player_optional_events[evt]);
		}
		for (var evt in checkpoint.player_required_events){
			this.player.happen(checkpoint.player_required_events[evt]);
		}
		this.lastState = "";
		this.setState(checkpoint.script_state);
		checkpoint.callback.apply(this, []);
	}

	var _get = function(url, callback){
		var oReq = new XMLHttpRequest();
		oReq.onload = function(a){
			if(callback){
				callback.call(this, a.target.response);
			} else {
				console.log("Error: No callback available!");
			}
			//no error handling....
		}
		oReq.open("get", url, true);
		oReq.send();
	}

	exports.Game = Game;
	exports.__ = __;
})(this);
