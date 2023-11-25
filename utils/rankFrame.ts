import { createCanvas } from "canvas";
import { Util } from "./util";
import { GuildMember } from "discord.js";
import { Money } from "./money";
import { BotCache } from "./botCache";
import { Document, WithId } from "mongodb";

const font = 'Pretendard';

export class RankFrame {

  static async createMoneyFrame(member: GuildMember, money: number, rank: number) {
    let name = member.displayName;
    let avatar = member.displayAvatarURL({ extension: 'png', size: 128 });

    const canvas = createBase();
    const ctx = canvas.getContext('2d');
    ctx.font = `30px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.style({ fill: '#8c8c8c' });
    ctx.fillText('도토리', 1150, 120);

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

    ctx.style({ fill: '#fff', font: `48px ${font}` });
    ctx.textAlign = 'center';
    ctx.fillText(Util.formatNumber(money, 1), 1150, 165);

    let img = await Util.getImage(avatar);
    ctx.style();
    ctx.arc(360, 150, 60, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, 300, 90, 120, 120);

    return canvas;
  }


  static async createMoneyTable(rankings: WithId<Document>[]) {
    const canvas = createCanvas(2980, 2820);
    const ctx = canvas.getContext('2d');

    let i = 0;
    let memberManager = BotCache.guild.members;
    for (let r of rankings) {
      let member = await memberManager.fetch(r.member);
      let frame = await RankFrame.createMoneyFrame(member, r.money, i + 1);
      ctx.drawImage(frame, i < 10 ? 0 : 1480, (i % 10) * 280);
      i++;
    }
    return canvas;
  }


}

function createBase() {
  const canvas = createCanvas(1500, 300);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#323232';
  ctx.rect(0, 0, 1500, 300);
  ctx.fill();
  ctx.lineWidth = 40;
  ctx.strokeStyle = '#464646';
  ctx.stroke();
  ctx.closePath();

  return canvas;
}