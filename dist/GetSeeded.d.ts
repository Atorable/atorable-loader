/// <reference types="node" />
export declare const GetTorrentSeedAsync: (assetRelPath: string, torRelPath: string, baseURL: string, rootContext: string) => Promise<{
    torrent: string;
    torrentBuf: Buffer;
}>;
