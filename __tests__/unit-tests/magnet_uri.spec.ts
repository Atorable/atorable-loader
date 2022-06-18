import { describe, beforeAll, expect, afterAll, it } from '@jest/globals'
import path from 'path'
import { GetMagnetAndTorrentBuf } from '../../src/BuildMagnetAndTorrentBuf'

describe('status integration tests', () => {
    // beforeAll(async () => {})

    it('can make a magnetURI', async () => {
        const relPath = 'upload/test-file-1.txt',
            patt1 = /\.[0-9a-z]+$/i,
            interend = patt1.exec(relPath)!,
            regex = /.*(?=\.)/gim,
            inter = regex.exec(relPath)!,
            torrentName = inter[0] + '.torrent' // TODO find all ! and deal
        const { magnetURI, torrentBuf, infoHash } =
            await GetMagnetAndTorrentBuf(
                new Buffer('test'),
                relPath,
                torrentName,
                'https://www.atorable.com/'
            )
        expect(magnetURI).toBe(
            'magnet:?xt=urn:btih:11bd88f9231cd2365360b4de1df92f9e20d8437d&dn=test-file-1.txt&tr=wss%3A%2F%2Fbitt.atorable.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwww.atorable.com%2Fupload%2Ftest-file-1.txt&xs=https%3A%2F%2Fwww.atorable.com%2Fupload%2Ftest-file-1.torrent'
        )
    })

    // afterAll(async () => {})
})
