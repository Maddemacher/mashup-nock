import nock from "nock";

import { decorateAlbums } from "./coverart";
import bleach from "./__fixtures__/bleach";

describe("#decorateAlbums", () => {
    it("Should append cover image to all albums if it is found", async () => {
        nock("http://coverartarchive.org/release-group")
            .get("/first-album")
            .times(2)
            .reply(200, bleach);

        nock("http://coverartarchive.org/release-group")
            .get("/second-album")
            .reply(404);

        const albums = await decorateAlbums([
            {
                id: "first-album",
                title: "some-title",
            },
            {
                id: "first-album",
                title: "some-title-again",
            },
            {
                id: "second-album",
                title: "some-other-title",
            },
        ]);

        expect(albums).toEqual([
            {
                title: "some-title",
                cover: "http://coverartarchive.org/release/7d166a44-cfb5-4b08-aacb-6863bbe677d6/1247101964.jpg",
            },
            {
                title: "some-title-again",
                cover: "http://coverartarchive.org/release/7d166a44-cfb5-4b08-aacb-6863bbe677d6/1247101964.jpg",
            },
            {
                title: "some-other-title",
                cover: undefined,
            },
        ]);
    });
});
