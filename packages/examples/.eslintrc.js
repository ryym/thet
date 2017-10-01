module.exports = {
  "parser": "babel-eslint",
  "extends": "ryym/base-react",
  "plugins": ["react"],
  "env": {
    "browser": true,
  },
  "rules": {
    "no-console": 0,

    // Allow `this` in class property functions.
    "no-invalid-this": 0,
  }
}
