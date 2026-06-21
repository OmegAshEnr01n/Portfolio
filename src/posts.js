/* Single source of truth for the writing list.
   Internal posts use `slug` (→ /blog/<slug>, Markdown in public/blog/).
   External posts use `href`. Order is reverse-chronological. */
const posts = [
  {
    title: "MLOps for high-frequency trading",
    desc: "What the model lifecycle looks like when your edge is smaller than the spread, and a runnable repo to prove it.",
    tag: "MLOps",
    when: "recent",
    slug: "mlops-in-hft",
  },
  {
    title: "Chasing factors: my run at the Artemis quant competition",
    desc: "What I built for Track 1 of the Artemis crypto quant competition: a weekly long/short factor strategy over ~113 coins, and a lesson in distrusting my own backtest.",
    tag: "Competition",
    when: "recent",
    slug: "artemis-crypto-factors",
  },
  {
    title: "The PyTorch C++ API, and writing efficient device-agnostic code",
    desc: "Getting close to the metal with LibTorch, and keeping one codebase fast on both CPU and GPU.",
    tag: "C++",
    when: "Medium",
    href: "https://medium.com/@sobhit.me/the-pytorch-c-api-and-how-to-write-efficient-device-agnostic-code-3d4ccd5ded44",
  },
  {
    title: "Learning new programming frameworks faster with Notion templates",
    desc: "The little system I use to ramp up on an unfamiliar framework without drowning in browser tabs.",
    tag: "Workflow",
    when: "Medium",
    href: "https://medium.com/@sobhit.me/learning-new-programming-frameworks-faster-with-notion-templates-1e9089c60fe9",
  },
];

export default posts;
