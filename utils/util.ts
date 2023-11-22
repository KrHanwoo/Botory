export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class Util {

  static isScript(file: string) {
    return file.endsWith('.js');
  }
}