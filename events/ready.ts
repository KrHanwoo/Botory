import { Raid } from '../features/raid.js';
import { Rank } from '../features/rank.js';
import { BotCache } from '../utils/botCache.js';
import { Database } from '../utils/database.js';
import { InteractionHandler } from '../utils/interactionHandler.js';
import { Util } from '../utils/util.js';

module.exports = {
  event: 'ready',
  async execute() {
    await BotCache.init();
    await InteractionHandler.init();

    Rank.init();
    Raid.init();

    console.log('Bot is ready!');

    setStatus();
  }
};

async function setStatus() {
  let status = await Database.getStorage('status');
  if (!status) return;
  Util.setStatus(status.status, status.activity);
}