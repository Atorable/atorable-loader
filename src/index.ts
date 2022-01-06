// index.ts
import { interpolateName } from 'loader-utils'
import { GetMagnetAndTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { Options, processTorrent } from './callServer'
// TODO: update all dependencies after getting things working

export { processTorrent }

module.exports = async function loader(
    this: any, // TODO: figure out what this is, find type available in webpack
    content: (string | Blob)[],
    sourceMap: any
) {
    let callback = this.async()!,
        context = this.rootContext

    let options = this.getOptions() as Options,
        baseURL = options.baseURL,
        assetPath = interpolateName(this, '[path][name].[ext]', {
            context,
            content,
            regExp: options.regExp
        }),
        filename = interpolateName(this, '[name].[ext]', {
            context,
            content,
            regExp: options.regExp
        }),
        torrentPath = interpolateName(this, '[path][name].torrent', {
            context,
            content,
            regExp: options.regExp
        })

    if (options.rootUrl) {
        baseURL = options.rootUrl()
    }

    if (options.ATORABLE_KEY_ID && options.ATORABLE_SECRET_KEY) {
        let mURI = await processTorrent(content, filename, options)
        if (mURI?.error) {
            throw mURI.error
        }
        callback(null, `export default "${mURI?.magnetURI}";`)
    } else {
        let seed = await GetMagnetAndTorrentBuf(
            content,
            assetPath,
            torrentPath,
            baseURL
        )
        let magnetURI = seed.magnetURI
        this.emitFile(assetPath, content, sourceMap)
        this.emitFile(torrentPath, seed.torrentBuf, null)
        callback(null, `export default "${magnetURI}";`)
    }
}

module.exports.raw = true
