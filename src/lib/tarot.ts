export type SpreadKey = "single" | "three" | "diamond" | "moon" | "horseshoe" | "celtic";
export type TimeFactor = "morning" | "afternoon" | "night";
export type Orientation = "正位" | "逆位";

export interface TarotCard {
  position: string;
  card: string;
  orientation: Orientation;
  is_major: boolean;
  element: string;
}

export interface TarotDraw {
  seed: number;
  spread: SpreadKey;
  spread_name: string;
  question: string;
  time_factor: TimeFactor;
  cards: TarotCard[];
}

export interface SpreadDefinition {
  key: SpreadKey;
  name: string;
  description: string;
  positions: Array<{ name: string; majorBias: boolean; uprightBias: boolean }>;
}

export interface SpreadPlacement {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
}

const majors = [
  "愚者",
  "魔术师",
  "女祭司",
  "女皇",
  "皇帝",
  "教皇",
  "恋人",
  "战车",
  "力量",
  "隐士",
  "命运之轮",
  "正义",
  "倒吊人",
  "死神",
  "节制",
  "恶魔",
  "高塔",
  "星星",
  "月亮",
  "太阳",
  "审判",
  "世界",
];

const majorElements = [
  "风",
  "风",
  "水",
  "土",
  "火",
  "土",
  "风",
  "水",
  "火",
  "土",
  "火",
  "风",
  "水",
  "水",
  "火",
  "土",
  "火",
  "风",
  "水",
  "火",
  "火",
  "土",
];

const suits: Record<string, string> = {
  权杖: "火",
  圣杯: "水",
  宝剑: "风",
  星币: "土",
};

const ranks = ["Ace", "二", "三", "四", "五", "六", "七", "八", "九", "十", "侍从", "骑士", "皇后", "国王"];
const minors = Object.keys(suits).flatMap((suit) => ranks.map((rank) => `${suit}${rank}`));
const allCards = [...majors, ...minors];

const elements: Record<string, string> = Object.fromEntries(majors.map((card, index) => [card, majorElements[index]]));
for (const card of minors) {
  elements[card] = suits[card.slice(0, 2)];
}

export const spreadDefinitions: SpreadDefinition[] = [
  {
    key: "single",
    name: "每日一牌",
    description: "适合今日指引或一个很简单的问题。",
    positions: [{ name: "当前指引", majorBias: true, uprightBias: false }],
  },
  {
    key: "three",
    name: "三牌阵",
    description: "适合关系、事业、选择与近期走势。",
    positions: [
      { name: "过去", majorBias: false, uprightBias: false },
      { name: "现在", majorBias: true, uprightBias: false },
      { name: "未来", majorBias: false, uprightBias: true },
    ],
  },
  {
    key: "diamond",
    name: "五牌阵",
    description: "适合卡住的决策，看到核心、阻力与建议。",
    positions: [
      { name: "核心", majorBias: true, uprightBias: false },
      { name: "根源", majorBias: false, uprightBias: false },
      { name: "阻力", majorBias: false, uprightBias: false },
      { name: "潜力", majorBias: false, uprightBias: false },
      { name: "建议", majorBias: true, uprightBias: true },
    ],
  },
  {
    key: "moon",
    name: "月亮牌阵",
    description: "适合一个月的节奏：意图、行动、觉察、释放。",
    positions: [
      { name: "新月", majorBias: true, uprightBias: false },
      { name: "上弦", majorBias: false, uprightBias: false },
      { name: "满月", majorBias: true, uprightBias: false },
      { name: "下弦", majorBias: false, uprightBias: false },
    ],
  },
  {
    key: "horseshoe",
    name: "马蹄形",
    description: "适合时间线问题，查看外部影响与结果。",
    positions: [
      { name: "远期过去", majorBias: false, uprightBias: false },
      { name: "近期过去", majorBias: false, uprightBias: false },
      { name: "当前", majorBias: true, uprightBias: false },
      { name: "近期未来", majorBias: false, uprightBias: false },
      { name: "外部影响", majorBias: true, uprightBias: false },
      { name: "建议", majorBias: false, uprightBias: true },
      { name: "结果", majorBias: true, uprightBias: true },
    ],
  },
  {
    key: "celtic",
    name: "凯尔特十字",
    description: "适合复杂局面，信息最多，解读也最慢。",
    positions: [
      { name: "核心", majorBias: true, uprightBias: false },
      { name: "交叉", majorBias: false, uprightBias: false },
      { name: "意识目标", majorBias: false, uprightBias: false },
      { name: "根基过去", majorBias: false, uprightBias: false },
      { name: "近期过去", majorBias: true, uprightBias: false },
      { name: "近期未来", majorBias: false, uprightBias: false },
      { name: "自我", majorBias: false, uprightBias: false },
      { name: "环境", majorBias: false, uprightBias: false },
      { name: "希望与恐惧", majorBias: false, uprightBias: false },
      { name: "结果", majorBias: true, uprightBias: true },
    ],
  },
];

const timeBoost: Record<TimeFactor, string[]> = {
  morning: ["火", "风"],
  afternoon: ["水", "土"],
  night: ["major"],
};

const majorImageNames: Record<string, string> = {
  愚者: "major-00-fool.jpg",
  魔术师: "major-01-magician.jpg",
  女祭司: "major-02-high-priestess.jpg",
  女皇: "major-03-empress.jpg",
  皇帝: "major-04-emperor.jpg",
  教皇: "major-05-hierophant.jpg",
  恋人: "major-06-lovers.jpg",
  战车: "major-07-chariot.jpg",
  力量: "major-08-strength.jpg",
  隐士: "major-09-hermit.jpg",
  命运之轮: "major-10-wheel.jpg",
  正义: "major-11-justice.jpg",
  倒吊人: "major-12-hanged-man.jpg",
  死神: "major-13-death.jpg",
  节制: "major-14-temperance.jpg",
  恶魔: "major-15-devil.jpg",
  高塔: "major-16-tower.jpg",
  星星: "major-17-star.jpg",
  月亮: "major-18-moon.jpg",
  太阳: "major-19-sun.jpg",
  审判: "major-20-judgement.jpg",
  世界: "major-21-world.jpg",
};

const suitImageNames: Record<string, string> = {
  权杖: "wands",
  圣杯: "cups",
  宝剑: "swords",
  星币: "pentacles",
};

export function getTimeFactor(date = new Date()): TimeFactor {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "night";
}

export function makeSeed(question = ""): number {
  const source = `${question}:${Date.now()}:${crypto.getRandomValues(new Uint32Array(2)).join(":")}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function next() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function cardWeight(card: string, majorBias: boolean, boosted: string[]) {
  const isMajor = majors.includes(card);
  const base = majorBias && isMajor ? 60 / 28 : 1;
  const hit = (boosted.includes("major") && isMajor) || boosted.includes(elements[card]);
  return base * (hit ? 1.08 : 1);
}

function weightedPick(pool: string[], weights: number[], random: () => number) {
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = random() * total;
  for (let index = 0; index < pool.length; index += 1) {
    cursor -= weights[index];
    if (cursor <= 0) return index;
  }
  return pool.length - 1;
}

export function drawCards(spreadKey: SpreadKey, question = "", seed = makeSeed(question), timeFactor = getTimeFactor()): TarotDraw {
  const spread = spreadDefinitions.find((item) => item.key === spreadKey) ?? spreadDefinitions[1];
  const random = mulberry32(seed);
  const pool = [...allCards];
  const cards = spread.positions.map((position) => {
    const weights = pool.map((card) => cardWeight(card, position.majorBias, timeBoost[timeFactor]));
    const index = weightedPick(pool, weights, random);
    const [card] = pool.splice(index, 1);
    return {
      position: position.name,
      card,
      orientation: random() < (position.uprightBias ? 0.7 : 0.6) ? "正位" : "逆位",
      is_major: majors.includes(card),
      element: elements[card],
    } satisfies TarotCard;
  });

  return {
    seed,
    spread: spread.key,
    spread_name: spread.name,
    question,
    time_factor: timeFactor,
    cards,
  };
}

export function getCardGlyph(card: string) {
  if (majors.includes(card)) return "✦";
  if (card.startsWith("权杖")) return "♨";
  if (card.startsWith("圣杯")) return "◒";
  if (card.startsWith("宝剑")) return "◇";
  return "◆";
}

export function getCardImageUrl(card: string) {
  const major = majorImageNames[card];
  if (major) {
    return `./assets/tarot/${major}`;
  }

  const suit = Object.keys(suitImageNames).find((item) => card.startsWith(item));
  if (!suit) return "";

  const rank = card.slice(suit.length);
  const rankMap: Record<string, string> = {
    Ace: "01",
    二: "02",
    三: "03",
    四: "04",
    五: "05",
    六: "06",
    七: "07",
    八: "08",
    九: "09",
    十: "10",
    侍从: "11",
    骑士: "12",
    皇后: "13",
    国王: "14",
  };
  const suffix = rankMap[rank] ?? rank;
  return `./assets/tarot/${suitImageNames[suit]}-${suffix}.jpg`;
}

export const spreadPlacements: Record<SpreadKey, SpreadPlacement[]> = {
  single: [{ x: 50, y: 48, rotate: 0, scale: 1.24 }],
  three: [
    { x: 34, y: 52, rotate: -8, scale: 1.08 },
    { x: 50, y: 42, rotate: 0, scale: 1.18 },
    { x: 66, y: 52, rotate: 8, scale: 1.08 },
  ],
  diamond: [
    { x: 50, y: 20, rotate: 0, scale: 0.98 },
    { x: 32, y: 50, rotate: -7, scale: 0.96 },
    { x: 50, y: 50, rotate: 0, scale: 1.06 },
    { x: 68, y: 50, rotate: 7, scale: 0.96 },
    { x: 50, y: 80, rotate: 0, scale: 0.98 },
  ],
  moon: [
    { x: 34, y: 34, rotate: -12, scale: 0.98 },
    { x: 50, y: 22, rotate: 0, scale: 1.04 },
    { x: 66, y: 34, rotate: 12, scale: 0.98 },
    { x: 50, y: 68, rotate: 0, scale: 1.02 },
  ],
  horseshoe: [
    { x: 14, y: 72, rotate: -16, scale: 0.92 },
    { x: 28, y: 44, rotate: -8, scale: 0.92 },
    { x: 41, y: 22, rotate: -2, scale: 0.96 },
    { x: 59, y: 22, rotate: 2, scale: 0.96 },
    { x: 72, y: 44, rotate: 8, scale: 0.92 },
    { x: 86, y: 72, rotate: 16, scale: 0.92 },
    { x: 50, y: 86, rotate: 0, scale: 0.96 },
  ],
  celtic: [
    { x: 34, y: 50, rotate: 0, scale: 1 },
    { x: 34, y: 50, rotate: 0, scale: 1 },
    { x: 34, y: 18, rotate: 0, scale: 0.88 },
    { x: 34, y: 82, rotate: 0, scale: 0.88 },
    { x: 16, y: 50, rotate: -4, scale: 0.88 },
    { x: 52, y: 50, rotate: 4, scale: 0.88 },
    { x: 82, y: 82, rotate: 0, scale: 0.82 },
    { x: 82, y: 60, rotate: 0, scale: 0.82 },
    { x: 82, y: 38, rotate: 0, scale: 0.82 },
    { x: 82, y: 16, rotate: 0, scale: 0.82 },
  ],
};

export function getSpreadPlacement(spread: SpreadKey, index: number) {
  return spreadPlacements[spread][index] ?? { x: 50, y: 50, rotate: 0, scale: 1 };
}
