module.exports = {
    transformIgnorePatterns: [
        "node_modules/(?!(@fullcalendar|@mui|@babel)/)"
    ],
    moduleNameMapper: {
        "^@mui/(.*)$": "<rootDir>/node_modules/@mui/$1",
        "^worker-loader!(.*)$": "<rootDir>/src/mocks/workerMock.js"
    },
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    setupFiles: [
        "<rootDir>/src/setupTests.js"
    ]
};