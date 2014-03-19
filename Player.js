;(function(exports) {
	var Player = function(game) {
		this.game = game;
		this.items = game.items;
		this.inventory = {};
		this.name = '';
		this.location = '';
		this.flags = [];
		this.states = {};
	};

	/* FLAGS */
	Player.prototype.setFlag = function(flag, flagState, flagLoop) {
		if (typeof(flag) != "string") throw new Error("Flag Error: flag name is not a string");
		if (flagState === false) {
			console.log("FLAG UNSET: " + flag);
			this.removeFlag(flag);
		} else {
			console.log("FLAG SET: " + flag, flagState);
			var flagIndex = this.getFlag(flag, true);
			var newFlag = {
				name: flag,
				state: flagState
			};
			if (typeof(flagLoop) == "function") {
				newFlag.loop = flagLoop;
			}
			if (flagIndex) {
				this.flags = this.flags.splice(flagIndex, 1, newFlag);
			} else {
				this.flags.push(newFlag);
			}
		}
	};

	Player.prototype.removeFlag = function(flag) {
		var flagIndex = this.getFlag(flag, true);
		if (flagIndex === false) {
			console.log("WARNING: Tried to remove flag which was not already set: " + flag);
		}
		this.flags.splice(flagIndex, 1);
	};

	Player.prototype.getFlag = function(flagName, returnIndex) {
		var i;
		for(i = 0; i < this.flags.length; i++) {
			if(this.flags[i].name == flagName) return returnIndex ? i : this.flags[i];
		}
		return false;
	};

	Player.prototype.getFlagState = function(flagName) {
		var flag = this.getFlag(flagName);
		if(!flag) return false;
		return flag.state;
	}

	/* ITEMS */
	Player.prototype.get = function(item) {
		if (!item) throw new Error("Inventory Error: item is not an object");
		console.log("GOT ", item);
		if (this.has(item)) throw new Error ("Inventory Error: Player already has " + item);
		this.inventory[item] = true;
		this.game.updatePlayer();
	};

	Player.prototype.lose = function(item) {
		if (!item) throw new Error("Inventory Error: item is not an object");
		console.log("LOST ", item);
		if (!this.has(item)) throw new Error ("Inventory Error: Player cannot lose " + item);
		this.inventory[item] = false;
		this.game.updatePlayer();
	};

	Player.prototype.has = function(item) {
		return this.inventory[item] === true;
	};

	/* STATES */
	Player.prototype.visit = function(state_name) {
		if (this.states[state_name] === undefined) {
			this.states[state_name] = 1;
		} else {
			this.states[state_name] += 1;
		}
	};

	Player.prototype.visited = function(state_name) {
		return this.states[state_name] || 0;
	};

	exports.Player = Player;

})(this);
