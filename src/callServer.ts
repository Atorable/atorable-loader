// callServer.ts
import { createTorrentBuf } from './BuildMagnetAndTorrentBuf'
import { checkIfHashExists, Uploader } from './api'
import parseTorrent from 'parse-torrent'
// TODO: update all dependencies after getting things working
interface Options {
    baseURL: string
    regExp: RegExp
    rootUrl: Function
    ATORABLE_KEY_ID: string
    ATORABLE_SECRET_KEY: string
    WEBTOR_API_URL: string
}

const processTorrent = async (
    content: Buffer,
    filename: string,
    options: Options
) => {
    try {
        let { torrentBuf } = await createTorrentBuf(content, filename),
            pt = parseTorrent(torrentBuf),
            infoHash = pt.infoHash as string

        let hashResponse = await checkIfHashExists({
            url: '/hash-check',
            method: 'POST',
            body: {},
            headers: {
                'x-api-key': options.ATORABLE_SECRET_KEY,
                'x-file-hash': infoHash
            }
        })

        let hashResult = await hashResponse.json()

        if (!hashResult.error && !hashResult.beginUpload) {
            return { magnetURI: hashResult.magnetURI!, error: '' }
        }

        let response = await Uploader(
                filename,
                content,
                options.ATORABLE_KEY_ID,
                options.ATORABLE_SECRET_KEY,
                infoHash
            ),
            // result = (await response.json()) as any
            body = await response.text(),
            result: any

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
    } catch (error) {
        console.error(error)
        return { magnetURI: '', error: 'Error on server' } // TODO: improve error msg
    }
}

export { processTorrent, Options }
