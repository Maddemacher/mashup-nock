module.exports = {
	setupFiles: [
		"./jest.setup.js"
	],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
};
