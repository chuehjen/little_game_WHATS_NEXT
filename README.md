# WHAT'S NEXT — Color Memory Game

**Can you remember a color well enough to recreate it?**

→ **[Play Now](https://chuehjen.github.io/whats-next/)**

---

## What is it?

WHAT'S NEXT is a minimalist browser game that tests your color memory and perception. A color flashes on screen — you study it, it disappears, and you try to recreate it from scratch using HSL sliders. Three rounds. One score.

---

## How to Play

Each round has two phases:

1. **Memorize** — A random color fills the screen for 3 seconds. Study it carefully.
2. **Tune** — The color disappears. Use the Hue, Saturation, and Lightness sliders to recreate it within 15 seconds.

Your score per round ranges from 0.00 to 10.00, based on how closely your color matches the original. A perfect match scores 10.00. Your total is the sum across all 3 rounds.

---

## Scoring

Score is calculated from the RGB Euclidean distance between your color and the target:

```
distance = √((r₁−r₂)² + (g₁−g₂)² + (b₁−b₂)²)
score    = max(0,  10 − distance / 44.167)
```

Maximum possible distance (~441.67) maps to 0.00. A perfect match scores 10.00.

---

## Tech Stack

| | |
|---|---|
| Language | TypeScript (strict mode) |
| Build tool | Vite |
| Testing | Vitest — 20 unit tests |
| Dependencies | None — zero runtime dependencies |
| Deploy | GitHub Pages (single-file build) |

---

## Local Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server
npm run test      # Run unit tests
npm run build     # Production build
```

---

## License

MIT

---
---

# WHAT'S NEXT — 颜色记忆挑战

**你能凭记忆，重现一种颜色吗？**

→ **[立即游玩](https://chuehjen.github.io/whats-next/)**

---

## 这是什么？

WHAT'S NEXT 是一款极简浏览器小游戏，测试你的颜色记忆与感知能力。屏幕上闪现一种颜色——你仔细观察，它消失了，然后你用 HSL 滑块凭记忆重现它。共三轮，最终一个分数。

---

## 怎么玩

每轮分为两个阶段：

1. **记忆** — 随机颜色铺满屏幕，持续 3 秒，仔细观察。
2. **重现** — 颜色消失，在 15 秒内用色相、饱和度、明度滑块复现它。

每轮得分为 0.00 到 10.00，取决于你的颜色与原色的接近程度。完全匹配得 10 分，三轮总分满分 30 分。

---

## 评分算法

评分基于你的颜色与目标颜色的 RGB 欧氏距离：

```
distance = √((r₁−r₂)² + (g₁−g₂)² + (b₁−b₂)²)
score    = max(0,  10 − distance / 44.167)
```

最大距离约为 441.67，对应 0 分；完全匹配为 10 分。

---

## 技术栈

| | |
|---|---|
| 语言 | TypeScript（strict 模式） |
| 构建工具 | Vite |
| 测试 | Vitest — 20 个单元测试 |
| 依赖 | 无运行时依赖 |
| 部署 | GitHub Pages（单文件构建） |

---

## 本地运行

```bash
npm install       # 安装依赖
npm run dev       # 启动开发服务器
npm run test      # 运行单元测试
npm run build     # 生产构建
```

---

## 许可证

MIT
