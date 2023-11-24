import { RankFrame } from "../utils/rankFrame";
import { BotCache } from "../utils/botCache";
import { Util } from "../utils/util";

export class Rank {

  static async init() {
    updateRank();
    setInterval(updateRank, 60 * 5 * 1000);
  }
}

async function updateRank() {
  let canvas = await RankFrame.createMoneyTable();
  let data = { files: [{ attachment: canvas.toBuffer(), name: `rank_${Util.currentDate()}.png` }] };
  let last = (await BotCache.rank.messages.fetch({ limit: 1 })).at(0);
  if (!last || !last.editable) BotCache.rank.send(data);
  else last.edit(data);
}