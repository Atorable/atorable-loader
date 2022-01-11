// api.ts
import FormData from 'form-data'
import fetch from 'node-fetch'

let BaseURLUp = 'https://data.atorable.com'

const setBaseURL = (baseURL: string) => {
    BaseURLUp = baseURL
}

// TODO: consolidate api call fn

const checkIfHashExists = (options: {
    url: string
    method: string
    body: any
    headers: object
}) => {
    // throw new Error('Function not implemented.')
    let { url, method, body, headers } = options
    return fetch(BaseURLUp + url, {
        method: method,
        // @ts-ignore
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
    uuid: string,
    apiKey: string,
    hash: string,
    ssbID: string
) => {
    let formData = new FormData()
    formData.append('file', acceptedFiles, fileName)
    return fetch(BaseURLUp + '/uploader', {
        method: 'POST',
        // @ts-ignore
        body: formData,
        headers: {
            // Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'x-api-key': apiKey,
            'x-file-hash': hash,
            'x-ssb-id': ssbID
        }
    })
}

export { Uploader, checkIfHashExists, setBaseURL }
