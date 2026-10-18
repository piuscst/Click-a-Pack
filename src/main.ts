// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";
import basePackUrl from "./assets/basepack.svg?no-inline";
import pack1Url from "./assets/pack1.svg?no-inline";
import pack2Url from "./assets/pack2.svg?no-inline";
import pack3Url from "./assets/pack3.svg?no-inline";
import pack4Url from "./assets/pack4.svg?no-inline";
import ripUrl from "./assets/rip.mp3?no-inline";
import "./style.css";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "D1 project";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 150;
image.height = 300;

const message = document.createElement("p");
message.textContent = "Click the pack!";

interface Pack {
  minCash: number;
  maxCash: number;
}

interface PassiveUpgrades {
  cashPerSecond: number;
}

interface Upgrade extends Pack {
  name: string;
  cost: number;
  imageUrl: string;
  purchased: boolean;
  button?: HTMLButtonElement;
}

interface Passives extends PassiveUpgrades {
  name: string;
  cost: number;
  button?: HTMLButtonElement;
  description?: string;
  owned: number;
}

const basePack = { minCash: 1, maxCash: 3, imageUrl: basePackUrl };
const packUpgrades: Upgrade[] = [
  {
    name: "Pack 1",
    cost: 500,
    minCash: 5,
    maxCash: 25,
    imageUrl: pack1Url,
    purchased: false,
  },
  {
    name: "Pack 2",
    cost: 10_000,
    minCash: 50,
    maxCash: 150,
    imageUrl: pack2Url,
    purchased: false,
  },
  {
    name: "Pack 3",
    cost: 100_000,
    minCash: 100,
    maxCash: 600,
    imageUrl: pack3Url,
    purchased: false,
  },
  {
    name: "Pack 4",
    cost: 5000000,
    minCash: 500,
    maxCash: 4000,
    imageUrl: pack4Url,
    purchased: false,
  },
];

const passiveUpgrades: Passives[] = [
  {
    name: "Sibling Helper",
    cashPerSecond: 2,
    cost: 100,
    description: "Opens packs for you",
    owned: 0,
  },
  {
    name: "Card Scanner",
    cashPerSecond: 12,
    cost: 500,
    description: "Scans cards and posts them online to sell",
    owned: 0,
  },
  {
    name: "Whatnot Streamer",
    cashPerSecond: 30,
    cost: 1000,
    description: "Sells cards you pull for you online through Whatnot auctions",
    owned: 0,
  },
  {
    name: "Master Ripper",
    cashPerSecond: 165,
    cost: 5_000,
    description: "Opens packs for you wayyy faster than your siblings",
    owned: 0,
  },
  {
    name: "Distributor Connection",
    cashPerSecond: 1_000,
    cost: 25_000,
    description: "Get packs straight from the factory",
    owned: 0,
  },
];

let cash: number = 0;
let displayedCash: number = 0;
let currentPack: Pack = basePack;

image.src = basePackUrl;
image.alt = "Base pack";

const counter = document.createElement("h1");
counter.textContent = "Cash: $0";

const upgradeRow = document.createElement("div");
upgradeRow.className = "upgrade-row";

const passiveRow = document.createElement("div");
passiveRow.className = "upgrade-row";

const passiveCounter = document.createElement("p");

for (const upgrade of packUpgrades) {
  const button = document.createElement("button");

  const icon = document.createElement("img");
  icon.src = upgrade.imageUrl;
  icon.alt = upgrade.name;
  icon.width = 32;
  icon.height = 64;

  const label = document.createElement("span");
  button.append(icon, label);
  button.disabled = true;

  button.addEventListener("click", () => {
    if (!upgrade.purchased) {
      if (cash < upgrade.cost) return;
      cash -= upgrade.cost;
      upgrade.purchased = true;
      updateCounter();
    }

    currentPack = upgrade;
    image.src = upgrade.imageUrl;
    image.alt = upgrade.name;
    updateUpgradeButtons();
  });

  upgrade.button = button;
  upgradeRow.append(button);
}

for (const upgrade of passiveUpgrades) {
  const card = document.createElement("div");
  card.className = "passive-card";

  const button = document.createElement("button");

  const description = document.createElement("p");
  description.className = "passive-description";
  description.textContent = upgrade.description ?? "";

  button.addEventListener("click", () => {
    if (cash < upgrade.cost) return;

    cash -= upgrade.cost;
    upgrade.owned += 1;

    updateCounter();
  });

  upgrade.button = button;

  card.append(button, description);
  passiveRow.append(card);
}

function getPassiveIncome(): number {
  let total = 0;

  for (const upgrade of passiveUpgrades) {
    total += upgrade.owned * upgrade.cashPerSecond;
  }

  return total;
}

app.append(
  heading,
  image,
  message,
  counter,
  upgradeRow,
  passiveCounter,
  passiveRow,
);

function openPack(pack: Pack): number {
  return Math.floor(
    pack.minCash + Math.random() * (pack.maxCash - pack.minCash + 1),
  );
}

image.addEventListener("click", function () {
  console.log("Clicked!");
  addCash(openPack(currentPack));
});

function addCash(amount: number) {
  cash = Math.max(0, cash + amount);
  updateCounter();
}

function money(n: number): string {
  return (n < 0 ? "-$" : "$") +
    Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

// Animated cash counter

function renderCash() {
  const text = `Cash: ${money(displayedCash)}`;

  if (counter.textContent !== text) {
    counter.textContent = text;
  }
}

function updateCounter() {
  renderCash();
  updateUpgradeButtons();
  updatePassiveButtons();
}

// Old function
// function updateUpgradeButtons() {
//   for (const upgrade of packUpgrades) {
//     upgrade.button!.disabled = upgrade.purchased || cash < upgrade.cost;
//     upgrade.button!.querySelector("span")!.textContent = upgrade.purchased
//       ? ` ${upgrade.name} (owned)`
//       : ` ${upgrade.name} (${money(upgrade.cost)}, ${
//         money(upgrade.minCash)
//       } to ${money(upgrade.maxCash)}/pack)`;
//   }
// }

function updateUpgradeButtons() {
  for (const upgrade of packUpgrades) {
    const button = upgrade.button!;
    const label = button.querySelector("span")!;
    const selected = currentPack === upgrade;

    button.disabled = selected || (!upgrade.purchased && cash < upgrade.cost);

    if (selected) {
      label.textContent = `${upgrade.name} (selected)`;
    } else if (upgrade.purchased) {
      label.textContent = `Select ${upgrade.name}`;
    } else {
      label.textContent = `Buy ${upgrade.name} (${money(upgrade.cost)}, ` +
        `${money(upgrade.minCash)} to ${money(upgrade.maxCash)}/pack)`;
    }
  }
}

function updatePassiveButtons() {
  for (const upgrade of passiveUpgrades) {
    const button = upgrade.button!;

    button.disabled = cash < upgrade.cost;
    button.textContent = `${upgrade.name} — ${money(upgrade.cost)} | ` +
      `+${money(upgrade.cashPerSecond)}/sec each | ` +
      `Owned: ${upgrade.owned}`;
  }

  passiveCounter.textContent = `Passive income: ${
    money(getPassiveIncome())
  }/sec`;
}

updateCounter();

let lastTime = performance.now();
let lastButtonUpdate = lastTime;

function gameLoop(now: number) {
  const elapsedSeconds = (now - lastTime) / 1000;
  lastTime = now;

  if (!document.hidden) {
    const passiveGain = getPassiveIncome() * elapsedSeconds;

    // Passive income moves both balances together
    cash += passiveGain;
    displayedCash += passiveGain;

    // Smooth out the difference caused by clicks
    const smoothing = 1 - Math.exp(-elapsedSeconds / 0.06);
    displayedCash += (cash - displayedCash) * smoothing;

    if (Math.abs(cash - displayedCash) < 0.005) {
      displayedCash = cash;
    }

    renderCash();

    if (now - lastButtonUpdate >= 100) {
      updateUpgradeButtons();
      updatePassiveButtons();
      lastButtonUpdate = now;
    }
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("visibilitychange", () => {
  lastTime = performance.now();
});

function playRip() {
  const sfx = new Audio(ripUrl);
  sfx.volume = 0.1;
  sfx.play();
}

image.addEventListener("click", function () {
  playRip();

  image.animate(
    [
      { transform: "rotate(0deg) scale(1)", filter: "brightness(1)" },
      { transform: "rotate(-6deg) scale(0.95)", offset: 0.15 },
      { transform: "rotate(6deg) scale(0.95)", offset: 0.3 },
      { transform: "rotate(-4deg) scale(0.97)", offset: 0.45 },
      { transform: "rotate(4deg) scale(0.97)", offset: 0.6 },
      {
        transform: "rotate(0deg) scale(1.12)",
        filter: "brightness(1.6)",
        offset: 0.8,
      },
      { transform: "rotate(0deg) scale(1)", filter: "brightness(1)" },
    ],
    { duration: 350, easing: "ease-out" },
  );
});

requestAnimationFrame(gameLoop);
