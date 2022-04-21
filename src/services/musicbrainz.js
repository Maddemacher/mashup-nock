import fetch from "node-fetch";

const getMusicBrainzUrl = (mbid) =>
    `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels+release-groups&fmt=json`;

const filterWikiRelations = ({ relations }) => {
    const wikiRelations = relations.filter(
        (relation) =>
            relation.type === "wikipedia" || relation.type === "wikidata"
    );

    return wikiRelations;
};

const filterAlbums = ({ "release-groups": releaseGroups }) => {
    const albums = releaseGroups.filter(
        (group) => group["primary-type"] === "Album"
    );

    return albums.map(({ id, title }) => ({
        id,
        title,
    }));
};

export const getMusicBrainzData = async (mbid) => {
    const response = await fetch(getMusicBrainzUrl(mbid));

    if (response.status === 404) {
        return undefined;
    }

    if (response.ok === false) {
        const error = new Error("MusicBrainz call failed");
        error.statusCode = response.status;

        throw error;
    }

    const data = await response.json();

    return {
        mbid,
        name: data.name,
        albums: filterAlbums(data),
        wiki: filterWikiRelations(data),
    };
};
