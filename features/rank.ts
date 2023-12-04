import { RankFrame } from '../utils/rankFrame';
import { BotCache } from '../utils/botCache';
import { Util } from '../utils/util';
import { Money } from '../utils/money';
import { Bot } from '../bot';
import { Document, WithId } from 'mongodb';
import { Xp } from '../utils/xp';
import { Collection, Message } from 'discord.js';
import { Canvas } from 'canvas';

let lastUpdate: number;

export class Rank {

  static async init() {
    updateRank();
  }

  static attemptUpdate(force: boolean){
    if(force || !lastUpdate)return updateRank();
    if(Date.now() < lastUpdate + 1000 * 60 * 15)return;
    updateRank();
  }
}

async function updateRank() {
  lastUpdate = Date.now();

  let messages = await BotCache.rank.messages.fetch({ limit: 5 });
  let moneyRankings = await Money.getRankings();
  let xpRankings = await Xp.getRankings();

  let moneyCanvas = await RankFrame.createMoneyTable(moneyRankings);
  let xpCanvas = await RankFrame.createRankTable(xpRankings);
  processTable(moneyCanvas, 'money', messages);
  processTable(xpCanvas, 'xp', messages);

  await processRoles(Bot.config.role.dichang, xpRankings, 3);
  await processRoles(Bot.config.role.rich, moneyRankings, 5, Bot.config.role.dichang);
}

async function processTable(table: Canvas, id: string, messages: Collection<string, Message>) {
  let data = { files: [{ attachment: table.toBuffer(), name: `${id}_rank_${Util.currentDate()}.png` }] };
  let msg = messages.filter(x => x.attachments.some(a => a.name.startsWith(`${id}_rank_`))).at(0);
  if (!msg || !msg.editable) BotCache.rank.send(data);
  else msg.edit(data);
}

async function processRoles(id: string, rankings: WithId<Document>[], limit: number, exclude?: string) {
  const role = await BotCache.guild.roles.fetch(id);
  let excludeRole;
  if (exclude) excludeRole = await BotCache.guild.roles.fetch(exclude);
  if (!role) return;
  let idx = -1;
  let eligible: string[] = [];
  for (let i = 0; i < limit; i++) {
    idx++;
    if (idx + 1 > rankings.length) return;
    let memberId = rankings[idx].id;
    if (excludeRole && excludeRole.members.some(x => x.id == memberId)) {
      i--;
      continue;
    }
    eligible.push(memberId);
  }

  let roleRemove = role.members.filter(m => !eligible.some(x => x == m.id));
  let roleAdd = eligible.filter(r => !role.members.some(x => x.id == r));
  for (let pair of roleRemove) {
    await pair[1].roles.remove(id).catch(() => null);
  }
  for (let mId of roleAdd) {
    let member = await BotCache.guild.members.fetch(mId);
    await member.roles.add(id).catch(() => null);
  }
}