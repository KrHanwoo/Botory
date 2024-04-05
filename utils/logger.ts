import { Message, EmbedBuilder, MessageReaction, User, StickerFormatType } from "discord.js";
import { BotCache } from "./botCache";
import { Util } from "./util";

export class Logger {
  static messageUpdate(oldMsg: Message, newMsg: Message) {
    if (newMsg.guild === null) return;
    if (newMsg.author.bot) return;
    if (oldMsg.content !== newMsg.content)
      BotCache.log.send({
        embeds: [
          new EmbedBuilder()
            .setUser(newMsg.author, true)
            .setDescription(`${newMsg.channel} 에서 메시지가 수정됨`)
            .fillField('이전 내용', oldMsg.content)
            .fillField('이후 내용', newMsg.content)
            .addField('메시지', newMsg.url)
            .setID([
              { name: '멤버', value: newMsg.author.id },
              { name: '채널', value: newMsg.channelId },
              { name: '메시지', value: newMsg.id }
            ])
            .setColor(0xfc6ddd)
        ],
      });

    if (oldMsg.attachments.size > newMsg.attachments.size) {
      oldMsg.attachments.filter(x => !newMsg.attachments.has(x.id)).forEach((attachment) => {
        const embed = new EmbedBuilder()
          .setUser(newMsg.author, true)
          .setDescription(`${newMsg.channel} 에서 수정으로 첨부파일이 삭제됨`)
          .addField('이름', attachment.name!)
          .addField('크기', Util.bytesToSize(attachment.size))
          .addField('원본 링크', attachment.url)
          .addField('메시지', newMsg.url)
          .setID([
            { name: '멤버', value: newMsg.author.id },
            { name: '채널', value: newMsg.channelId },
            { name: '메시지', value: newMsg.id }
          ])
          .setColor(0xff8345);
        Util.sendFile(attachment, newMsg.guild, embed)
      });
    }
  }

  static messageDelete(msg: Message) {
    if (msg.guild === null) return;
    if (msg.author.bot) return;

    msg.attachments.forEach((attachment) => {
      const embed = new EmbedBuilder()
        .setUser(msg.author, true)
        .setDescription(`${msg.channel} 에서 첨부파일이 삭제됨`)
        .addField('이름', attachment.name ?? 'file')
        .addField('크기', Util.bytesToSize(attachment.size))
        .addField('원본 링크', attachment.url)
        .setID([
          { name: '멤버', value: msg.author.id },
          { name: '채널', value: msg.channelId },
          { name: '메시지', value: msg.id }
        ])
        .setColor(0xfcba03);
      Util.sendFile(attachment, msg.guild, embed);
    });

    if (msg.content.length > 0) {
      const embed = new EmbedBuilder()
        .setUser(msg.author, true)
        .setDescription(`${msg.channel} 에서 메시지가 삭제됨`)
        .fillField('내용', msg.content)
        .setID([
          { name: '멤버', value: msg.author.id },
          { name: '채널', value: msg.channelId },
          { name: '메시지', value: msg.id }
        ])
        .setColor(0x00aaff);
      BotCache.log.send({ embeds: [embed] });
    }

    msg.stickers.forEach((sticker) => {
      const embed = new EmbedBuilder()
        .setUser(msg.author, true)
        .setDescription(`${msg.channel} 에서 스티커가 삭제됨`)
        .setThumbnail(sticker.url)
        .addField('이름', sticker.name)
        .addField('링크', sticker.url)
        .addField('형식', StickerFormatType[sticker.format])
        .setID([
          { name: '멤버', value: msg.author.id },
          { name: '채널', value: msg.channelId },
          { name: '메시지', value: msg.id },
          { name: '스티커', value: sticker.id }
        ])
        .setColor(0xb170fc);
      BotCache.log.send({
        embeds: [embed],
      });
    });
  }

  static messageReactionRemove(reaction: MessageReaction, user: User) {
    if (reaction.message.guild === null) return;
    if (user.bot) return;
    const embed = new EmbedBuilder()
      .setUser(user, true)
      .setDescription(`${reaction.message.channel} 에서 반응이 제거됨`)
      .setColor(0x4cf57a);
    if (reaction.emoji.url === null) {
      embed
        .addField('반응', reaction.emoji.name)
        .addField('메시지', reaction.message.url)
        .setID([
          { name: '멤버', value: user.id },
          { name: '채널', value: reaction.message.channelId },
          { name: '메시지', value: reaction.message.id }
        ]);
    } else
      embed
        .setThumbnail(reaction.emoji.url)
        .addField('이름', reaction.emoji.name)
        .addField('링크', reaction.emoji.url)
        .addField(
          '형식',
          reaction.emoji.animated ? '움직이는 이모지' : '일반 이모지'
        )
        .addField('메시지', reaction.message.url)
        .setID([
          { name: '멤버', value: user.id },
          { name: '채널', value: reaction.message.channelId },
          { name: '메시지', value: reaction.message.id },
          { name: '이모지', value: reaction.emoji.id! }
        ]);
    BotCache.log.send({ embeds: [embed] });
  }
}