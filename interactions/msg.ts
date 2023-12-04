import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Util } from '../utils/util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('msg')
    .setDescription('채팅')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(cmd: ChatInputCommandInteraction) {
    cmd.info('N/A');
  }
};

function isTrashChat(content: string) {
  if (!content || content.length < 5) return true;
  const stripped = content
    .replaceAll(Util.EMOJI_REGEX, '')
    .replaceAll(Util.MENTION_REGEX, '')
    .replaceAll(/\s/g, '');
  if (!stripped) return true;
  const collapsed = stripped.replaceAll(/(.)\1+/gi, '');
  let total = collapsed.length;
  let kr = collapsed.match(/[가-힣]/g)?.length ?? 0;
  let other = total - kr;
  let score = kr * 2 + other;
  if (score < 12) return true;
  return false;
}