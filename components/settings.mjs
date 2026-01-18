// Settings state
let isSettingsOpen = false;
let clockFormat = "24h"; // '24h' or '12h'

const settingsConfig = {
  x: 0,
  y: 0,
  width: 400,
  height: 300,
  padding: 20,
  cornerRadius: 8,
  itemHeight: 50,
};

const settingsItems = [
  { label: "Clock Format", id: "clockFormat", type: "toggle" },
];

let hoveredSettingIndex = -1;

// Initialize settings
function initSettings() {
  // Settings will be initialized with default values
}

// Open settings
function openSettings() {
  isSettingsOpen = true;
}

// Close settings
function closeSettings() {
  isSettingsOpen = false;
  hoveredSettingIndex = -1;
}

// Check if settings is open
function getSettingsOpen() {
  return isSettingsOpen;
}

// Get current clock format
function getClockFormat() {
  return clockFormat;
}

// Set clock format
function setClockFormat(format) {
  if (format === "24h" || format === "12h") {
    clockFormat = format;
  }
}

// Toggle clock format
function toggleClockFormat() {
  clockFormat = clockFormat === "24h" ? "12h" : "24h";
}

// Handle settings mouse move
function handleSettingsMouseMove(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isSettingsOpen) return;

  const centerX = (canvasWidth - settingsConfig.width) / 2;
  const centerY = (canvasHeight - settingsConfig.height) / 2;

  hoveredSettingIndex = -1;

  for (let i = 0; i < settingsItems.length; i++) {
    const itemY =
      centerY + settingsConfig.padding + 50 + i * settingsConfig.itemHeight;

    if (
      mouseX >= centerX + settingsConfig.padding &&
      mouseX <= centerX + settingsConfig.width - settingsConfig.padding &&
      mouseY >= itemY &&
      mouseY <= itemY + settingsConfig.itemHeight - 10
    ) {
      hoveredSettingIndex = i;
      break;
    }
  }
}

// Handle settings click
function handleSettingsClick(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isSettingsOpen) return;

  const centerX = (canvasWidth - settingsConfig.width) / 2;
  const centerY = (canvasHeight - settingsConfig.height) / 2;

  // Check close button
  const closeButtonX = centerX + settingsConfig.width - 35;
  const closeButtonY = centerY + 10;
  if (
    mouseX >= closeButtonX &&
    mouseX <= closeButtonX + 25 &&
    mouseY >= closeButtonY &&
    mouseY <= closeButtonY + 25
  ) {
    closeSettings();
    return;
  }

  // Check settings items
  for (let i = 0; i < settingsItems.length; i++) {
    const itemY =
      centerY + settingsConfig.padding + 50 + i * settingsConfig.itemHeight;

    if (
      mouseX >= centerX + settingsConfig.padding &&
      mouseX <= centerX + settingsConfig.width - settingsConfig.padding &&
      mouseY >= itemY &&
      mouseY <= itemY + settingsConfig.itemHeight - 10
    ) {
      if (settingsItems[i].id === "clockFormat") {
        toggleClockFormat();
      }
    }
  }
}

// Draw settings
function drawSettings(ctx, canvasWidth, canvasHeight) {
  if (!isSettingsOpen) return;

  const centerX = (canvasWidth - settingsConfig.width) / 2;
  const centerY = (canvasHeight - settingsConfig.height) / 2;

  // Draw semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw settings window background
  ctx.fillStyle = "#2a2a3e";
  roundRect(
    ctx,
    centerX,
    centerY,
    settingsConfig.width,
    settingsConfig.height,
    settingsConfig.cornerRadius,
  );
  ctx.fill();

  // Draw settings window border
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    centerX,
    centerY,
    settingsConfig.width,
    settingsConfig.height,
    settingsConfig.cornerRadius,
  );
  ctx.stroke();

  // Draw title
  ctx.fillStyle = "white";
  ctx.font = 'bold 24px "Courier New"';
  ctx.textAlign = "left";
  ctx.fillText("Settings", centerX + settingsConfig.padding, centerY + 35);

  // Draw close button
  ctx.fillStyle = "#764ba2";
  ctx.fillRect(centerX + settingsConfig.width - 35, centerY + 10, 25, 25);
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 1;
  ctx.strokeRect(centerX + settingsConfig.width - 35, centerY + 10, 25, 25);
  ctx.fillStyle = "white";
  ctx.font = 'bold 16px "Courier New"';
  ctx.textAlign = "center";
  ctx.fillText("✕", centerX + settingsConfig.width - 22.5, centerY + 22.5);

  // Draw settings items
  for (let i = 0; i < settingsItems.length; i++) {
    const item = settingsItems[i];
    const itemY =
      centerY + settingsConfig.padding + 50 + i * settingsConfig.itemHeight;

    // Draw item background
    ctx.fillStyle = hoveredSettingIndex === i ? "#667eea" : "#3a3a4e";
    roundRect(
      ctx,
      centerX + settingsConfig.padding,
      itemY,
      settingsConfig.width - settingsConfig.padding * 2,
      settingsConfig.itemHeight - 10,
      settingsConfig.cornerRadius,
    );
    ctx.fill();

    // Draw item border
    ctx.strokeStyle = hoveredSettingIndex === i ? "#764ba2" : "#667eea";
    ctx.lineWidth = 2;
    roundRect(
      ctx,
      centerX + settingsConfig.padding,
      itemY,
      settingsConfig.width - settingsConfig.padding * 2,
      settingsConfig.itemHeight - 10,
      settingsConfig.cornerRadius,
    );
    ctx.stroke();

    // Draw item label
    ctx.fillStyle = "white";
    ctx.font = '14px "Courier New"';
    ctx.textAlign = "left";
    ctx.fillText(item.label, centerX + settingsConfig.padding + 15, itemY + 18);

    // Draw toggle value
    if (item.id === "clockFormat") {
      const formatText = clockFormat === "24h" ? "24-Hour" : "12-Hour";
      ctx.fillStyle = "#667eea";
      ctx.font = 'bold 14px "Courier New"';
      ctx.textAlign = "right";
      ctx.fillText(
        formatText,
        centerX + settingsConfig.width - settingsConfig.padding - 15,
        itemY + 18,
      );
    }
  }
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
  initSettings,
  openSettings,
  closeSettings,
  getSettingsOpen,
  getClockFormat,
  setClockFormat,
  toggleClockFormat,
  handleSettingsMouseMove,
  handleSettingsClick,
  drawSettings,
};
