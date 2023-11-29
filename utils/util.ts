import { Image } from 'canvas';

const lookup = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' }
];
const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

export class Util {

  static isScript(file: string) {
    return file.endsWith('.js');
  }

  static async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static adjustColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '')
      .replace(/../g, x => Math.min(255, Math.max(0, parseInt(x, 16) + amount)).toString(16).padStart(2, '0'));
  }

  static formatNumber(num: number, digits: number) {
    let item = lookup.slice().reverse().find(x => num >= x.value);
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
  }

  static currentDate(){
    return new Date().toISOString().split('T')[0];
  }

  static async getImage(url: string){
    let img = new Image();
    await new Promise(r => {
      img.onload = () => { r(null); };
      img.src = url;
    });
    return img;
  }
}