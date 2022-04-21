import fetch from "node-fetch";

const getWikipediaUrl = (title) =>
    `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${title}`;

const getWikidataUrl = (wikidataId) =>
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&format=json&props=sitelinks`;

const getWikipediaDescription = async (title) => {
    const response = await fetch(getWikipediaUrl(title));

    if (!response.ok) {
        return "";
    }

    const data = await response.json();

    return Object.values(data.query.pages)[0].extract;
};

const getTitleFromWikidata = async (wikidataRelation) => {
    const wikidataId = wikidataRelation.url.resource.split("/").pop();

    const response = await fetch(getWikidataUrl(wikidataId));

    if (!response.ok) {
        throw new Error("Unable to get stuff from wikidata");
    }

    const data = await response.json();

    return data.entities[wikidataId].sitelinks.enwiki.title;
};

const getTitle = (wikiRelations) => {
    const wikipediaRelation = wikiRelations.find(
        (relation) => relation.type === "wikipedia"
    );

    if (wikipediaRelation) {
        return wikipediaRelation.url.resource.split("/").pop();
    }

    const wikidataRelation = wikiRelations.find(
        (relation) => relation.type === "wikidata"
    );

    if (wikidataRelation) {
        return getTitleFromWikidata(wikidataRelation);
    }

    throw new Error("Unable to find suitable relation");
};

export const getDescription = async (wikiRelations) => {
    try {
        const title = await getTitle(wikiRelations);
        return getWikipediaDescription(title);
    } catch (error) {
        // console.log(error);
        return "";
    }
};
