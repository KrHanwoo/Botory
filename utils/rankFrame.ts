import { createCanvas } from 'canvas';
import { Util } from './util';
import { GuildMember } from 'discord.js';
import { BotCache } from './botCache';
import { Document, WithId } from 'mongodb';
import { Xp } from './xp';

const font = 'Pretendard';

export class RankFrame {

  static async createMoneyFrame(member: GuildMember, money: number, rank: number) {
    const canvas = await createProfile(member, rank);
    const ctx = canvas.getContext('2d');

    ctx.style({ fill: '#8c8c8c', font: `30px ${font}` });
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('도토리', 1150, 120);

    ctx.style({ fill: '#fff', font: `48px ${font}` });
    ctx.fillText(Util.formatNumber(money, 1), 1150, 165);

    return canvas;
  }


  static async createMoneyTable(rankings: WithId<Document>[]) {
    const canvas = createCanvas(2980, 2820);
    const ctx = canvas.getContext('2d');

    let i = 0;
    let memberManager = BotCache.guild.members;
    for (let r of rankings) {
      let member = await memberManager.fetch(r.id);
      let frame = await RankFrame.createMoneyFrame(member, r.money, i + 1);
      ctx.drawImage(frame, i < 10 ? 0 : 1480, (i % 10) * 280);
      i++;
    }
    return canvas;
  }

  static async createRankFrame(member: GuildMember, xp: number, rank: number) {
    let level = Xp.xpToLevel(xp);
    let prop = 1;
    if (level < 1000) prop = (xp - Xp.levelToXp(level)) / (Xp.calcRequiredXp(level));

    const canvas = await createProfile(member, rank);
    const ctx = canvas.getContext('2d');

    ctx.style({ fill: '#505050' });
    ctx.arc(1350, 150, 81, 0, 2 * Math.PI);
    ctx.fill();

    ctx.style({ fill: '#c8c8c8' });
    ctx.moveTo(1350, 150);
    ctx.arc(1350, 150, 81, 1.5 * Math.PI, 1.5 * Math.PI + 2 * prop * Math.PI);
    ctx.fill();

    ctx.style({ fill: '#323232' });
    ctx.arc(1350, 150, 75, 0, 2 * Math.PI);
    ctx.fill();


    ctx.style({ fill: '#8c8c8c', font: `30px ${font}` });
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LEVEL', 1350, 120);
    ctx.fillText('EXP', 1110, 120);

    ctx.style({ fill: '#fff', font: `48px ${font}` });
    ctx.fillText(level >= 1000 ? 'MAX' : String(level), 1350, 165);
    ctx.fillText(Util.formatNumber(xp, 1), 1110, 165);

    return canvas;
  }

  static async createRankTable(rankings: WithId<Document>[]) {
    const canvas = createCanvas(2980, 2820);
    const ctx = canvas.getContext('2d');

    let i = 0;
    let memberManager = BotCache.guild.members;
    for (let r of rankings) {
      let member = await memberManager.fetch(r.id);
      let frame = await RankFrame.createRankFrame(member, r.xp, i + 1);
      ctx.drawImage(frame, i < 10 ? 0 : 1480, (i % 10) * 280);
      i++;
    }
    return canvas;
  }

}

function createBase() {
  const canvas = createCanvas(1500, 300);
  const ctx = canvas.getContext('2d');

  ctx.style({ fill: '#323232', stroke: '#464646', thickness: 40 });
  ctx.rect(0, 0, 1500, 300);
  ctx.fill();
  ctx.stroke();

  return canvas;
}


async function createProfile(member: GuildMember, rank: number) {
  let name = member.displayName;
  let avatar = member.displayAvatarURL({ extension: 'png', size: 128 });

  const canvas = createBase();
  const ctx = canvas.getContext('2d');
  ctx.font = `30px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let rankColor = '#646464';
  if (rank < 4) rankColor = ['#d4af37', '#d0d0d0', '#8a541e'][rank - 1];
  let darkercolor = Util.adjustColor(rankColor, -20);
  ctx.style({ fill: rankColor, stroke: darkercolor, thickness: 12 });
  ctx.arc(150, 150, 69, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.style({ fill: '#fff', stroke: '#000', thickness: 8, font: `90px ${font}` });
  ctx.strokeText(String(rank), 150, 150);
  ctx.fillText(String(rank), 150, 150);

  ctx.style({ fill: '#fff', font: `60px ${font}` });
  ctx.textAlign = 'left';
  let shortName = name.length > 10 ? `${name.substring(0, 10)}...` : name;
  ctx.fillText(String(shortName), 450, 150);

  let img = await Util.getImage(avatar);
  ctx.style();
  ctx.arc(360, 150, 60, 0, 2 * Math.PI);
  ctx.save();
  ctx.clip();
  ctx.drawImage(img, 300, 90, 120, 120);
  ctx.restore();

  return canvas;
}