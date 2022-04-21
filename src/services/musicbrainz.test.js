import nock from "nock";

import { getMusicBrainzData } from "./musicbrainz";
import nirvana from "./__fixtures__/nirvana";

describe("#getMusicBrainzData", () => {
    it("Should fetch data from musicBrainz", async () => {
        nock("https://musicbrainz.org")
            .get("/ws/2/artist/some-mbid?inc=url-rels+release-groups&fmt=json")
            .reply(200, nirvana);

        const mbData = await getMusicBrainzData("some-mbid");

        expect(mbData).toEqual({
            mbid: "some-mbid",
            name: "Nirvana",
            albums: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    title: expect.any(String),
                }),
            ]),
            wiki: expect.any(Array),
        });
    });

    it("Should return undefined when musicBrainz returns a 404", async () => {
        nock("https://musicbrainz.org")
            .get("/ws/2/artist/some-mbid?inc=url-rels+release-groups&fmt=json")
            .reply(404);

        const mbData = await getMusicBrainzData("some-mbid");

        expect(mbData).toBeUndefined();
    });

    it("Should throw with status code if any other error", async () => {
        nock("https://musicbrainz.org")
            .get("/ws/2/artist/some-mbid?inc=url-rels+release-groups&fmt=json")
            .reply(502);

        try {
            await getMusicBrainzData("some-mbid");
        } catch (error) {
            expect(error.message).toContain("MusicBrainz call failed");
            expect(error.statusCode).toBe(502);
        }

        expect.assertions(2);
    });
});
