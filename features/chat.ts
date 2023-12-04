import { Message } from 'discord.js';
import { Money } from '../utils/money';
import { Xp } from '../utils/xp';
import { Util } from '../utils/util';

let map = new Map<string, number>();

export class Chat {

  static async chat(msg: Message) {
    if (!msg) return;
    let id = msg.author.id;
    if (!check(id)) return;
    if (Util.isTrashChat(msg)) return;
    Money.addMoney(id, 50);
    Xp.addXp(id, 20);
  }
}

function check(id: string) {
  let last = map.get(id) ?? 0;
  if (Date.now() >= last + 1000 * 60) {
    map.set(id, Date.now());
    return true;
  }
  return false;
}