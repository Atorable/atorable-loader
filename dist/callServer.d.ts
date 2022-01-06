interface Options {
    baseURL: string;
    regExp: RegExp;
    rootUrl: Function;
    ATORABLE_KEY_ID: string;
    ATORABLE_SECRET_KEY: string;
}
declare const processTorrent: (content: (string | Blob)[], filename: string, options: Options) => Promise<{
    magnetURI: any;
    error: string;
} | undefined>;
export { processTorrent, Options };
