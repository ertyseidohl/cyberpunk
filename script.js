;(function(exports) {
	exports.script = {
		beginning:{
			callfore: function() {
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
				};
			},
			loop: function(frame) {
				if (this.done == 2) return;
				var anim = document.getElementById("anim");
				var anim2 = document.getElementById("anim2");
				this.size.x += Math.random() * 100;
				this.size.y += Math.random() * 100;

				if (this.size.x > this.size.xmax) {
					this.size.x = this.size.xmax;
					this.done = 1;
				}
				if (this.size.y > this.size.ymax) {
					this.size.y = this.size.ymax;
					if (this.done == 1) this.done = 2;
				}

				anim.style.width = this.size.x + "px";
				anim.style.height = this.size.y + "px";

				anim.style.marginTop = (-0.5 * this.size.y) + "px";
				anim.style.marginLeft = (-0.5 * this.size.x) + "px";

				if (this.done == 2) {
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
					state: "login"
				},
				{
					text: "Credits",
					state: "credits"
				}
			]
		},
		game_over: {
			callfore: function() {
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
			loop: function() {
				if (this.done < 3) {
					var anim = document.getElementById("anim");
					var anim2 = document.getElementById("anim2");
					this.size.x -= Math.random() * 100;
					this.size.y -= Math.random() * 100;

					if (this.size.x <= this.size.xmin) {
						this.size.x = this.size.xmin;
						this.done = 1;
					}
					if (this.size.y <= this.size.ymin) {
						this.size.y = this.size.ymin;
						if (this.done == 1) this.done = 2;
					}

					anim.style.width = this.size.x + "px";
					anim.style.height = this.size.y + "px";

					anim.style.marginTop = (-0.5 * this.size.y) + "px";
					anim.style.marginLeft = (-0.5 * this.size.x) + "px";

					if (this.done == 2) {
						this.done = 3;
						anim.innerHTML = "<input type='button' onclick='document.getElementById(\"anim\").innerHTML = \"\"; game.restart();' id='restart' value='Restart' />";
					}
				}
			}
		},
		login: {
			callfore: function() {
				game.typewriter.push(
					game.outEl,
					[
					"Please create a user for this session."
					],
					1,
					function(element) {
						var s = '';
						s += "Username: <input type='text' id='player-name' value='debug' autocomplete='off'/>";
						s += "<br /><br />";
						s += "Password: <input type='password' id='player-password' value='debug' autocomplete='off'/>";
						s += "<br /><br />";
						s += "Click <input type='button' id='player-submit' value='here'/> to start this session";
						game.outEl.innerHTML += s;
						var submit = document.getElementById('player-submit');
						submit.onclick = function() {
							var nameEl = document.getElementById("player-name");
							var passwordEl = document.getElementById("player-password");
							if (nameEl.value.length === 0) {
								nameEl.style.backgroundColor = "#220000";
							}
							if (passwordEl.value.length === 0) {
								passwordEl.style.backgroundColor = "#220000";
							}
							if (nameEl.value.length > 0 && passwordEl.value.length > 0) {
								game.player.name = nameEl.value;
								game.player.password = passwordEl.value;
								game.setState("start");
								game.updatePlayer();
							}
						};
					}
				);
			}
		},
		credits: {
			location: "Boulder, CO and Brooklyn, NY",
			callfore: function() {
				game.player.name = "Handprint Industries";
				game.player.inventory = ["Awesomeness", "Silly Hats"];
			},
			callback: function() {
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
					text: "Jorge Seidel, Levi Satter"
				}
			],
			options: [
				{
					text: "Back",
					state: "beginning"
				}
			]
		},
		start: {
			location: 'Mizumo HQ, room 2503',
			callfore: function() {
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
					state: "examine_alert"
				},
				{
					text: "Ingore Alert",
					state: "leaving"
				}
			]
		},
		examine_alert: {
			location: 'Mizumo HQ, room 2503',
			color: "blue",
			text: [
				"To: __NAME_UC__",
				"From: JORDAN LANDES",
				"Subject: HELP PLEASE",
				"I'M TRAPPED IN ROOM S438 IN SUB-BASEMENT 4. IS ANYONE STILL AROUND? I'VE TRIED CALLING SECURITY BUT THEY AREN'T ANSWERING.",
				"I KNOW THIS IS TOTALLY AGAINST POLICY, BUT THERE'S A SPARE KEYCARD IN MY DESK (ROOM 2206) IN THE THIRD DRAWER DOWN THAT WILL GET YOU INTO THE BASEMENT.",
				"I'VE BEEN DOWN HERE A LONG TIME ALREADY AND I REALLY DON'T WANT TO BE HERE UNTIL MONDAY!",
				"PLEASE HELP ME!",
				"JORDAN"
			],
			options: [
				{
					text: "Go to Room 2206",
					state: "room_2206"
				},
				{
					text: "Go to Elevator",
					state: "elevator_call"
				},
				{
					text: "Ignore Message",
					state: "leaving"
				},
				{
					condition: function() {return !(game.player.visited('call_opsec'));},
					text: "Make OpSec deal with it",
					state: "call_opsec"
				},
				{
					condition: function() {return game.player.visited('call_opsec');},
					text: "Call the Opsec office again",
					state: "call_opsec"
				}
			]
		},
		room_2206: {
			location: 'Mizumo HQ, room 2206',
			text: [
				"Room 2206 is an office on the 22nd floor - three floors down from you. It's a smaller office than yours, for what that's worth.",
				"You have an uneasy feeling, but it's probably becuase most of the lights are off here and there's nobody around."
			],
			options: [
				{
					condition: function() {return !(game.player.visited('room_2206_examine'));},
					text: "Look Around",
					state: "room_2206_examine"
				},
				{
					condition: function() {return !(game.player.has(game.items.sb4_keycard));},
					text: "Get Keycard",
					state: "room_2206_keycard"
				},
				{
					condition: function() {return !(game.player.visited('room_2206_examine'));},
					text: "Snoop around in the office",
					state: "room_2206_examine"
				},
				{
					text: "Go to Elevator",
					state: "elevator_call"
				}
			]
		},
		room_2206_examine: {
			location: 'Mizumo HQ, room 2206',
			text: [
				"You hear the small whine of something mechanical behind you, and you whip around. You see a security camera zooming in on you. Idiots in Opsec have time to watch you on the camera but not save people in the basement.",
				function() {if (!game.player.visited('call_opsec')) return "Come to think of it, you could probably just call Opsec and have them rescue James or whoever they were.";},
				"You notice that this room seems... almost too empty for someone to be working in it. There's barely anything on the desk. Either way, it looks like the keycard should be where they said."
			],
			options: [
				{
					condition: function() {return !(game.player.has(game.items.sb4_keycard));},
					text: "Get Keycard",
					state: "room_2206_keycard"
				},
				{
					condition: function() {return !(game.player.visited('call_opsec'));},
					text: "Call the Opsec office",
					state: "call_opsec"
				},
				{
					text: "Go to Elevator",
					state: "elevator_call"
				}
			]
		},
		call_opsec: {
			location: undefined,
			text: [
				{
					text: "You pick up your relic of a desk phone, and dial the extension for Operations Security."
				},
				{
					text: "\"Thank you for calling Mizumo Operations Security Office. For Emergencies, press 1. For Non-emergencies, press 2.\"",
					color: "red"
				},
				function() {
					if (!(game.player.visited('call_opsec'))) return "Oh, right. OpSec goes home at 6pm like everyone else.";
				},
				function() {
					if (!(game.player.visited('call_opsec'))) return "You'd think a multi-million dollar corporation would have 24-hour security. But no, it's this automated system.";
				}
			],
			options: [
				{
					text: "Emergencies",
					state: "call_opsec_emergencies"
				},
				{
					text: "Non-Emergencies",
					state: "call_opsec_non_emergencies"
				},
				{
					text: "Nevermind",
					state: "call_opsec_end"
				}
			]
		},
		call_opsec_non_emergencies: {
			location: undefined,
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
					state: "call_opsec"
				},
				{
					text: "Give up and go home",
					state: "leaving"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2206";},
					text: "Go to Elevator",
					state: "elevator_call"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2206" && !(game.player.has(game.items.sb4_keycard));},
					text: "Get Keycard from Desk",
					state: "room_2206_keycard"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2503";},
					//player is in their own office
					text: "Go to Room 2206",
					state: "room_2206"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2503";},
					//player is in their own office
					text: "Ignore the message - go home",
					state: "leaving"
				}
			]
		},
		call_opsec_emergencies: {
			location: undefined,
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
					state: "call_opsec"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2206";},
					text: "Too creepy - give up and go home",
					state: "leaving"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2206";},
					text: "Go to Elevator",
					state: "elevator_call"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2206" && !(game.player.has(game.items.sb4_keycard));},
					text: "Get Keycard from Desk",
					state: "room_2206_keycard"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2503";},
					//player is in their own office
					text: "Go to Room 2206",
					state: "room_2206"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2503";},
					//player is in their own office
					text: "Ignore the message - go home",
					state: "leaving"
				}
			]
		},
		call_opsec_end:{
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
					condition: function() {return game.player.location == "Mizumo HQ, room 2206" && !(game.player.has(game.items.sb4_keycard));},
					//player is in downstairs office, no keycard
					text: "Get Keycard from Desk",
					state: "room_2206_keycard",
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2206";},
					text: "Go to Elevator",
					state: "elevator_call"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2503";},
					//player is in their own office
					text: "Ignore the message - go home",
					state: "elevator_call"
				},
				{
					condition: function() {return game.player.location == "Mizumo HQ, room 2503";},
					//player is in their own office
					text: "Go to Room 2206",
					state: "room_2206"
				},
			]

		},
		room_2206_keycard: {
			location: 'Mizumo HQ, room 2206',
			callfore: function() {
				game.player.get(game.items.sb4_keycard);
			},
			text: [
				"You pick up the keycard. It looks like your own, except their department code is \"AIRT\", which you've never heard of. The name on the keycard is \"Jordan Landes\"."
			],
			options: [
				{
					text: "Put the keycard back and go home",
					callback: function() {
						game.player.lose(game.items.sb4_keycard);
					},
					state: "leaving"
				},
				{
					text: "Go help Jordan",
					state: "elevator_call"
				}
			]
		},
		elevator_call: {
			location: 'Mizumo HQ, Service Elevator 07b',
			text: [
				"You press the button to call an elevator. The door directly behind you opens with a small \"ding!\"",
				"As you step into the elevator, the small security camera in the corner whines quietly, obscured by semi-opaque glass.",
				"Mizumo HQ uses smart elevators - the usual button panel is replaced by a touchscreen. There is also a keycard access panel installed just above the controls."
			],
			options: [
				{
					text: "Go to front lobby",
					state: "leaving"
				},
				{
					condition: function() {return game.player.visited('room_2206');},
					text: "Return to Room 2206",
					state: "room_2206"
				},
				{
					condition: function() {return game.player.visited('room_2206');},
					text: "Return to your office",
					state: "return_to_desk"
				},
				{
					condition: function() {return (game.player.has(game.items.sb4_keycard));},
					text: "Use Mizumo Keycard",
					state: "elevator_unlocked"
				}
			]
		},
		elevator_unlocked: {
			location: 'Mizumo HQ, Service Elevator 07b',
			text: [
				"The lock icon on the button for Sub-Basement 4 disappears."
			],
			options: [
				{
					text: "Return to Room 2206",
					state: "room_2206"
				},
				{
					text: "Go to Sub-Basement 4",
					state: "sb4_arrive"
				},
				{
					text: "Go to ground floor and leave",
					state: "leaving"
				},
				{
					text: "Return to your office",
					state: "return_to_desk"
				}
			]
		},
		leaving: {
			location: 'Mizumo HQ, Service Elevator 07b',
			text: [
				"You punch the touchscreen button labeled \"lobby\" in the elevator, and begin to descend.",
				"The express elevators here actually live up to their name: you can feel the pressure in your ears from descending so quickly.",
				"The touchscreen displays \"Lobby - Floor 1\" for just a moment before going black. The car continues to descend.",
				"The doors open to a room you've never seen before. Judging by the distance you've travelled, you must be underground."
			],
			options: [
				{
					text: "Leave the elevator",
					state: "sb4_arrive"
				},
				{
					text: "Try to call the elevator",
					state: "sb4_call_elevator"
				}
			]
		},
		return_to_desk:{
			location: 'Mizumo HQ, room 2503',
			text: [
				"You return to your desk. It's quiet here, now that your computer is in sleep mode, and there's nobody else around.",
				"You can hear the distant rumbling of the air system, punctuated occasionally by a car horn from outside.",
				"It's almost peaceful."
			],
			options: [
				{
					text: "Read the message from earlier",
					state: "examine_alert"
				},
				{
					text: "Head back to the lobby",
					state: "leaving"
				}
			]
		},
		sb4_arrive: {
			location: "Mizumo HQ, Sub-Basement 4, Elevator Room",
			checkpoint: {
				callback: function() {
					game.player.name = "debug";
				},
				player_required_inventory: [
					game.items.smartphone,
					game.items.sb4_keycard
				],
				player_optional_inventory: [
					//none
				],
				script_state: "sb4_arrive"
			},
			text: [
				"You step out of the elevator into a dark hallway. A light, alerted somehow to your presence, flickers on behind a door to your right.",
				"It's even quieter than upstairs here - which makes sense. You're underground, and can no longer hear the cars on the street out front.",
				"The low hum of the air circulation system is deeper and more sonorous here, yet the air feels stale and still."
			],
			options: [
				{
					text: "Go through the door to the right",
					state: "sb4_rooms"
				},
				{
					text: "Look around a little more",
					state: "sb4_elevator"
				}
			]
		},
		sb4_elevator: {
			location: 'Mizumo HQ, Sub-Basement 4, Elevator Room',
			text: [
				function(){ if (!game.player.visited('sb4_elevator')) return "You notice the elvator doors shut behind you with a sudden snap. The lights buzz on and off.";},
				function(){ if (!game.player.visited('sb4_elevator')) return "You hear the elevator begin to rise behind you.";}
			],
			options: [
				{
					text: "Call the elevator",
					state: "sb4_call_elevator"
				},
				{
					text: "Walk through the door to your right",
					state: "sb4_arrive"
				},
				{
					text: "Look around near the elevator",
					state: "electrical_box"
				},
			]
		},
		sb4_call_elevator: {
			location: 'Mizumo HQ, Sub-Basement 4, Elevator Room',
			text: [
				function(){if (!game.player.visited('leaving')) return "You press the call elevator button, but it doesn't respond. Only now do you realize the folly of going to the same place where someone just said they were trapped.";},
				function(){if (game.player.visited('leaving')) return "You attempt to call an elevator, but all of the elevators seem to be deactivated, or at least not responsive to your button pushing.";},
				"There must be an emergency exit stairwell somewhere, but you don't know where."
			],
			options: [
				{
					text: "Go to the door on your right",
					state: "sb4_arrive"
				},
				{
					text: "Look around near the elevator",
					state: "electrical_box"
				},
			]
		},
		electrical_box: {
			location: 'Mizumo HQ, Sub-Basement 4, Elevator Room',
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
					state: "sb4_arrive"
				}
			]
		},
		electrical_box_interior: {
			location: 'Mizumo HQ, Sub-Basement 4, Elevator Room',
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
					text: "This will prevent the elevators from being called from sb4 and sb3 - you'll need to take the stairs. Make sure everyone is out of the office first.",
					color: "brown",
					font: "serif"
				},
				"There's a pocket multitool acting as a paperweight for the repair notice."
			],
			options: [
				{
					text: "Go through the door on your right",
					state: "sb4_rooms"
				},
				{
					text: "Take the multitool",
					state: "sb4_multitool"
				}
			]
		},
		sb4_multitool: {
			location: 'Mizumo HQ, Sub-Basement 4, Elevator Room',
			text: [
				"You pick up a small multitool, maybe it will come in handy later?"
			],
			callfore: function() {
				game.player.get(game.items.multitool);
			},
			options: [
				{
					text: "Go through the door on your right",
					state: "sb4_rooms"
				}
			]
		},
		sb4_rooms: {
			location: 'Mizumo HQ, Sub-Basement 4, Corridor SB430',
			text: [
				"You come to a junction with three closed doors. The only light here is a single, buzzing flourescent tube, which reflects off the tile underfoot. The air here feels colder, and you hear the humming of electronic equipment through the walls.",
				{
					condition: function(){return game.player.getFlag('banging_sounds');},
					text: "The banging noise is louder now! You hear it, still somewhat muffled, behind the door to room S438."
				},
				{
					condition: function(){return !game.player.visited('sb4_rooms');},
					text: "You hear the small whine of a security camera. There is one above the door to S438, and you catch the glint of the lens as it brings you into focus."
				}
			],
			options: [
				{
					text: "Return to the elevator",
					state: "sb4_elevator"
				},
				{
					condition: function(){return !game.player.has(sb4_keycard);},
					text: "Enter room S437",
					state: "sb4_rm37_locked"
				},
				{
					condition: function(){return game.player.has(sb4_keycard) && !game.player.visited('sb4_rm37_light');},
					text: "Enter room S437",
					state: "sb4_rm37_dark"
				},
				{
					condition: function(){return game.player.visited('sb4_rm37_light');},
					text: "Enter room S437",
					state: "sb4_rm37_light"
				},
				{
					text: "Enter room S438",
					state: "sb4_rm38_pre"
				},
				{
					text: "Enter room S439",
					state: "sb4_rm39_locked"
				}
			]
		},
		sb4_rm37_locked: {
			location: "Mizumo HQ, Sub-Basement 4, Corridor SB430",
			text: [
				"The door is locked. There's a keycard reader next to it, but you don't have access here.",
			],
			options: [
				{
					text: "Enter room S438",
					state: "sb4_rm38_pre"
				},
				{
					text: "Enter room S439",
					state: "sb4_rm39_locked"
				}
			],
		},
		sb4_rm37_dark: {
			location: "Mizumo HQ, Sub-Basement 4, Room 37",
			text: [
				"You scan Jordan Landes' keycard and enter the room. It's dark in here.",
			],
			options: [
				{
					text: "Turn on the lights",
					state: "sb4_rm37_light"
				},
				{
					text: "Use your cellphone flashlight",
					state: "sb4_rm37_flashlight"
				},
			],
		},
		sb4_rm37_flashlight: {
			location: "Mizumo HQ, Sub-Basement 4, Room 37",
			text: [
				"",
			],
			options: [
				{
					text: "",
					state: ""
				},
			],
		},
		sb4_rm37_light: {
			location: "Mizumo HQ, Sub-Basement 4, Room 37",
			text: [
				"",
			],
			options: [
				{
					text: "",
					state: ""
				},
			],
		},
		sb4_rm37_examine: {
			location: "Mizumo HQ, Sub-Basement 4, Room 37",
			text: [
				"",
			],
			options: [
				{
					text: "",
					state: ""
				},
			],
		},
		sb4_rm38_pre: {
			location: "Mizumo HQ, Sub-Basement 4, Room 38",
			text: [
				"",
			],
			options: [
				{
					text: "",
					state: ""
				},
			],
		},
		sb4_rm39_locked: {
			location: "Mizumo HQ, Sub-Basement 4, Corridor SB430",
			text: [
				"",
			],
			options: [
				{
					text: "",
					state: ""
				},
			],
		},
	};
})(game);
