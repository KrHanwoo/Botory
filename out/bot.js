"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = __importStar(require("discord.js"));
const config_json_1 = __importDefault(require("./config.json"));
const fs_1 = __importDefault(require("fs"));
const extUtil_1 = require("./utils/extUtil");
const util_1 = require("./utils/util");
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates
    ]
});
exports.Bot = {
    config: config_json_1.default,
    client: client
};
extUtil_1.ExtUtil.initialize();
fs_1.default.readdirSync('./events').filter(util_1.Util.isScript).forEach(f => {
    const event = require(`./events/${f}`);
    client.on(event.event, (...args) => event.execute(...args));
});
(async () => {
    console.log(new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
    await client.login(config_json_1.default.token);
    console.log(`Logged as ${exports.Bot.client.user?.username}`);
})();
