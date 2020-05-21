import * as path from 'path';

import {Build} from '../../classes/build/build';
import {config} from '../../config/config';

exports.command = 'typescript [source] [dist]';
exports.alias = 'ts';
exports.desc = 'Generate typescript models';
exports.builder = {
  source: {
    default: `${config.host}:${config.port.spec}`,
  },
  dist: {
    default: config.tsModelsUrl,
  },
};
exports.handler = (argv: any) => {
  const source = /^https?:\/\//.test(argv.source) ? argv.source : path.resolve(path.join(process.cwd(), argv.source));
  const dist = path.resolve(path.join(process.cwd(), argv.dist));
  Build.typescript(source, dist);
};
