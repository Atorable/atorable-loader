/// <reference types="node" />
export declare const GetTorrentSeedAsync: (relPath: string, baseURL: string, rootContext: string) => Promise<{
    torrent: string;
    torPathName: string;
    torrentBuf: Buffer;
}>;
