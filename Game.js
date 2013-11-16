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

	var Game = function(_settings){

		console.log(_settings);

		var optionIds = _settings.options;
		this.states = _settings.script.states;
		this.items = _settings.script.items;
		this.events = _settings.script.events;

		this.restart = function(){

			this.state = "beginning";
			this.lastState = "";

			this.inEl = document.getElementById(_settings.input);
			this.outEl = document.getElementById(_settings.output);
			this.playerEl = document.getElementById(_settings.player);

			this.frame = 0;

			this.typewriter = new Typewriter();

			this.opt = {};
			for(var i = 0; i < optionIds.length; i++){
				this.opt[i] = {
					element: document.getElementById(optionIds[i]),
					callback: null,
					enabled: false
				};
				this.opt[i].element.onclick = function(){game.keyListener(48 + i)};
			}

			this.player = {
				inventory: [],
				name: '',
				location: '',
				events: [],
				happen: function(evt){
					this.events[evt] = true;
				},
				get: function(item){
					if(this.has(item)) throw new Error ("Inventory Error: Player already has " + this.items[item]);
					this.inventory.push(item);
					game.updatePlayer();
				},
				has: function(item){
					return this.inventory.indexOf(item) != -1 || this.events[item] == true;
				}
			}

			this.setOptions({});
			this.flow();
		}
		this.restart();
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
			this.player.inventory.forEach(function(a){
				s += '<li>' + a + '</li>';
			});
			s += '</ul>';
		}
		s += '</p>';
		this.playerEl.innerHTML = s;
	}

	Game.prototype.loop = function(){
		if(this.lastState != this.state){

			console.log(this.lastState, " -> ", this.state);

			if(script[this.lastState] && script[this.lastState].callback){
				script[this.lastState].callback.call(this);
			}

			if(!script[this.state]){
				this.outEl.innerHTML = "Not Yet Written: " + this.state;
				this.setOptions({
					1: {
						text: "Return to last state",
						callback: (function(lastState){
							return function(){
								this.lastState = this.state;
								this.setScriptState(lastState);
							}
						})(this.lastState)
					}
				});
				this.lastState = this.state;
				return;
			}

			if(script[this.state].checkpoint){
				this.checkpoint(script[this.state].checkpoint);
			}

			if(script[this.state].callfore){
				script[this.state].callfore.call(this);
			}

			if(script[this.state].color){
				this.outEl.style.color = script[this.state].color;
			} else{
				this.outEl.style.color = "green";
			}

			if(script[this.state].location){
				this.player.location = script[this.state].location;
				this.updatePlayer();
			}

			this.typewriter.push(
				this.outEl,
				script[this.state].text,
				1,
				function(element){
					var i = 1;
					var options = {};
					script[this.state].options.forEach(function(a){
						if((a.condition && a.condition()) || !a.condition){
							options[i] = a;
							if(!a.callback){
								options[i].callback = function(){
									this.setScriptState(a.state);
								};
							}
							i++;
						}
					});
					this.setOptions(options);
				}
			);
			this.lastState = this.state;
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
		for(var i = 0; i < this.opt.length; i++){
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

	Game.prototype.checkpoint = function(checkName){
		var check = this.checkpoints[checkName];
		this.items.forEach(function(item){
			var req = check.player_required_inventory.indexOf(item) !== -1;
			var opt = check.player_optional_inventory.indexOf(item) !== -1;
			var inv = this.player.inventory.indexOf(item) !== -1;
			if(!req && !opt && inv) throw new Error("Checkpoint Error! Inevntory item '" + item + "' not required or optional at " + checkName);
			if(req && !inv) throw new Error("Checkpoint Error! Inventory item '" + item + "' required but not found at " + checkName);
		});
		this.events.forEach(function(event){
			var req = check.player_required_events.indexOf(item) !== -1;
			var opt = check.player_optional_events.indexOf(item) !== -1;
			var inv = this.player.events[item];
			if(!req && !opt && inv) throw new Error("Checkpoint Error! Event '" + item + "' not required or optional at " + checkName);
			if(req && !inv) throw new Error("Checkpoint Error! Event '" + item + "' required but not found at " + checkName);
		});

		if(this.states[check.state] != this.state) throw new Error("Checkpoint Error! State mismatch at " + checkName);
		if(check.script_state != this.script_state) throw new Error("Checkpoint Error! Script State mismatch at " + checkName);
		console.log("Checkpoint Reached: " + checkName);
	}
	exports.Game = Game;
})(this);
