// index.ts
import path from "path";
import { getOptions, interpolateName } from "loader-utils";
import { GetTorrentSeedAsync } from "./GetSeeded";
import webpack from "webpack";

interface Options{
  context: string;
  name: string;
  baseURL: string;
  regExp: RegExp;
  rootUrl: Function;
  esModule: string;
}

module.exports =  async function loader(this: webpack.loader.LoaderContext, content: any, sourceMap: any) {
    const options = <Options> <unknown>getOptions(this),
          callback = this.async()!,
          context = options.context || this.rootContext,
          name: string = <string> options.name || '[contenthash].[ext]',
          assetPath = interpolateName(this, name, {
                context,
                content,
                regExp: options.regExp,
              }),
          torrentPath = interpolateName(this, '[path][name].torrent', {
                context,
                content,
                regExp: options.regExp,
              });

    let baseURL = <string> options.baseURL;
    if (options.rootUrl){
      baseURL =  options.rootUrl()
    }

    let seed = await GetTorrentSeedAsync(assetPath, torrentPath, baseURL, this.rootContext);

    this.emitFile(torrentPath, seed.torrentBuf, sourceMap);
    this.emitFile(assetPath, content, sourceMap);

    const esModule =
      typeof options.esModule !== 'undefined' ? options.esModule : true;
    callback(null,  `${esModule ? 'export default' : 'module.exports ='} "${seed.magnetURI}";`);
}

module.exports.raw = true;
