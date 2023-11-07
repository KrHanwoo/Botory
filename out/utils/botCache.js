"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotCache = void 0;
const bot_1 = require("../bot");
exports.BotCache = {
    async initialize() {
    }
};
async function getChannel(id) {
    return await bot_1.Bot.client.channels.fetch(id);
}
