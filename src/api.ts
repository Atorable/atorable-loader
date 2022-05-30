// api.ts
import FormData from 'form-data'
import fetch from 'node-fetch'

let APIServerURL = 'https://data.atorable.com'
let PRODUCTION = false

const setAPIServerURL = (baseURL: string) => {
    APIServerURL = baseURL
}

const setPROD = (isProd: boolean) => {
    PRODUCTION = isProd
}

// TODO: consolidate api call fn

const checkIfHashExists = (
    ATORABLE_SECRET_KEY: string,
    infoHash: string,
    fileSize: string,
    filename: string,
    ssbID: string
) => {
    // throw new Error('Function not implemented.')
    return fetch(APIServerURL + '/hash-check', {
        method: 'POST',
        headers: {
            'x-is-prod': PRODUCTION ? 'true' : 'false',
            'x-api-key': ATORABLE_SECRET_KEY,
            'x-file-hash': infoHash,
            'x-file-size': fileSize,
            'x-file-name': filename,
            'x-ssb-id': ssbID
        }
    })
}

const Uploader = (
    fileName: string,
    acceptedFiles: Buffer,
    apiKey: string,
    hash: string,
    ssbID: string
) => {
    const formData = new FormData()
    formData.append('file', acceptedFiles, fileName)
    const fileSize = Buffer.byteLength(acceptedFiles) * 1e-6

    return fetch(APIServerURL + '/uploader', {
        method: 'POST',
        body: formData,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers: {
            'x-is-prod': PRODUCTION ? 'true' : 'false',
            'x-api-key': apiKey,
            'x-file-hash': hash,
            'x-file-size': fileSize,
            'x-file-name': fileName,
            'x-ssb-id': ssbID
        }
    })
}

export { Uploader, checkIfHashExists, setAPIServerURL, setPROD }
