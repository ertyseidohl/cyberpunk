(function() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
})();

var game = new Game({
		input: "input",
		output: "output",
		player: "player",
		options: [
			"option1", "option2", "option3", "option4"
		]
	});

var init = function() {
	document.onkeyup = function(evt) {game.keyListener(evt.keyCode);};
	game.restart();
	requestAnimationFrame(loop);
};

var loop = function() {
	game.loop();
	window.requestAnimationFrame(loop);
};

//http://stackoverflow.com/a/12286303/374601
function onReady ( callback ) {
    var addListener = document.addEventListener || document.attachEvent,
        removeListener =  document.removeEventListener || document.detachEvent;
        eventName = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

    addListener.call(document, eventName, function() {
        removeListener( eventName, arguments.callee, false );
        callback();
    }, false );
}

onReady(init);

window.addEventListener('resize', function(event) {
  game.flow();
});
