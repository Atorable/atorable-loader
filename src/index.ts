// index.ts
import { interpolateName, getHashDigest } from 'loader-utils'
import { GetMagnetAndTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { Options, processTorrent } from './callServer'
import uuidAPIKey from 'uuid-apikey'
import { setBaseURL } from './api'
// TODO: update all dependencies after getting things working
const ssbID = uuidAPIKey.create().uuid // super special build ID
console.log('\x1b[1;32m%s\x1b[0m', ssbID) //green

export { processTorrent }

module.exports = async function loader(
    this: any, // TODO: figure out what this is, find type available in webpack
    content: string | Buffer,
    sourceMap: any
) {
    const callback = this.async()!,
        context = this.rootContext,
        options = this.getOptions() as Options,
        // digestString = getHashDigest(content as Buffer, 'sha1', 'hex', 0),
        // contentHash = interpolateName(this, '[contenthash].[name]', { // TODO: for caching
        //     context,
        //     content,
        //     regExp: options.regExp
        // }),
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
    let baseURL = options.baseURL

    console.log('\x1b[1;32m%s\x1b[0m', `${ssbID} ${filename}`) //green

    if (options.rootUrl) {
        baseURL = options.rootUrl()
    }

    if (options.WEBTOR_API_URL) {
        setBaseURL(options.WEBTOR_API_URL)
    }

    if (options.ATORABLE_KEY_ID && options.ATORABLE_SECRET_KEY) {
        const mURI = await processTorrent(
            content as Buffer,
            filename,
            options,
            ssbID
        )
        if (mURI?.error) {
            throw mURI.error
        }
        callback(null, `export default "${mURI?.magnetURI}";`)
    } else {
        const seed = await GetMagnetAndTorrentBuf(
            content as Buffer,
            assetPath,
            torrentPath,
            baseURL
        )
        const magnetURI = seed.magnetURI
        this.emitFile(assetPath, content, sourceMap)
        this.emitFile(torrentPath, seed.torrentBuf, null)
        callback(null, `export default "${magnetURI}";`)
    }
}

module.exports.raw = true
