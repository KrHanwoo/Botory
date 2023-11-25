import { RankFrame } from "../utils/rankFrame";
import { BotCache } from "../utils/botCache";
import { Util } from "../utils/util";
import { Money } from "../utils/money";
import { Bot } from "../bot";

export class Rank {

  static async init() {
    updateRank();
    setInterval(updateRank, 60 * 5 * 1000);
  }
}

async function updateRank() {
  let rankings = await Money.getRankings();
  
  let rich = Bot.config.role.rich;
  const role = await BotCache.guild.roles.fetch(rich);
  if (role) {
    let eligible = rankings.slice(0, 10);
    let roleRemove = role.members.filter(m => !eligible.some(x => x.member == m.id));
    let roleAdd = eligible.filter(r => !role.members.some(x => x.id == r.member));
    for(let pair of roleRemove){
      await pair[1].roles.remove(rich).catch(() => null);
    }
    for(let doc of roleAdd){
      let member = await BotCache.guild.members.fetch(doc.member);
      await member.roles.add(rich).catch(() => null);
    }
  }

  let canvas = await RankFrame.createMoneyTable(rankings);
  let data = { files: [{ attachment: canvas.toBuffer(), name: `rank_${Util.currentDate()}.png` }] };
  let last = (await BotCache.rank.messages.fetch({ limit: 1 })).at(0);
  if (!last || !last.editable) BotCache.rank.send(data);
  else last.edit(data);
}