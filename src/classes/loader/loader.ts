import {readFileSync} from 'fs-extra';
import {Notify} from '@lubowiecki/node-notify';
import {Maybe} from '@lubowiecki/ts-utility';

export class Loader {
  static loadSource(source: string): Maybe<any> {
    let file: Maybe<any> = null;

    if (typeof source === 'string') {
      const fileAsString = this.readFile(source);

      if (typeof fileAsString === 'string') {
        file = JSON.parse(fileAsString);
      }
    }

    return file;
  }

  static readFile(source: string): Maybe<string> {
    try {
      return readFileSync(source, 'utf-8');
    } catch (e) {
      Notify.error({
        message: `Can't read file: ${source}`,
      });
    }
  }
}
