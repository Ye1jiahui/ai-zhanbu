import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LoaderCircle, Moon, RotateCcw, Sparkles } from "lucide-react";
import { requestReading, type TarotReading } from "./lib/api";
import { drawCards, getCardGlyph, spreadDefinitions, type SpreadKey, type TarotDraw } from "./lib/tarot";

const examples = ["这段关系接下来我该主动吗？", "我现在的事业方向哪里卡住了？", "今天我需要看见什么？"];

type TableCard = {
  position: string;
  card?: string;
  orientation?: string;
  element?: string;
};

export function App() {
  const [question, setQuestion] = useState("");
  const [spread, setSpread] = useState<SpreadKey>("three");
  const [draw, setDraw] = useState<TarotDraw | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedSpread = useMemo(() => spreadDefinitions.find((item) => item.key === spread) ?? spreadDefinitions[1], [spread]);

  function startDraw() {
    const trimmed = question.trim();
    if (!trimmed) {
      setError("先写下你的问题，再把它交给牌桌。");
      return;
    }
    setError("");
    setReading(null);
    setRevealed(false);
    setDraw(drawCards(spread, trimmed));
  }

  async function revealCards() {
    if (!draw) return;
    setRevealed(true);
    setIsLoading(true);
    setError("");
    try {
      setReading(await requestReading(draw));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "解读接口暂时没有回应，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  }

  function resetTable() {
    setDraw(null);
    setRevealed(false);
    setReading(null);
    setError("");
  }

  return (
    <main className="app-shell">
      <section className="table-stage" aria-labelledby="app-title">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <Moon size={18} />
          </div>
          <span>AI Tarot Table</span>
        </div>

        <div className="stage-grid">
          <aside className="question-panel" aria-label="提问和牌阵选择">
            <div>
              <p className="eyebrow">把问题放在桌面中央</p>
              <h1 id="app-title">一次清醒的塔罗对话</h1>
              <p className="intro">牌是镜子，不是宣判。写下一个真实的问题，选择牌阵，再翻开当下的线索。</p>
            </div>

            <label className="field-label" htmlFor="question">
              你的问题
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：我该如何看待现在的工作选择？"
              maxLength={180}
            />

            <div className="example-row" aria-label="示例问题">
              {examples.map((item) => (
                <button className="ghost-chip" key={item} type="button" onClick={() => setQuestion(item)}>
                  {item}
                </button>
              ))}
            </div>

            <label className="field-label" htmlFor="spread">
              牌阵
            </label>
            <div className="select-wrap">
              <select id="spread" value={spread} onChange={(event) => setSpread(event.target.value as SpreadKey)}>
                {spreadDefinitions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} aria-hidden="true" />
            </div>
            <p className="spread-note">{selectedSpread.description}</p>

            <div className="action-row">
              <button className="primary-button" type="button" onClick={startDraw}>
                <Sparkles size={18} />
                洗牌
              </button>
              <button className="icon-button" type="button" onClick={resetTable} aria-label="清空牌桌">
                <RotateCcw size={18} />
              </button>
            </div>
            {error ? <p className="error-text">{error}</p> : null}
          </aside>

          <section className="card-table" aria-label="牌桌">
            <div className={`orbital-layout spread-${draw?.spread ?? spread}`}>
              <AnimatePresence mode="popLayout">
                {(draw?.cards ?? selectedSpread.positions.map((position) => ({ position: position.name } as TableCard))).map((card, index) => (
                  <motion.button
                    className={`tarot-card ${revealed ? "is-revealed" : ""}`}
                    key={`${card.position}-${index}-${draw?.seed ?? "preview"}`}
                    type="button"
                    onClick={draw && !revealed ? revealCards : undefined}
                    disabled={!draw || revealed || isLoading}
                    initial={{ opacity: 0, y: 24, rotate: index % 2 ? -4 : 4 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.045, duration: 0.38 }}
                    aria-label={card.card ? `${card.position}：${card.card}${card.orientation ?? ""}` : card.position}
                  >
                    <span className="card-position">{card.position}</span>
                    <span className="card-face">
                      {card.card && revealed ? (
                        <>
                          <span className="card-glyph">{getCardGlyph(card.card)}</span>
                          <span className="card-name">{card.card}</span>
                          <span className="card-meta">
                            {card.orientation} · {card.element}
                          </span>
                        </>
                      ) : (
                        <span className="card-back" aria-hidden="true" />
                      )}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <div className="table-center">
              <p>{draw ? `${draw.spread_name} · seed ${draw.seed}` : selectedSpread.name}</p>
              <button className="secondary-button" type="button" onClick={revealCards} disabled={!draw || revealed || isLoading}>
                {isLoading ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />}
                {revealed ? "已翻牌" : "翻牌解读"}
              </button>
            </div>
          </section>
        </div>
      </section>

      <AnimatePresence>
        {(reading || isLoading) && (
          <motion.section
            className="reading-scroll"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            aria-live="polite"
          >
            {isLoading ? <LoadingReading /> : reading ? <ReadingView reading={reading} draw={draw} /> : null}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function LoadingReading() {
  return (
    <div className="loading-reading">
      <LoaderCircle className="spin" size={24} />
      <p>正在把牌面转成可以行动的语言…</p>
    </div>
  );
}

function ReadingView({ reading, draw }: { reading: TarotReading; draw: TarotDraw | null }) {
  return (
    <>
      <div className="reading-header">
        <p className="eyebrow">解读完成</p>
        <h2>{reading.energy_word}</h2>
        <p>{reading.overview}</p>
        {draw ? (
          <div className="draw-proof">
            <span>{draw.spread_name}</span>
            <span>seed {draw.seed}</span>
            <span>{draw.time_factor}</span>
          </div>
        ) : null}
      </div>

      <div className="reading-grid">
        {reading.cards.map((card) => (
          <article className="reading-card" key={`${card.position}-${card.card}`}>
            <p className="card-kicker">{card.position}</p>
            <h3>
              {card.card} · {card.orientation}
            </h3>
            <div className="keyword-row">
              {card.keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
            <p className="lens-text">{card.lens}</p>
            <p>{card.message}</p>
          </article>
        ))}
      </div>

      {reading.relations ? (
        <section className="reading-band">
          <h3>牌间关系</h3>
          <p>{reading.relations}</p>
        </section>
      ) : null}

      <section className="synthesis">
        <div>
          <span>起点</span>
          <p>{reading.synthesis.start}</p>
        </div>
        <div>
          <span>张力</span>
          <p>{reading.synthesis.tension}</p>
        </div>
        <div>
          <span>转折</span>
          <p>{reading.synthesis.turn}</p>
        </div>
        <div>
          <span>出口</span>
          <p>{reading.synthesis.action}</p>
        </div>
        <div>
          <span>回响</span>
          <p>{reading.synthesis.echo}</p>
        </div>
      </section>

      <footer className="closing-note">
        <p>{reading.safety_note}</p>
        <strong>{reading.closing_question}</strong>
      </footer>
    </>
  );
}
