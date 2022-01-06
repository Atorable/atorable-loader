// api.ts
import FormData from 'form-data'
import fetch from 'node-fetch'

let baseURLUp = 'https://data.atorable.com'
// baseURLUp = 'https://localhost:9092'

// TODO: consolidate api call fn

const checkIfHashExists = (options: {
    url: string
    method: string
    body: any
    headers: object
}) => {
    // throw new Error('Function not implemented.')
    let { url, method, body, headers } = options
    return fetch(baseURLUp + url, {
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
    acceptedFiles: (string | Blob)[],
    uuid: string,
    apiKey: string,
    hash: string
) => {
    let formData = new FormData()
    formData.append('file', acceptedFiles, fileName)
    return fetch(baseURLUp + '/uploader', {
        method: 'POST',
        // @ts-ignore
        body: formData,
        headers: {
            // Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'x-api-key': apiKey,
            'x-uuid': uuid,
            'x-file-hash': hash
        }
    })
}

export { Uploader, checkIfHashExists }
