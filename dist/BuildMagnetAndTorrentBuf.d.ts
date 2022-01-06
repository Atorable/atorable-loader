/// <reference types="node" />
declare const GetMagnetAndTorrentBuf: (assetBuffer: any, assetRelPath: string, torRelPath: string, baseURL: string) => Promise<{
    magnetURI: string;
    torrentBuf: Buffer;
    infoHash: string;
}>;
declare let createTorrentBuf: (assetBuffer: any, filename: string) => Promise<{
    torrentBuf: Buffer;
}>;
export { GetMagnetAndTorrentBuf, createTorrentBuf };
