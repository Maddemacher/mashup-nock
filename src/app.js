import express from "express";
import asyncHandler from "express-async-handler";
import { decorateAlbums } from "./services/coverart";
import { getMusicBrainzData } from "./services/musicbrainz";
import { getDescription } from "./services/wikipedia";

const app = express();

app.get(
    "/api/artist/:mbid",
    asyncHandler(async (req, res) => {
        const { mbid } = req.params;

        const musicBrainz = await getMusicBrainzData(mbid);

        if (musicBrainz === undefined) {
            res.sendStatus(404);
            return;
        }

        const albumPromise = decorateAlbums(musicBrainz.albums);
        const descriptionPromise = getDescription(musicBrainz.wiki);

        res.send({
            mbid,
            description: await descriptionPromise,
            albums: await albumPromise,
        });
    })
);

app.use((error, req, res, next) => {
    if (error.statusCode !== undefined) {
        res.sendStatus(error.statusCode);
        return;
    }

    res.sendStatus(500);
});

export default app;
