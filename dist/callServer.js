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
exports.processTorrent = void 0;
// callServer.ts
var BuildMagnetAndTorrentBuf_1 = require("./BuildMagnetAndTorrentBuf");
var api_1 = require("./api");
var parse_torrent_1 = __importDefault(require("parse-torrent"));
var processTorrent = function (content, filename, options) { return __awaiter(void 0, void 0, void 0, function () {
    var torrentBuf, pt, infoHash, hashResponse, hashResult, response, 
    // result = (await response.json()) as any
    body, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, (0, BuildMagnetAndTorrentBuf_1.createTorrentBuf)(content, filename)];
            case 1:
                torrentBuf = (_a.sent()).torrentBuf, pt = (0, parse_torrent_1.default)(torrentBuf), infoHash = pt.infoHash;
                return [4 /*yield*/, (0, api_1.checkIfHashExists)({
                        url: '/hash-check',
                        method: 'POST',
                        body: {},
                        headers: {
                            'x-api-key': options.ATORABLE_SECRET_KEY,
                            'x-file-hash': infoHash
                        }
                    })];
            case 2:
                hashResponse = _a.sent();
                return [4 /*yield*/, hashResponse.json()];
            case 3:
                hashResult = _a.sent();
                if (!hashResult.error && !hashResult.beginUpload) {
                    return [2 /*return*/, { magnetURI: hashResult.magnetURI, error: '' }];
                }
                return [4 /*yield*/, (0, api_1.Uploader)(filename, content, options.ATORABLE_KEY_ID, options.ATORABLE_SECRET_KEY, infoHash)];
            case 4:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 5:
                body = _a.sent(), result = void 0;
                if (body) {
                    // TODO: figure out why this is necessary
                    try {
                        result = JSON.parse(body); // TODO: clean up
                        if (!result.success) {
                            console.log(body);
                            return [2 /*return*/, { magnetURI: '', error: body }
                                // TODO: throw error in callback ?
                            ]; // TODO: improve error msg
                            // TODO: throw error in callback ?
                        }
                    }
                    catch (e) {
                        console.log(e);
                        return [2 /*return*/, { magnetURI: '', error: body }]; // TODO: improve error msg
                    }
                    return [2 /*return*/, { magnetURI: result.magnetURI, error: '' }];
                }
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, { magnetURI: '', error: 'Error on server' }]; // TODO: improve error msg
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.processTorrent = processTorrent;
//# sourceMappingURL=callServer.js.map