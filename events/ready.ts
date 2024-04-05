import { Raid } from '../features/raid';
import { Rank } from '../features/rank';
import { BotCache } from '../utils/botCache';
import { Database } from '../utils/database';
import { InteractionHandler } from '../utils/interactionHandler';
import { Util } from '../utils/util';

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