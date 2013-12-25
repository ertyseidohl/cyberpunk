;(function(exports){
	exports.script = {
		beginning:{
			callfore: function(){
				var anim = document.getElementById("anim");
				var anim2 = document.getElementById("anim2");
				anim.style.display = "block";
				anim2.style.display = "block";
				this.done = 0;
				this.size = {
					x: 0,
					y: 0,
					xmax: document.body.clientWidth,
					ymax: document.body.clientHeight
				}
			},
			loop: function(frame){
				if(this.done == 2) return;
				var anim = document.getElementById("anim");
				var anim2 = document.getElementById("anim2");
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
				}
			},
			text: [
				{
					text: "INDEX",
					color: "white"
				},
				"This Game is best played in fullscreen.",
				"Most browsers access fullscreen by pressing F11.",
				"Please adjust your browser, then hit '1' to continue.",
				"(You can hit the tilde/backtick key to skip text animations)"],
			options: [
				{
					text: "Log In",
					callback: function(){
						game.setState("login");
					}
				},
				{
					text: "Credits",
					state: "credits"
				}
			]
		},
		game_over: {
			callfore: function(){
				var anim = document.getElementById("anim");
				var anim2 = document.getElementById("anim2");
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
			},
			loop: function(){
				var anim = document.getElementById("anim");
				var anim2 = document.getElementById("anim2");
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
		},
		login: {
			callfore: function(){
				game.typewriter.push(
					game.outEl,
					[
					"Please create a user for this session."
					],
					1,
					function(element){
						var s = '';
						s += "Username: <input type='text' id='player-name' value='debug' autocomplete='off'/>";
						s += "<br /><br />";
						s += "Password: <input type='password' id='player-password' value='debug' autocomplete='off'/>";
						s += "<br /><br />";
						s += "Click <input type='button' id='player-submit' value='here'/> to start this session";
						game.outEl.innerHTML += s;
						var submit = document.getElementById('player-submit');
						submit.onclick = function(){
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
								game.setState("mizumo_start");
								game.updatePlayer();
							}
						};
					}
				);
			}
		},
		credits: {
			location: "Boulder, CO and Brooklyn, NY",
			callfore: function(){
				game.player.name = "Handprint Industries";
				game.player.inventory = ["Awesomeness", "Silly Hats"];
			},
			callback: function(){
				game.player.name = "";
				game.player.inventory = [];
				game.playerEl.innerHTML = "";
			},
			text: [
				{
					text: "A Handprint Industries Game",
					color: "white",
					contain: "h3",
					font: "sans-serif"
				},
				{
					text: "Lead Developer:",
					contain: "h4"
				},
				{
					text:"Erty Seidel",
				},
				{
					text:"Sound and Music:",
					contain: "h4"
				},
				{
					text: "Evan Conway"
				},
				{
					text:"Developers/Scripters:",
					contain: "h4"
				},
				{
					text: "Matt Golon"
				},
				{
					text:"Testers:",
					contain: "h4"
				},
				{
					text: "Jorge Seidel"
				}
			],
			options: [
				{
					text: "Back",
					state: "beginning"
				}
			]
		},
		mizumo_start: {
			location: 'Mizumo HQ, room 2503',
			callfore: function(){
				game.player.get(game.items.smartphone);
			},
			text: [
				"Welcome, __NAME__",
				"You look up from your stale coffee at the dim, glowing screen of your Mizumo Corporation terminal.",
				"You were supposed to head home a few hours ago. Except for the occasional security guard, the rest of the Mizumo office building is dark and empty.",
				"It's friday, but your friends cancelled their plans with you, so you figured you might as well get some last work in before the weekend."
			],
			options: [
				{
					text: "Look Around",
					state: "beginning_looking_around"
				}
			]
		},
		beginning_looking_around: {
			location: 'Mizumo HQ, room 2503',
			text: [
				"The row of offices stretches quite a ways in both directions. You have the misfortune of inhabiting the office right in the middle of this floor.",
				"You have a small light on in your office, casting a bluish glow across your desk.",
				"Mizumo Corporation is a world renowned Computing and Simulation corporation - and you spend all your time dealing with their boring finances. Someone's gotta do it.",
				"An alert flashes up on your computer terminal."
			],
			options: [
				{
					text: "Examime Alert",
					state: "mizumo_examine_alert"
				},
				{
					text: "Ingore Alert",
					state: "mizumo_leaving"
				}
			]
		},
		mizumo_examine_alert: {
			location: 'Mizumo HQ, room 2503',
			callfore: function(){
				game.player.happen("janus_message_read");
			},
			color: "blue",
			text: [
				"To: __NAME_UC__",
				"From: JANUS",
				"Subject: HELP PLEASE",
				"I'M TRAPPED IN ROOM S229 IN SUB-BASEMENT 2. IS ANYONE STILL AROUND? I'VE TRIED CALLING SECURITY BUT THEY AREN'T ANSWERING.",
				"I KNOW THIS IS TOTALLY AGAINST POLICY, BUT THERE'S A SPARE KEYCARD IN MY DESK (ROOM 2206) IN THE THIRD DRAWER DOWN THAT WILL GET YOU INTO THE BASEMENT.",
				"I'VE BEEN DOWN HERE A LONG TIME ALREADY AND I REALLY DON'T WANT TO BE HERE UNTIL MONDAY!",
				"PLEASE HELP ME!",
				"JANUS"
			],
			options: [
				{
					text: "Go to Room 2206",
					state: "mizumo_room_2206"
				},
				{
					text: "Go to Elevator",
					state: "mizumo_elevator_locked"
				},
				{
					text: "Ignore Message",
					state: "mizumo_leaving"
				},
				{
					condition: function(){return !(game.player.has(game.events.mizumo_opsec_called))},
					text: "Make OpSec deal with it",
					state: "mizumo_call_opsec"
				},
				{
					condition: function(){return game.player.has(game.events.mizumo_opsec_called)},
					text: "Call the Opsec office again",
					state: "mizumo_call_opsec"
				}
			]
		},
		mizumo_room_2206: {
			location: 'Mizumo HQ, room 2206',
			callfore: function(){
				game.player.happen("visited_room_2206");
			},
			text: [
				"Room 2206 is an office on the 22nd floor - three floors down from you. It's a smaller office than yours, for what that's worth.",
				"You have an uneasy feeling, but it's probably becuase most of the lights are off here and there's nobody around."
			],
			options: [
				{
					condition: function(){return !(game.player.has(game.events.mizumo_2206_snooped))},
					text: "Look Around",
					state: "mizumo_room_2206_examine"
				},
				{
					condition: function(){return !(game.player.has(game.items.sb2_keycard))},
					text: "Get Keycard",
					state: "mizumo_room_2206_keycard"
				},
				{
					condition: function(){return !(game.player.has(game.events.mizumo_2206_snooped))},
					text: "Snoop around in the office",
					state: "mizumo_room_2206_examine"
				},
				{
					text: "Go to Elevator",
					state: "mizumo_elevator_locked"
				}
			]
		},
		mizumo_room_2206_examine: {
			location: 'Mizumo HQ, room 2206',
			callfore: function(){
				game.player.happen("mizumo_2206_snooped");
			},
			text: [
				"You hear the small whine of something mechanical behind you, and you whip around. You see a security camera zooming in on you. Idiots in Opsec have time to watch you on the camera but not save people in the basement.",
				function(){if(!game.player.has(game.events.mizumo_opsec_called)) return "Come to think of it, you could probably just call Opsec and have them rescue James or whoever they were."},
				"You notice that this room seems... almost too empty for someone to be working in it. There's barely anything on the desk. Either way, it looks like the keycard should be where they said."
			],
			options: [
				{
					condition: function(){return !(game.player.has(game.items.sb2_keycard))},
					text: "Get Keycard",
					state: "mizumo_room_2206_keycard"
				},
				{
					condition: function(){return !(game.player.has(game.events.mizumo_opsec_called))},
					text: "Call the Opsec office",
					state: "mizumo_call_opsec"
				},
				{
					text: "Go to Elevator",
					state: "mizumo_elevator_locked"
				}
			]
		},
		mizumo_call_opsec: {
			location: undefined,
			text: [
				{
					text: "You pick up your relic of a desk phone, and dial the extension for Operations Security."
				},
				{
					text: "\"Thank you for calling Mizumo Operations Security Office. For Emergencies, press 1. For Non-emergencies, press 2.\"",
					color: "red"
				},
				function(){
					if (!(game.player.has(game.events.mizumo_opsec_called)))
					return "Oh, right. OpSec goes home at 6pm like everyone else.";
				},
				function(){
					if (!(game.player.has(game.events.mizumo_opsec_called)))
					return "You'd think a multi-million dollar corporation would have 24-hour security. But no, it's this automated system.";
				}
			],
			options: [
				{
					text: "Emergencies",
					state: "mizumo_call_opsec_emergencies"
				},
				{
					text: "Non-Emergencies",
					state: "mizumo_call_opsec_non_emergencies"
				},
				{
					text: "Nevermind",
					state: "mizumo_call_opsec_end"
				}
			]
		},
		mizumo_call_opsec_non_emergencies: {
			location: undefined,
			callfore: function(){
				game.player.happen("mizumo_opsec_called");
			},
			text: [
				{
					text: "\"Thank you for your call. The Mizumo Operations Security office is closed for the weekend. Please call back during working hours.\"",
					color: "red"
				},
				"That's not much help. Maybe this qualifies as an emergency?"
			],
			options: [
				{
					text: "Call opsec again.",
					state: "mizumo_call_opsec"
				},
				{
					text: "Give up and go home",
					state: "mizumo_leaving"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206"},
					text: "Go to Elevator",
					state: "mizumo_elevator_locked"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206" && !(game.player.has(game.items.sb2_keycard))},
					text: "Get Keycard from Desk",
					state: "mizumo_room_2206_keycard"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2503"},
					//player is in their own office
					text: "Go to Room 2206",
					state: "mizumo_room_2206"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2503"},
					//player is in their own office
					text: "Ignore the message - go home",
					state: "mizumo_leaving"
				}
			]
		},
		mizumo_call_opsec_emergencies: {
			location: undefined,
			callfore: function(){
				game.player.happen("mizumo_opsec_called");
			},
			text: [
				{
					text: "Please hold.",
					color: "red"
				},
				"The phone rings for a long time. Nobody picks up."
			],
			options: [
				{
					text: "Call opsec again.",
					state: "mizumo_call_opsec"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206"},
					text: "Too creepy - give up and go home",
					state: "mizumo_leaving"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206"},
					text: "Go to Elevator",
					state: "mizumo_elevator_locked"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206" && !(game.player.has(game.items.sb2_keycard))},
					text: "Get Keycard from Desk",
					state: "mizumo_room_2206_keycard"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2503"},
					//player is in their own office
					text: "Go to Room 2206",
					state: "mizumo_room_2206"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2503"},
					//player is in their own office
					text: "Ignore the message - go home",
					state: "mizumo_leaving"
				}
			]
		},
		mizumo_call_opsec_end:{
			location: undefined,
			text: [
				{
					text: "\"Thank you for calling.\"",
					color: "red"
				},
				"Not helpful. You look around. There's nobody else here, at least on this floor."
			],
			options: [
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206" && !(game.player.has(game.items.sb2_keycard))},
					//player is in downstairs office, no keycard
					text: "Get Keycard from Desk",
					state: "mizumo_room_2206_keycard",
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206" && !(game.player.has(game.items.sb2_keycard))},
					//player is in downstairs office, no keycard
					text: "Go to Elevator",
					state: "mizumo_elevator_locked"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.has(game.items.sb2_keycard)},
					//player is in downstairs office, keycard
					text: "Go to Elevator",
					state: "mizumo_elevator_locked"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.has(game.items.sb2_keycard)},
					//player is in downstairs office, keycard
					text: "Not worth losing your job",
					state: "mizumo_leaving"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2503"},
					//player is in their own office
					text: "Go to Room 2206",
					state: "mizumo_room_2206"
				},
				{
					condition: function(){return game.player.location == "Mizumo HQ, room 2503"},
					//player is in their own office
					text: "Ignore the message - go home",
					state: "mizumo_leaving"
				}
			]

		},
		mizumo_room_2206_keycard: {
			location: 'Mizumo HQ, room 2206',
			callfore: function(){
				game.player.get(game.items.sb2_keycard);
			},
			text: [
				"You pick up the keycard. It looks like your own, except their department code is \"AIR\", which you've never heard of. The name on the keycard is \"Jason Landes\".",
				"The sub-basements have always been an in-joke at Mizumo, that there's strange research happening there, but you've always assumed it was just poking fun at the corporation.",
				"Well, now might be your chance to find out."
			],
			options: [
				{
					text: "Not worth losing your job",
					state: "mizumo_leaving"
				},
				{
					text: "Go help the trapped person",
					state: "mizumo_elevator_locked"
				}
			]
		},
		mizumo_elevator_locked: {
			location: 'Mizumo HQ, Service Elevator 07b',
			text: [
				"You step into the elevator. It looks like there are three sub-basements, but there are small lock icons near the buttons, and the elevator doesn't respond if you press them.",
			],
			options: [
				{
					condition: function(){return game.player.has(game.events.visited_room_2206)},
					text: "Return to Room 2206",
					state: "mizumo_room_2206"
				},
				{
					condition: function(){return !(game.player.has(game.events.visited_room_2206))},
					text: "Return to your office",
					state: "mizumo_return_to_desk"
				},
				{
					condition: function(){return (game.player.has(game.items.sb2_keycard))},
					text: "Use Mizumo Keycard",
					state: "mizumo_elevator_unlocked"
				}
			]
		},
		mizumo_elevator_unlocked: {
			location: 'Mizumo HQ, Service Elevator 07b',
			text: [
				"The lock icon on the button for sub-basement 2 disappears."
			],
			options: [
				{
					text: "Return to Room 2206",
					state: "mizumo_room_2206"
				},
				{
					text: "Go to Sub-Basement 2",
					state: "mizumo_sb2_arrive"
				},
				{
					text: "Last chance to wimp out",
					state: "mizumo_leaving"
				}
			]
		},
		mizumo_leaving: {
			location: 'Mizumo HQ, Front Lobby',
			text: [
				"You step out of the elevator into the cold front lobby of the Mizumo Headquarters building. Outside, the city is alive and bustling. Through the large glass doors, you see the "
			],
			options: [
				{
					condition: function(){return game.player.has(game.events.visited_room_2206)},
					text: "On second thought...",
					state: "mizumo_room_2206"
				},
				{
					condition: function(){return !(game.player.has(game.events.visited_room_2206))},
					text: "On second thought...",
					state: "mizumo_return_to_desk"
				},
				{
					text: "Leave Mizumo",
					callback: function(){
						game.setState("game_over");
					}
				}
			]
		},
		mizumo_return_to_desk:{
			location: 'Mizumo HQ, room 2503',
			text: [
				"You return to your desk. It's quiet here, now that your computer is in sleep mode, and there's nobody else around.",
				"You can hear the distant rumbling of the air system, punctuated occasionally by a car horn from outside.",
				"It's almost peaceful."
			],
			options: [
				{
					text: "Read the message from earlier",
					state: "mizumo_examine_alert"
				},
				{
					text: "Head back to the lobby",
					state: "mizumo_leaving"
				}
			]
		},
		mizumo_sb2_arrive: {
			location: "Mizumo HQ, Sub-Basement 2",
			checkpoint: {
				callback: function(){
					game.player.name = "debug";
				},
				player_required_inventory: [
					game.items.smartphone,
					game.items.sb2_keycard
				],
				player_optional_inventory: [
					//none
				],
				player_required_events: [
					"janus_message_read",
					"visited_room_2206"
				],
				player_optional_events: [
					"mizumo_opsec_called",
					"mizumo_2206_snooped"
				],
				script_state: "mizumo_sb2_arrive"
			},
			text: [
				"You step out of the elevator into a dark hallway. A light, alerted somehow to your presence, flickers on behind a door to your right.",
				"It's even quieter than upstairs here - which makes sense. You're underground, and can no longer hear the cars on the street out front.",
				"The low hum of the air circulation system is deeper and more sonorous here, yet the air feels stale and still."
			],
			options: [
				{
					text: "Go through the door to the right",
					state: "mizumo_sb2_rooms"
				},
				{
					text: "Look around a little more",
					state: "mizumo_sb2_elevator"
				}
			]
		},
		mizumo_sb2_elevator: {
			location: 'Mizumo HQ, Sub-Basement 2',
			text: [
				"You notice the elvator doors shut behind you with a sudden snap. The lights buzz on and off.",
				"You hear the elevator begin to rise behind you."
			],
			options: [
				{
					text: "Call the elevator",
					state: "mizumo_sb2_call_elevator"
				},
				{
					text: "Walk through the door to your right",
					state: "mizumo_sb2_arrive"
				},
				{
					text: "Look around near the elevator",
					state: "electrical_box"
				},
				{
					text: "Use your cell phone and call for help",
					state: "mizumo_sb2_cellphone",
					condition: function(){return !game.player.has(game.events.use_sb2_cellphone)}
				}
			]
		},
		mizumo_sb2_call_elevator: {
			location: 'Mizumo HQ, Sub-Basement 2',
			text: [
				"You press the call elevator button, but it doesn't respond. Only now do you realize the folly of going to the same place where someone just said they were trapped.",
				"There must be an emergency exit stairwell somewhere, but you don't know where. You turn on your cell phone flashlight."
			],
			options: [
				{
					text: "Go to the door on your right",
					state: "mizumo_sb2_arrive"
				},
				{
					text: "Look around near the elevator",
					state: "electrical_box"
				},
				{
					text: "Use your cell phone and call for help",
					state: "mizumo_sb2_cellphone",
					condition: function(){return !game.player.has(game.events.use_sb2_cellphone)}
				}
			]
		},
		electrical_box: {
			location: 'Mizumo HQ, Sub-Basement 2',
			text: [
				"There is an older electrical box mounted on the wall to the left of the elevator, buzzing softly.",
				"You can see a fresh handprint in the thin layer of dust on top."
			],
			options: [
				{
					text: "Examine the box",
					state: "electrical_box_interior"

				},
				{
					text: "Go to the door on your right",
					state: "mizumo_sb2_arrive"
				}
			]
		},
		electrical_box_interior: {
			location: 'Mizumo HQ, Sub-Basement 2',
			text: [
				"You find what seems to be a fresh piece of paper folded atop a small toolbox behind some wires...",
				{
					text: "MIZUMO CORP - MAINTENANCE & UPKEEP",
					color: "brown",
					font: "serif"
				},
				{
					text: "REPAIR TICKET -- SEE BOTTOM FOR ADDITIONAL NOTES",
					color: "brown",
					font: "serif"
				},
				{
					text: "Elevator Bays 1 - 7",
					color: "brown",
					font: "serif"
				},
				{
					text: "Please remove the green/white wires from each of the elevator boxes. Continental will be in over the weekend to do maintenence and they have requested that we do this beforehand.",
					color: "brown",
					font: "serif"
				},
				{
					text: "This will prevent the elevators from being called from sb2 and sb1 - you'll need to take the stairs. Make sure everyone is out of the office first.",
					color: "brown",
					font: "serif"
				},
				"There's a pocket multitool acting as a paperweight for the repair notice."
			],
			options: [
				{
					text: "Go through the door on your right",
					state: "mizumo_sb2_rooms"
				},
				{
					text: "Take the multitool",
					state: "mizumo_sb2_multitool"
				}
			]

		},
		mizumo_sb2_multitool: {
			location: 'Mizumo HQ, Sub-Basement 2',
			text: [
				"You pick up a small multitool, maybe it will come in handy later?"
			],
			callfore: function(){
				game.player.get(game.items.multitool);
			},
			options: [
				{
					text: "Go through the door on your right",
					state: "mizumo_sb2_rooms"
				}
			]
		},
		mizumo_sb2_rooms: {
			location: 'Mizumo HQ, Sub-Basement 2',
			text: [
				"You come to a junction with several doors."
			],
			options: [
				{
					text: "Return to the elevator",
					state: "mizumo_sb2_elevator"
				},
				{
					text: "Enter room S228",
					state: "mizumo_sb2_lockeddoor"
				},
				{
					text: "Enter room S229",
					state: "mizumo_sb2_rm229"
				},
				{
					text: "Enter room S230",
					state: "mizumo_sb2_rm230"
				}
			]
		},
	}
})(game);
