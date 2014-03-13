;(function(exports) {
	var Player = function() {
		this.inventory = {};
		this.name = '';
		this.location = '';
		this.flags = {};
		this.states = {};
	};

	/* FLAGS */
	Player.prototype.setFlag = function(flag, flag_state) {
		if (!typeof(flag) == "string") throw new Error("Flag Error: flag name is not a string");
		console.log("FLAG SET: " + flag, flag_state);
		this.flags[flag] = flag_state;
	};

	Player.prototype.getFlag = function(flag) {
		return this.flag || false;
	}

	/* ITEMS */
	Player.prototype.get = function(item) {
		if(!item) throw new Error("Inventory Error: item is not an object");
		console.log("GOT " + item);
		if(this.has(item)) throw new Error ("Inventory Error: Player already has " + item);
		this.inventory[item] = true;
		game.updatePlayer();
	};

	Player.prototype.lose = function(item) {
		if(!item) throw new Error("Inventory Error: item is not an object");
		console.log("LOST " + item);
		if(!this.has(item)) throw new Error ("Inventory Error: Player cannot lose " + item);
		this.inventory[item] = false;
		game.updatePlayer();
	};

	Player.prototype.has = function(item) {
		return this.inventory[item] === true;
	};

	/* STATES */
	Player.prototype.visit = function(state_name) {
		if (this.states[state_name] == undefined) {
			this.states[state_name] = 1;
		} else {
			this.states[state_name] += 1;
		}
	}

	Player.prototype.visited = function(state_name) {
		return this.states[state_name] || 0;
	}

	exports.Player = Player;

})(this);
