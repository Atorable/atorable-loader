// api.ts
import FormData from 'form-data'
import fetch from 'node-fetch'

let APIServerURL = 'https://data.atorable.com'

const setAPIServerURL = (baseURL: string) => {
    APIServerURL = baseURL
}

// TODO: consolidate api call fn

const checkIfHashExists = (options: {
    url: string
    method: string
    body: any
    headers: object
}) => {
    // throw new Error('Function not implemented.')
    const { url, method, body, headers } = options
    return fetch(APIServerURL + url, {
        method: method,
        body: body,
        headers: {
            // Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            ...headers
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
            // Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'x-api-key': apiKey,
            'x-file-hash': hash,
            'x-file-size': fileSize,
            'x-file-name': fileName,
            'x-ssb-id': ssbID
        }
    })
}

export { Uploader, checkIfHashExists, setAPIServerURL }
