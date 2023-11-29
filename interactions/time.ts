import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('시간 확인')
    .setDMPermission(false),
  async execute(cmd: ChatInputCommandInteraction) {
    let embed = new EmbedBuilder()
      .addField(getTime('KST', 9), '한국 표준시')
      .addField(getTime('PST', -8), listMentions('793028538021838869'))
      .addField(getTime('EST', -5), listMentions('725249696439992321'))
      .addField(getTime('CST', -6), listMentions('290408959649644544'))
      .addField(getTime('GMT', 0), listMentions('567643576830525443'));
    cmd.reply({ embeds: [embed], ephemeral: true });
  }
};


function getTime(code: string, offset: number) {
  let date = new Date();
  date.setUTCHours(date.getUTCHours() + offset);
  let str = date.toISOString();
  let split = str.split('T');
  let time = split[1].split(':').slice(0, 2).join(':');
  return `[${code}] ${split[0]} ${time}`;
}

function listMentions(...ids: string[]) {
  return ids.map(x => `<@${x}>`).join(' ');
}