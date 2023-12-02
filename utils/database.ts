import { Collection, Db, MongoClient } from 'mongodb';
import { Bot } from '../bot';

let client;
let db: Db;

export class Database {

  static storage: Collection;

  static async init() {
    client = new MongoClient(Bot.config.db);
    await client.connect();
    db = client.db('Botory');
    await db.command({ ping: 1 });
    this.storage = this.get('storage');
  }

  static get(name: string) {
    return db.collection(name);
  }

  static async getStorage(key: string){
    return (await this.storage.findOne({key: key}))?.value;
  }

  static async setStorage(key: string, value: any){
    return this.storage.replaceOne({key: key}, {key: key, value: value}, {upsert: true});
  }
}