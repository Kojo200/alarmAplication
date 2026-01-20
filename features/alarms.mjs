// Alarm data structure
let alarms = [];
let nextAlarmId = 0;

// Create a new alarm
function createAlarm(hours, minutes) {
  let alarm = {
    id: nextAlarmId++,
    hours: hours,
    minutes: minutes,
    enabled: true,
    triggered: false,
  };
  alarms.push(alarm);
  return alarm;
}

// Get all alarms
function getAllAlarms() {
  return alarms;
}

// Get alarm by ID
function getAlarmById(id) {
  for (let i = 0; i < alarms.length; i++) {
    if (alarms[i].id === id) {
      return alarms[i];
    }
  }
  return null;
}

// Update alarm time
function updateAlarmTime(id, hours, minutes) {
  let alarm = getAlarmById(id);
  if (alarm) {
    alarm.hours = hours;
    alarm.minutes = minutes;
    alarm.triggered = false;
  }
}

// Toggle alarm enabled/disabled
function toggleAlarm(id) {
  let alarm = getAlarmById(id);
  if (alarm) {
    alarm.enabled = !alarm.enabled;
    alarm.triggered = false;
  }
}

// Enable alarm
function enableAlarm(id) {
  let alarm = getAlarmById(id);
  if (alarm) {
    alarm.enabled = true;
  }
}

// Disable alarm
function disableAlarm(id) {
  let alarm = getAlarmById(id);
  if (alarm) {
    alarm.enabled = false;
    alarm.triggered = false;
  }
}

// Delete alarm
function deleteAlarm(id) {
  let keep = [];
  for (let i = 0; i < alarms.length; i++) {
    if (alarms[i].id !== id) {
      keep.push(alarms[i]);
    }
  }
  alarms = keep;
}

// Check if any alarm should trigger
function checkAlarms(currentHours, currentMinutes) {
  for (let i = 0; i < alarms.length; i++) {
    let alarm = alarms[i];
    if (alarm.enabled && !alarm.triggered) {
      if (alarm.hours === currentHours && alarm.minutes === currentMinutes) {
        alarm.triggered = true;
        return alarm;
      }
    }
  }
  return null;
}

// Reset alarm trigger for next day
function resetAlarmTrigger(id) {
  let alarm = getAlarmById(id);
  if (alarm) {
    alarm.triggered = false;
  }
}

// Format alarm time for display
function formatAlarmTime(alarm) {
  let hoursStr = padZero(alarm.hours);
  let minutesStr = padZero(alarm.minutes);
  return hoursStr + ":" + minutesStr;
}

// Helper function to pad numbers with leading zeros
function padZero(num) {
  let numStr = num.toString();
  if (numStr.length < 2) {
    numStr = "0" + numStr;
  }
  return numStr;
}

export {
  createAlarm,
  getAllAlarms,
  getAlarmById,
  updateAlarmTime,
  toggleAlarm,
  enableAlarm,
  disableAlarm,
  deleteAlarm,
  checkAlarms,
  resetAlarmTrigger,
  formatAlarmTime,
};
