<h1 style="color: #5270d9; font-family: 'PT Sans', sans-serif;">ATORABLE</h1>

<p align="center">
  <img height="300" width="300" title="atorable logo" src="https://github.com/Atorable/atorable-loader/raw/main/atorable.svg">
</p>

# atorable-loader

<!-- <p align="center">
  <img src="https://github.com/Atorable/atorable-loader/blob/main/atorable.png" height="300" width="300" title="atorable logo">© -->
</p>
<!-- <p align="center">
  <img src="./android-chrome-512x512.png" height="300" width="300" title="atorable logo">©
</p> -->

High data costs? Slow PageSpeed? High server load? Need a solution for viral content? [Atorable.com](https://www.atorable.com/) moves more content faster.

As more users visit your site the more users serve up your content. More users makes faster downloads, less server load, lower data costs, more decentralized. PageSpeed will also increases by not blocking page load. Designed for use with [Webpack][webpack] and [atorable-react][atorable-react-npm].

The `atorable-loader` resolves `import`/`require()` of a file into a [Webtorrent](https://webtorrent.io/) magnet uri. During the webpack build the target file is emitted along with the corresponding torrent file into the output directory. The emitted files act as the seeds for the torrent when the root url is provided to the build. [Atorable.com](https://www.atorable.com/) offers a paid plans that integrates easily with your build to further decrease your server load. [Contact us][contact] for custom solutions.

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
import { ATorVidStrm, ATorImg, ATorVid } from 'atorable-react'

import hugeImage from './hugeImage.jpg' // ==> 'magnet:?xt=urn:...'
import bestMovieEverTribute from './bestMovieEverTribute.mp4' // ==> 'magnet:?xt=urn:...'
const oceanFish = require('./oceanFish.mp4') // ==> {default: 'magnet:?xt=urn:...'}

const Example = (props: any) => {
    return (
        <div>
            <ATorVid
                width={'320'}
                height={'240'}
                type={'video/mp4'}
                magnetURI={oceanFish}
                loading={<h2 style={{ color: 'orange' }}>Loading</h2>} // optional
            />
            <ATorVidStrm
                width={'320'}
                height={'240'}
                type={'video/mp4'}
                autoplay={true}
                magnetURI={bestMovieEverTribute}
            />
            <ATorStreamVideo
                aspectRatio={3 / 4}
                type={'video/mp4'}
                magnetURI={bestMovieEverTribute}
                autoplay={true}
            />
            // aspectRatio={height / width} aspectRatio works best for responsive
            videos
            <ATorImg magnetURI={hugeImage} style={{ border: 'solid' }} />
        </div>
    )
}
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
const rootURL = 'http://localhost:8080/' // Define your root url http://example.com/
// this makes it possible for the initial torrent to be downloaded ending slash / is important.

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|m4v|mp4)$/i,
                //   test: /src[\\\/]assets[\\\/]Needle\.jpg$/, // for targeting a specific file
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

And run `webpack` via your preferred method. This will emit `file.*` and a `file.torrent` file
in the output directory.

## Paid/Pro Version

This makes it possible for the initial torrent to be seeded from an external server reducing local load, improving PageSpeed and faster high demand downloads.

**webpack.config.js**

```ts
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
                                process.env.ATORABLE_SECRET_KEY, // access token from atorable.com
                            showMagnetInfo: true, // optional
                            PRODUCTION: true // optional default: false
                            // if true, this will only update production build files
                        }
                    }
                ]
            }
        ]
    }
}
```

When you run `webpack` the [Atorable.com](https://www.atorable.com/) API will send relevant files to an external server and return magnetURIs.

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
[webpack]: https://webpack.js.org/
[contact]: https://www.atorable.com/contact
