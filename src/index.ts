// index.ts
import { interpolateName } from 'loader-utils'
import { GetMagnetAndTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { Options, processTorrent } from './callServer'
import uuidAPIKey from 'uuid-apikey'
import { setAPIServerURL } from './api'
// TODO: update all dependencies after getting things working
const ssbID = uuidAPIKey.create().uuid, // super special build ID
    printBuildFileMagInfo = (
        ssbID: string,
        filename: string,
        magnetURI: string,
        showMagnetInfo: boolean
    ) => {
        if (showMagnetInfo) {
            console.log(
                '\x1b[1;32m%s\x1b[0m',
                `${ssbID} ${filename} \n\n${magnetURI}`
            ) //green
        }
    }
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

    if (options.ATORABLE_SECRET_KEY) {
        if (options.WEBTOR_API_URL) {
            setAPIServerURL(options.WEBTOR_API_URL)
        }

        const mURI = await processTorrent(
            content as Buffer,
            filename,
            options,
            ssbID
        )
        if (mURI?.error) {
            throw mURI.error
        }
        printBuildFileMagInfo(
            ssbID,
            filename,
            mURI?.magnetURI,
            options.showMagnetInfo
        )
        callback(null, `export default "${mURI?.magnetURI}";`)
    } else {
        let baseURL = options.baseURL

        if (options.rootUrl) {
            baseURL = options.rootUrl()
        }

        if (!baseURL) {
            throw new Error(
                'You must provide a baseURL or rootUrl Function. See readme.'
            )
        }
        const seed = await GetMagnetAndTorrentBuf(
            content as Buffer,
            assetPath,
            torrentPath,
            baseURL
        )
        const magnetURI = seed.magnetURI
        this.emitFile(assetPath, content, sourceMap)
        this.emitFile(torrentPath, seed.torrentBuf, null)
        printBuildFileMagInfo(
            ssbID,
            filename,
            magnetURI,
            options.showMagnetInfo
        )
        callback(null, `export default "${magnetURI}";`)
    }
}

module.exports.raw = true
