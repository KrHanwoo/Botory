import { Db, MongoClient } from 'mongodb';
import { Bot } from '../bot';

let client;
let db: Db;

export const Database = {

  async init() {
    client = new MongoClient(Bot.config.db);
    await client.connect();
    db = client.db('Botory');
    await db.command({ ping: 1 });
  },

  get(name: string) {
    return db.collection(name);
  }
}