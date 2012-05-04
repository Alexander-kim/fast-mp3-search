Events = {};

Events.enableFocusCall = function() {
	if (location.search !== "?foo") {
		location.search = "?foo";
		throw new Error;
	}
};

Events.submitFormOnEnter = function() {
	window.addEventListener("keydown", function(event) {
		if (event.keyCode == 13) {
			return do_submit();
		}
	}, false);
};
