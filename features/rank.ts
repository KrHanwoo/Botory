import { RankFrame } from "../utils/rankFrame";
import { BotCache } from "../utils/botCache";
import { Util } from "../utils/util";
import { Money } from "../utils/money";
import { Bot } from "../bot";
import { Document, WithId } from "mongodb";
import { Xp } from "../utils/xp";

export class Rank {

  static async init() {
    updateRank();
    setInterval(updateRank, 60 * 5 * 1000);
  }
}

async function updateRank() {
  let moneyRankings = await Money.getRankings();
  let xpRankings = await Xp.getRankings();

  await processRoles(Bot.config.role.rich, moneyRankings);
  await processRoles(Bot.config.role.dichang, xpRankings);

  let moneyCanvas = await RankFrame.createMoneyTable(moneyRankings);
  let xpCanvas = await RankFrame.createRankTable(xpRankings);
  let moneyData = { files: [{ attachment: moneyCanvas.toBuffer(), name: `money_rank_${Util.currentDate()}.png` }] };
  let xpData = { files: [{ attachment: xpCanvas.toBuffer(), name: `money_rank_${Util.currentDate()}.png` }] };

  let messages = await BotCache.rank.messages.fetch({ limit: 5 });
  let moneyMsg = messages.filter(x => x.attachments.some(a => a.name.startsWith('money_rank_'))).at(0);
  let xpMsg = messages.filter(x => x.attachments.some(a => a.name.startsWith('xp_rank_'))).at(0);

  if (!moneyMsg || !moneyMsg.editable) BotCache.rank.send(moneyData);
  else moneyMsg.edit(moneyData);
  if (!xpMsg || !xpMsg.editable) BotCache.rank.send(xpData);
  else xpMsg.edit(xpData);
}

async function processRoles(id: string, rankings: WithId<Document>[]) {
  const role = await BotCache.guild.roles.fetch(id);
  if (role) {
    let eligible = rankings.slice(0, 5);
    let roleRemove = role.members.filter(m => !eligible.some(x => x.member == m.id));
    let roleAdd = eligible.filter(r => !role.members.some(x => x.id == r.member));
    for (let pair of roleRemove) {
      await pair[1].roles.remove(id).catch(() => null);
    }
    for (let doc of roleAdd) {
      let member = await BotCache.guild.members.fetch(doc.member);
      await member.roles.add(id).catch(() => null);
    }
  }
}