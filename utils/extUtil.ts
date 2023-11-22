import { BaseChannel, BaseInteraction, EmbedBuilder, InteractionResponse, User } from 'discord.js';
type replyType = Promise<InteractionResponse<boolean> | undefined>;
type optionalString = string | null | undefined;

declare module 'discord.js' {
  interface EmbedBuilder {
    addField(name: optionalString, value: optionalString, inline?: boolean): EmbedBuilder;
    setUser(author: User, showTag?: boolean): EmbedBuilder;
    setGuild(guild: Guild): EmbedBuilder;
  }

  interface BaseInteraction {
    err(message: string, ephemeral?: boolean): replyType;
    success(message: string, ephemeral?: boolean): replyType;
    info(message: string, ephemeral?: boolean): replyType;
    na(): replyType;
  }
}

export const ExtUtil = {
  
  init() {
    EmbedBuilder.prototype.setUser = function (author: User, showTag: boolean = true): EmbedBuilder {
      return this.setAuthor({
        name: showTag ? author.tag : author.username, iconURL: author.displayAvatarURL()
      });
    };

    EmbedBuilder.prototype.addField = function (name: optionalString, value: optionalString, inline: boolean = false): EmbedBuilder {
      if (!name || !value) return this;
      return this.addFields({ name: name, value: value, inline: inline });
    };

    BaseInteraction.prototype.success = async function (message: string, ephemeral: boolean = true) {
      return reply(this, message, ephemeral, 0x3c95ff);
    };

    BaseInteraction.prototype.err = async function (message: string, ephemeral: boolean = true) {
      return reply(this, message, ephemeral, 0xff5c5c);
    };

    BaseInteraction.prototype.info = async function (message: string, ephemeral: boolean = true) {
      return reply(this, message, ephemeral, 0x1e1f22);
    };
    
    BaseInteraction.prototype.na = async function () {
      return reply(this, '사용할 수 없습니다', true, 0xff5c5c);
    };
  }
}

function reply(interaction: BaseInteraction, message: string, ephemeral: boolean, color: number) {
  if (!interaction.isRepliable()) return;
  let embed = new EmbedBuilder()
    .setDescription(message)
    .setColor(color);
  return interaction.reply({
    embeds: [embed],
    ephemeral: ephemeral
  }).catch(() => undefined);
}