# atorable-loader

The `atorable-loader` resolves `import`/`require()` on a file into a webtorrent magnetUri. During the webpack build the original file is emitted along with the associated torrent file into the output directory. The emitted files are the original seeds for the torrent. This works closely with [`atorable-react`](https://github.com/sergethompson/atorable-loader).

## Getting Started

To begin, you'll need to install `atorable-loader`:

```console
$ npm install atorable-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

**file.tsx**

```tsx
import React, { Component } from 'react'
import { VidStrmATor, ImgATor, VidATor } from 'atorable-react'

import hugeImage from './hugeImage.jpg';
import bestMovieEverTribute from './bestMovieEverTribute.mv4';
const  oceanFish = require('./oceanFish.mv4');

class Example extends Component {
  render() {
    return (
      <div>
        <VidATor width='320' height='240' magnetLink={oceanFish} />

        <VidStrmATor width='320' height='240' autoplay={true} magnetLink={bestMovieEverTribute} />

        <ImgATor magnetLink={hugeImage} style={{border: 'solid'}} />
      </div>
    )
  }
}
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
              baseURL: baseURL,
            },
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
For use with a set build environment `NODE_ENV=development` (exterior to webpack env settings i.e. EnvironmentPlugin)


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


## Include & Exclude
#### `Array`
Webpack [include](https://webpack.js.org/configuration/module/#ruleinclude) & [exclude](https://webpack.js.org/configuration/module/#ruleexclude)

**webpack.config.js**

```js
const baseURL = "http://localhost:8080/"; // Define your base url http://example.com/

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'atorable-loader',
        options: {
            baseURL: baseURL,
        },
        include: [
            path.resolve(__dirname, "img"), 
        ],
        exclude: [
            path.resolve(__dirname, "app/demo-files"),
            /node_modules/, /doNotWant\.js$/
        ],
      },
    ],
  },
};
```

## License
[MIT](./LICENSE) © [Serge Thompson](https://github.com/sergethompson)