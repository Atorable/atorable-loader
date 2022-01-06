declare const checkIfHashExists: (options: {
    url: string;
    method: string;
    body: any;
    headers: object;
}) => Promise<import("node-fetch").Response>;
declare const Uploader: (fileName: string, acceptedFiles: (string | Blob)[], uuid: string, apiKey: string, hash: string) => Promise<import("node-fetch").Response>;
export { Uploader, checkIfHashExists };
