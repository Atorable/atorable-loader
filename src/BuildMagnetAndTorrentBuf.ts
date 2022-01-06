// BuildMagnetAndTorrentBuf.ts
import parseTorrent from 'parse-torrent'
import createTorrent from 'create-torrent'
import path from 'path'

const GetMagnetAndTorrentBuf = (
    assetBuffer: any,
    assetRelPath: string,
    torRelPath: string,
    baseURL: string
) => {
    return new Promise<{
        magnetURI: string
        torrentBuf: Buffer
        infoHash: string
    }>(async (resolve, reject) => {
        let filename = path.parse(assetRelPath).base

        try {
            let { torrentBuf } = await createTorrentBuf(assetBuffer, filename),
                pt = parseTorrent(torrentBuf),
                { magnetURI } = buildMagnetURI(
                    pt,
                    baseURL,
                    assetRelPath,
                    torRelPath
                )

            resolve({ magnetURI, torrentBuf, infoHash: pt.infoHash! })
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}

let createTorrentBuf = (assetBuffer: any, filename: string) => {
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

let buildMagnetURI = (
    pt: any, // TODO: type this
    baseURL: string,
    assetRelPath: string,
    torRelPath: string
) => {
    let torrentURL = baseURL + torRelPath,
        encode = encodeURIComponent(torrentURL),
        assetURL = baseURL + assetRelPath

    pt.urlList = pt.urlList?.concat([assetURL])
    pt.announce = Array.from(new Set(pt.announce)) // TODO: is this needed?
    pt.urlList = Array.from(new Set(pt.urlList)) // TODO: is this needed?

    let magnetURI = parseTorrent.toMagnetURI(pt) + `&xs=${encode}`

    return { magnetURI }
}

// https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
export { GetMagnetAndTorrentBuf, createTorrentBuf }
