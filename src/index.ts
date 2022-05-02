// index.ts
import { interpolateName } from 'loader-utils'
import { GetMagnetAndTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { Options, processTorrent as ProcessTorrent } from './callServer'
import uuidAPIKey from 'uuid-apikey'
import { setAPIServerURL as SetAPIServerURL } from './api'
export const API_BUILD = 'api-build'
export { Options, ProcessTorrent, SetAPIServerURL, GetMagnetAndTorrentBuf }
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
                `File: ${filename} buildID:${ssbID} \n\n${magnetURI}\n`
            ) //green
        }
    },
    updatePlan = 'https://www.atorable.com/services'

module.exports = async function loader(
    this: any, // TODO: figure out what this is, find type available in webpack
    content: string | Buffer,
    sourceMap: any
) {
    const callback = this.async()!,
        context = this.rootContext,
        opts = this.getOptions() as Options,
        // digestString = getHashDigest(content as Buffer, 'sha1', 'hex', 0),
        // contentHash = interpolateName(this, '[contenthash].[name]', { // TODO: for caching
        //     context,
        //     content,
        //     regExp: opts.regExp
        // }),
        assetPath = interpolateName(this, '[path][name].[ext]', {
            context,
            content,
            regExp: opts.regExp
        }),
        filename = interpolateName(this, '[name].[ext]', {
            context,
            content,
            regExp: opts.regExp
        }),
        torrentPath = interpolateName(this, '[path][name].torrent', {
            context,
            content,
            regExp: opts.regExp
        })

    if (opts.ATORABLE_SECRET_KEY) {
        if (opts.WEBTOR_API_URL) {
            SetAPIServerURL(opts.WEBTOR_API_URL)
        }

        const mURI = await ProcessTorrent(
            content as Buffer,
            filename,
            opts,
            ssbID
        )

        if (mURI?.error)
            return callback(
                mURI.error +
                    `\nCannot build magnet URI\n` +
                    `Update Plan: \x1b[1;34m${updatePlan}\x1b[0m\n`
            ) //blue

        printBuildFileMagInfo(
            ssbID,
            filename,
            mURI?.magnetURI,
            opts.showMagnetInfo
        )
        callback(null, `export default "${mURI?.magnetURI}";`)
    } else {
        let baseURL = opts.baseURL

        if (opts.rootUrl) {
            baseURL = opts.rootUrl()
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
        printBuildFileMagInfo(ssbID, filename, magnetURI, opts.showMagnetInfo)
        callback(null, `export default "${magnetURI}";`)
    }
}

module.exports.raw = true
