// BuildMagnetAndTorrentBuf.ts
import parseTorrent from 'parse-torrent'
import createTorrent from 'create-torrent'
var path = require('path')

export const GetMagnetAndTorrentBuf = (
    assetBuffer: any,
    assetRelPath: string,
    torRelPath: string,
    baseURL: string
) => {
    return new Promise<{ magnetURI: string; torrentBuf: Buffer }>((resolve) => {
        let filename = path.parse(assetRelPath).base

        createTorrent(assetBuffer, { name: filename }, (err, torrentBuf) => {
            if (!err) {
                let magnetURI = buildMagnetURI(
                    torrentBuf,
                    baseURL,
                    assetRelPath,
                    torRelPath
                )
                console.log(magnetURI)

                resolve({ magnetURI, torrentBuf })
            } else {
                console.error(err)
            }
        })
    })
}

let buildMagnetURI = (
    torrentBuf: Buffer,
    baseURL: string,
    assetRelPath: string,
    torRelPath: string
) => {
    let torrentURL = baseURL + torRelPath,
        encode = encodeURIComponent(torrentURL),
        assetURL = baseURL + assetRelPath,
        parsedTorrent = parseTorrent(torrentBuf)

    parsedTorrent.urlList = parsedTorrent.urlList?.concat([assetURL])
    parsedTorrent.announce = Array.from(new Set(parsedTorrent.announce))
    parsedTorrent.urlList = Array.from(new Set(parsedTorrent.urlList))

    let magnetURI = parseTorrent.toMagnetURI(parsedTorrent) + `&xs=${encode}`
    return magnetURI
}

// https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
module.exports = { GetMagnetAndTorrentBuf: GetMagnetAndTorrentBuf }
