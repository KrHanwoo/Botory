"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botCache_js_1 = require("../utils/botCache.js");
const interactionHandler_js_1 = require("../utils/interactionHandler.js");
module.exports = {
    event: 'ready',
    async execute() {
        await botCache_js_1.BotCache.initialize();
        await interactionHandler_js_1.InteractionHandler.register();
        console.log('Bot is ready!');
    }
};
