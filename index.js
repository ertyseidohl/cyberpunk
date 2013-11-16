(function() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
})();

var game = null;

var init = function(){
	game = new Game({
		input: "input",
		output: "output",
		player: "player",
		options: [
			"option1", "option2", "option3", "option4"
		],
		script: createScript()
	});
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
