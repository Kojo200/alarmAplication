import {
  displayCurrentTime,
  getCurrentTime,
  getCurrentDate,
} from "./features/time.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.setAttribute("width", 800);
canvas.setAttribute("height", 600);

const width = 800;
const height = 600;
const padding = 20;

//#region INITIALIZATION

function init() {
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
  // Update logic will go here
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
  const currentTime = getCurrentTime();
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
}

//#endregion

init();
