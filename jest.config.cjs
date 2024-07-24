module.exports = {
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,ts,tsx,vue}",
        "!node_modules/**/*.{js,jsx,ts,tsx}"
    ],
    "moduleNameMapper": {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    "preset": "ts-jest",
    "testEnvironment": "node",
    "transform": {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.tsx?$": "babel-jest"
    }
}
