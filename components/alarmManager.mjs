import { createAlarm, getAllAlarms, getAlarmById, updateAlarmTime, toggleAlarm, deleteAlarm, formatAlarmTime } from "../features/alarms.mjs";
import { openTimeEditor, getTimeEditorOpen } from "./timeEditor.mjs";
import { getClockFormat, getSettingsOpen, getClockFormatScreenOpen } from "./settings.mjs";

// Alarm Manager state
let isAlarmManagerOpen = false;
let selectedAlarmIndex = -1;
let isEditingAlarm = false;
let editingAlarmHours = 0;
let editingAlarmMinutes = 0;
let hoveredAlarmIndex = -1;
let hoveredDeleteIndex = -1;
let hoveredToggleIndex = -1;
let editingHours = false;
let editingMinutes = false;

const alarmManagerConfig = {
  x: 0,
  y: 0,
  width: 500,
  height: 450,
  padding: 20,
  cornerRadius: 8,
  itemHeight: 60
};

// Open alarm manager
function openAlarmManager() {
  isAlarmManagerOpen = true;
  selectedAlarmIndex = -1;
}

// Close alarm manager
function closeAlarmManager() {
  isAlarmManagerOpen = false;
  selectedAlarmIndex = -1;
  isEditingAlarm = false;
  hoveredAlarmIndex = -1;
  hoveredDeleteIndex = -1;
}

// Check if alarm manager is open
function getAlarmManagerOpen() {
  return isAlarmManagerOpen;
}

// Handle alarm manager mouse move (kept for compatibility)
function handleAlarmManagerMouseMove(mouseX, mouseY, canvasWidth, canvasHeight) {
  // This is now handled by handleAlarmManagerMouseMoveOnScreen
}

// Handle alarm manager click (kept for compatibility)
function handleAlarmManagerClick(mouseX, mouseY, canvasWidth, canvasHeight) {
  // This is now handled by handleAlarmManagerClickOnScreen
}

// Handle alarm manager mouse move on screen
function handleAlarmManagerMouseMoveOnScreen(mouseX, mouseY, canvasWidth, canvasHeight, startY) {
  hoveredAlarmIndex = -1;
  hoveredDeleteIndex = -1;
  
  let alarms = getAllAlarms();
  let currentY = startY + 60;
  
  for (let i = 0; i < alarms.length; i++) {
    if (mouseX >= 20 && mouseX <= canvasWidth - 40 &&
        mouseY >= currentY && mouseY <= currentY + 50) {
      hoveredAlarmIndex = i;
      
      // Check if delete button is hovered
      const deleteButtonX = canvasWidth - 50;
      if (mouseX >= deleteButtonX && mouseX <= deleteButtonX + 20 &&
          mouseY >= currentY + 15 && mouseY <= currentY + 35) {
        hoveredDeleteIndex = i;
      }
      break;
    }
    currentY += 60;
  }
}

// Handle alarm manager click on screen
function handleAlarmManagerClickOnScreen(mouseX, mouseY, canvasWidth, canvasHeight, startY) {
  // Don't process alarm clicks if settings are open
  if (getSettingsOpen() || getClockFormatScreenOpen() || getTimeEditorOpen()) {
    return;
  }
  
  let alarms = getAllAlarms();
  let currentY = startY + 60;
  
  // Check + button
  if (mouseX >= canvasWidth - 60 && mouseX <= canvasWidth - 20 &&
      mouseY >= startY + 5 && mouseY <= startY + 45) {
    createAlarm(8, 0);
    return;
  }
  
  for (let i = 0; i < alarms.length; i++) {
    if (mouseX >= 20 && mouseX <= canvasWidth - 40 &&
        mouseY >= currentY && mouseY <= currentY + 50) {
      
      // Check delete button
      const deleteButtonX = canvasWidth - 50;
      if (mouseX >= deleteButtonX && mouseX <= deleteButtonX + 20 &&
          mouseY >= currentY + 15 && mouseY <= currentY + 35) {
        deleteAlarm(alarms[i].id);
        return;
      }
      
      // Check toggle circle
      const toggleX = canvasWidth - 120;
      const toggleY = currentY + 25;
      const toggleRadius = 10;
      
      const distX = mouseX - toggleX;
      const distY = mouseY - toggleY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      if (distance <= toggleRadius + 5) {
        toggleAlarm(alarms[i].id);
        return;
      }
      
      // Check time area for editing
      if (mouseX >= 35 && mouseX <= canvasWidth - 120) {
        if (!getTimeEditorOpen()) {
          openTimeEditor(alarms[i].id, alarms[i].hours, alarms[i].minutes);
        }
        return;
      }
    }
    currentY += 60;
  }
}

// Draw alarm manager on main screen
function drawAlarmManagerOnScreen(ctx, canvasWidth, canvasHeight, startY) {
  let alarms = getAllAlarms();
  
  // Draw "Alarms" title
  ctx.fillStyle = "white";
  ctx.font = "bold 20px 'Courier New'";
  ctx.textAlign = "left";
  ctx.fillText("Alarms", 20, startY + 30);
  
  // Draw + button
  ctx.fillStyle = "#667eea";
  ctx.fillRect(canvasWidth - 60, startY + 5, 40, 40);
  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 2;
  ctx.strokeRect(canvasWidth - 60, startY + 5, 40, 40);
  
  ctx.fillStyle = "white";
  ctx.font = "bold 20px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText("+", canvasWidth - 40, startY + 32);
  
  let currentY = startY + 60;
  
  // Draw alarms list
  for (let i = 0; i < alarms.length; i++) {
    let alarm = alarms[i];
    
    // Draw alarm background
    ctx.fillStyle = hoveredAlarmIndex === i ? "#667eea" : "#3a3a4e";
    ctx.fillRect(20, currentY, canvasWidth - 40, 50);
    ctx.strokeStyle = hoveredAlarmIndex === i ? "#764ba2" : "#667eea";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, currentY, canvasWidth - 40, 50);
    
    // Draw alarm time
    ctx.fillStyle = "white";
    ctx.font = "bold 24px 'Courier New'";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    
    let timeDisplay = formatAlarmTime(alarm);
    
    // Add AM/PM if in 12h format
    if (getClockFormat() === "12h") {
      const period = alarm.hours >= 12 ? "PM" : "AM";
      timeDisplay = timeDisplay + " " + period;
    }
    
    ctx.fillText(timeDisplay, 35, currentY + 25);
    
    // Draw enable/disable toggle circle
    const toggleX = canvasWidth - 120;
    const toggleY = currentY + 25;
    const toggleRadius = 10;
    
    ctx.fillStyle = alarm.enabled ? "#00AA00" : "#AA0000";
    ctx.beginPath();
    ctx.arc(toggleX, toggleY, toggleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = alarm.enabled ? "#00FF00" : "#FF0000";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw delete button
    const deleteButtonX = canvasWidth - 50;
    const deleteButtonY = currentY + 15;
    
    ctx.fillStyle = hoveredDeleteIndex === i ? "#FF4444" : "#AA0000";
    ctx.fillRect(deleteButtonX, deleteButtonY, 20, 20);
    ctx.strokeStyle = "#FF6666";
    ctx.lineWidth = 1;
    ctx.strokeRect(deleteButtonX, deleteButtonY, 20, 20);
    
    ctx.fillStyle = "white";
    ctx.font = "bold 14px 'Courier New'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✕", deleteButtonX + 10, deleteButtonY + 10);
    
    currentY += 60;
  }
  
  // Draw message if no alarms
  if (alarms.length === 0) {
    ctx.fillStyle = "#999";
    ctx.font = "14px 'Courier New'";
    ctx.textAlign = "left";
    ctx.fillText("No alarms yet. Click '+' to create one.", 35, startY + 90);
  }
  
  return currentY;
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
  openAlarmManager,
  closeAlarmManager,
  getAlarmManagerOpen,
  handleAlarmManagerMouseMove,
  handleAlarmManagerClick,
  drawAlarmManagerOnScreen,
  handleAlarmManagerMouseMoveOnScreen,
  handleAlarmManagerClickOnScreen
};