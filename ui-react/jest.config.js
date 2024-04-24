module.exports = {
    transform: {
      "^.+\\.tsx?$": "babel-jest",
      "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
      "^.+\\.(css|less|scss)$": "identity-obj-proxy"
    }
  };
  