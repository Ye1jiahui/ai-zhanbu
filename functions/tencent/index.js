"use strict";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

exports.main_handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const corsHeaders = buildCorsHeaders(origin);

  if (event.httpMethod === "OPTIONS" || event.requestContext?.http?.method === "OPTIONS") {
    return response(204, "", corsHeaders);
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return response(500, { message: "云函数缺少 DEEPSEEK_API_KEY 环境变量。" }, corsHeaders);
  }

  let payload;
  try {
    payload = parseBody(event);
  } catch {
    return response(400, { message: "请求体不是有效 JSON。" }, corsHeaders);
  }

  const validation = validatePayload(payload);
  if (validation) {
    return response(400, { message: validation }, corsHeaders);
  }

  if (isCrisisQuestion(payload.question)) {
    return response(
      200,
      {
        overview: "这个问题里出现了可能涉及自伤或紧急安全的表达，我不会继续做占卜解读。",
        cards: [],
        relations: "",
        synthesis: {
          start: "先暂停抽牌。",
          tension: "此刻最重要的不是解释牌面，而是确保你处在安全环境里。",
          turn: "请立刻联系身边可信任的人，或联系当地紧急服务。",
          action: "如果你在中国大陆，也可以联系心理援助热线 400-161-9995。",
          echo: "你不需要一个人扛过这一刻。",
        },
        energy_word: "先保安全",
        closing_question: "你现在能联系到哪一个可信任的人？",
        safety_note: "明确自伤风险时，系统会暂停占卜并优先建议寻求现实帮助。",
      },
      corsHeaders,
    );
  }

  try {
    const reading = await callDeepSeek(payload);
    return response(200, reading, corsHeaders);
  } catch (error) {
    console.error(error);
    return response(502, { message: "DeepSeek 解读暂时失败，请稍后重试。" }, corsHeaders);
  }
};

function buildCorsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function parseBody(event) {
  if (typeof event.body === "string") {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    return JSON.parse(raw);
  }
  return event.body || event;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "请求体不能为空。";
  if (!payload.question || typeof payload.question !== "string") return "请提供 question。";
  if (!payload.spread || typeof payload.spread !== "string") return "请提供 spread。";
  if (!Number.isFinite(Number(payload.seed))) return "请提供 seed。";
  if (!payload.time_factor || typeof payload.time_factor !== "string") return "请提供 time_factor。";
  if (!Array.isArray(payload.cards) || payload.cards.length === 0) return "请提供 cards。";
  return "";
}

function isCrisisQuestion(question) {
  return /自杀|轻生|不想活|结束生命|伤害自己|活不下去|suicide|kill myself/i.test(question);
}

async function callDeepSeek(draw) {
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
  const aiResponse = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.78,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt(),
        },
        {
          role: "user",
          content: JSON.stringify(draw, null, 2),
        },
      ],
    }),
  });

  const payload = await aiResponse.json();
  if (!aiResponse.ok) {
    throw new Error(payload?.error?.message || "DeepSeek request failed");
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error("DeepSeek returned empty content");
  return JSON.parse(content);
}

function systemPrompt() {
  return [
    "你是一个中文塔罗解读助手。塔罗是镜子，不是水晶球；把牌面转成自我观察和可选择的下一步，不宣判固定命运。",
    "必须严格依据用户传入的 cards、seed、time_factor 解读，禁止自行改牌、补牌或重新抽牌。",
    "语言温暖但清醒。不要说“你一定会”。建议必须具体到时间或动作，避免空泛话术。",
    "不做医疗、法律、投资买卖、重大人生决定。发现自伤风险时应暂停占卜，但通常这类请求会在函数层拦截。",
    "多牌必须分析花色/元素分布、大阿卡纳比例和相邻牌关系。综合解读按起点、张力、转折、出口、回响组织。",
    "只输出 JSON，不要 Markdown。JSON 结构必须为：overview 字符串；cards 数组，每项含 position、card、orientation、keywords 数组、lens、message；relations 字符串；synthesis 对象含 start、tension、turn、action、echo；energy_word 3-4 个汉字；closing_question 字符串；safety_note 字符串。",
    "safety_note 固定包含：牌显示的是当下能量，你的选择随时可以改变走向。",
  ].join("\n");
}

function response(statusCode, body, headers) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}
