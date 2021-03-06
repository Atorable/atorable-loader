// index.ts
import { interpolateName } from 'loader-utils'
import { Options, processTorrent as ProcessTorrent } from './callServer'
import uuidAPIKey from 'uuid-apikey'
import { setAPIServerURL as SetAPIServerURL, setPROD } from './api'
import { GetMagnetAndTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { printBuildFileMagInfo } from './printBuildFileMagInfo'

// TODO: update all dependencies after getting things working
const ssbID = uuidAPIKey.create().uuid, // super special build ID
    updatePlan = 'https://www.atorable.com/services'

export const API_BUILD = 'api-build'
export { GetMagnetAndTorrentBuf } from './BuildMagnetAndTorrentBuf'
export { Options, processTorrent as ProcessTorrent } from './callServer'
export { setAPIServerURL as SetAPIServerURL } from './api'
export const raw = true

export default async function loader(
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
        if (opts.WEBTOR_API_URL) SetAPIServerURL(opts.WEBTOR_API_URL)
        if (opts.PRODUCTION) setPROD(opts.PRODUCTION)

        const mURI = await ProcessTorrent(
            content as Buffer,
            filename,
            opts,
            ssbID
        )

        if (mURI?.error) {
            const err = new Error(
                `\n${mURI.error}\n` +
                    `Update Plan @ \x1b[1;34m${updatePlan}\x1b[0m to build magnet URI. \n`
            )
            return callback(err) //blue
        }
        printBuildFileMagInfo(
            ssbID,
            filename,
            mURI?.magnetURI,
            opts.showMagnetInfo
        )
        callback(null, `export default "${mURI?.magnetURI}";`)
        return
    } else {
        let baseURL = opts.baseURL

        if (opts.rootUrl) {
            baseURL = opts.rootUrl()
        }

        if (!baseURL) {
            callback(
                new Error(
                    'You must provide a baseURL or rootUrl Function. See readme.'
                )
            )
            return
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
