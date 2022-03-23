// api.ts
import FormData from 'form-data'
import fetch from 'node-fetch'

let APIServerURL = 'https://test.atorable.com'

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
    return fetch(APIServerURL + '/uploader', {
        method: 'POST',
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

export { Uploader, checkIfHashExists, setAPIServerURL }
