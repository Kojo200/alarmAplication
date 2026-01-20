import { updateAlarmTime, getAllAlarms } from "../features/alarms.mjs";
import { getClockFormat } from "./settings.mjs";

// Time editor state
let isTimeEditorOpen = false;
let selectedAlarmId = -1;
let editingHours = 0;
let editingMinutes = 0;
let editingPeriod = "AM"; // "AM" or "PM" for 12-hour format
let selectedField = "hours"; // "hours" or "minutes"
let hoveredButton = ""; // "hourUp", "hourDown", "minUp", "minDown", "save", "cancel"

const timeEditorConfig = {
  x: 0,
  y: 0,
  width: 350,
  height: 280,
  padding: 20,
  cornerRadius: 8,
};

// Open time editor
function openTimeEditor(alarmId, hours, minutes) {
  isTimeEditorOpen = true;
  selectedAlarmId = alarmId;

  // Convert to 12-hour format if needed
  if (getClockFormat() === "12h") {
    editingPeriod = hours >= 12 ? "PM" : "AM";
    editingHours = hours % 12;
    if (editingHours === 0) {
      editingHours = 12;
    }
  } else {
    editingHours = hours;
    editingPeriod = "AM";
  }

  editingMinutes = minutes;
  selectedField = "hours";
  hoveredButton = "";
  console.log(
    "Time editor opened with:",
    editingHours,
    editingMinutes,
    editingPeriod,
  );
}

// Close time editor
function closeTimeEditor() {
  isTimeEditorOpen = false;
  selectedAlarmId = -1;
  hoveredButton = "";
}

// Check if time editor is open
function getTimeEditorOpen() {
  return isTimeEditorOpen;
}

// Handle time editor mouse move
function handleTimeEditorMouseMove(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isTimeEditorOpen) return;

  const centerX = (canvasWidth - timeEditorConfig.width) / 2;
  const centerY = (canvasHeight - timeEditorConfig.height) / 2;

  hoveredButton = "";

  // Check hour up button
  if (
    mouseX >= centerX + timeEditorConfig.padding + 30 &&
    mouseX <= centerX + timeEditorConfig.padding + 80 &&
    mouseY >= centerY + 80 &&
    mouseY <= centerY + 110
  ) {
    hoveredButton = "hourUp";
  }
  // Check hour down button
  else if (
    mouseX >= centerX + timeEditorConfig.padding + 30 &&
    mouseX <= centerX + timeEditorConfig.padding + 80 &&
    mouseY >= centerY + 140 &&
    mouseY <= centerY + 170
  ) {
    hoveredButton = "hourDown";
  }
  // Check minute up button
  else if (
    mouseX >= centerX + timeEditorConfig.padding + 120 &&
    mouseX <= centerX + timeEditorConfig.padding + 170 &&
    mouseY >= centerY + 80 &&
    mouseY <= centerY + 110
  ) {
    hoveredButton = "minUp";
  }
  // Check minute down button
  else if (
    mouseX >= centerX + timeEditorConfig.padding + 120 &&
    mouseX <= centerX + timeEditorConfig.padding + 170 &&
    mouseY >= centerY + 140 &&
    mouseY <= centerY + 170
  ) {
    hoveredButton = "minDown";
  }
  // Check AM button if 12h format
  else if (
    getClockFormat() === "12h" &&
    mouseX >= centerX + timeEditorConfig.padding + 30 &&
    mouseX <= centerX + timeEditorConfig.padding + 80 &&
    mouseY >= centerY + 195 &&
    mouseY <= centerY + 225
  ) {
    hoveredButton = "am";
  }
  // Check PM button if 12h format
  else if (
    getClockFormat() === "12h" &&
    mouseX >= centerX + timeEditorConfig.padding + 120 &&
    mouseX <= centerX + timeEditorConfig.padding + 170 &&
    mouseY >= centerY + 195 &&
    mouseY <= centerY + 225
  ) {
    hoveredButton = "pm";
  }
  // Check save button
  else if (
    mouseX >= centerX + timeEditorConfig.padding &&
    mouseX <= centerX + timeEditorConfig.padding + 150 &&
    mouseY >= centerY + timeEditorConfig.height - 50 &&
    mouseY <= centerY + timeEditorConfig.height - 20
  ) {
    hoveredButton = "save";
  }
  // Check cancel button
  else if (
    mouseX >=
      centerX + timeEditorConfig.width - timeEditorConfig.padding - 150 &&
    mouseX <= centerX + timeEditorConfig.width - timeEditorConfig.padding &&
    mouseY >= centerY + timeEditorConfig.height - 50 &&
    mouseY <= centerY + timeEditorConfig.height - 20
  ) {
    hoveredButton = "cancel";
  }
}

// Handle time editor click
function handleTimeEditorClick(mouseX, mouseY, canvasWidth, canvasHeight) {
  if (!isTimeEditorOpen) return;

  const centerX = (canvasWidth - timeEditorConfig.width) / 2;
  const centerY = (canvasHeight - timeEditorConfig.height) / 2;

  // Check hour up button
  if (
    mouseX >= centerX + timeEditorConfig.padding + 30 &&
    mouseX <= centerX + timeEditorConfig.padding + 80 &&
    mouseY >= centerY + 80 &&
    mouseY <= centerY + 110
  ) {
    editingHours = (editingHours + 1) % 24;
    return;
  }
  // Check hour down button
  if (
    mouseX >= centerX + timeEditorConfig.padding + 30 &&
    mouseX <= centerX + timeEditorConfig.padding + 80 &&
    mouseY >= centerY + 140 &&
    mouseY <= centerY + 170
  ) {
    editingHours = (editingHours - 1 + 24) % 24;
    return;
  }
  // Check minute up button
  if (
    mouseX >= centerX + timeEditorConfig.padding + 120 &&
    mouseX <= centerX + timeEditorConfig.padding + 170 &&
    mouseY >= centerY + 80 &&
    mouseY <= centerY + 110
  ) {
    editingMinutes = (editingMinutes + 1) % 60;
    return;
  }
  // Check minute down button
  if (
    mouseX >= centerX + timeEditorConfig.padding + 120 &&
    mouseX <= centerX + timeEditorConfig.padding + 170 &&
    mouseY >= centerY + 140 &&
    mouseY <= centerY + 170
  ) {
    console.log("Before:", editingMinutes);
    editingMinutes = (editingMinutes - 1 + 60) % 60;
    console.log("After:", editingMinutes);
    return;
  }
  // Check save button
  if (
    mouseX >= centerX + timeEditorConfig.padding &&
    mouseX <= centerX + timeEditorConfig.padding + 150 &&
    mouseY >= centerY + timeEditorConfig.height - 50 &&
    mouseY <= centerY + timeEditorConfig.height - 20
  ) {
    updateAlarmTime(selectedAlarmId, editingHours, editingMinutes);
    closeTimeEditor();
    return;
  }
  // Check cancel button
  if (
    mouseX >=
      centerX + timeEditorConfig.width - timeEditorConfig.padding - 150 &&
    mouseX <= centerX + timeEditorConfig.width - timeEditorConfig.padding &&
    mouseY >= centerY + timeEditorConfig.height - 50 &&
    mouseY <= centerY + timeEditorConfig.height - 20
  ) {
    closeTimeEditor();
    return;
  }
}

// Draw time editor
function drawTimeEditor(ctx, canvasWidth, canvasHeight) {
  if (!isTimeEditorOpen) return;

  const centerX = (canvasWidth - timeEditorConfig.width) / 2;
  const centerY = (canvasHeight - timeEditorConfig.height) / 2;

  // Draw semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw time editor window background
  ctx.fillStyle = "#2a2a3e";
  roundRect(
    ctx,
    centerX,
    centerY,
    timeEditorConfig.width,
    timeEditorConfig.height,
    timeEditorConfig.cornerRadius,
  );
  ctx.fill();

  // Draw time editor window border
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    centerX,
    centerY,
    timeEditorConfig.width,
    timeEditorConfig.height,
    timeEditorConfig.cornerRadius,
  );
  ctx.stroke();

  // Draw title
  ctx.fillStyle = "white";
  ctx.font = "bold 20px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText(
    "Set Alarm Time",
    centerX + timeEditorConfig.width / 2,
    centerY + 35,
  );

  // Draw hours label and value
  ctx.fillStyle = "#667eea";
  ctx.font = "14px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText("Hours", centerX + timeEditorConfig.padding + 55, centerY + 65);

  ctx.fillStyle = "white";
  ctx.font = "bold 28px 'Courier New'";
  ctx.fillText(
    String(editingHours).padStart(2, "0"),
    centerX + timeEditorConfig.padding + 55,
    centerY + 130,
  );

  // Draw minutes label and value
  ctx.fillStyle = "#667eea";
  ctx.font = "14px 'Courier New'";
  ctx.fillText(
    "Minutes",
    centerX + timeEditorConfig.padding + 145,
    centerY + 65,
  );

  ctx.fillStyle = "white";
  ctx.font = "bold 28px 'Courier New'";
  ctx.fillText(
    String(editingMinutes).padStart(2, "0"),
    centerX + timeEditorConfig.padding + 145,
    centerY + 130,
  );

  // Draw hour up button
  ctx.fillStyle = hoveredButton === "hourUp" ? "#764ba2" : "#667eea";
  roundRect(
    ctx,
    centerX + timeEditorConfig.padding + 30,
    centerY + 80,
    50,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 16px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText("▲", centerX + timeEditorConfig.padding + 55, centerY + 100);

  // Draw hour down button
  ctx.fillStyle = hoveredButton === "hourDown" ? "#764ba2" : "#667eea";
  roundRect(
    ctx,
    centerX + timeEditorConfig.padding + 30,
    centerY + 140,
    50,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 16px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText("▼", centerX + timeEditorConfig.padding + 55, centerY + 160);

  // Draw minute up button
  ctx.fillStyle = hoveredButton === "minUp" ? "#764ba2" : "#667eea";
  roundRect(
    ctx,
    centerX + timeEditorConfig.padding + 120,
    centerY + 80,
    50,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 16px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText("▲", centerX + timeEditorConfig.padding + 145, centerY + 100);

  // Draw minute down button
  ctx.fillStyle = hoveredButton === "minDown" ? "#764ba2" : "#667eea";
  roundRect(
    ctx,
    centerX + timeEditorConfig.padding + 120,
    centerY + 140,
    50,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 16px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText("▼", centerX + timeEditorConfig.padding + 145, centerY + 160);

  // Draw AM/PM buttons if in 12-hour format
  if (getClockFormat() === "12h") {
    // Draw AM button
    ctx.fillStyle = editingPeriod === "AM" ? "#00AA00" : "#667eea";
    roundRect(
      ctx,
      centerX + timeEditorConfig.padding + 30,
      centerY + 195,
      50,
      30,
      4,
    );
    ctx.fill();
    ctx.strokeStyle = editingPeriod === "AM" ? "#00FF00" : "#764ba2";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = "bold 14px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("AM", centerX + timeEditorConfig.padding + 55, centerY + 215);

    // Draw PM button
    ctx.fillStyle = editingPeriod === "PM" ? "#00AA00" : "#667eea";
    roundRect(
      ctx,
      centerX + timeEditorConfig.padding + 120,
      centerY + 195,
      50,
      30,
      4,
    );
    ctx.fill();
    ctx.strokeStyle = editingPeriod === "PM" ? "#00FF00" : "#764ba2";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = "bold 14px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("PM", centerX + timeEditorConfig.padding + 145, centerY + 215);
  }

  // Draw save button
  ctx.fillStyle = hoveredButton === "save" ? "#00AA00" : "#00FF00";
  roundRect(
    ctx,
    centerX + timeEditorConfig.padding,
    centerY + timeEditorConfig.height - 50,
    150,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.font = "bold 14px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText(
    "Save",
    centerX + timeEditorConfig.padding + 75,
    centerY + timeEditorConfig.height - 30,
  );

  // Draw cancel button
  ctx.fillStyle = hoveredButton === "cancel" ? "#FF4444" : "#FF6666";
  roundRect(
    ctx,
    centerX + timeEditorConfig.width - timeEditorConfig.padding - 150,
    centerY + timeEditorConfig.height - 50,
    150,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = "#FF6666";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 14px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText(
    "Cancel",
    centerX + timeEditorConfig.width - timeEditorConfig.padding - 75,
    centerY + timeEditorConfig.height - 30,
  );
}

// Helper function to pad numbers with leading zeros
function padZero(num) {
  let numStr = num.toString();
  if (numStr.length < 2) {
    numStr = "0" + numStr;
  }
  return numStr;
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
  openTimeEditor,
  closeTimeEditor,
  getTimeEditorOpen,
  handleTimeEditorMouseMove,
  handleTimeEditorClick,
  drawTimeEditor,
};
