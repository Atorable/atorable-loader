/// <reference types="node" />
export declare const GetMagnetAndTorrentBuf: (assetRelPath: string, torRelPath: string, baseURL: string, rootContext: string) => Promise<{
    magnetURI: string;
    torrentBuf: Buffer;
}>;
