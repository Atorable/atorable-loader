/// <reference types="node" />
export declare const GetMagnetAndTorrentBuf: (assetBuffer: any, assetRelPath: string, torRelPath: string, baseURL: string) => Promise<{
    magnetURI: string;
    torrentBuf: Buffer;
}>;
