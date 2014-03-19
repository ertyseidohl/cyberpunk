;(function(exports) {
	exports.items = {
		"smartphone": {
			name: "Smartphone",
			battery: 56.0,
			isFlashlightOn: false,
			toString: function(){
				var str = this.name + " - " + (this.battery | 0) + "% battery";
				if(this.isFlashlightOn) str += "(Flashlight On)";
				return str;
			},
			loop: function(){
				rate = 1 / (60 * 60 * 5); // 5 minutes per drop
				if(this.isFlashlightOn) {
					rate *= 3;
				}
				this.battery -= rate;
			}
		},
		"sb4_keycard": "Mizumo Keycard",
		"multitool": "Multitool"
	};
})(game);
