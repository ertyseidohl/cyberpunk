var createScript = function(){return {
	beginning:{
		text: ["This Game is best played in fullscreen.",
				"Most browsers access fullscreen by pressing F11.",
				"Please adjust your browser, then hit '1' to continue.",
				"(You can hit the tilde/backtick key to skip text animations)"],
		options: [
			{
				text: "Log In",
				callback: function(){
					game.setState("login");
				}
			}
		]
	},
	mizumo_start: {
		location: 'Mizumo HQ, room 2503',
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
			"Mizumo Corporation is a world renowned Computing and Simulation corporation - and you spend all your time writing stupid SEO stuff for the website. Someone's gotta do it.",
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
		color: "#0000ff",
		text: [
			"To: __NAME_UC__",
			"From: JANUS",
			"Subject: HELP PLEASE",
			"I'M TRAPPED IN ROOM 0029 IN SUB-BASEMENT 2. IS ANYONE STILL AROUND? I'VE TRIED CALLING SECURITY BUT THEY AREN'T ANSWERING.",
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
				condition: function(){return game.player.events["mizumo_opsec_line_dead"] == undefined},
				text: "Make OpSec deal with it",
				state: "mizumo_call_opsec"
			},
			{
				condition: function(){return game.player.events["mizumo_opsec_line_dead"] == true},
				text: "Call the Opsec office again",
				state: "mizumo_call_opsec_dead"
			}
		]
	},
	mizumo_room_2206: {
		location: 'Mizumo HQ, room 2206',
		text: [
			"Room 2206 is a noffice on the 22nd floor - three floors down from you. It's a smaller office than yours, for what that's worth.",
			"You have an uneasy feeling, but it's probably becuase most of the lights are off here and there's nobody around."
		],
		options: [
			{
				condition: function(){return game.player.events["mizumo_2206_snooped"] == undefined},
				text: "Look Around",
				callback: function(){
					game.player.events["mizumo_2206_snooped"] = true;
					game.setScriptState("mizumo_room_2206_examine");
				}
			},
			{
				condition: function(){return game.player.inventory.indexOf(game.items.sb2_keycard) == -1},
				text: "Get Keycard",
				callback: function(){
					game.player.inventory.push(game.items.sb2_keycard);
					game.updatePlayer();
					game.setScriptState("mizumo_room_2206_keycard");
				}
			},
			{
				condition: function(){return game.player.events["mizumo_2206_snooped"] == undefined},
				text: "Snoop around in the office",
				callback: function(){
					game.player.events["mizumo_2206_snooped"] = true;
					game.setScriptState("mizumo_room_2206_examine");
				}
			},
			{
				text: "Go to Elevator",
				state: "mizumo_elevator_locked"
			}
		]
	},
	mizumo_room_2206_examine: {
		location: 'Mizumo HQ, room 2206',
		text: [
			"You hear the small whine of something mechanical behind you, and you whip around. You see a security camera zooming in on you. Idiots in Opsec have time to watch you on the camera but not save people in the basement.",
			function(){if(!game.player.events["mizumo_opsec_line_dead"]) return "Come to think of it, you could probably just call Opsec and have them rescue James or whoever they were."},
			"You notice that this room seems... almost too empty for someone to be working in it. There's barely anything on the desk. Either way, it looks like the keycard should be where they said."
		],
		options: [
			{
				condition: function(){return game.player.inventory.indexOf(game.items.sb2_keycard) == -1},
				text: "Get Keycard",
				state: "mizumo_room_2206_keycard"
			},
			{
				condition: function(){return game.player.events["mizumo_opsec_line_dead"] == undefined},
				text: "Call the Opsec office",
				state: "mizumo_call_opsec"
			},
			{
				condition: function(){return game.player.events["mizumo_opsec_line_dead"] == true},
				text: "Call the Opsec office",
				state: "mizumo_call_opsec_dead"
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
			"\"Hello, Mizumo Opsec.\""
		],
		color: "red",
		options: [
			{
				text: "Tell them about the person in the basement",
				state: "mizumo_call_opsec_tell"
			},
			{
				text: "Nevermind",
				state: "mizumo_call_opsec_end"
			}
		]
	},
	mizumo_call_opsec_tell: {
		location: undefined,
		callfore: function(){
			game.player.events["mizumo_opsec_line_dead"] = true;
		},
		text: [
			"You're about to start explaining, when the line suddenly goes dead. Weird."
		],
		options: [
			{
				text: "Call opsec again.",
				state: "mizumo_call_opsec_dead"
			},
			{
				text: "Too creepy - give up and go home",
				state: "mizumo_leaving"
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) != -1},
				text: "Go to Elevator",
				state: "mizumo_elevator_locked"
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) == -1},
				text: "Go to Elevator",
				state: "mizumo_elevator_locked"
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) == -1},
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
			"\"Okay, thank you for calling.\""
		],
		color: "red",
		options: [
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) == -1},
				//player is in downstairs office, no keycard
				text: "Get Keycard from Desk",
				state: "mizumo_room_2206_keycard",
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) == -1},
				//player is in downstairs office, no keycard
				text: "Go to Elevator",
				state: "mizumo_elevator_locked"
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) != -1},
				//player is in downstairs office, keycard
				text: "Go to Elevator",
				state: "mizumo_elevator_locked"
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) != -1},
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
	mizumo_call_opsec_dead: {
		location: undefined,
		text: [
			"You pick up the phone, but there's no dial tone."
		],
		options: [
			{
				text: "Too creepy - give up and go home",
				state: "mizumo_leaving"
			},
			{
				text: "Go to Elevator",
				state: "mizumo_elevator_locked"
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2206" && game.player.inventory.indexOf(game.items.sb2_keycard) == -1},
				text: "Get Keycard from Desk",
				state: "mizumo_room_2206_keycard"
			},
			{
				condition: function(){return game.player.location == "Mizumo HQ, room 2503"},
				//player is in their own office
				text: "Go to Room 2206",
				state: "mizumo_room_2206"
			}
		]
	},
	mizumo_room_2206_keycard: {
		location: 'Mizumo HQ, room 2206',
		callfore: function(){
			game.player.inventory.push(game.items.sb2_keycard);
			game.updatePlayer();
		},
		text: [
			"You pick up the keycard. It looks like your own, except that their department code is \"AIR\", which you've never heard of. The name on the keycard is \"Jason Landes\".",
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
			"You step into the elevator. It looks like there are three sub basements, but there are small lock icons near them, and the elevator doesn't respond if you press them.",
		],
		options: [
			{
				text: "Return to Room 2206",
				state: "mizumo_room_2206"
			},
			{
				condition: function(){return game.player.inventory.indexOf(game.items.sb2_keycard) != -1},
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
			"You step out of the elevator into the cold "
		],
		options: [
			{
				text: "On second thought...",
				state: "mizumo_room_2206"
			}
		]
	},
	mizumo_sb2_arrive: {
		location: 'Mizumo HQ, Sub-Basement 2',
		text: [
			""
		]
	}
}};
