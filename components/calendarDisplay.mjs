import {
  getCalendarOpen,
  getDaysInMonth,
  getFirstDayOfMonth,
  previousMonth,
  nextMonth,
  goToToday,
  getEventsForDate,
} from "../features/calendar.mjs";

import { getClockFormat } from "./settings.mjs";

// Calendar display state
let hoveredDate = -1;
let selectedDate = -1;
let calendarViewType = "monthly"; // "monthly" or "weekly"
let weekOffset = 0; // For weekly view navigation

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const calendarDisplayConfig = {
  x: 0,
  y: 0,
  width: 700,
  height: 500,
  padding: 20,
  cornerRadius: 8,
};

// Get current time
function getCurrentTime() {
  let currentDate = new Date();
  return {
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    seconds: currentDate.getSeconds(),
  };
}

// Format time based on format type (for timeline display)
function formatTimelineTime(hours, format) {
  if (format === "12h") {
    let period = hours >= 12 ? "PM" : "AM";
    let displayHours = hours % 12;
    if (displayHours === 0) {
      displayHours = 12;
    }
    return displayHours + period;
  } else {
    return String(hours).padStart(2, "0");
  }
}

// Get today's date info
function getTodayInfo() {
  let today = new Date();
  return {
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  };
}

// Get week number for a given date
function getWeekNumber(date) {
  let d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  let dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
function handleCalendarDisplayMouseMove(
  mouseX,
  mouseY,
  canvasWidth,
  canvasHeight,
  currentMonth,
  currentYear,
) {
  if (!getCalendarOpen()) return;

  const centerX = (canvasWidth - calendarDisplayConfig.width) / 2;
  const centerY = (canvasHeight - calendarDisplayConfig.height) / 2;

  hoveredDate = -1;

  // Calculate grid position
  const gridStartX = centerX + calendarDisplayConfig.padding + 20;
  const gridStartY = centerY + calendarDisplayConfig.padding + 100;
  const cellWidth =
    (calendarDisplayConfig.width - calendarDisplayConfig.padding * 2 - 40) / 7;
  const cellHeight = 50;

  let daysInMonth = getDaysInMonth(currentMonth, currentYear);
  let firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  for (let day = 1; day <= daysInMonth; day++) {
    let position = firstDay + day - 1;
    let row = Math.floor(position / 7);
    let col = position % 7;

    let cellX = gridStartX + col * cellWidth;
    let cellY = gridStartY + row * cellHeight;

    if (
      mouseX >= cellX &&
      mouseX <= cellX + cellWidth &&
      mouseY >= cellY &&
      mouseY <= cellY + cellHeight
    ) {
      hoveredDate = day;
      break;
    }
  }
}

// Handle calendar display click
function handleCalendarDisplayClick(
  mouseX,
  mouseY,
  canvasWidth,
  canvasHeight,
  currentMonth,
  currentYear,
) {
  if (!getCalendarOpen()) return;

  const centerX = (canvasWidth - calendarDisplayConfig.width) / 2;
  const centerY = (canvasHeight - calendarDisplayConfig.height) / 2;

  // Check Today button
  if (
    mouseX >= centerX + calendarDisplayConfig.width - 90 &&
    mouseX <= centerX + calendarDisplayConfig.width - 10 &&
    mouseY >= centerY + 10 &&
    mouseY <= centerY + 40
  ) {
    goToToday();
    weekOffset = 0;
    return "today";
  }

  // Check monthly view button
  if (
    mouseX >= centerX + calendarDisplayConfig.padding &&
    mouseX <= centerX + calendarDisplayConfig.padding + 100 &&
    mouseY >= centerY + 10 &&
    mouseY <= centerY + 40
  ) {
    calendarViewType = "monthly";
    return "monthlyView";
  }

  // Check weekly view button
  if (
    mouseX >= centerX + calendarDisplayConfig.padding + 110 &&
    mouseX <= centerX + calendarDisplayConfig.padding + 210 &&
    mouseY >= centerY + 10 &&
    mouseY <= centerY + 40
  ) {
    calendarViewType = "weekly";
    weekOffset = 0;
    return "weeklyView";
  }

  // Check previous week button (only in weekly view)
  if (
    calendarViewType === "weekly" &&
    mouseX >= centerX + calendarDisplayConfig.padding &&
    mouseX <= centerX + calendarDisplayConfig.padding + 40 &&
    mouseY >= centerY + 45 &&
    mouseY <= centerY + 75
  ) {
    weekOffset = weekOffset - 1;
    return "previousWeek";
  }

  // Check next week button (only in weekly view)
  if (
    calendarViewType === "weekly" &&
    mouseX >=
      centerX +
        calendarDisplayConfig.width -
        calendarDisplayConfig.padding -
        40 &&
    mouseX <=
      centerX + calendarDisplayConfig.width - calendarDisplayConfig.padding &&
    mouseY >= centerY + 45 &&
    mouseY <= centerY + 75
  ) {
    weekOffset = weekOffset + 1;
    return "nextWeek";
  }

  // Check previous month button
  if (
    mouseX >= centerX + calendarDisplayConfig.padding &&
    mouseX <= centerX + calendarDisplayConfig.padding + 40 &&
    mouseY >= centerY + calendarDisplayConfig.padding + 25 &&
    mouseY <= centerY + calendarDisplayConfig.padding + 55
  ) {
    previousMonth();
    return "previousMonth";
  }

  // Check next month button
  if (
    mouseX >=
      centerX +
        calendarDisplayConfig.width -
        calendarDisplayConfig.padding -
        40 &&
    mouseX <=
      centerX + calendarDisplayConfig.width - calendarDisplayConfig.padding &&
    mouseY >= centerY + calendarDisplayConfig.padding + 25 &&
    mouseY <= centerY + calendarDisplayConfig.padding + 55
  ) {
    nextMonth();
    return "nextMonth";
  }

  // Check date selection
  const gridStartX = centerX + calendarDisplayConfig.padding + 20;
  const gridStartY = centerY + calendarDisplayConfig.padding + 100;
  const cellWidth =
    (calendarDisplayConfig.width - calendarDisplayConfig.padding * 2 - 40) / 7;
  const cellHeight = 50;

  let daysInMonth = getDaysInMonth(currentMonth, currentYear);
  let firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  for (let day = 1; day <= daysInMonth; day++) {
    let position = firstDay + day - 1;
    let row = Math.floor(position / 7);
    let col = position % 7;

    let cellX = gridStartX + col * cellWidth;
    let cellY = gridStartY + row * cellHeight;

    if (
      mouseX >= cellX &&
      mouseX <= cellX + cellWidth &&
      mouseY >= cellY &&
      mouseY <= cellY + cellHeight
    ) {
      selectedDate = day;
      return "dateSelected";
    }
  }

  return null;
}

// Draw calendar display
function drawCalendarDisplay(
  ctx,
  canvasWidth,
  canvasHeight,
  currentMonth,
  currentYear,
) {
  if (!getCalendarOpen()) return;

  const centerX = (canvasWidth - calendarDisplayConfig.width) / 2;
  const centerY = (canvasHeight - calendarDisplayConfig.height) / 2;

  // Draw calendar window background
  ctx.fillStyle = "#2a2a3e";
  roundRect(
    ctx,
    centerX,
    centerY,
    calendarDisplayConfig.width,
    calendarDisplayConfig.height,
    calendarDisplayConfig.cornerRadius,
  );
  ctx.fill();

  // Draw calendar window border
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    centerX,
    centerY,
    calendarDisplayConfig.width,
    calendarDisplayConfig.height,
    calendarDisplayConfig.cornerRadius,
  );
  ctx.stroke();

  // Draw Monthly View button
  ctx.fillStyle = calendarViewType === "monthly" ? "#667eea" : "#3a3a4e";
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.padding,
    centerY + 10,
    100,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = calendarViewType === "monthly" ? "#764ba2" : "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.padding,
    centerY + 10,
    100,
    30,
    4,
  );
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Monthly",
    centerX + calendarDisplayConfig.padding + 50,
    centerY + 25,
  );

  // Draw Weekly View button
  ctx.fillStyle = calendarViewType === "weekly" ? "#667eea" : "#3a3a4e";
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.padding + 110,
    centerY + 10,
    100,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = calendarViewType === "weekly" ? "#764ba2" : "#667eea";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.padding + 110,
    centerY + 10,
    100,
    30,
    4,
  );
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Weekly",
    centerX + calendarDisplayConfig.padding + 160,
    centerY + 25,
  );

  // Draw title
  ctx.fillStyle = "white";
  ctx.font = "bold 24px 'Courier New'";
  ctx.textAlign = "center";

  if (calendarViewType === "monthly") {
    ctx.fillText(
      monthNames[currentMonth] + " " + currentYear,
      centerX + calendarDisplayConfig.width / 2,
      centerY + 65,
    );
  } else if (calendarViewType === "weekly") {
    // Calculate week number for weekly view
    let todayInfo = getTodayInfo();
    let today = new Date(todayInfo.year, todayInfo.month, todayInfo.day);
    let weekDate = new Date(today);
    weekDate.setDate(weekDate.getDate() + weekOffset * 7);
    let weekNum = getWeekNumber(weekDate);
    let weekMonth = weekDate.getMonth();
    let weekYear = weekDate.getFullYear();

    ctx.font = "bold 18px 'Courier New'";
    ctx.fillText(
      monthNames[weekMonth] + " " + weekYear,
      centerX + calendarDisplayConfig.width / 2,
      centerY + 55,
    );

    ctx.font = "bold 24px 'Courier New'";
    ctx.fillText(
      "Week " + weekNum,
      centerX + calendarDisplayConfig.width / 2,
      centerY + 75,
    );

    // Draw previous week button
    ctx.fillStyle = "#667eea";
    roundRect(
      ctx,
      centerX + calendarDisplayConfig.padding,
      centerY + 45,
      40,
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
    ctx.textBaseline = "middle";
    ctx.fillText(
      "◀",
      centerX + calendarDisplayConfig.padding + 20,
      centerY + 60,
    );

    // Draw next week button
    ctx.fillStyle = "#667eea";
    roundRect(
      ctx,
      centerX +
        calendarDisplayConfig.width -
        calendarDisplayConfig.padding -
        40,
      centerY + 45,
      40,
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
    ctx.textBaseline = "middle";
    ctx.fillText(
      "▶",
      centerX +
        calendarDisplayConfig.width -
        calendarDisplayConfig.padding -
        20,
      centerY + 60,
    );
  }

  // Draw "Today" button
  ctx.fillStyle = "#667eea";
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.width - 90,
    centerY + 10,
    80,
    30,
    4,
  );
  ctx.fill();
  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.width - 90,
    centerY + 10,
    80,
    30,
    4,
  );
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 14px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Today",
    centerX + calendarDisplayConfig.width - 50,
    centerY + 25,
  );

  // Draw previous month button
  ctx.fillStyle = "#667eea";
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.padding,
    centerY + calendarDisplayConfig.padding + 25,
    40,
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
  ctx.fillText(
    "◀",
    centerX + calendarDisplayConfig.padding + 20,
    centerY + calendarDisplayConfig.padding + 42,
  );

  // Draw next month button
  ctx.fillStyle = "#667eea";
  roundRect(
    ctx,
    centerX + calendarDisplayConfig.width - calendarDisplayConfig.padding - 40,
    centerY + calendarDisplayConfig.padding + 25,
    40,
    30,
    4,
  );
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = "bold 16px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillText(
    "▶",
    centerX + calendarDisplayConfig.width - calendarDisplayConfig.padding - 20,
    centerY + calendarDisplayConfig.padding + 42,
  );

  // Draw days of week header
  const gridStartX = centerX + calendarDisplayConfig.padding + 20;
  const gridStartY = centerY + calendarDisplayConfig.padding + 100;
  const cellWidth =
    (calendarDisplayConfig.width - calendarDisplayConfig.padding * 2 - 40) / 7;

  ctx.fillStyle = "#667eea";
  ctx.font = "bold 12px 'Courier New'";
  ctx.textAlign = "center";

  for (let i = 0; i < daysOfWeek.length; i++) {
    ctx.fillText(
      daysOfWeek[i],
      gridStartX + i * cellWidth + cellWidth / 2,
      gridStartY - 10,
    );
  }

  // Draw calendar grid based on view type
  if (calendarViewType === "monthly") {
    drawMonthlyView(
      ctx,
      centerX,
      centerY,
      currentMonth,
      currentYear,
      gridStartX,
      gridStartY,
      cellWidth,
    );
  } else if (calendarViewType === "weekly") {
    drawWeeklyView(
      ctx,
      centerX,
      centerY,
      currentMonth,
      currentYear,
      gridStartX,
      gridStartY,
      cellWidth,
    );
  }
}

// Helper function to draw monthly view
function drawMonthlyView(
  ctx,
  centerX,
  centerY,
  currentMonth,
  currentYear,
  gridStartX,
  gridStartY,
  cellWidth,
) {
  let daysInMonth = getDaysInMonth(currentMonth, currentYear);
  let firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const cellHeight = 50;

  ctx.fillStyle = "#3a3a4e";
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 1;

  for (let day = 1; day <= daysInMonth; day++) {
    let position = firstDay + day - 1;
    let row = Math.floor(position / 7);
    let col = position % 7;

    let cellX = gridStartX + col * cellWidth;
    let cellY = gridStartY + row * cellHeight;

    // Get today's info
    let todayInfo = getTodayInfo();
    let isToday =
      day === todayInfo.day &&
      currentMonth === todayInfo.month &&
      currentYear === todayInfo.year;

    // Draw cell background
    if (isToday) {
      ctx.fillStyle = "#00AA00";
    } else if (hoveredDate === day) {
      ctx.fillStyle = "#667eea";
    } else if (selectedDate === day) {
      ctx.fillStyle = "#764ba2";
    } else {
      ctx.fillStyle = "#3a3a4e";
    }

    ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
    ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);

    // Check if this date has events
    let dateEvents = getEventsForDate(day, currentMonth, currentYear);
    let hasDeadline = false;
    for (let i = 0; i < dateEvents.length; i++) {
      if (dateEvents[i].isDeadline) {
        hasDeadline = true;
        break;
      }
    }

    // Draw day number
    if (isToday) {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = hasDeadline ? "#FF6666" : "white";
    }
    ctx.font = "bold 16px 'Courier New'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(day, cellX + cellWidth / 2, cellY + 5);

    // Draw event indicator
    if (dateEvents.length > 0) {
      ctx.fillStyle = hasDeadline ? "#FF6666" : "#FFD700";
      ctx.beginPath();
      ctx.arc(cellX + cellWidth - 8, cellY + 8, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Helper function to draw weekly view
function drawWeeklyView(
  ctx,
  centerX,
  centerY,
  currentMonth,
  currentYear,
  gridStartX,
  gridStartY,
  cellWidth,
) {
  let todayInfo = getTodayInfo();
  let today = new Date(todayInfo.year, todayInfo.month, todayInfo.day);

  // Get the start of the week (Sunday) with offset
  let weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() + weekOffset * 7);
  let dayOfWeek = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - dayOfWeek);

  const cellHeight = 30;

  ctx.fillStyle = "#3a3a4e";
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 1;

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(weekStart);
    currentDate.setDate(currentDate.getDate() + i);

    let cellX = gridStartX + i * cellWidth;
    let cellY = gridStartY;

    let isToday =
      currentDate.getDate() === todayInfo.day &&
      currentDate.getMonth() === todayInfo.month &&
      currentDate.getFullYear() === todayInfo.year;

    // Draw cell background
    if (isToday) {
      ctx.fillStyle = "#00AA00";
    } else if (
      hoveredDate === currentDate.getDate() &&
      currentDate.getMonth() === currentMonth
    ) {
      ctx.fillStyle = "#667eea";
    } else if (
      selectedDate === currentDate.getDate() &&
      currentDate.getMonth() === currentMonth
    ) {
      ctx.fillStyle = "#764ba2";
    } else {
      ctx.fillStyle = "#3a3a4e";
    }

    ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
    ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);

    // Check if this date has events
    let dateEvents = getEventsForDate(
      currentDate.getDate(),
      currentDate.getMonth(),
      currentDate.getFullYear(),
    );
    let hasDeadline = false;
    for (let j = 0; j < dateEvents.length; j++) {
      if (dateEvents[j].isDeadline) {
        hasDeadline = true;
        break;
      }
    }

    // Draw day number
    if (isToday) {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = hasDeadline ? "#FF6666" : "white";
    }
    ctx.font = "bold 14px 'Courier New'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(currentDate.getDate(), cellX + cellWidth / 2, cellY + 5);

    // Draw event indicator
    if (dateEvents.length > 0) {
      ctx.fillStyle = hasDeadline ? "#FF6666" : "#FFD700";
      ctx.beginPath();
      ctx.arc(cellX + cellWidth - 8, cellY + 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw timeline section
  drawWeeklyTimeline(ctx, centerX, centerY, weekStart, gridStartX, cellWidth);
}

// Helper function to draw weekly timeline
function drawWeeklyTimeline(
  ctx,
  centerX,
  centerY,
  weekStart,
  gridStartX,
  cellWidth,
) {
  const timelineStartY = centerY + 165;
  const timelineHeight = 220;
  const timelineStartX = gridStartX;
  const timeSlotHeight = timelineHeight / 24;
  const timeLabelsX = centerX + 35;

  // Draw time labels and grid
  ctx.fillStyle = "#667eea";
  ctx.font = "bold 12px 'Courier New'";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let hour = 0; hour < 24; hour++) {
    let y = timelineStartY + hour * timeSlotHeight;

    // Draw time label
    let timeLabel = formatTimelineTime(hour, getClockFormat());
    ctx.fillText(timeLabel, timeLabelsX, y);

    // Draw grid line
    ctx.strokeStyle = "#3a3a4e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(timelineStartX, y);
    ctx.lineTo(gridStartX + cellWidth * 7, y);
    ctx.stroke();
  }

  // Draw vertical lines dividing the days
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 7; i++) {
    let x = gridStartX + i * cellWidth;
    ctx.beginPath();
    ctx.moveTo(x, timelineStartY);
    ctx.lineTo(x, timelineStartY + timelineHeight);
    ctx.stroke();
  }

  // Draw bottom border line
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gridStartX, timelineStartY + timelineHeight);
  ctx.lineTo(gridStartX + cellWidth * 7, timelineStartY + timelineHeight);
  ctx.stroke();

  // Draw current time indicator line
  let currentTime = getCurrentTime();
  let currentTimeMinutes = currentTime.hours * 60 + currentTime.minutes;
  let currentTimeY =
    timelineStartY + (currentTimeMinutes / (24 * 60)) * timelineHeight;

  ctx.strokeStyle = "#FF6666";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(timelineStartX, currentTimeY);
  ctx.lineTo(gridStartX + cellWidth * 7, currentTimeY);
  ctx.stroke();

  // Draw events for this week
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    let dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + dayIndex);

    let dayEvents = getEventsForDate(
      dayDate.getDate(),
      dayDate.getMonth(),
      dayDate.getFullYear(),
    );

    for (let i = 0; i < dayEvents.length; i++) {
      let event = dayEvents[i];
      let eventX = gridStartX + dayIndex * cellWidth + 5;
      let eventY =
        timelineStartY +
        ((event.hours * 60 + event.minutes) / (24 * 60)) * timelineHeight;

      ctx.fillStyle = event.isDeadline ? "#FF6666" : "#FFD700";
      ctx.fillRect(eventX, eventY - 8, cellWidth - 10, 16);
      ctx.strokeStyle = event.isDeadline ? "#FF4444" : "#FFA500";
      ctx.lineWidth = 1;
      ctx.strokeRect(eventX, eventY - 8, cellWidth - 10, 16);

      ctx.fillStyle = "white";
      ctx.font = "bold 10px 'Courier New'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        event.title.substring(0, 3),
        eventX + (cellWidth - 10) / 2,
        eventY,
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
  handleCalendarDisplayMouseMove,
  handleCalendarDisplayClick,
  drawCalendarDisplay,
};
