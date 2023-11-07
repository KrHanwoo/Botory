"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('default')
        .setDescription('default'),
    async execute(cmd) {
        cmd.info(new Date().toString());
    }
};
