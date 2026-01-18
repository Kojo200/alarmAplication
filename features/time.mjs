// Function to get current time in HH:MM:SS format
function getCurrentTime(format = '24h') {
  let currentDate = new Date();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();
  let period = '';
  
  // Convert to 12-hour format if needed
  if (format === '12h') {
    period = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }
  }
  
  // Pad with leading zeros
  hours = padZero(hours);
  minutes = padZero(minutes);
  seconds = padZero(seconds);
  
  return hours + ":" + minutes + ":" + seconds + period;
}

// Function to get current date information
function getCurrentDate() {
  let currentDate = new Date();
  let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
  
  let day = dayNames[currentDate.getDay()];
  let date = currentDate.getDate();
  let month = monthNames[currentDate.getMonth()];
  let year = currentDate.getFullYear();
  
  return day + ", " + month + " " + date + ", " + year;
}

// Helper function to pad numbers with leading zeros
function padZero(num) {
  let numStr = num.toString();
  if (numStr.length < 2) {
    numStr = "0" + numStr;
  }
  return numStr;
}

// Function to display the current time and date
function displayCurrentTime() {
  let time = getCurrentTime();
  let date = getCurrentDate();
  
  console.clear();
  console.log("=== Alarm Application ===\n");
  console.log("Current Time: " + time);
  console.log("Current Date: " + date);
}

export { displayCurrentTime, getCurrentTime, getCurrentDate };