import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = "https://raw.githubusercontent.com/twbs/icons/v1.11.3/icons/";

const ICONS = [
  ["icon-compass", "compass.svg"],
  ["icon-globe", "globe2.svg"],
  ["icon-map", "map.svg"],
  ["icon-buildings", "buildings.svg"],
  ["icon-people", "people.svg"],
  ["icon-moon-stars-fill", "moon-stars-fill.svg"],
  ["icon-brightness-high-fill", "brightness-high-fill.svg"],
  ["icon-clock", "clock.svg"],
  ["icon-currency-ruble", "cash-coin.svg"],
  ["icon-sun", "sun.svg"],
  ["icon-ticket-perforated", "ticket-perforated.svg"],
  ["icon-train-front", "train-front.svg"],
  ["icon-star-fill", "star-fill.svg"],
  ["icon-star-half", "star-half.svg"],
  ["icon-star", "star.svg"],
  ["icon-link-45deg", "link-45deg.svg"],
  ["icon-clipboard", "clipboard.svg"],
  ["icon-pencil-square", "pencil-square.svg"],
  ["icon-chat-left-text", "chat-left-text.svg"],
  ["icon-person", "person.svg"],
  ["icon-envelope", "envelope.svg"],
  ["icon-search", "search.svg"],
  ["icon-bookmark-check", "bookmark-check.svg"],
  ["icon-circle", "circle.svg"],
];

function extractInner(svgText) {
  const m = svgText.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!m) return "";
  return m[1].trim();
}

function innerToSymbol(id, inner) {
  return `  <symbol id="${id}" viewBox="0 0 16 16">\n${inner
    .split("\n")
    .map((l) => "    " + l)
    .join("\n")}\n  </symbol>`;
}

async function fetchInner(file) {
  const res = await fetch(base + file);
  if (!res.ok) throw new Error(file + " " + res.status);
  return extractInner(await res.text());
}

async function main() {
  const symbols = [];
  for (const [id, file] of ICONS) {
    symbols.push(innerToSymbol(id, await fetchInner(file)));
  }
  const out = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">
${symbols.join("\n")}
</svg>
`;
  fs.writeFileSync(path.join(__dirname, "sprite.svg"), out, "utf8");
  console.log("sprite.svg", symbols.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
