// Settings state
let isSettingsOpen = false;
let isClockFormatScreenOpen = false;
let clockFormatScreenJustOpened = false;
let clockFormat = "24h";
let closeTimeEditorFn = null;

const settingsConfig = {
  x: 0,
  y: 0,
  width: 400,
  height: 300,
  padding: 20,
  cornerRadius: 8,
  itemHeight: 50,
};

const clockFormatScreenConfig = {
  x: 0,
  y: 0,
  width: 400,
  height: 300,
  padding: 20,
  cornerRadius: 8,
  optionHeight: 80,
};

const settingsItems = [
  { label: "Clock Format", id: "clockFormat", type: "submenu" },
];

const clockFormatOptions = [
  { label: "24-Hour", id: "24h" },
  { label: "12-Hour", id: "12h" },
];

let hoveredSettingIndex = -1;
let hoveredClockOption = -1;

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

// Open clock format screen
function openClockFormatScreen() {
  isClockFormatScreenOpen = true;
  clockFormatScreenJustOpened = true;
}

// Close clock format screen
function closeClockFormatScreen() {
  isClockFormatScreenOpen = false;
  clockFormatScreenJustOpened = false;
  hoveredClockOption = -1;
}

// Check if settings is open
function getSettingsOpen() {
  return isSettingsOpen;
}

// Check if clock format screen is open
function getClockFormatScreenOpen() {
  return isClockFormatScreenOpen;
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

// Handle settings mouse move
function handleSettingsMouseMove(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isSettingsOpen || isClockFormatScreenOpen) return;

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

// Handle clock format screen mouse move
function handleClockFormatMouseMove(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isClockFormatScreenOpen) return;

  const centerX = (canvasWidth - clockFormatScreenConfig.width) / 2;
  const centerY = (canvasHeight - clockFormatScreenConfig.height) / 2;

  hoveredClockOption = -1;

  for (let i = 0; i < clockFormatOptions.length; i++) {
    const optionY =
      centerY +
      clockFormatScreenConfig.padding +
      50 +
      i * clockFormatScreenConfig.optionHeight;

    if (
      mouseX >= centerX + clockFormatScreenConfig.padding &&
      mouseX <=
        centerX +
          clockFormatScreenConfig.width -
          clockFormatScreenConfig.padding &&
      mouseY >= optionY &&
      mouseY <= optionY + clockFormatScreenConfig.optionHeight - 10
    ) {
      hoveredClockOption = i;
      break;
    }
  }
}

// Handle settings click
function handleSettingsClick(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isSettingsOpen) return;

  // Don't process settings clicks if clock format screen is open
  if (isClockFormatScreenOpen) return;

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
    const itemHeight = settingsConfig.itemHeight - 10;

    if (
      mouseX >= centerX + settingsConfig.padding &&
      mouseX <= centerX + settingsConfig.width - settingsConfig.padding &&
      mouseY >= itemY &&
      mouseY <= itemY + itemHeight
    ) {
      if (settingsItems[i].id === "clockFormat") {
        openClockFormatScreen();
        return;
      }
    }
  }
}

// Handle clock format screen click
function handleClockFormatClick(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isClockFormatScreenOpen) {
    return;
  }

  // Ignore clicks on the frame the screen was just opened
  if (clockFormatScreenJustOpened) {
    clockFormatScreenJustOpened = false;
    return;
  }

  const centerX = (canvasWidth - clockFormatScreenConfig.width) / 2;
  const centerY = (canvasHeight - clockFormatScreenConfig.height) / 2;

  // Check back button
  const backButtonX = centerX + clockFormatScreenConfig.width - 35;
  const backButtonY = centerY + 10;
  if (
    mouseX >= backButtonX &&
    mouseX <= backButtonX + 25 &&
    mouseY >= backButtonY &&
    mouseY <= backButtonY + 25
  ) {
    closeClockFormatScreen();
    return;
  }

  // Check clock format options
  for (let i = 0; i < clockFormatOptions.length; i++) {
    const optionY =
      centerY +
      clockFormatScreenConfig.padding +
      50 +
      i * clockFormatScreenConfig.optionHeight;

    if (
      mouseX >= centerX + clockFormatScreenConfig.padding &&
      mouseX <=
        centerX +
          clockFormatScreenConfig.width -
          clockFormatScreenConfig.padding &&
      mouseY >= optionY &&
      mouseY <= optionY + clockFormatScreenConfig.optionHeight - 10
    ) {
      setClockFormat(clockFormatOptions[i].id);
      closeClockFormatScreen();
      return;
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

    // Draw clock format value
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

// Draw clock format screen
function drawClockFormatScreen(ctx, canvasWidth, canvasHeight) {
  if (!isClockFormatScreenOpen) return;

  const centerX = (canvasWidth - clockFormatScreenConfig.width) / 2;
  const centerY = (canvasHeight - clockFormatScreenConfig.height) / 2;

  // Draw semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw screen window background
  ctx.fillStyle = "#2a2a3e";
  roundRect(
    ctx,
    centerX,
    centerY,
    clockFormatScreenConfig.width,
    clockFormatScreenConfig.height,
    clockFormatScreenConfig.cornerRadius,
  );
  ctx.fill();

  // Draw screen window border
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    centerX,
    centerY,
    clockFormatScreenConfig.width,
    clockFormatScreenConfig.height,
    clockFormatScreenConfig.cornerRadius,
  );
  ctx.stroke();

  // Draw title
  ctx.fillStyle = "white";
  ctx.font = 'bold 24px "Courier New"';
  ctx.textAlign = "left";
  ctx.fillText(
    "Clock Format",
    centerX + clockFormatScreenConfig.padding,
    centerY + 35,
  );

  // Draw back button
  ctx.fillStyle = "#764ba2";
  ctx.fillRect(
    centerX + clockFormatScreenConfig.width - 35,
    centerY + 10,
    25,
    25,
  );
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 1;
  ctx.strokeRect(
    centerX + clockFormatScreenConfig.width - 35,
    centerY + 10,
    25,
    25,
  );
  ctx.fillStyle = "white";
  ctx.font = 'bold 16px "Courier New"';
  ctx.textAlign = "center";
  ctx.fillText(
    "←",
    centerX + clockFormatScreenConfig.width - 22.5,
    centerY + 22.5,
  );

  // Draw clock format options
  for (let i = 0; i < clockFormatOptions.length; i++) {
    const option = clockFormatOptions[i];
    const optionY =
      centerY +
      clockFormatScreenConfig.padding +
      50 +
      i * clockFormatScreenConfig.optionHeight;

    // Draw option background
    ctx.fillStyle = hoveredClockOption === i ? "#667eea" : "#3a3a4e";
    roundRect(
      ctx,
      centerX + clockFormatScreenConfig.padding,
      optionY,
      clockFormatScreenConfig.width - clockFormatScreenConfig.padding * 2,
      clockFormatScreenConfig.optionHeight - 10,
      clockFormatScreenConfig.cornerRadius,
    );
    ctx.fill();

    // Draw option border
    ctx.strokeStyle = hoveredClockOption === i ? "#764ba2" : "#667eea";
    ctx.lineWidth = 2;
    roundRect(
      ctx,
      centerX + clockFormatScreenConfig.padding,
      optionY,
      clockFormatScreenConfig.width - clockFormatScreenConfig.padding * 2,
      clockFormatScreenConfig.optionHeight - 10,
      clockFormatScreenConfig.cornerRadius,
    );
    ctx.stroke();

    // Draw option label
    ctx.fillStyle = "white";
    ctx.font = '14px "Courier New"';
    ctx.textAlign = "left";
    ctx.fillText(
      option.label,
      centerX + clockFormatScreenConfig.padding + 15,
      optionY + 30,
    );

    // Draw selection circle
    const circleX =
      centerX +
      clockFormatScreenConfig.width -
      clockFormatScreenConfig.padding -
      30;
    const circleY = optionY + (clockFormatScreenConfig.optionHeight - 10) / 2;
    const circleRadius = 12;

    // Draw circle background
    ctx.fillStyle = clockFormat === option.id ? "#FFD700" : "#555";
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw circle border
    ctx.strokeStyle = clockFormat === option.id ? "#FFA500" : "#999";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw inner circle if selected
    if (clockFormat === option.id) {
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Set the close time editor function (called from main.mjs)
function setCloseTimeEditorFn(fn) {
  closeTimeEditorFn = fn;
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
  openClockFormatScreen,
  closeClockFormatScreen,
  getSettingsOpen,
  getClockFormatScreenOpen,
  getClockFormat,
  setClockFormat,
  setCloseTimeEditorFn,
  handleSettingsMouseMove,
  handleClockFormatMouseMove,
  handleSettingsClick,
  handleClockFormatClick,
  drawSettings,
  drawClockFormatScreen,
};
