export const printBuildFileMagInfo = (
    ssbID: string,
    filename: string,
    magnetURI: string,
    showMagnetInfo: boolean
) => {
    if (showMagnetInfo) {
        console.log(
            '\x1b[1;32m%s\x1b[0m',
            `File: ${filename} buildID:${ssbID} \n\n${magnetURI}\n`
        ) //green
    }
}
