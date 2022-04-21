import nock from "nock";

import { getDescription } from "./wikipedia";

import wikidata from "./__fixtures__/wikidata";
import wikipedia from "./__fixtures__/wikipedia";

describe("#getDescription", () => {
    it("Should get description from wikidata relation", async () => {
        nock("https://www.wikidata.org")
            .get(
                "/w/api.php?action=wbgetentities&ids=Q11649&format=json&props=sitelinks"
            )
            .reply(200, wikidata);

        nock("https://en.wikipedia.org")
            .get(
                "/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=Nirvana%20(band)"
            )
            .reply(200, wikipedia);

        const description = await getDescription([
            {
                type: "wikidata",
                url: {
                    id: "1221730c-3a48-49fa-8001-beaa6e93c892",
                    resource: "https://www.wikidata.org/wiki/Q11649",
                },
            },
        ]);

        expect(description).toEqual(wikipedia.query.pages[21231].extract);
    });

    it("Should get description from wikipedia relation", async () => {
        nock("https://en.wikipedia.org")
            .get(
                "/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=Nirvana%20(band)"
            )
            .reply(200, wikipedia);

        const description = await getDescription([
            {
                type: "wikipedia",
                url: {
                    id: "1221730c-3a48-49fa-8001-beaa6e93c892",
                    resource: "https://www.some.url/Nirvana%20(band)",
                },
            },
        ]);

        expect(description).toEqual(wikipedia.query.pages[21231].extract);
    });

    it("Should return empty description if something fails with wikidata", async () => {
        nock("https://www.wikidata.org")
            .get(
                "/w/api.php?action=wbgetentities&ids=Q11649&format=json&props=sitelinks"
            )
            .reply(404);

        const description = await getDescription([
            {
                type: "wikidata",
                url: {
                    id: "1221730c-3a48-49fa-8001-beaa6e93c892",
                    resource: "https://www.wikidata.org/wiki/Q11649",
                },
            },
        ]);

        expect(description).toEqual("");
    });

    it("Should return empty description if something fails with wikipedia", async () => {
        nock("https://en.wikipedia.org")
            .get(
                "/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=Nirvana%20(band)"
            )
            .reply(404);

        const description = await getDescription([
            {
                type: "wikipedia",
                url: {
                    id: "1221730c-3a48-49fa-8001-beaa6e93c892",
                    resource: "https://www.some.url/Nirvana%20(band)",
                },
            },
        ]);

        expect(description).toEqual("");
    });

    it("Should return empty description when there is no suitable relation", async () => {
        const description = await getDescription([]);

        expect(description).toEqual("");
    });
});
