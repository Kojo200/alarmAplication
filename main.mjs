import { displayCurrentTime } from './features/time.mjs';

// Main application function
function runAlarmApp() {
  console.log("=== Alarm Application ===\n");
  
  // Display current time
  displayCurrentTime();
  
  // Update time every second
  setInterval(() => {
    displayCurrentTime();
  }, 1000);
}

// Start the application
runAlarmApp();