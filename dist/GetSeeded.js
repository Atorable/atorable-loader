"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTorrentSeedAsync = void 0;
var parse_torrent_1 = __importDefault(require("parse-torrent"));
var create_torrent_1 = __importDefault(require("create-torrent"));
// TODO: clean up below and make torrent magnet with out seeding it 
var GetTorrentSeedAsync = function (relPath, baseURL, rootContext) {
    return new Promise(function (resolve) {
        var filePath = rootContext + "/" + relPath;
        var regex = /.*(?=\.)/gmi, stripAfterDot = regex.exec(relPath)[0], torPathName = stripAfterDot + ".torrent";
        create_torrent_1.default(filePath, function (err, torrentBuf) {
            if (!err) {
                var magnetURI = buildMagnetURI(torrentBuf, baseURL, relPath, torPathName);
                console.log("FILE NAME: ", torPathName);
                console.log(magnetURI);
                resolve({ torrent: magnetURI, torPathName: torPathName, torrentBuf: torrentBuf });
            }
            else {
                console.error(err);
            }
        });
    });
};
exports.GetTorrentSeedAsync = GetTorrentSeedAsync;
var buildMagnetURI = function (torrentBuf, baseURL, makeAPath, torPathName) {
    var _a;
    var torrentName = baseURL + torPathName, encode = encodeURIComponent(torrentName), parsedTorrent = parse_torrent_1.default(torrentBuf);
    parsedTorrent.urlList = (_a = parsedTorrent.urlList) === null || _a === void 0 ? void 0 : _a.concat([baseURL + makeAPath]);
    parsedTorrent.announce = Array.from(new Set(parsedTorrent.announce));
    parsedTorrent.urlList = Array.from(new Set(parsedTorrent.urlList));
    var magnetURI = parse_torrent_1.default.toMagnetURI(parsedTorrent) + ("&xs=" + encode);
    return magnetURI;
};
// https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
module.exports = { GetTorrentSeedAsync: exports.GetTorrentSeedAsync };
// `torrent` is a Buffer with the contents of the new .torrent file
// fs.writeFile(torPathName, torrentBuf, () => {
// TODO: see if torrent/file name already exists make a hash of file names see server index.js file
// try { parsedTorrent = parseTorrent(torrentId) } catch (err) {}
// this.magnetURI = parseTorrent.toMagnetURI(parsedTorrent) // https://github.com/webtorrent/webtorrent/blob/ee9da3d019742b648ec87c7757a25c8320cb2f3d/lib/torrent.js
// keepHash[fields.fileName] = torrent.magnetURI + `&xs=${encode}`
// export const MakeFile = (fileName, text) => {
//     return new Promise((resolve) => {
//         fs.writeFile(fileName, text, function (err) {
//             if (err) return console.log(err);
//             console.log('Hello World > helloworld.txt');
//             resolve(fileName)
//         });
//     });
// };
// var itsAllRelative = (relPath, context, rootContext) => {
//     var rootDir = rootContext.split("/").pop()
//     var root = context.split(rootContext)[1]
//     var slashSplit = root.split("/")
//     var dotDotSplit = relPath.split("../")
//     for (let index = 0; index < (dotDotSplit.length - 1); index++) {
//         slashSplit.pop()
//     }
//     var makeAPath = "";
//     for (let index = 0; index < slashSplit.length; index++) {
//         const folder = slashSplit[index];
//         makeAPath += folder + "/"
//     }
//     makeAPath += dotDotSplit.pop()
//     return makeAPath 
// }
