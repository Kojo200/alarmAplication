import {
  displayCurrentTime,
  getCurrentTime,
  getCurrentDate,
} from "./features/time.mjs";
import { initMenuInput, getMenuOpen, drawMenu } from "./components/menu.mjs";
import {
  initSettings,
  getSettingsOpen,
  getClockFormat,
  handleSettingsMouseMove,
  handleSettingsClick,
  drawSettings,
} from "./components/settings.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.setAttribute("width", 800);
canvas.setAttribute("height", 600);

const width = 800;
const height = 600;
const padding = 20;

//#region INITIALIZATION

function init() {
  initMenuInput(document);
  initSettings();
  loop();
}

//#endregion

//#region GAME LOOP

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

//#endregion

//#region UPDATE

function update() {
  // Mouse tracking for menu and settings
  document.addEventListener("mousemove", (event) => {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    handleSettingsMouseMove(mouseX, mouseY, width, height);
  });

  document.addEventListener("click", (event) => {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    handleSettingsClick(mouseX, mouseY, width, height);
  });
}

//#endregion

//#region DRAW

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, width, height);

  // Draw title
  ctx.fillStyle = "white";
  ctx.font = 'bold 32px "Courier New"';
  ctx.textAlign = "center";
  ctx.fillText("⏰ Alarm Application", width / 2, 60);

  // Draw time display
  const currentTime = getCurrentTime(getClockFormat());
  const currentDate = getCurrentDate();

  ctx.fillStyle = "#667eea";
  ctx.fillRect(100, 120, width - 200, 200);
  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 120, width - 200, 200);

  ctx.fillStyle = "white";
  ctx.font = 'bold 64px "Courier New"';
  ctx.textAlign = "center";
  ctx.fillText(currentTime, width / 2, 220);

  ctx.font = '20px "Courier New"';
  ctx.fillText(currentDate, width / 2, 300);

  // Draw menu and settings
  drawMenu(ctx, width, height);
  drawSettings(ctx, width, height);
}

//#endregion

init();
