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
  BotCache.rank.send({
    files: [{ attachment: canvas.toBuffer(), name: `rank_${Util.currentDate()}.png` }]
  });
}