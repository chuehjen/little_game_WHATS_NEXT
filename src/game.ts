import type { GameState, HSL, GamePhase } from './types';
import { calcScore, randomColor, toHSLString } from './colors';
import { saveScore } from './scores';
import {
  getDomRefs,
  hideAll,
  animateNumber,
  startCountdom,
  getPlayerHSL,
  updatePreview,
  showHistory,
  hideHistory,
} from './ui';

/* ---- Constants ---- */
const TOTAL_ROUNDS = 3;
const MEMORIZE_MS = 3000;
const TUNE_MS = 15000;
const TYPEWRITER_MS = 5000;

/* ---- Rules Text ---- */
const RULES_TEXT = [
  'A color memory game in 3 rounds.',
  'Each round, a color appears for 3 seconds. After it disappears, you have 15 seconds to recreate it.',
  'Score is based on how close your color matches — up to 10.00 per round.',
].join('\n');

/* ---- Game State ---- */
const game: GameState = {
  round: 0,
  scores: [],
  target: null,
  phase: 'start' as GamePhase,
};

let timerRAF: number | null = null;
let typewriterTimer: ReturnType<typeof setTimeout> | null = null;

/* ---- DOM ---- */
const dom = getDomRefs();
const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

/** Keep iOS Safari nav bars black. */
function setThemeColor(color: string): void {
  if (themeColorMeta) themeColorMeta.content = color;
}

/* ============================================================
   Game Phases
   ============================================================ */

function showStart(): void {
  game.phase = 'start';
  timerRAF = hideAll(dom, timerRAF);
  dom.startScreen.classList.remove('hide');
  dom.startScreen.classList.add('fade-in');
  setThemeColor('#000000');
  typewriterEffect();
}

function startMemorize(): void {
  game.phase = 'memorize';
  game.target = randomColor();
  const { h, s, l } = game.target;
  timerRAF = hideAll(dom, timerRAF);

  const colorStr = toHSLString({ h, s, l });
  dom.colorBg.style.backgroundColor = colorStr;
  dom.colorBg.classList.remove('hidden');
  dom.memorizeHint.classList.add('show');
  setThemeColor(colorStr);

  timerRAF = startCountdom(dom, MEMORIZE_MS, 300, () => {
    if (game.phase === 'memorize') startTune();
  });
}

function startTune(): void {
  game.phase = 'tune';
  timerRAF = hideAll(dom, timerRAF);

  // Reset sliders to neutral gray (S=0 so it's clearly not the target)
  dom.sliderH.value = '180';
  dom.sliderS.value = '50';  // FIX: was 0, inconsistent with HTML default
  dom.sliderL.value = '50';

  // Set background to gray BEFORE showing, to prevent target color flash
  const grayStr = 'hsl(180,0%,50%)';
  dom.colorBg.style.backgroundColor = grayStr;
  dom.colorBg.classList.remove('hidden');
  setThemeColor(grayStr);
  updatePreview(dom);

  dom.tuneControls.classList.remove('hide');
  dom.tuneControls.classList.add('fade-in');

  timerRAF = startCountdom(dom, TUNE_MS, 150, () => {
    if (game.phase === 'tune') finishTune();
  });
}

function finishTune(): void {
  // Guard: prevent double execution
  if (game.phase !== 'tune') return;
  game.phase = '_finishing';
  if (timerRAF !== null) cancelAnimationFrame(timerRAF);

  const player = getPlayerHSL(dom);
  const score = calcScore(game.target!, player);
  game.scores.push(score);
  showResult(score, player);
}

function showResult(score: number, player: HSL): void {
  game.phase = 'result';
  timerRAF = hideAll(dom, timerRAF);
  setThemeColor('#000000');

  dom.resultScreen.classList.remove('hide');
  dom.resultScreen.classList.add('fade-in');

  animateNumber(dom.scoreValue, 0, score, 600);

  // Show color comparison swatches
  const t = game.target!;
  dom.swatchTarget.style.background = toHSLString(t);
  dom.swatchPlayer.style.background = toHSLString(player);

  dom.scoreDetail.textContent =
    `HSL(${t.h}, ${t.s}%, ${t.l}%)  →  HSL(${player.h}, ${player.s}%, ${player.l}%)`;

  dom.nextBtn.textContent =
    game.round < TOTAL_ROUNDS - 1 ? 'Next' : 'See Total';
}

function showFinal(): void {
  game.phase = 'final';
  timerRAF = hideAll(dom, timerRAF);
  setThemeColor('#000000');

  dom.finalScreen.classList.remove('hide');
  dom.finalScreen.classList.add('fade-in');

  const total = game.scores.reduce((a, b) => a + b, 0);
  animateNumber(dom.finalScore, 0, total, 800);

  // Persist score to localStorage
  saveScore(total);

  dom.totalBreakdown.textContent =
    game.scores.map((s, i) => `R${i + 1}: ${s.toFixed(2)}`).join('   ');
}

/* ---- Game Flow ---- */

function startGame(): void {
  game.round = 0;
  game.scores = [];
  startMemorize();
}

function nextRound(): void {
  game.round++;
  if (game.round >= TOTAL_ROUNDS) showFinal();
  else startMemorize();
}

/* ---- Typewriter Effect ---- */

function typewriterEffect(): void {
  if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }
  dom.rulesText.innerHTML = '';
  dom.startBtn.classList.add('hide');
  dom.historyBtn.classList.add('hide');

  let i = 0;
  const charDelay = TYPEWRITER_MS / RULES_TEXT.length;

  function type() {
    if (i < RULES_TEXT.length) {
      dom.rulesText.innerHTML =
        RULES_TEXT.substring(0, i + 1).replace(/\n/g, '<br>') +
        '<span class="cursor">|</span>';
      i++;
      typewriterTimer = setTimeout(type, charDelay);
    } else {
      dom.rulesText.innerHTML = RULES_TEXT.replace(/\n/g, '<br>');
      dom.startBtn.classList.remove('hide');
      dom.startBtn.classList.add('fade-in');
      dom.historyBtn.classList.remove('hide');
      dom.historyBtn.classList.add('fade-in');
      typewriterTimer = null;
    }
  }
  type();
}

/* ============================================================
   Event Binding
   ============================================================ */

// Slider live update
dom.sliderH.addEventListener('input', () => updatePreview(dom));
dom.sliderS.addEventListener('input', () => updatePreview(dom));
dom.sliderL.addEventListener('input', () => updatePreview(dom));

dom.startBtn.addEventListener('click', () => {
  if (game.phase === 'start') startGame();
});

dom.confirmBtn.addEventListener('click', () => {
  if (game.phase === 'tune') finishTune();
});

dom.nextBtn.addEventListener('click', nextRound);

dom.restartBtn.addEventListener('click', startGame);
dom.finalHistoryBtn.addEventListener('click', () => showHistory(dom));

// History modal
dom.historyBtn.addEventListener('click', () => showHistory(dom));
dom.historyClose.addEventListener('click', () => hideHistory(dom));
dom.historyBackdrop.addEventListener('click', () => hideHistory(dom));

// Prevent iOS rubber-band scroll (except on sliders)
document.addEventListener('touchmove', (e) => {
  if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault();
}, { passive: false });

/* ============================================================
   Init
   ============================================================ */

showStart();
