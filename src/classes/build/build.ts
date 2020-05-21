import {execSync} from 'child_process';
import {removeSync, writeJsonSync, emptyDirSync} from 'fs-extra';
import {Notify} from '@lubowiecki/node-notify';
import {flatten, is, mergeDeepLeft, reduce} from 'ramda';
import * as path from 'path';

import {Loader} from '../loader/loader';
export class Build {
  static spec(source: string | string[], dist: string, filename: string): void {
    if (is(Array, source)) {
      const tmpFilePath = `src/docs/index--tmp.json`;

      const spec = reduce(
        (acc: any, elem: string) => {
          const currentFile = Loader.loadSource(elem);
          return currentFile != null ? mergeDeepLeft(acc, currentFile) : acc;
        },
        {},
        source as string[]
      );
      writeJsonSync(tmpFilePath, spec);
      this.generateSpec(tmpFilePath, dist, filename);

      removeSync(tmpFilePath);
    } else if (typeof source === 'string') {
      this.generateSpec(source, dist, filename);
    }
  }

  private static generateSpec(source: string, dist: string, filename: string): void {
    let isSpecValid = false;

    try {
      execSync(`swagger-cli validate ${source}`);
      Notify.info({message: 'Openapi schema valid'});
      isSpecValid = true;
    } catch (error) {
      Notify.error({message: 'Openapi schema validation failed', error});
    }

    if (isSpecValid) {
      try {
        execSync(`swagger-cli bundle -o ${dist}/${filename}.json ${source}`);
        execSync(`swagger-cli bundle -r -o ${dist}/${filename}-dereferenced.json ${source}`);
        Notify.success({
          message: `Openapi spec generated in directory: ${dist}`,
        });
      } catch (error) {
        Notify.error({message: 'Openapi spec generation error', error});
      }
    }
  }

  static typescript(source: string, dist: string): void {
    emptyDirSync(dist);
    const configPath = path.resolve(path.join(__dirname, '../../../ng-openapi-gen.json'));
    const templatePath = path.resolve(path.join(__dirname, '../../../template-overrides'));
    try {
      execSync(`ng-openapi-gen --input ${source} --output ${dist} --config ${configPath} --templates ${templatePath}`);

      Notify.success({
        message: `Files generated in directory: ${dist}`,
      });

      this.removeUnusedFiles(dist);
    } catch (error) {
      Notify.error({message: 'Generation error', error});
    }
  }

  private static removeUnusedFiles(dist: string): void {
    const unusedFiles = [
      path.join(dist, '/services'),
      path.join(dist, '/api.module.ts'),
      path.join(dist, '/api-configuration.ts'),
      path.join(dist, '/base-service.ts'),
      path.join(dist, '/models.ts'),
      path.join(dist, '/request-builder.ts'),
      path.join(dist, '/services.ts'),
      path.join(dist, '/strict-http-response.ts'),
    ];

    flatten(unusedFiles).forEach((p) => {
      removeSync(p);
      Notify.info({message: `Removed: ${p}`});
    });
  }
}
