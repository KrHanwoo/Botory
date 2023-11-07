"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtUtil = void 0;
const discord_js_1 = require("discord.js");
exports.ExtUtil = {
    initialize() {
        discord_js_1.EmbedBuilder.prototype.setUser = function (author, showTag = true) {
            return this.setAuthor({
                name: showTag ? author.tag : author.username, iconURL: author.displayAvatarURL()
            });
        };
        discord_js_1.EmbedBuilder.prototype.addField = function (name, value, inline = false) {
            if (!name || !value)
                return this;
            return this.addFields({ name: name, value: value, inline: inline });
        };
        discord_js_1.BaseInteraction.prototype.success = async function (message, ephemeral = true) {
            return reply(this, message, ephemeral, 0x3c95ff);
        };
        discord_js_1.BaseInteraction.prototype.err = async function (message, ephemeral = true) {
            return reply(this, message, ephemeral, 0xff5c5c);
        };
        discord_js_1.BaseInteraction.prototype.info = async function (message, ephemeral = true) {
            return reply(this, message, ephemeral, 0x676767);
        };
    }
};
function reply(interaction, message, ephemeral, color) {
    if (!interaction.isRepliable())
        return;
    let embed = new discord_js_1.EmbedBuilder()
        .setDescription(message)
        .setColor(color);
    return interaction.reply({
        embeds: [embed],
        ephemeral: ephemeral
    }).catch(() => undefined);
}
