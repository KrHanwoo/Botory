import { Raid } from '../features/raid.js';
import { Rank } from '../features/rank.js';
import { BotCache } from '../utils/botCache.js';
import { InteractionHandler } from '../utils/interactionHandler.js';
import { Money } from '../utils/money.js';
import { Xp } from '../utils/xp.js';

module.exports = {
  event: 'ready',
  async execute() {
    await BotCache.init();
    await InteractionHandler.init();


    //TODO: Move
    Xp.init();
    Money.init();
    Rank.init();
    Raid.init();
    
    console.log('Bot is ready!');

  }
};