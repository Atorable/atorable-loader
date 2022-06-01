// BuildMagnetAndTorrentBuf.ts
import parseTorrent from 'parse-torrent'
import createTorrent from 'create-torrent'
import path from 'path'

let devAnnounceURL = ''

const SetDevAnnounceURL = (url: string) => {
    devAnnounceURL = url
}

const GetMagnetAndTorrentBuf = (
    assetBuffer: Buffer,
    assetRelPath: string,
    torRelPath: string,
    baseURL: string
) => {
    return new Promise<{
        magnetURI: string
        torrentBuf: Buffer
        infoHash: string
    }>(async (resolve, reject) => {
        const filename = path.parse(assetRelPath).base

        try {
            const { torrentBuf } = await createTorrentBuf(
                    assetBuffer,
                    filename
                ),
                { magnetURI, infoHash } = buildMagnetURI(
                    torrentBuf,
                    baseURL,
                    assetRelPath,
                    torRelPath
                )

            resolve({ magnetURI, torrentBuf, infoHash: infoHash! })
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}

const createTorrentBuf = (assetBuffer: Buffer, filename: string) => {
    return new Promise<{
        torrentBuf: Buffer
    }>((resolve, reject) => {
        createTorrent(assetBuffer, { name: filename }, (err, torrentBuf) => {
            if (!err) {
                resolve({ torrentBuf })
            } else {
                console.error(err)
                reject(err)
            }
        })
    })
}

const buildMagnetURI = (
    torrentBuffer: Buffer,
    baseURL: string,
    assetRelPath: string,
    torRelPath: string
) => {
    const torrentURL = baseURL + torRelPath,
        encode = encodeURIComponent(torrentURL),
        assetURL = baseURL + assetRelPath,
        pt = parseTorrent(torrentBuffer)

    pt.announce?.unshift('wss://bitt.atorable.com') // TODO: manage atorable trackers better
    if (devAnnounceURL) pt.announce?.unshift(devAnnounceURL)

    pt.urlList = pt.urlList?.concat([assetURL])
    pt.announce = Array.from(new Set(pt.announce)) // TODO: is this needed?
    pt.urlList = Array.from(new Set(pt.urlList)) // TODO: is this needed?

    const magnetURI = parseTorrent.toMagnetURI(pt) + `&xs=${encode}`

    return { magnetURI, infoHash: pt.infoHash }
}

// https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
export { GetMagnetAndTorrentBuf, createTorrentBuf, SetDevAnnounceURL }
