import { displayCurrentTime, getCurrentTime, getCurrentDate } from "./features/time.mjs";
import { initMenuInput, getMenuOpen, drawMenu } from "./components/menu.mjs";
import { initSettings, openSettings, getSettingsOpen, getClockFormatScreenOpen, getClockFormat, setCloseTimeEditorFn, handleSettingsMouseMove, handleClockFormatMouseMove, handleSettingsClick, handleClockFormatClick, drawSettings, drawClockFormatScreen } from "./components/settings.mjs";
import { openAlarmManager, getAlarmManagerOpen, drawAlarmManagerOnScreen, handleAlarmManagerMouseMoveOnScreen, handleAlarmManagerClickOnScreen } from "./components/alarmManager.mjs";
import { getTimeEditorOpen, closeTimeEditor, handleTimeEditorMouseMove, handleTimeEditorClick, drawTimeEditor } from "./components/timeEditor.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.setAttribute("width", 800);
canvas.setAttribute("height", 800);

const width = 800;
const height = 800;
const padding = 20;

// Track if listeners are initialized
let listenersInitialized = false;

//#region INITIALIZATION

function init() {
  initMenuInput(document);
  initSettings();
  setCloseTimeEditorFn(closeTimeEditor);
  
  // Listen for menu item selections
  document.addEventListener("menuItemSelected", (event) => {
    if (event.detail.id === "settings") {
      openSettings();
    } else if (event.detail.id === "alarms") {
      openAlarmManager();
    }
  });
  
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
  // Only add event listeners once
  if (!listenersInitialized) {
    // Mouse tracking for menu and settings
    document.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      handleSettingsMouseMove(mouseX, mouseY, width, height);
      handleClockFormatMouseMove(mouseX, mouseY, width, height);
      handleAlarmManagerMouseMoveOnScreen(mouseX, mouseY, width, height, 350);
      handleTimeEditorMouseMove(mouseX, mouseY, width, height);
    });
    
    document.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      handleSettingsClick(mouseX, mouseY, width, height);
      handleClockFormatClick(mouseX, mouseY, width, height);
      handleAlarmManagerClickOnScreen(mouseX, mouseY, width, height, 350);
      handleTimeEditorClick(mouseX, mouseY, width, height);
    });
    
    listenersInitialized = true;
  }
}

//#endregion

//#region DRAW

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, width, height);

  // Draw title
  ctx.fillStyle = "white";
  ctx.font = "bold 32px 'Courier New'";
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
  ctx.font = "bold 64px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText(currentTime, width / 2, 220);

  ctx.font = "20px 'Courier New'";
  ctx.fillText(currentDate, width / 2, 300);
  
  // Draw alarms on main screen
  drawAlarmManagerOnScreen(ctx, width, height, 350);
  
  // Draw menu and settings LAST so they appear on top
  drawMenu(ctx, width, height);
  drawSettings(ctx, width, height);
  drawClockFormatScreen(ctx, width, height);
  drawTimeEditor(ctx, width, height);
}

//#endregion

init();