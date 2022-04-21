import supertest from "supertest";
import { decorateAlbums } from "./services/coverart";
import { getMusicBrainzData } from "./services/musicbrainz";
import { getDescription } from "./services/wikipedia";

import app from "./app";

jest.mock("./services/coverart");
jest.mock("./services/musicbrainz");
jest.mock("./services/wikipedia");

describe("app", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should do stuff when all is good", async () => {
        getMusicBrainzData.mockResolvedValue({
            mbid: "some-id",
            albums: [],
            wikiRelations: [],
        });

        decorateAlbums.mockResolvedValue([
            {
                id: "some-album-id",
                title: "some-album",
                image: "http://some-image",
            },
        ]);

        getDescription.mockResolvedValue("Some description");

        const response = await supertest(app).get("/api/artist/some-id");

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            mbid: "some-id",
            albums: [
                {
                    id: "some-album-id",
                    title: "some-album",
                    image: "http://some-image",
                },
            ],
            description: "Some description",
        });
    });

    it("Should return 404 when music brainz response is undefined", async () => {
        getMusicBrainzData.mockResolvedValue(undefined);

        const response = await supertest(app).get("/api/artist/some-id");

        expect(response.statusCode).toEqual(404);

        expect(decorateAlbums).not.toHaveBeenCalled();
        expect(getDescription).not.toHaveBeenCalled();
    });
});
