import { Collection, Document } from 'mongodb';
import { BotCache } from '../utils/botCache';
import { Database } from '../utils/database';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, Message, escapeMarkdown } from 'discord.js';
import { Util } from '../utils/util';
import { Money } from '../utils/money';

const lastRaidField = { lastRaid: { $exists: true } };

let storage: Collection<Document>;

export class Raid {
  static running = false;
  static msg: Message | null;
  static raiders: GuildMember[] = [];

  static async init() {
    storage = Database.get('raid');
    setInterval(checkRaid, 180 * 1000);
  }

  static async startRaid(prize: number) {
    let embed = new EmbedBuilder()
      .setTitle('도토리 레이드 도착!')
      .setDescription(`15초 안에 아래 버튼을 눌러서 도토리 ${prize}개를 받으세요!`);
    let btn = new ButtonBuilder()
      .setCustomId('btn-raid')
      .setLabel('레이드 받기').setStyle(ButtonStyle.Primary);
    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);
    Raid.running = true;
    Raid.msg = await BotCache.general.send({ embeds: [embed], components: [row] });
    await Util.delay(15 * 1000);
    endRaid(prize);
  }
}

async function checkRaid() {
  if (Math.random() >= 0.1) return;
  if (BotCache.general.lastMessage?.author.isSelf()) return;
  let prize = await calculatePrize();
  Raid.startRaid(prize);
}

async function endRaid(prize: number) {
  Raid.running = false;
  setLastRaid();
  let embed = new EmbedBuilder()
    .setTitle('도토리 레이드 마감~~!');
  if (Raid.raiders.length == 0) {
    if (prize < 4000) embed.setDescription(`아무도 도토리 ${prize}개를 획득하지 못하셨습니다!`);
    else embed.setDescription(`아무도 레이드를 성공하지 못했습니다!\n무려 ${prize}개짜리였는데!`);
    Raid.msg?.edit({ embeds: [embed], components: [] });
    Raid.msg = null;
    Raid.raiders = [];
    return;
  }

  let rewards = new Map<string, number>();
  let bonus = Raid.raiders[Math.floor(Math.random() * Raid.raiders.length)];
  let boosts = [];
  let commons = [];

  let boostPrize = Math.round(1.5 * prize);

  for (let raider of Raid.raiders) {
    if (bonus.id == raider.id) continue;
    if (raider.premiumSince) {
      boosts.push(raider);
      rewards.set(raider.id, boostPrize);
    } else {
      commons.push(raider);
      rewards.set(raider.id, prize);
    }
  }
  if (commons.length > 0)
    embed.addField(`${prize}개 획득 성공!`, joinRaiders(commons));
  if (boosts.length > 0)
    embed.addField(`부스터 1.5배 혜택으로 ${boostPrize}개 획득 성공!`, joinRaiders(boosts));
  if (bonus.premiumSince) {
    rewards.set(bonus.id, prize * 3);
    embed.addField(`부스터 1.5배 혜택과 레이드 2배 당첨까지! ${prize * 3}개 획득 성공!`, `||${escapeMarkdown(bonus.displayName)}||`);
  } else {
    rewards.set(bonus.id, prize * 2);
    embed.addField(`레이드 2배 당첨으로 ${prize * 2}개 획득 성공!`, `||${escapeMarkdown(bonus.displayName)}||`);
  }

  Raid.msg?.edit({ embeds: [embed], components: [] });
  Raid.msg = null;
  Raid.raiders = [];
  rewards.forEach((v, k) => {
    Money.addMoney(k, v);
  });
}

function joinRaiders(raiders: GuildMember[]) {
  return raiders.map(x => x.displayName).map(x => escapeMarkdown(x)).join(', ');
}

async function setLastRaid() {
  await storage.replaceOne(lastRaidField, { lastRaid: Date.now() }, { upsert: true });
}

async function calculatePrize() {
  let doc = await storage.findOne({ lastRaid: { $exists: true } });
  if (!doc || !doc.lastRaid) return 2000;
  let diff = (Date.now() - doc.lastRaid) / 1000 / 3600;
  return Math.max(Math.floor(diff * 4000), 2000);
}