"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMagnetAndTorrentBuf = void 0;
// BuildMagnetAndTorrentBuf.ts
var parse_torrent_1 = __importDefault(require("parse-torrent"));
var create_torrent_1 = __importDefault(require("create-torrent"));
var GetMagnetAndTorrentBuf = function (assetRelPath, torRelPath, baseURL, rootContext) {
    return new Promise(function (resolve) {
        var assetAbsoutePath = rootContext + "/" + assetRelPath;
        create_torrent_1.default(assetAbsoutePath, function (err, torrentBuf) {
            if (!err) {
                var magnetURI = buildMagnetURI(torrentBuf, baseURL, assetRelPath, torRelPath);
                console.log(magnetURI);
                resolve({ magnetURI: magnetURI, torrentBuf: torrentBuf });
            }
            else {
                console.error(err);
            }
        });
    });
};
exports.GetMagnetAndTorrentBuf = GetMagnetAndTorrentBuf;
var buildMagnetURI = function (torrentBuf, baseURL, assetRelPath, torRelPath) {
    var _a;
    var torrentURL = baseURL + torRelPath, encode = encodeURIComponent(torrentURL), assetURL = baseURL + assetRelPath, parsedTorrent = parse_torrent_1.default(torrentBuf);
    parsedTorrent.urlList = (_a = parsedTorrent.urlList) === null || _a === void 0 ? void 0 : _a.concat([assetURL]);
    parsedTorrent.announce = Array.from(new Set(parsedTorrent.announce));
    parsedTorrent.urlList = Array.from(new Set(parsedTorrent.urlList));
    var magnetURI = parse_torrent_1.default.toMagnetURI(parsedTorrent) + ("&xs=" + encode);
    return magnetURI;
};
// https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
module.exports = { GetMagnetAndTorrentBuf: exports.GetMagnetAndTorrentBuf };
//# sourceMappingURL=BuildMagnetAndTorrentBuf.js.map