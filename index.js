;(function(exports){

	var states = {
		beginning: function(game, frame){
			var anim = document.getElementById("anim");
			var anim2 = document.getElementById("anim2");
			if(frame == 0){
				anim.style.display = "block";
				anim2.style.display = "block";
				this.done = 0;
				this.size = {
					x: 0,
					y: 0,
					xmax: document.body.clientWidth,
					ymax: document.body.clientHeight
				}
			}

			this.size.x += Math.random() * 100;
			this.size.y += Math.random() * 100;

			if(this.size.x > this.size.xmax){
				this.size.x = this.size.xmax;
				this.done = 1;
			}
			if(this.size.y > this.size.ymax){
				this.size.y = this.size.ymax;
				if(this.done == 1) this.done = 2;
			}

			anim.style.width = this.size.x + "px";
			anim.style.height = this.size.y + "px";

			anim.style.marginTop = (-.5 * this.size.y) + "px";
			anim.style.marginLeft = (-.5 * this.size.x) + "px";

			if(this.done == 2){
				document.getElementById("console").style.display = "block";
				anim.style.display = "none";
				anim2.style.display = "none";
				game.setState("playing");
			}

		},
		login: function(game, frame){
			if(frame == 0){
				game.typewriter.push(
					game.outEl,
					[
					"Please create a user for this session."
					],
					1,
					function(element){
						var s = '';
						s += "<form id='sessionform'>"
						s += "Username: <input type='text' id='player-name' value='debug' autocomplete='off'/>";
						s += "<br /><br />";
						s += "Password: <input type='password' id='player-password' value='debug' autocomplete='off'/>";
						s += "<br /><br />";
						s += "Click <input type='submit' value='here'/> to start this session";
						s += "</form>";
						game.outEl.innerHTML += s;
						var form = document.getElementById('sessionform');
						if (form.attachEvent) {
							form.attachEvent("submit", createUser);
						} else {
							form.addEventListener("submit", createUser);
						}
					}
				);

			}
		},
		playing: function(game, frame){
			if(game.lastScriptState == game.scriptState) return;

			console.log(game.lastScriptState, " -> ", game.scriptState);

			if(!script[game.scriptState]){
				game.outEl.innerHTML = "Not Yet Written: " + game.scriptState;
				game.setOptions({
					1: {
						text: "Return to last state",
						callback: (function(lastState){
							return function(){
								game.lastScriptState = game.scriptState;
								game.setScriptState(lastState);
							}
						})(game.lastScriptState)
					}
				});
				game.lastScriptState = game.scriptState;
				return;
			}

			if(script[game.scriptState].callfore){
				script[game.scriptState].callfore.call(this);
			}

			if(script[game.scriptState].color){
				game.outEl.style.color = script[game.scriptState].color;
			} else{
				game.outEl.style.color = "green";
			}

			if(script[game.scriptState].location){
				game.player.location = script[game.scriptState].location;
				game.updatePlayer();
			}

			game.typewriter.push(
				game.outEl,
				__(script[game.scriptState].text),
				1,
				function(element){
					var i = 1;
					var options = {};
					script[game.scriptState].options.forEach(function(a){
						if((a.condition && a.condition()) || !a.condition){
							options[i] = a;
							if(!a.callback){
								options[i].callback = function(){
									game.setScriptState(a.state);
								};
							}
							i++;
						}
					});
					this.setOptions(options);
				}
			);

			game.lastScriptState = game.scriptState;

		},
		game_over: function(game, frame) {
			if(frame < 0) return;
			var anim = document.getElementById("anim");
			var anim2 = document.getElementById("anim2");
			if(frame == 0){
				this.done = 0;
				this.size = {
					x: document.body.clientWidth,
					y: document.body.clientHeight,
					xmin: 0,
					ymin: 0
				};
				document.getElementById("console").style.display = "none";
				anim.style.display = "block";
				anim2.style.display = "block";
			}

			this.size.x -= Math.random() * 100;
			this.size.y -= Math.random() * 100;

			if(this.size.x <= this.size.xmin){
				this.size.x = this.size.xmin;
				this.done = 1;
			}
			if(this.size.y <= this.size.ymin){
				this.size.y = this.size.ymin;
				if(this.done == 1) this.done = 2;
			}

			anim.style.width = this.size.x + "px";
			anim.style.height = this.size.y + "px";

			anim.style.marginTop = (-.5 * this.size.y) + "px";
			anim.style.marginLeft = (-.5 * this.size.x) + "px";

			if(this.done == 2){
				this.done = 3;
				anim.innerHTML = "<input type='button' onclick='document.getElementById(\"anim\").innerHTML = \"\"; game.restart();' id='restart' value='Restart' />";
			}
		}
	}


	var TypeWriter = function(){
		this.queue = [];

		this.push = function(element, strings, delay, callback){
			var that = this;
			//strings = strings.map(function(s){return s.split(/(\s)/).filter(Boolean)});
			this.queue.push({
				"element": element,
				"strings": strings,
				"delay": delay,
				delayPassed: 0,
				stringsIndex: 0,
				stringIndex: 0,
				loop: that.typeFunction,
				done: false,
				"callback": callback
			});
		};

		this.finish = function(){
			this.queue.forEach(function(a){
				a.element.innerHTML = "";
				for(var i = 0; i < a.strings.length; i++){
					a.element.innerHTML += a.strings[i];
					a.element.innerHTML += "<br /><br />";
				}
				a.done = true;
			});
		}

		this.typeFunction = function(){
			if(this.done) return;
			this.delayPassed += 1;
			if(this.delayPassed == this.delay){
				if(this.stringIndex == this.strings[this.stringsIndex].length){
					this.stringIndex = 0;
					this.stringsIndex ++;
					this.element.innerHTML += "<br /><br />	";
				}
				if(this.stringsIndex == this.strings.length){
					this.done = true;
				} else{
					if(typeof(this.strings[this.stringsIndex]) == "string"){
						this.element.innerHTML += this.strings[this.stringsIndex][this.stringIndex];
						this.delayPassed = 0;
						this.stringIndex += 1;
					} else {
						this.element.innerHTML += this.strings[this.stringsIndex].text + "<br /><br />";
						this.stringsIndex += 1;
						this.delayPassed = 0;
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

	var __ = function(strArr){
		return strArr.map(function(str){
			if(typeof(str) == "function"){
				return str.call(this);
			}
			return str;
		}).filter(function(str){
			return !!str;
		}).map(function(str){
			if(typeof(str) == "object"){
				return str;
			};
			return str.replace('__NAME__', game.player.name).replace('__NAME_UC__', game.player.name.toUpperCase());
		});
	}

	var Game = function(inId, outId, playerId, opt1Id, opt2Id, opt3Id, opt4Id){
		this.restart = function(){
			this.state = states.beginning;

			this.scriptState = "beginning";
			this.lastScriptState = "";

			this.inEl = document.getElementById(inId);
			this.outEl = document.getElementById(outId);
			this.playerEl = document.getElementById(playerId);

			this.opt = {
				1: {
					element: document.getElementById(opt1Id),
					callback: null,
					enabled: false
				},
				2: {
					element: document.getElementById(opt2Id),
					callback: null,
					enabled: false
				},
				3: {
					element: document.getElementById(opt3Id),
					callback: null,
					enabled: false
				},
				4: {
					element: document.getElementById(opt4Id),
					callback: null,
					enabled: false
				}
			}

			this.player = {
				inventory: [],
				name: '',
				location: '',
				events: {}
			};

			this.items = {
				sb2_keycard: "Mizumo Keycard"
			}

			this.frame = 0;

			this.typewriter = new TypeWriter();
		}
		this.restart();

		this.updatePlayer = function(){
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

		this.loop = function(){
			this.state.call(null, this, this.frame);
			this.typewriter.loop();

			this.frame += 1;
		}

		this.setScriptState = function(newState, reset){
			if(!reset) this.reset();
			this.scriptState = newState;
			this.scriptStateChange = true;
		}

		this.reset = function(){
			this.frame = -1;
			this.outEl.innerHTML = "";
			this.setOptions({});
		}

		this.setState = function(newState, reset){
			if(!reset) this.reset();
			this.state = states[newState];
		}

		this.flow = function(){
			var height = document.body.clientHeight;
			var inHeight = 100;
			var outHeight = height - 20 - 20 - 10 - 10 - 4 - 40 - inHeight;
			this.outEl.style.height = outHeight + "px";
			this.inEl.style.height = inHeight + "px";
			this.playerEl.style.height = outHeight + inHeight + 10 + 10 + 1 + "px";
		};

		this.setOptions = function(options){
			options = options || {};
			for(var i = 1; i < 5; i++){
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

		this.keyListener = function(keyCode){
			var key = keyCode - 48; //"1"
			if(this.opt[key] && this.opt[key].enabled && this.opt[key].callback){
				this.opt[key].callback.call(this, this.opt[key].element);
			} else if(key == 144){ // "~"
				this.typewriter.finish();
			}
		}
	}

	var createUser = function(evt){
		if (evt.preventDefault) evt.preventDefault();
		var nameEl = document.getElementById("player-name");
		var passwordEl = document.getElementById("player-password");
		if(nameEl.value.length == 0){
			nameEl.style.backgroundColor = "#220000";
		}
		if(passwordEl.value.length == 0){
			passwordEl.style.backgroundColor = "#220000";
		}
		if(nameEl.value.length > 0 && passwordEl.value.length > 0){
			game.player.name = nameEl.value;
			game.player.password = passwordEl.value;
			game.setScriptState("mizumo_start", false);
			game.setState("playing");
			game.updatePlayer();
		}
		return false;
	};

	exports.createUser = createUser;
	exports.Game = Game;
})(this);

(function() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
})();

var init = function(){
	game = new Game("input", "output", "player", "option1", "option2", "option3", "option4");
	game.setOptions({});
	game.flow();
	script = createScript();
	document.onkeyup = function(evt){game.keyListener(evt.keyCode);};
}

var loop = function(){
	game.loop();
	window.requestAnimationFrame(loop);
}
requestAnimationFrame(init);
requestAnimationFrame(loop);

window.addEventListener('resize', function(event){
  game.flow();
});
