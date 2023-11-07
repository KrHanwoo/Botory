import { BotCache } from '../utils/botCache.js';
import { InteractionHandler } from '../utils/interactionHandler.js';

module.exports = {
  event: 'ready',
  async execute() {
    await BotCache.initialize();
    await InteractionHandler.register();
    
    console.log('Bot is ready!');
  }
};