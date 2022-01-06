"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfHashExists = exports.Uploader = void 0;
// api.ts
var form_data_1 = __importDefault(require("form-data"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var baseURLUp = 'https://data.atorable.com';
// baseURLUp = 'https://localhost:9092'
// TODO: consolidate api call fn
var checkIfHashExists = function (options) {
    // throw new Error('Function not implemented.')
    var url = options.url, method = options.method, body = options.body, headers = options.headers;
    return (0, node_fetch_1.default)(baseURLUp + url, {
        method: method,
        // @ts-ignore
        body: body,
        headers: __assign({}, headers)
    });
};
exports.checkIfHashExists = checkIfHashExists;
var Uploader = function (fileName, acceptedFiles, uuid, apiKey, hash) {
    var formData = new form_data_1.default();
    formData.append('file', acceptedFiles, fileName);
    return (0, node_fetch_1.default)(baseURLUp + '/uploader', {
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
    });
};
exports.Uploader = Uploader;
//# sourceMappingURL=api.js.map