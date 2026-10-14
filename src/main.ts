// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";
import pack1Url from "./assets/pack1.svg?no-inline";
import pack2Url from "./assets/pack2.svg?no-inline";
import pack3Url from "./assets/pack3.svg?no-inline";
import clickSfx from "./assets/click.mp3?no-line";
import "./style.css";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "D1 project";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

const message = document.createElement("p");
message.textContent = "Your project starts here.";

interface Pack {
  minCash: number;
  maxCash: number;
}

interface Upgrade extends Pack {
  name: string;
  cost: number;
  imageUrl: string;
  purchased: boolean;
  button?: HTMLButtonElement;
}

const basePack = { minCash: 1, maxCash: 3 };

const packUpgrades: Upgrade[] = [
  {
    name: "Pack 1",
    cost: 20,
    minCash: 1,
    maxCash: 10,
    imageUrl: pack1Url,
    purchased: false,
  },
  {
    name: "Pack 2",
    cost: 100,
    minCash: 5,
    maxCash: 60,
    imageUrl: pack2Url,
    purchased: false,
  },
  {
    name: "Pack 3",
    cost: 500,
    minCash: 50,
    maxCash: 400,
    imageUrl: pack3Url,
    purchased: false,
  },
];

let cash: number = 0;
// let passiveBonuses: number = 0;
let currentPack: Pack = basePack;

const counter = document.createElement("h1");
counter.textContent = "Cash: $0";

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
    if (upgrade.purchased || cash < upgrade.cost) return;
    cash -= upgrade.cost;
    upgrade.purchased = true;
    currentPack = upgrade;
    image.src = upgrade.imageUrl;
    image.alt = upgrade.name;
    updateCounter();
  });

  upgrade.button = button;
  app.append(button);
}

app.append(heading, image, message, counter);

function openPack(pack: Pack): number {
  return Math.floor(
    pack.minCash + Math.random() * (pack.maxCash - pack.minCash + 1),
  );
}

function playSound(url: string) {
  const sound = new Audio(url);
  sound.volume = 0.5;

  void sound.play().catch((error) => {
    console.warn("Could not play sound:", error);
  });
}

image.addEventListener("click", function () {
  console.log("Clicked!");
  addCash(openPack(currentPack));
  playSound(clickSfx);
});

function addCash(amount: number) {
  cash = Math.max(0, cash + amount);
  updateCounter();
}

function money(n: number): string {
  return (n < 0 ? "-$" : "$") + Math.abs(n);
}

function updateCounter() {
  counter.textContent = "Cash: $ " + Math.floor(cash);
}

function updateUpgradeButtons() {
  for (const upgrade of packUpgrades) {
    upgrade.button!.disabled = upgrade.purchased || cash < upgrade.cost;
    upgrade.button!.querySelector("span")!.textContent = upgrade.purchased
      ? ` ${upgrade.name} (owned)`
      : ` ${upgrade.name} (${money(upgrade.cost)}, ${
        money(upgrade.minCash)
      } to ${money(upgrade.maxCash)}/pack)`;
  }
}

// Tick calculations
function tick() {
  updateUpgradeButtons();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
