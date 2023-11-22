export class Util {

  static isScript(file: string) {
    return file.endsWith('.js');
  }

  static async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}