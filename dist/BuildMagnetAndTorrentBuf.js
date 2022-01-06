"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTorrentBuf = exports.GetMagnetAndTorrentBuf = void 0;
// BuildMagnetAndTorrentBuf.ts
var parse_torrent_1 = __importDefault(require("parse-torrent"));
var create_torrent_1 = __importDefault(require("create-torrent"));
var path_1 = __importDefault(require("path"));
var GetMagnetAndTorrentBuf = function (assetBuffer, assetRelPath, torRelPath, baseURL) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var filename, torrentBuf, pt, magnetURI, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filename = path_1.default.parse(assetRelPath).base;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createTorrentBuf(assetBuffer, filename)];
                case 2:
                    torrentBuf = (_a.sent()).torrentBuf, pt = (0, parse_torrent_1.default)(torrentBuf), magnetURI = buildMagnetURI(pt, baseURL, assetRelPath, torRelPath).magnetURI;
                    resolve({ magnetURI: magnetURI, torrentBuf: torrentBuf, infoHash: pt.infoHash });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    reject(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
};
exports.GetMagnetAndTorrentBuf = GetMagnetAndTorrentBuf;
var createTorrentBuf = function (assetBuffer, filename) {
    return new Promise(function (resolve, reject) {
        (0, create_torrent_1.default)(assetBuffer, { name: filename }, function (err, torrentBuf) {
            if (!err) {
                resolve({ torrentBuf: torrentBuf });
            }
            else {
                console.error(err);
                reject(err);
            }
        });
    });
};
exports.createTorrentBuf = createTorrentBuf;
var buildMagnetURI = function (pt, // TODO: type this
baseURL, assetRelPath, torRelPath) {
    var _a;
    var torrentURL = baseURL + torRelPath, encode = encodeURIComponent(torrentURL), assetURL = baseURL + assetRelPath;
    pt.urlList = (_a = pt.urlList) === null || _a === void 0 ? void 0 : _a.concat([assetURL]);
    pt.announce = Array.from(new Set(pt.announce)); // TODO: is this needed?
    pt.urlList = Array.from(new Set(pt.urlList)); // TODO: is this needed?
    var magnetURI = parse_torrent_1.default.toMagnetURI(pt) + "&xs=".concat(encode);
    return { magnetURI: magnetURI };
};
//# sourceMappingURL=BuildMagnetAndTorrentBuf.js.map