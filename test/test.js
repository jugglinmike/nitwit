var nitwit = require("../nitwit.js");

exports.rightAlignedUrl = function(test) {

	var rau = nitwit.rightAlignedUrl;

	test.deepEqual(rau("from ethers tragic I am born again"), {
		score: 9,
		domainStart: 3,
		tldStart: 21,
		pathStart: 23,
		pathEnd: 34,
	}, "Correctly identifies the longest possible URL");

	test.equal(rau("zzzzzz"), undefined, "Returns undefined when no URL can be found");

	test.done();
};

exports.formatUrl = function(test) {
	var fu = nitwit.formatUrl;

	test.equal("today is.the.greatest.day/ive/ever/known",
		fu("today is the greatest day ive ever known", {
			score: 10,
			domainStart: 6,
			tldStart: 22,
			pathStart: 25,
			pathEnd: 40
		}), "Correctly formats a string into a URL as described by the 'split'");

	test.done();
};

exports.formatSolution = function(test) {

	var fs = nitwit.formatSolution;

	test.equal("Sp eak.to.me.in/a/language/I/u nders tand.Humor.me.bef.or/e/I/have/to/go",
		fs("Speak to me in a language I understand Humor me before I have to go", {
			score: 21,
			splits: [
				{
					offset: 1,
					score: 10,
					domainStart: 1,
					tldStart: 11,
					pathStart: 13,
					pathEnd: 28
				},
				{
					offset: 31,
					score: 10,
					domainStart: 3,
					tldStart: 20,
					pathStart: 22,
					pathEnd: 37
				}
			]
		}), "Formats a solution as expected");

	test.done();
};

exports.nitwit = function(test) {
	var n = nitwit.nitwit;

	test.equal("Welcom e.to.nowhere.fast.No/thing/here/eve r lasts.nothing.but.me/mories/of/what never was",
		n("Welcome to nowhere fast. Nothing here ever lasts nothing but memories of what never was"),
		"Finds the optimal solution for a given string");

	test.equal("Twi light.fades.throu.gh/blistered/aval o n.the.skies.cruel.to/rch/on/aching autobahn",
		n("Twilight fades through blistered avalon, the skies cruel torch on aching autobahn"),
		"Finds the optimal solution for a given string");

	test.equal("zzzzzzzzzzzzzzzzzzzzzzzzzzz",
		n("zzzzzzzzzzzzzzzzzzzzzzzzzzz"),
		"Returns original string when no URLs can be found");

	test.done();
};
