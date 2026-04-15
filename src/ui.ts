import type { HSL } from './types';
import { toHSLString } from './colors';
import { loadScores, formatDate } from './scores';

export interface DomRefs {
  countdown: HTMLElement;
  colorBg: HTMLElement;
  memorizeHint: HTMLElement;
  startScreen: HTMLElement;
  startBtn: HTMLButtonElement;
  tuneControls: HTMLElement;
  confirmBtn: HTMLButtonElement;
  resultScreen: HTMLElement;
  scoreValue: HTMLElement;
  scoreDetail: HTMLElement;
  colorCompare: HTMLElement;
  swatchTarget: HTMLElement;
  swatchPlayer: HTMLElement;
  nextBtn: HTMLButtonElement;
  finalScreen: HTMLElement;
  finalScore: HTMLElement;
  totalBreakdown: HTMLElement;
  restartBtn: HTMLButtonElement;
  finalHistoryBtn: HTMLButtonElement;
  sliderH: HTMLInputElement;
  sliderS: HTMLInputElement;
  sliderL: HTMLInputElement;
  hVal: HTMLElement;
  sVal: HTMLElement;
  lVal: HTMLElement;
  rulesText: HTMLElement;
  historyBtn: HTMLButtonElement;
  historyModal: HTMLElement;
  historyList: HTMLElement;
  historyClose: HTMLButtonElement;
  historyBackdrop: HTMLElement;
}

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

export function getDomRefs(): DomRefs {
  return {
    countdown:    $('countdown'),
    colorBg:      $('colorBg'),
    memorizeHint: $('memorizeHint'),
    startScreen:  $('startScreen'),
    startBtn:     $('startBtn'),
    tuneControls: $('tuneControls'),
    confirmBtn:   $('confirmBtn'),
    resultScreen: $('resultScreen'),
    scoreValue:   $('scoreValue'),
    scoreDetail:  $('scoreDetail'),
    colorCompare: $('colorCompare'),
    swatchTarget: $('swatchTarget'),
    swatchPlayer: $('swatchPlayer'),
    nextBtn:      $('nextBtn'),
    finalScreen:  $('finalScreen'),
    finalScore:   $('finalScore'),
    totalBreakdown: $('totalBreakdown'),
    restartBtn:   $('restartBtn'),
    finalHistoryBtn: $('finalHistoryBtn'),
    sliderH:      $('sliderH'),
    sliderS:      $('sliderS'),
    sliderL:      $('sliderL'),
    hVal:         $('hVal'),
    sVal:         $('sVal'),
    lVal:         $('lVal'),
    rulesText:    $('rulesText'),
    historyBtn:   $('historyBtn'),
    historyModal: $('historyModal'),
    historyList:  $('historyList'),
    historyClose: $('historyClose'),
    historyBackdrop: $('historyBackdrop'),
  };
}

export function hideAll(dom: DomRefs, timerRAF: number | null): number | null {
  dom.startScreen.classList.add('hide');
  dom.tuneControls.classList.add('hide');
  dom.resultScreen.classList.add('hide');
  dom.finalScreen.classList.add('hide');
  dom.colorBg.classList.add('hidden');
  dom.memorizeHint.classList.remove('show');
  dom.countdown.classList.add('hide');
  dom.startScreen.classList.remove('fade-in');
  dom.tuneControls.classList.remove('fade-in');
  dom.resultScreen.classList.remove('fade-in');
  dom.finalScreen.classList.remove('fade-in');
  if (timerRAF !== null) cancelAnimationFrame(timerRAF);
  return null;
}

/** Animate a number from `from` to `to` with ease-out cubic. */
export function animateNumber(el: HTMLElement, from: number, to: number, durationMs: number): void {
  const start = performance.now();
  function step(now: number) {
    const t = Math.min((now - start) / durationMs, 1);
    const ease = 1 - (1 - t) ** 3;
    el.textContent = (from + (to - from) * ease).toFixed(2);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/** 3-digit countdown display. Uses rAF + Date.now() for drift-free timing. */
export function startCountdom(
  dom: DomRefs,
  durationMs: number,
  maxDisplay: number,
  onEnd: () => void
): number {
  dom.countdown.classList.remove('hide');
  const timerEnd = Date.now() + durationMs;
  let timerRAF: number | undefined;

  function tick() {
    const remaining = Math.max(0, timerEnd - Date.now());
    const display = Math.round((remaining / durationMs) * maxDisplay);
    dom.countdown.textContent = String(Math.max(0, display)).padStart(3, '0');

    if (remaining > 0) {
      timerRAF = requestAnimationFrame(tick);
    } else {
      dom.countdown.textContent = '000';
      setTimeout(onEnd, 120);
    }
  }
  tick();
  return timerRAF!;
}

export function getPlayerHSL(dom: DomRefs): HSL {
  return {
    h: +dom.sliderH.value,
    s: +dom.sliderS.value,
    l: +dom.sliderL.value,
  };
}

export function updatePreview(dom: DomRefs): void {
  const { h, s, l } = getPlayerHSL(dom);
  dom.hVal.textContent = String(h);
  dom.sVal.textContent = String(s);
  dom.lVal.textContent = String(l);

  dom.colorBg.style.backgroundColor = toHSLString({ h, s, l });

  dom.sliderS.style.background =
    `linear-gradient(to right,hsl(${h},0%,${l}%),hsl(${h},100%,${l}%))`;

  dom.sliderL.style.background =
    `linear-gradient(to right,#0a0a0a,hsl(${h},${s}%,50%),#f5f5f5)`;
}

export function renderHistory(dom: DomRefs): void {
  const scores = loadScores();
  if (scores.length === 0) {
    dom.historyList.innerHTML = '<div class="history-empty">No records yet.<br>Play your first game!</div>';
    return;
  }
  dom.historyList.innerHTML = scores.map((entry, i) => {
    const dateStr = entry.date ? formatDate(entry.date) : '';
    return (
      `<div class="history-item">` +
      `<span class="history-rank">#${i + 1}</span>` +
      `<span class="history-date">${dateStr}</span>` +
      `<span class="history-score">${entry.score.toFixed(2)}</span>` +
      `</div>`
    );
  }).join('');
}

export function showHistory(dom: DomRefs): void {
  renderHistory(dom);
  dom.historyModal.classList.add('open');
}

export function hideHistory(dom: DomRefs): void {
  dom.historyModal.classList.remove('open');
}
