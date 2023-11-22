import { Raid } from '../features/raid.js';
import { BotCache } from '../utils/botCache.js';
import { InteractionHandler } from '../utils/interactionHandler.js';

module.exports = {
  event: 'ready',
  async execute() {
    await BotCache.init();
    await InteractionHandler.init();
    
    console.log('Bot is ready!');

    Raid.init();
  }
};