<h1 style="color: #5270d9; font-family: 'PT Sans', sans-serif;">ATORABLE</h1>

<p align="center">
  <img height="300" width="300" title="atorable logo" src="./atorable.svg">
</p>

# atorable-loader

<!-- <p align="center">
  <img src="https://github.com/Atorable/atorable-loader/blob/main/atorable.png" height="300" width="300" title="atorable logo">© -->
</p>
<!-- <p align="center">
  <img src="./android-chrome-512x512.png" height="300" width="300" title="atorable logo">©
</p> -->

Why? Decreased data from your server.

The `atorable-loader` resolves `import`/`require()` of a file into a [Webtorrent](https://webtorrent.io/) magnet uri.

During the webpack build the target file is emitted along with the corresponding torrent file into the output directory. The emitted files act as the seeds for the torrent when the root url is provided to the build. This works closely with [atorable-react][atorable-react-npm].

#### [Demo][atorable-react]

## Getting Started

To begin, you'll need to install `atorable-loader`:

```console
$ npm install atorable-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files (see [atorable-react][atorable-react-npm]):

**file.tsx**

```tsx
import React from 'react'
import { VidStrmATor, ImgATor, VidATor } from 'atorable-react'

import hugeImage from './hugeImage.jpg' // ==> 'magnet:?xt=urn:...'
import bestMovieEverTribute from './bestMovieEverTribute.mp4' // ==> 'magnet:?xt=urn:...'
const oceanFish = require('./oceanFish.mp4') // ==> {default: 'magnet:?xt=urn:...'}

const Example = (props: any) => {
    return (
        <div>
            <VidATor
                width={320}
                height={240}
                type={'video/mp4'}
                magnetURI={oceanFish}
                loading={<h2 style={{ color: 'orange' }}>Loading</h2>}
            />

            <VidStrmATor
                width={320}
                height={240}
                type={'video/mp4'}
                autoplay={true}
                magnetURI={bestMovieEverTribute}
            />

            <ImgATor magnetURI={hugeImage} style={{ border: 'solid' }} />
        </div>
    )
}
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
const rootURL = 'http://localhost:8080/' // Define your root url http://example.com/
// this makes it possible for the initial torrent to be downloaded.

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|m4v|mp4)$/i,
                use: [
                    {
                        loader: 'atorable-loader',
                        options: {
                            baseURL: rootURL,
                            showMagnetInfo: true // optional
                        }
                    }
                ]
            }
        ]
    }
}
```

And run `webpack` via your preferred method. This will emit `file.png` and a `file.torrent` file
in the output directory.

## Paid/Pro Version (Trial)

**webpack.config.js**

```ts
// this makes it possible for the initial torrent to be seeded from an external server reducing local load.
// Message developer to purchase a paid version. Enquire about encryption.
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|m4v|mp4)$/i,
                use: [
                    {
                        loader: 'atorable-loader',
                        options: {
                            ATORABLE_SECRET_KEY:
                                process.env.ATORABLE_SECRET_KEY,
                            showMagnetInfo: true // optional,
                        }
                    }
                ]
            }
        ]
    }
}
```

And run `webpack` via your preferred method. This will emit `file.png` and a `file.torrent` file
in the output directory.

## Options

#### `Function`

For use with a set build environment `NODE_ENV=development` (not relevant to webpack env settings i.e. EnvironmentPlugin)

**webpack.config.js**

```js
const devURL = 'http://localhost:8080/' // Define your root url
const prodURL = 'http://www.example.com/'

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'atorable-loader',
                        options: {
                            rootUrl() {
                                console.log(
                                    'Here Node env: ',
                                    process.env.NODE_ENV
                                )
                                if (process.env.NODE_ENV === 'development') {
                                    return devURL
                                }

                                return prodURL
                            }
                        }
                    }
                ]
            }
        ]
    }
}
```

## Target

#### `Array`

Webpack [include](https://webpack.js.org/configuration/module/#ruleinclude) & [exclude](https://webpack.js.org/configuration/module/#ruleexclude)

**webpack.config.js**

```js
const rootURL = 'http://localhost:8080/' // Define your root url http://example.com/

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'atorable-loader',
                        options: {
                            baseURL: rootURL
                        }
                    }
                ],
                include: [path.resolve(__dirname, 'img')],
                exclude: [
                    path.resolve(__dirname, 'app/demo-files'),
                    /node_modules/,
                    /doNotWant\.jpg$/
                ]
            }
        ]
    }
}
```

## Thank you

[Webtorrent](https://webtorrent.io/)
[Webpack](https://webpack.js.org/)

## License

[MIT](./LICENSE) © [Serge Thompson](https://github.com/sergethompson)

[atorable-react]: https://atorable.github.io/atorable-react/
[atorable-react-source]: https://github.com/Atorable/atorable-react
[atorable-react-npm]: https://www.npmjs.com/package/atorable-react
