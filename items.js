;(function(exports) {
	exports.items = {
		"credits0": "Awesomeness",
		"credits1": "Silly Hats",
		"smartphone": {
			name: "Smartphone",
			battery: 56.0,
			isFlashlightOn: false,
			displayString: function(){
				var str = this.name + " - " + (this.battery | 0) + "% battery";
				if(this.isFlashlightOn) str += "(Flashlight On)";
				return str;
			},
			loop: function(){
				if(this.battery <= 0) {
					this.battery = 0;
					return;
				}
				var battInt = this.battery | 0;
				rate = 1/60; // 5 minutes per drop
				if(this.isFlashlightOn) {
					rate *= 3;
				}
				this.battery -= rate;
				return (this.battery | 0) != battInt;
			}
		},
		"sb4_keycard": "Mizumo Keycard",
		"multitool": "Multitool"
	};
})(game);
