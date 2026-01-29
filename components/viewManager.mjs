import {
  openCalendar,
  closeCalendar,
  getCurrentMonth,
  getCurrentYear,
} from "../features/calendar.mjs";

// View manager state
let currentView = "alarm"; // "alarm" or "calendar"

const viewManagerConfig = {
  x: 0,
  y: 0,
  buttonWidth: 120,
  buttonHeight: 40,
  padding: 15,
  cornerRadius: 8,
};

// Initialize view manager
function initViewManager() {
  currentView = "alarm";
}

// Switch to alarm view
function switchToAlarmView() {
  currentView = "alarm";
  closeCalendar();
}

// Switch to calendar view
function switchToCalendarView() {
  currentView = "calendar";
  openCalendar();
}

// Get current view
function getCurrentViewType() {
  return currentView;
}

// Get current month
function getViewCurrentMonth() {
  return getCurrentMonth();
}

// Get current year
function getViewCurrentYear() {
  return getCurrentYear();
}

// Handle view manager mouse move
function handleViewManagerMouseMove(mouseX, mouseY, canvasWidth, canvasHeight) {
  // This can be extended for hover effects on buttons
}

// Handle view manager click
function handleViewManagerClick(mouseX, mouseY, canvasWidth, canvasHeight) {
  const startX =
    canvasWidth / 2 -
    viewManagerConfig.buttonWidth -
    viewManagerConfig.padding / 2;
  const startY = 10;

  // Check alarm button
  if (
    mouseX >= startX &&
    mouseX <= startX + viewManagerConfig.buttonWidth &&
    mouseY >= startY &&
    mouseY <= startY + viewManagerConfig.buttonHeight
  ) {
    switchToAlarmView();
    return;
  }

  // Check calendar button
  if (
    mouseX >=
      startX + viewManagerConfig.buttonWidth + viewManagerConfig.padding &&
    mouseX <=
      startX + viewManagerConfig.buttonWidth * 2 + viewManagerConfig.padding &&
    mouseY >= startY &&
    mouseY <= startY + viewManagerConfig.buttonHeight
  ) {
    switchToCalendarView();
    return;
  }
}

// Draw view manager buttons
function drawViewManager(ctx, canvasWidth, canvasHeight) {
  const startX =
    canvasWidth / 2 -
    viewManagerConfig.buttonWidth -
    viewManagerConfig.padding / 2;
  const startY = 10;

  // Draw alarm button
  ctx.fillStyle = currentView === "alarm" ? "#667eea" : "#3a3a4e";
  roundRect(
    ctx,
    startX,
    startY,
    viewManagerConfig.buttonWidth,
    viewManagerConfig.buttonHeight,
    viewManagerConfig.cornerRadius,
  );
  ctx.fill();

  ctx.strokeStyle = currentView === "alarm" ? "#764ba2" : "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    startX,
    startY,
    viewManagerConfig.buttonWidth,
    viewManagerConfig.buttonHeight,
    viewManagerConfig.cornerRadius,
  );
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 14px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "⏰ Alarms",
    startX + viewManagerConfig.buttonWidth / 2,
    startY + viewManagerConfig.buttonHeight / 2,
  );

  // Draw calendar button
  ctx.fillStyle = currentView === "calendar" ? "#667eea" : "#3a3a4e";
  roundRect(
    ctx,
    startX + viewManagerConfig.buttonWidth + viewManagerConfig.padding,
    startY,
    viewManagerConfig.buttonWidth,
    viewManagerConfig.buttonHeight,
    viewManagerConfig.cornerRadius,
  );
  ctx.fill();

  ctx.strokeStyle = currentView === "calendar" ? "#764ba2" : "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    startX + viewManagerConfig.buttonWidth + viewManagerConfig.padding,
    startY,
    viewManagerConfig.buttonWidth,
    viewManagerConfig.buttonHeight,
    viewManagerConfig.cornerRadius,
  );
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 14px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "📅 Calendar",
    startX +
      viewManagerConfig.buttonWidth +
      viewManagerConfig.padding +
      viewManagerConfig.buttonWidth / 2,
    startY + viewManagerConfig.buttonHeight / 2,
  );
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export {
  initViewManager,
  switchToAlarmView,
  switchToCalendarView,
  getCurrentViewType,
  getViewCurrentMonth,
  getViewCurrentYear,
  handleViewManagerMouseMove,
  handleViewManagerClick,
  drawViewManager,
};
