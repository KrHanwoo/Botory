import { Collection, Document } from 'mongodb';
import { Database } from './database';


let storage: Collection<Document>;

export class Money {

  static init() {
    storage = Database.get('money');
  }

  static async addMoney(id: string, amount: number) {
    return storage.updateOne({ id: id }, { $inc: { money: amount } }, { upsert: true });
  }

  static async getMoney(id: string) {
    return (await storage.findOne({ id: id }))?.money ?? 0;
  }

  static async getInfo(id: string) {
    let docs = await storage.find().toArray();
    docs.sort((a, b) => b.money - a.money);
    let idx = docs.findIndex(x => x.id == id);
    let rank = (idx + 1) || (docs.length + 1);
    let money = idx == -1 ? 0 : docs[idx].money ?? 0;
    return { rank: rank, money: money };
  }

  static async getRankings() {
    let docs = await storage.find().toArray();
    docs = docs.sort((a, b) => b.money - a.money).slice(0,20);
    return docs;
  }

}