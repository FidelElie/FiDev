import { describe, it, expect } from "vitest";

import { compileOutputWithPlugins } from "./config";

const testInput = `
Jokes aside it was great to see all the familiar faces and catch up - at the time I saw a
music buddy and of course we started talking about what he has listened to and he recommended
me Nascent's earlier album :album[4oP4LxB36ixn9QydAT4Q45][Minus The Bullshit Life's Great]
and I got listening to it. Even up to recently when
I have picked it back up I really liked it so not sure why it never made it into my main
playlist. Luckily for me though I think this new offering is even better.

:quote[Young Mexico - Young Flexico] (that's what he calls himself - don't come for me) is a
producer through and through. All the beats on this are clean and punchy, non of the
transitions are jarring even if he can switch genres with what seems to be every other song.
It stays rooted with rnb or hip hop for the most part with elements of others. Surprisingly,
the song that standouts the most for me is actually the :track[2fBx9NDWSdxk7NZIzJWwqQ][Found You (Outro)],
which could be considered more a skit, but the beat is great and conceptually him having a
conversation with jesus who tells him not to grow up too soon, try new things no matter how
old he gets really resonated with me leading to this being on repeat for me.

The concept doesn't fully extend to the entire album, :track[2s3jEDDokwMlhrhoc5aCnI][Lil Chris (Intro)]
also starts with jesus' very different sermon (it is very entertaining) or the retrospective
:track[12N9VEUrRcRvEOPHAYYYBk][Take Your Time] where Ab Soul reflects on his experiences, but then there
are tracks like :track[3As19hYDpTwkp9Ia2yEqVF][Plata O Plomo (Remix)] that deviate drastically from this.
I do like that song a lot, a great  ignorant hype track to me - it can feel a little out
of place even with the transition being so good between it and the Saba track
:track[2VFgYkEP5RbTxRzVM7i6Cz][2VFgYkEP5RbTxRzVM7i6Cz]. I also think the bonus track
:track[2Li5EVxVHq3yAXBIixJpvK][LONG LIVE DOC] could have just been left off the project, as
I don't think it adds anything and the album should just end with the great outro.
`;

describe("remarkRegExpDirective", () => {
	it("Will properly update inputs with correct directives", async () => {
		const output = (await compileOutputWithPlugins(testInput)).toString();

		console.log(output);

		expect(output.includes("<q>Young Mexico - Young Flexico</q>")).toBeTruthy();
	});
});
