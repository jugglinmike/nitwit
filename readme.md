niTwit
======

Exploit Twitter's URL shortener to write tweets with more than 140 characters

Description
-----------

To shorten URL's, Twitter takes links of variable length and consistently
produces links of length 20. Despite this shortening, it still displays a
"partial" of the origin URL. This partial can be *longer* than the 20
characters subtracted from your tweet.

For example, the following URL

	https://github.com/rwldrn/johnny-five

Is 37 characters long. Attempt to tweet it, and you'll see that you still have
120 characters remaining. This is because Twitter will replace that long URL
with a shortened version, such as:

	https://t.co/YzTM9t0A

...which is only 20 characters long. When you view the tweet on Twitter, you
will see:

	github.com/rwldrn/johnny-...

...and THIS string is 25 characters long. In short, there were 5 "free"
characters tweeted.

Use at your own risk
--------------------

While I can't imagine the develpers at Twitter appreciate using their URL
shortener in this way, the real danger comes from automated spam detection.
Tweets authored by niTwit will appear to be spam. Don't make a habit of using
it.

Transformation Criteria
-----------------------

niTwit attempts to format your tweet as a series of strings that look like
URLs. In order to fool Twitter into thinking the transformation contains actual
URL's (and not just your smarmy political commentary), the URL's need to follow
some rules.

As far as I can tell, the rules are:

* The "host" string must match the grammer defined by
  [RFC3968](http://tools.ietf.org/html/rfc3986)
* The "host" string must be 20 characters or less
* The "TLD" string must be an actual TLD (I've sourced the
  [Wikipedia listing on TLDs](http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains))

...and because the displayed URL is limited to 14 characters in the path name,
generated URLs should never have longer paths (otherwise, content would be
truncated by the shortener).

For any given tweet, there may be a large number of possible URL subdivisions.
niTwit attempts to intelligently subdivide the provided content in order to
maximize the number of "free" characters.

Usage
-----

niTwit may be used as a Node.js module or in the browser.

* `nitwit.nitwit([string input])`
  * Description: Transform the input string into a series of URL-like
    substrings
  * Returns: A string value
* `nitwit.noConflict()`
  * Description: Re-set the global `nitwit` variable to its value immediately
prior to the inclusion of niTwit. (Relevant only in browser contexts.)
  * Returns: The niTwit object (as a convenience for re-aliasing)

Tests
-----
Tests for niTwit require Node.js and the "nodeunit" module.

Thanks
------

Many thanks to [Eric O'Connor](https://github.com/oconnore) for significant
algorithm optimization and help debugging my shoddy work.

License
-------
Copyright (c) 2012 [Eric O'Connor](https://github.com/oconnore) & [Mike
Pennisi](https://github.com/jugglinmike)  
Licensed under the MIT license.
