// index.ts
import { getOptions, interpolateName } from 'loader-utils'
import { GetMagnetAndTorrentBuf } from './BuildMagnetAndTorrentBuf'
import webpack from 'webpack'

interface Options {
    baseURL: string
    regExp: RegExp
    rootUrl: Function
}

module.exports = async function loader(
    this: webpack.loader.LoaderContext,
    content: any,
    sourceMap: any
) {
    const options = <Options>(<unknown>getOptions(this)),
        callback = this.async()!,
        context = this.rootContext,
        assetPath = interpolateName(this, '[path][name].[ext]', {
            context,
            content,
            regExp: options.regExp
        }),
        torrentPath = interpolateName(this, '[path][name].torrent', {
            context,
            content,
            regExp: options.regExp
        })

    let baseURL = <string>options.baseURL
    if (options.rootUrl) {
        baseURL = options.rootUrl()
    }

    let seed = await GetMagnetAndTorrentBuf(
        content,
        assetPath,
        torrentPath,
        baseURL
    )

    this.emitFile(assetPath, content, sourceMap)
    this.emitFile(torrentPath, seed.torrentBuf, null)

    callback(null, `export default "${seed.magnetURI}";`)
}

module.exports.raw = true
