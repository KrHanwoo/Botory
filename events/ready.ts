import { Bot } from '../bot.js';
import { Raid } from '../features/raid.js';
import { Rank } from '../features/rank.js';
import { BotCache } from '../utils/botCache.js';
import { InteractionHandler } from '../utils/interactionHandler.js';

module.exports = {
  event: 'ready',
  async execute() {
    await BotCache.init();
    await InteractionHandler.init();

    Rank.init();
    Raid.init();
    
    console.log('Bot is ready!');
  }
};