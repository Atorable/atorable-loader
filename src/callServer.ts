// callServer.ts
import { createTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { checkIfHashExists, Uploader } from './api'
import parseTorrent from 'parse-torrent'
import { API_BUILD } from '.'
// TODO: update all dependencies after getting things working
interface Options {
    showMagnetInfo: boolean
    baseURL: string
    regExp: RegExp
    rootUrl: () => string
    ATORABLE_KEY_ID: string
    ATORABLE_SECRET_KEY: string
    WEBTOR_API_URL: string
}

const processTorrent = async (
    content: Buffer,
    filename: string,
    options: Options,
    ssbID?: string
) => {
    try {
        ssbID = ssbID || API_BUILD

        const { torrentBuf } = await createTorrentBuf(content, filename),
            pt = parseTorrent(torrentBuf),
            infoHash = pt.infoHash as string,
            fileSize = Buffer.byteLength(content) * 1e-6

        const hashResponse = await checkIfHashExists({
            url: '/hash-check',
            method: 'POST',
            body: {},
            headers: {
                'x-api-key': options.ATORABLE_SECRET_KEY,
                'x-file-hash': infoHash,
                'x-file-size': fileSize,
                'x-ssb-id': ssbID
            }
        })

        // const hashResulttext = await hashResponse.text()
        const hashResult = await hashResponse.json()

        if (hashResult.error) {
            return { magnetURI: '', error: hashResult.error }
        }

        if (!hashResult.beginUpload) {
            // returns if hash exists
            return { magnetURI: hashResult.magnetURI!, error: '' }
        }

        const response = await Uploader(
                filename,
                content,
                options.ATORABLE_SECRET_KEY,
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
