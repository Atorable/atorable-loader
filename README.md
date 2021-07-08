# atorable-loader

The `atorable-loader` resolves `import`/`require()` on a file into a webtorrent magnetUri and emits the file and the torrent file into the output directory. For use with [`atorable-react`](https://github.com/sergethompson/atorable-loader).

## Getting Started

To begin, you'll need to install `atorable-loader`:

```console
$ npm install atorable-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

**file.js**

```js
import img from './file.png';
const  imgSame = require('./file.png');
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
const baseURL = "http://localhost:8080/"; // Define your base url http://example.com/

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|m4v|mp4)$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              baseURL: ,
              name: "[path][name].[ext]",
            },
            // include: [
            //     path.resolve(__dirname, "app"), 
            //   ],
            //   exclude: [
            //     path.resolve(__dirname, "app/demo-files"),
            //     /node_modules/, /upFileDownMTorrents\.js$/
            //   ],
          },
        ],
      },
    ],
  },
};
```

And run `webpack` via your preferred method. This will emit `file.png` and a `file.torrent` as a file
in the output directory.

## Options
#### `Function`

**webpack.config.js**

```js
const baseURL = "http://localhost:8080/"; // Define your base url http://example.com/
const prodURL = "http://www.example.com/"; // Define your base url http://example.com/

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'atorable-loader',
        options: {
          rootUrl() {
                if (process.env.NODE_ENV === 'development') {
                return baseURL;
                }

                return prodURL;
            },
        },
      },
    ],
  },
};
```

> ℹ️ By default the path and name you specify will output the file in that same directory, and will also use the same URI path to access the file.


### `publicPath`

Type: `String|Function`
Default: [`__webpack_public_path__`](https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific-)+outputPath

Specifies a custom public path for the target file(s).

#### `String`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'atorable-loader',
        options: {
          publicPath: 'assets',
        },
      },
    ],
  },
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'atorable-loader',
        options: {
          publicPath: (url, resourcePath, context) => {
            // `resourcePath` is original absolute path to asset
            // `context` is directory where stored asset (`rootContext`) or `context` option

            // To get relative path you can use
            // const relativePath = path.relative(context, resourcePath);

            if (/my-custom-image\.png/.test(resourcePath)) {
              return `other_public_path/${url}`;
            }

            if (/images/.test(context)) {
              return `image_output_path/${url}`;
            }

            return `public_path/${url}`;
          },
        },
      },
    ],
  },
};
```

### `postTransformPublicPath`

Type: `Function`
Default: `undefined`

Specifies a custom function to post-process the generated public path. This can be used to prepend or append dynamic global variables that are only available at runtime, like `__webpack_public_path__`. This would not be possible with just `publicPath`, since it stringifies the values.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        loader: 'atorable-loader',
        options: {
          publicPath: '/some/path/',
          postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
        },
      },
    ],
  },
};
```

### `context`

Type: `String`
Default: [`context`](https://webpack.js.org/configuration/entry-context/#context)

Specifies a custom file context.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              context: 'project',
            },
          },
        ],
      },
    ],
  },
};
```

### `emitFile`

Type: `Boolean`
Default: `true`

If true, emits a file (writes a file to the filesystem). If false, the loader
will return a public URI but **will not** emit the file. It is often useful to
disable this option for server-side packages.

**file.js**

```js
// bundle file
import img from './file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
};
```

### `regExp`

Type: `RegExp`
Default: `undefined`

Specifies a Regular Expression to one or many parts of the target file path.
The capture groups can be reused in the `name` property using `[N]`
[placeholder](https://github.com/webpack-contrib/atorable-loader#placeholders).

**file.js**

```js
import img from './customer01/file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/i,
              name: '[1]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

> ℹ️ If `[0]` is used, it will be replaced by the entire tested string, whereas `[1]` will contain the first capturing parenthesis of your regex and so on...

### `esModule`

Type: `Boolean`
Default: `true`

By default, `atorable-loader` generates JS modules that use the ES modules syntax.
There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).

You can enable a CommonJS module syntax using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
```

## Placeholders

Full information about placeholders you can find [here](https://github.com/webpack/loader-utils#interpolatename).

### `[ext]`

Type: `String`
Default: `file.extname`

The file extension of the target file/resource.

### `[name]`

Type: `String`
Default: `file.basename`

The basename of the file/resource.

### `[path]`

Type: `String`
Default: `file.directory`

The path of the resource relative to the webpack/config `context`.

### `[folder]`

Type: `String`
Default: `file.folder`

The folder of the resource is in.

### `[query]`

Type: `String`
Default: `file.query`

The query of the resource, i.e. `?foo=bar`.

### `[emoji]`

Type: `String`
Default: `undefined`

A random emoji representation of `content`.

### `[emoji:<length>]`

Type: `String`
Default: `undefined`

Same as above, but with a customizable number of emojis

### `[hash]`

Type: `String`
Default: `md4`

Specifies the hash method to use for hashing the file content.

### `[contenthash]`

Type: `String`
Default: `md4`

Specifies the hash method to use for hashing the file content.

### `[<hashType>:hash:<digestType>:<length>]`

Type: `String`

The hash of options.content (Buffer) (by default it's the hex digest of the hash).

#### `digestType`

Type: `String`
Default: `'hex'`

The [digest](https://en.wikipedia.org/wiki/Cryptographic_hash_function) that the
hash function should use. Valid values include: base26, base32, base36,
base49, base52, base58, base62, base64, and hex.

#### `hashType`

Type: `String`
Default: `'md4'`

The type of hash that the hash function should use. Valid values include: `md4`, `md5`, `sha1`, `sha256`, and `sha512`.

#### `length`

Type: `Number`
Default: `undefined`

Users may also specify a length for the computed hash.

### `[N]`

Type: `String`
Default: `undefined`

The n-th match obtained from matching the current file name against the `regExp`.

## Examples

### Names

The following examples show how one might use `atorable-loader` and what the result would be.

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              name: 'dirname/[contenthash].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

Result:

```bash
# result
dirname/0dcbbaa701328ae351f.png
```

---

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

Result:

```bash
# result
gdyb21L.png
```

---

**file.js**

```js
import png from './path/to/file.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              name: '[path][name].[ext]?[contenthash]',
            },
          },
        ],
      },
    ],
  },
};
```

Result:

```bash
# result
path/to/file.png?e43b20c069c4a01867c31e98cbce33c9
```

### CDN

The following examples show how to use `atorable-loader` for CDN uses query params.

**file.js**

```js
import png from './directory/image.png?width=300&height=300';
```

**webpack.config.js**

```js
module.exports = {
  output: {
    publicPath: 'https://cdn.example.com/',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'atorable-loader',
            options: {
              name: '[path][name].[ext][query]',
            },
          },
        ],
      },
    ],
  },
};
```

Result:

```bash
# result
https://cdn.example.com/directory/image.png?width=300&height=300
```

### Dynamic public path depending on environment variable at run time

An application might want to configure different CDN hosts depending on an environment variable that is only available when running the application. This can be an advantage, as only one build of the application is necessary, which behaves differently depending on environment variables of the deployment environment. Since atorable-loader is applied when compiling the application, and not when running it, the environment variable cannot be used in the atorable-loader configuration. A way around this is setting the `__webpack_public_path__` to the desired CDN host depending on the environment variable at the entrypoint of the application. The option `postTransformPublicPath` can be used to configure a custom path depending on a variable like `__webpack_public_path__`.

**main.js**

```js
const assetPrefixForNamespace = (namespace) => {
  switch (namespace) {
    case 'prod':
      return 'https://cache.myserver.net/web';
    case 'uat':
      return 'https://cache-uat.myserver.net/web';
    case 'st':
      return 'https://cache-st.myserver.net/web';
    case 'dev':
      return 'https://cache-dev.myserver.net/web';
    default:
      return '';
  }
};
const namespace = process.env.NAMESPACE;

__webpack_public_path__ = `${assetPrefixForNamespace(namespace)}/`;
```

**file.js**

```js
import png from './image.png';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        loader: 'atorable-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'static/assets/',
          publicPath: 'static/assets/',
          postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
        },
      },
    ],
  },
};
```

Result when run with `NAMESPACE=prod` env variable:

```bash
# result
https://cache.myserver.net/web/static/assets/image.somehash.png
```

Result when run with `NAMESPACE=dev` env variable:

```bash
# result
https://cache-dev.myserver.net/web/static/assets/image.somehash.png
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/atorable-loader.svg
[npm-url]: https://npmjs.com/package/atorable-loader
[node]: https://img.shields.io/node/v/atorable-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/atorable-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/atorable-loader
[tests]: https://github.com/webpack-contrib/atorable-loader/workflows/atorable-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/atorable-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/atorable-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/atorable-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=atorable-loader
[size-url]: https://packagephobia.now.sh/result?p=atorable-loader
