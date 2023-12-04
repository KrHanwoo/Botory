import { Image } from 'canvas';
import { ActivityType, Message } from 'discord.js';
import { Bot } from '../bot';

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
  static EMOJI_REGEX = /(:|<:|<a:)((\w{1,64}:\d*)|(\w{1,64}))(:|>)/g;
  static MENTION_REGEX = /<[@#][!&]?[0-9]+>/g;

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

  static currentDate() {
    return new Date().toISOString().split('T')[0];
  }

  static async getImage(url: string) {
    let img = new Image();
    await new Promise(r => {
      img.onload = () => { r(null); };
      img.src = url;
    });
    return img;
  }

  static async setStatus(status?: string | null, activity?: string | null) {
    const user = Bot.client.user;
    if (!user) return;
    if (status) user.setStatus(status as any);
    else user.setStatus('online');
    if (activity) user.setActivity(activity, { type: ActivityType.Custom });
    else user.setActivity();
  }

  static isTrashChat(msg: Message) {
    if (!msg) return true;
    if (msg.attachments.size > 0) return false;
    const content = msg.content;
    if (!content || content.length < 5) return true;
    const stripped = content
      .replaceAll(Util.EMOJI_REGEX, '')
      .replaceAll(Util.MENTION_REGEX, '')
      .replaceAll(/\s/g, '');
    if (!stripped) return true;
    const collapsed = stripped.replaceAll(/(.)\1+/gi, '');
    let total = collapsed.length;
    let kr = collapsed.match(/[가-힣]/g)?.length ?? 0;
    let other = total - kr;
    let score = kr * 2 + other;
    if (score < 12) return true;
    return false;
  }
}