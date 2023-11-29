import { Collection, Document } from 'mongodb';
import { Database } from './database';


let storage: Collection<Document>;

export class Xp {

  static init() {
    storage = Database.get('xp');
  }

  static async addXp(id: string, amount: number) {
    return storage.updateOne({ member: id }, { $inc: { xp: amount } }, { upsert: true });
  }

  static async getXp(id: string) {
    return (await storage.findOne({ member: id }))?.xp ?? 0;
  }

  static async getInfo(id: string) {
    let docs = await storage.find().toArray();
    docs.sort((a, b) => b.xp - a.xp);
    let idx = docs.findIndex(x => x.member == id);
    let rank = (idx + 1) || (docs.length + 1);
    let xp = idx == -1 ? 0 : docs[idx].xp ?? 0;
    return { rank: rank, xp: xp };
  }

  static async getRankings() {
    let docs = await storage.find().toArray();
    docs = docs.sort((a, b) => b.xp - a.xp).slice(0, 20);
    return docs;
  }

  static calcRequiredXp(current: number) {
    return 100 + current * 55;
  }

  static levelToXp(level: number) {
    let x = 10 * Math.pow(level, 3) + 135 * Math.pow(level, 2) + 455 * level;
    return Math.floor(x / 6);
  }

  static xpToLevel(xp: number) {
    let l = 0;
    let r = 1001;
    let mid;
    while (r - l > 1) {
      mid = Math.floor((l + r) / 2);
      if (xp < this.levelToXp(mid)) r = mid;
      else l = mid;
    }
    return l;
  }


}