import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/assets/tarot");

const majors = [
  ["愚者", "major-00-fool", "00", "漫步"],
  ["魔术师", "major-01-magician", "01", "显化"],
  ["女祭司", "major-02-high-priestess", "02", "静听"],
  ["女皇", "major-03-empress", "03", "滋养"],
  ["皇帝", "major-04-emperor", "04", "秩序"],
  ["教皇", "major-05-hierophant", "05", "传承"],
  ["恋人", "major-06-lovers", "06", "选择"],
  ["战车", "major-07-chariot", "07", "推进"],
  ["力量", "major-08-strength", "08", "驯心"],
  ["隐士", "major-09-hermit", "09", "内照"],
  ["命运之轮", "major-10-wheel", "10", "转动"],
  ["正义", "major-11-justice", "11", "衡量"],
  ["倒吊人", "major-12-hanged-man", "12", "换位"],
  ["死神", "major-13-death", "13", "结束"],
  ["节制", "major-14-temperance", "14", "调和"],
  ["恶魔", "major-15-devil", "15", "束缚"],
  ["高塔", "major-16-tower", "16", "崩解"],
  ["星星", "major-17-star", "17", "疗愈"],
  ["月亮", "major-18-moon", "18", "潜影"],
  ["太阳", "major-19-sun", "19", "照亮"],
  ["审判", "major-20-judgement", "20", "召唤"],
  ["世界", "major-21-world", "21", "完成"],
];

const suits = {
  权杖: { slug: "wands", mark: "♨", element: "火", label: "行动" },
  圣杯: { slug: "cups", mark: "◒", element: "水", label: "情感" },
  宝剑: { slug: "swords", mark: "◇", element: "风", label: "思维" },
  星币: { slug: "pentacles", mark: "◆", element: "土", label: "现实" },
};

const ranks = [
  ["Ace", "01", "种子"],
  ["二", "02", "选择"],
  ["三", "03", "初果"],
  ["四", "04", "稳定"],
  ["五", "05", "冲突"],
  ["六", "06", "恢复"],
  ["七", "07", "考验"],
  ["八", "08", "精进"],
  ["九", "09", "临成"],
  ["十", "10", "完成"],
  ["侍从", "11", "学习"],
  ["骑士", "12", "行动"],
  ["皇后", "13", "滋养"],
  ["国王", "14", "掌控"],
];

function escapeText(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function cardSvg({ title, slug, corner, mark, subtitle, element }) {
  const escapedTitle = escapeText(title);
  const escapedSubtitle = escapeText(subtitle);
  const escapedElement = escapeText(element);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="620" viewBox="0 0 420 620">
  <defs>
    <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f3e7cf"/>
      <stop offset="0.48" stop-color="#dbc59c"/>
      <stop offset="1" stop-color="#f7eedc"/>
    </linearGradient>
    <linearGradient id="ink" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#19313a"/>
      <stop offset="1" stop-color="#071014"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.08"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="420" height="620" rx="28" fill="url(#paper)"/>
  <rect x="18" y="18" width="384" height="584" rx="20" fill="none" stroke="#17303a" stroke-width="4"/>
  <rect x="34" y="34" width="352" height="552" rx="14" fill="none" stroke="#b08a46" stroke-width="2"/>
  <rect x="54" y="96" width="312" height="344" rx="156" fill="url(#ink)" opacity="0.96"/>
  <circle cx="210" cy="268" r="112" fill="none" stroke="#d8b76e" stroke-width="3" stroke-dasharray="8 12"/>
  <circle cx="210" cy="268" r="68" fill="none" stroke="#f4d58f" stroke-width="2"/>
  <text x="70" y="78" fill="#17303a" font-size="34" font-family="Georgia, serif" font-weight="700">${corner}</text>
  <text x="350" y="78" fill="#17303a" font-size="34" font-family="Georgia, serif" font-weight="700" text-anchor="end">${corner}</text>
  <text x="210" y="286" fill="#f4d58f" font-size="96" font-family="Georgia, serif" text-anchor="middle">${mark}</text>
  <path d="M144 482 C170 462, 250 462, 276 482" fill="none" stroke="#17303a" stroke-width="3"/>
  <text x="210" y="522" fill="#17303a" font-size="42" font-family="serif" font-weight="700" text-anchor="middle">${escapedTitle}</text>
  <text x="210" y="558" fill="#765f34" font-size="24" font-family="sans-serif" text-anchor="middle">${escapedSubtitle} · ${escapedElement}</text>
  <rect width="420" height="620" filter="url(#grain)" opacity="0.7"/>
  <metadata>${slug}</metadata>
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const [title, slug, number, subtitle] of majors) {
    await writeFile(path.join(OUT_DIR, `${slug}.svg`), cardSvg({ title, slug, corner: number, mark: "✦", subtitle, element: "大阿卡纳" }));
  }

  for (const [suitName, suit] of Object.entries(suits)) {
    for (const [rankName, suffix, subtitle] of ranks) {
      const title = `${suitName}${rankName}`;
      const slug = `${suit.slug}-${suffix}`;
      await writeFile(path.join(OUT_DIR, `${slug}.svg`), cardSvg({ title, slug, corner: suffix, mark: suit.mark, subtitle, element: `${suit.element} · ${suit.label}` }));
    }
  }
}

main();
