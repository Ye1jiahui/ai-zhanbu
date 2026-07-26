import type { TarotCard, TarotDraw } from "./tarot";

export interface CardReading {
  position: string;
  card: string;
  orientation: string;
  keywords: string[];
  lens: string;
  message: string;
}

export interface TarotReading {
  overview: string;
  cards: CardReading[];
  relations: string;
  synthesis: {
    start: string;
    tension: string;
    turn: string;
    action: string;
    echo: string;
  };
  energy_word: string;
  closing_question: string;
  safety_note: string;
}

const apiUrl = import.meta.env.VITE_TAROT_API_URL as string | undefined;

export async function requestReading(draw: TarotDraw): Promise<TarotReading> {
  if (!apiUrl) {
    return createLocalPreview(draw.cards);
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draw),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return createLocalPreview(draw.cards, payload?.message ?? "解读接口暂时没有回应，请稍后再试。");
    }

    return payload as TarotReading;
  } catch {
    return createLocalPreview(draw.cards, "本地预览暂时没有连上云函数，所以先显示离线解读。");
  }
}

function createLocalPreview(cards: TarotCard[], fallbackNote = ""): TarotReading {
  return {
    overview: fallbackNote
      ? `已完成抽牌。${fallbackNote}`
      : "已完成抽牌。当前没有配置腾讯云函数 URL，所以这里显示本地预览文案；部署后会由 DeepSeek 返回完整解读。",
    cards: cards.map((card) => ({
      position: card.position,
      card: card.card,
      orientation: card.orientation,
      keywords: [card.element, card.is_major ? "关键转折" : "日常选择"],
      lens: card.is_major ? "镜子" : "门",
      message: `${card.card}${card.orientation}落在“${card.position}”，提示你先把注意力放回一个具体行动，而不是急着给局面定论。`,
    })),
    relations: cards.length > 1 ? "多牌关系会在云端解读中补全，包括元素分布、大阿卡纳比例与相邻牌的递进或转折。" : "",
    synthesis: {
      start: "你已经把问题带到牌桌上。",
      tension: "真正的张力来自尚未说出口的选择。",
      turn: "翻牌之后，可以先看见自己正在回避什么。",
      action: "今天选一个最小动作完成它，并在晚上记录结果。",
      echo: "牌只显示当下能量，不替你宣判未来。",
    },
    energy_word: "回到手中",
    closing_question: "如果只允许你今天推进一步，你会选哪一步？",
    safety_note: fallbackNote ? `${fallbackNote} 牌显示的是当下能量，你的选择随时可以改变走向。` : "牌显示的是当下能量，你的选择随时可以改变走向。",
  };
}
