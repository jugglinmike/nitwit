(function( window, $, undefined) {
	var $originalTweet, $originalRemaining, $nitwitTweet, $nitwitRemaining;

	// Regex taken from: http://stackoverflow.com/questions/3809401/javascript-url-regex
	function isUrl( str ) {
		return /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/gi.test(str);
	}

	function countChars( str ) {
		var parts = str.split(" ");
		var mlen = -1;
		$.each(parts, function(idx, elem) {
			if (isUrl(elem) ) {
				mlen += 20;
			} else {
				mlen += elem.length;
			}
			mlen += 1;
		});
		return mlen;
	}

	function getTweetCharsRemaining( msg ) {
		return 140 - countChars(msg);
	}

	function updateCharsRemaining() {

		var message = $originalTweet.val();

		$originalRemaining.text(getTweetCharsRemaining(message));
	}

	function applyNitwit() {

		var message = $originalTweet.val();
		var transformed = nitwit.nitwit( message );

		updateCharsRemaining();

		$nitwitTweet.text(transformed);
		$nitwitRemaining.text(getTweetCharsRemaining(transformed));
	}

	$(function() {
		$originalTweet = $(".tweet-view.normal .content");
		$originalRemaining = $(".tweet-view.normal .char-count");
		$nitwitTweet = $(".tweet-view.nitwit .content");
		$nitwitRemaining = $(".tweet-view.nitwit .char-count");

		$originalTweet.on("keyup", updateCharsRemaining);
		$(".tweet-view.nitwit .label").on("click", applyNitwit);
	});

})( this, this.$ );
