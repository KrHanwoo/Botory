import { Image, createCanvas } from "canvas";
import { Util } from "./util";

const font = 'Pretendard';

export class RankFrame {

  static async createMoneyFrame(name: string, money: number, rank: number, avatar: string) {
    const canvas = createBase();
    const ctx = canvas.getContext('2d');
    ctx.font = `30px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#8c8c8c';
    ctx.fillText('도토리', 1150, 120);

    let rankColor = '#646464';
    if (rank < 4) rankColor = ['#d4af37', '#d0d0d0', '#8a541e'][rank - 1];
    let darkercolor = Util.adjustColor(rankColor, -20);
    ctx.fillStyle = rankColor;
    ctx.strokeStyle = darkercolor;

    ctx.beginPath();
    ctx.arc(150, 150, 69, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = `90px ${font}`;
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(String(rank), 150, 150);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(rank), 150, 150);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = `60px ${font}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    let shortName = name.length > 10 ? `${name.substring(0, 10)}...` : name;
    ctx.fillText(String(shortName), 450, 150);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = `48px ${font}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(Util.formatNumber(money, 1), 1150, 165);
    ctx.closePath();

    ctx.beginPath();
    let img = new Image();
    await new Promise(r => {
      img.onload = () => { r(null); };
      img.src = avatar;
    });
    ctx.save();
    ctx.beginPath();
    ctx.arc(360, 150, 60, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 300, 90, 120, 120);
    ctx.closePath();
    ctx.restore();

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