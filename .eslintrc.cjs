module.exports = {
  env: {
    node: true,
    es2022: true,
    es6: true
  },
  plugins: ["import", 'node'],
  extends: ['google', "eslint:recommended", "plugin:import/recommended"],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.json']
      }
    },
    'import/extensions': [
      '.js',
      '.mjs',
    ],
    'import/core-modules': [],
    'import/ignore': [
      'node_modules',
      '\\.(coffee|scss|css|less|hbs|svg|json)$',
    ],
    node: {
      "tryExtensions": [".js", ".json", ".node"]
    }
  },
  globals: {
    "__dirname": true,
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "__API_PREFIX": "readonly",
    "__BASEDIR": "readonly",
    "__DATABASEREADPREFERENCE": "readonly",
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "max-len": ["error", {"code": 180}],
    "indent": ["error", 4]
  },
};
