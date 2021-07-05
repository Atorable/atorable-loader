// fileToTorrentLoader.js
import path from "path";
import { getOptions, interpolateName, OptionObject } from "loader-utils";
import { GetTorrentSeedAsync } from "./GetSeeded";
import webpack from "webpack";

module.exports =  async function loader(this: webpack.loader.LoaderContext, content: any, sourceMap: any) {
    const options: Readonly<OptionObject> = getOptions(this),
          callback = this.async()!,
          context = options.context || this.rootContext,
          name: string = <string> options.name || '[contenthash].[ext]';

    const url = interpolateName(this, name, {
      context,
      content,
      regExp: options.regExp,
    });
    let outputPath = url;

    const relativePath = path.relative(this.rootContext, this.resourcePath);

    let seed = await GetTorrentSeedAsync(relativePath, <string> options.baseURL, this.rootContext);
    this.emitFile(seed.torPathName, seed.torrentBuf, sourceMap);

    let seedTor = `"${seed.torrent}"`

    this.emitFile(outputPath, content, sourceMap);

    const esModule =
      typeof options.esModule !== 'undefined' ? options.esModule : true;

    callback(null,  `${esModule ? 'export default' : 'module.exports ='} ${seedTor};`);
}

module.exports.raw = true;
