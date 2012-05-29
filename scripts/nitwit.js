(function( global, undefined ) {

	var nitwit = {};
	var previousNitwit = global.nitwit;

	// "Contants"
	var CONST =  {
		maxHost: 20,
		maxPath: 14,
		minTld: 2,
		maxTld: 2,
		minUrl: 21
	};

	var tlds = [
		"ac", "ad", "ae", "af", "ag", "ai", "al", "am", "an", "ao", "aq", "ar", "as", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cr", "cs", "cu", "cv", "cx", "cy", "cz", "dd", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee", "eg", "eh", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "ss", "st", "su", "sv", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "ye", "yt", "yu", "za", "zm", "zw"
	];

	// TODO: add support for longer TLDs
	var regex = nitwit.regex = new RegExp(
		// Host
		"("
			// Leading spaces
			+ "\\s*"
			+ ".{"
				// A constant modifier of -1 is necessary to account for the dot
				// separator that must be added between domain label and tld
				+ (CONST.minUrl-CONST.maxPath-CONST.maxTld-1) + ","
				+ (CONST.maxHost-CONST.maxTld-1)
			+ "}"
			// Trailing spaces
			+ "\\s*"
		+ ")"
		// TLD (and optional separator)
		+ "("
			// Capture any character(s) that may be replaced with a dot
			+ "([^a-z0-9-_]*)"
			// Match the TLD itself
			+ "(?:" + tlds.join("|") + ")"
		+ ")"
		// Path
		+ "("
			// Leading spaces (should not count against path length)
			+ "\\s*"
			+ ".{0," + (CONST.maxPath) + "}"
			// Trailing spaces (should not count against path length)
			+ "\\s*"
		+ ")"
		// The URL should be right-aligned
		+ "$",
	"i");

	var noConflict = nitwit.noConflict = function() {
		global.nitwit = previousNitwit;
		return nitwit;
	};

	// Return the indices which descibe the longest URL within a given
	// string. (Only considers "right-aligned" URLs to bound this problem and
	// avoid repeating work of earlier problems.) Additionally, calculate a
	// score for the URL found (higher numbers are better)
	var rightAlignedUrl = nitwit.rightAlignedUrl = function( str ) {

		var match = regex.exec(str);
		var domainLabel, dot, tld, path, strLen, matchIdx, score;
		if (!match) {
			return;
		}
		strLen = str.length;
		domainLabel = match[1];
		tld = match[2];
		dot = match[3] || "";
		path = match[4];
		matchIdx = match.index;

		score = domainLabel.length + 1 + tld.length + 1 + path.length - CONST.minUrl
			// Bonus points for using an already-present dot
			+ dot.length
			// Lost points for un-used characters
			- matchIdx;

		return {
			score: score,
			domainStart: matchIdx,
			tldStart: matchIdx + domainLabel.length,
			pathStart: matchIdx + domainLabel.length + tld.length,
			pathEnd: strLen
		};
	};

	var formatUrl = nitwit.formatUrl = function( str, split ) {

		var unusedChars = "";
		
		if (split.domainStart) {
			unusedChars = str.slice(0, split.domainStart);
			if (unusedChars.charAt(unusedChars.length-1) !== " ") {
				unusedChars += " ";
			}
		}

		return unusedChars +
			// Host formatting
			str.slice(split.domainStart, split.tldStart)
				// Remove leading and trailing spaces
				.replace(/(^ +)|( +$)/g, "")
				// Replace interior spaces with dots
				.replace(/ /g, ".")
				// Remove invalid characters
				.replace(/[^a-z0-9-_\.]/gi, "")
				+
			"." +
			str.slice(split.tldStart, split.pathStart) + "/" +
			// Path formatting
			str.slice(split.pathStart)
				// Remove leading and trailing spaces
				.replace(/(^ +)|( +$)/g, "")
				// Replace interior spaces with slashes
				.replace(/ /g, "/");
	};

	var formatSolution = nitwit.formatSolution = function( str, solution ) {

		var splitIdx, splitCount, currentSplit, nextSplit;
		var firstSplit = solution.splits[0];
		var lastSplit = solution.splits[ solution.splits.length-1];
		var formatted = "";

		if (firstSplit && firstSplit.offset) {
			formatted += str.slice(0, firstSplit.offset);

			// Only insert a space before the first split if it begins with the
			// domain
			if (!firstSplit.domainStart) {
				formatted += " ";
			}
		}

		for (splitIdx = 0, splitCount = solution.splits.length; splitIdx < splitCount; ++splitIdx) {
			currentSplit = solution.splits[splitIdx];
			nextSplit = solution.splits[splitIdx+1];

			formatted += formatUrl(
				str.slice(currentSplit.offset, currentSplit.offset + currentSplit.pathEnd),
				currentSplit );

			if (nextSplit) {
				if (currentSplit.offset + currentSplit.pathEnd - nextSplit.offset) {
					formatted += " " + str.slice(currentSplit.offset + currentSplit.pathEnd, nextSplit.offset);
				}
				if (!nextSplit.domainStart) {
					formatted += " ";
				}
			}
		}

		if (lastSplit && lastSplit.offset + lastSplit.pathEnd < str.length) {
			formatted += " " + str.slice(lastSplit.offset + lastSplit.pathEnd);
		}

		return formatted;
	};

	// Transform the input string into a series of URL-like substrings
	nitwit.nitwit = function( str ) {
		var idx, jdx, bestSub, currentSub, split;
		var len = str.length;
		var subSolutions = [];
		str = str.replace(/[^a-z0-9-_]+/gi, " ");

		for (idx = 0; idx <= len; ++idx) {
			// Generate subsolutions
			bestSub = {
				score: Number.NEGATIVE_INFINITY
			};
			for (jdx = 0; jdx < idx; ++jdx) {
				currentSub = {
					splits: []
				};

				split = rightAlignedUrl( str.slice(jdx, idx) );

				if (split) {
					if ("score" in currentSub) {
						currentSub.score += split.score;
					} else {
						currentSub.score = split.score;
					}
					split.offset = jdx;
					currentSub.splits.push(split);
				}

				if (subSolutions[jdx-1]) {
					if ("score" in currentSub) {
						currentSub.score += subSolutions[jdx-1].score;
					} else {
						currentSub.score = subSolutions[jdx-1].score;
					}
					currentSub.splits = subSolutions[jdx-1].splits.concat(currentSub.splits);
				}

				if ("score" in currentSub && currentSub.score > bestSub.score) {
					bestSub = currentSub;
				}
			}
			if (bestSub.score > Number.NEGATIVE_INFINITY) {
				subSolutions[idx] = bestSub;
			}
		}

		if (subSolutions[idx-1]) {
			return formatSolution(str, subSolutions[idx-1]);
		} else {
			return str;
		}
	}

	if (typeof exports !== "undefined") {
		for (var attr in nitwit) {
			if (nitwit.hasOwnProperty(attr)) {
				exports[attr] = nitwit[attr];
			}
		};
	} else {
		global.nitwit = nitwit;
	}

})( this );
