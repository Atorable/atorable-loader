// callServer.ts
import { createTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { checkIfHashExists, setAPIServerURL, setPROD, Uploader } from './api'
import parseTorrent from 'parse-torrent'
import { API_BUILD } from '.'
// TODO: update all dependencies after getting things working
interface Options {
    DEV_ANNOUNCE_URL: string
    showMagnetInfo?: boolean
    baseURL?: string
    regExp?: RegExp
    rootUrl?: () => string
    ATORABLE_KEY_ID?: string
    ATORABLE_SECRET_KEY?: string
    WEBTOR_API_URL?: string
    PRODUCTION?: boolean
}

interface HashRes {
    error: string
    magnetURI: string
    beginUpload: boolean
}

const processTorrent = async (
    content: Buffer,
    filename: string,
    options: Options,
    ssbID?: string
) => {
    if (options.PRODUCTION) setPROD(options.PRODUCTION)
    if (options.WEBTOR_API_URL) setAPIServerURL(options.WEBTOR_API_URL)

    try {
        ssbID = ssbID || API_BUILD

        const { ATORABLE_SECRET_KEY } = options,
            { torrentBuf } = await createTorrentBuf(content, filename),
            pt = parseTorrent(torrentBuf),
            infoHash = pt.infoHash as string,
            fileSize = (Buffer.byteLength(content) * 1e-6).toString()

        const hashResponse = await checkIfHashExists(
            ATORABLE_SECRET_KEY as string,
            infoHash,
            fileSize,
            filename,
            ssbID
        )

        // const hashResulttext = await hashResponse.text()
        const res = await hashResponse.json()
        const hashResult = res as HashRes

        if (hashResult.error) {
            return { magnetURI: '', error: hashResult.error }
        }

        if (!hashResult.beginUpload) {
            // returns if hash exists
            return { magnetURI: hashResult.magnetURI, error: '' }
        }

        const response = await Uploader(
                filename,
                content,
                ATORABLE_SECRET_KEY as string,
                infoHash,
                ssbID
            ),
            // result = (await response.json()) as any
            body = await response.text()
        let result: any

        if (body) {
            // TODO: figure out why this is necessary
            try {
                result = JSON.parse(body) // TODO: clean up
                if (!result.success) {
                    console.log(body)
                    return { magnetURI: '', error: body } // TODO: improve error msg
                    // TODO: throw error in callback ?
                }
            } catch (e) {
                console.log(e)
                return { magnetURI: '', error: body } // TODO: improve error msg
            }

            return { magnetURI: result.magnetURI!, error: '' }
        }
        // {
        //     magnetURI?: string
        //     success: Boolean
        //     error: string
        // } // TODO: more type safety
    } catch (err: unknown) {
        if (typeof err === 'string') {
            console.trace(err)
            console.error(err.toUpperCase()) // works, `e` narrowed to string
        } else if (err instanceof Error) {
            console.trace(err)
            console.error(err.message)
        }

        return { magnetURI: '', error: 'Error on server' } // TODO: improve error msg
    }
}

export { processTorrent, Options }
