import fetch from "node-fetch";

const getCoverArtUrl = (albumId) =>
    `http://coverartarchive.org/release-group/${albumId}`;

const getCover = async (album) => {
    const response = await fetch(getCoverArtUrl(album.id));

    if (!response.ok) {
        return {
            title: album.title,
            cover: undefined,
        };
    }

    const data = await response.json();
    const front = data.images.find((image) => image.front);

    return {
        title: album.title,
        cover: front && front.image,
    };
};

export const decorateAlbums = (albums) => Promise.all(albums.map(getCover));
