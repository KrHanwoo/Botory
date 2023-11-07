export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Util = {

  isScript(file: string) {
    return file.endsWith('.js');
  }
}