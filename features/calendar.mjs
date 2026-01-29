// Calendar state
let isCalendarOpen = false;
let currentMonth = 0;
let currentYear = 0;
let events = [];
let nextEventId = 0;
let hoveredDate = -1;
let selectedDate = -1;

const calendarConfig = {
  x: 0,
  y: 0,
  width: 600,
  height: 500,
  padding: 20,
  cornerRadius: 8,
};

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

// Initialize calendar with current month and year
function initCalendar() {
  let today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
}

// Open calendar
function openCalendar() {
  isCalendarOpen = true;
  let today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
}

// Close calendar
function closeCalendar() {
  isCalendarOpen = false;
  selectedDate = -1;
  hoveredDate = -1;
}

// Get if calendar is open
function getCalendarOpen() {
  return isCalendarOpen;
}

// Get current month
function getCurrentMonth() {
  return currentMonth;
}

// Get current year
function getCurrentYear() {
  return currentYear;
}

// Get days in a specific month
function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

// Get first day of month (0 = Sunday)
function getFirstDayOfMonth(month, year) {
  return new Date(year, month, 1).getDay();
}

// Navigate to previous month
function previousMonth() {
  currentMonth = currentMonth - 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear = currentYear - 1;
  }
}

// Navigate to next month
function nextMonth() {
  currentMonth = currentMonth + 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear = currentYear + 1;
  }
}

// Go back to today's month and year
function goToToday() {
  let today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
}

// Create an event
function createEvent(day, month, year, title) {
  let event = {
    id: nextEventId++,
    day: day,
    month: month,
    year: year,
    title: title,
    isDeadline: false,
  };
  events.push(event);
  return event;
}

// Create a deadline event
function createDeadline(day, month, year, title) {
  let event = {
    id: nextEventId++,
    day: day,
    month: month,
    year: year,
    title: title,
    isDeadline: true,
  };
  events.push(event);
  return event;
}

// Get all events
function getAllEvents() {
  return events;
}

// Get events for a specific date
function getEventsForDate(day, month, year) {
  let dateEvents = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].day === day && events[i].month === month && events[i].year === year) {
      dateEvents.push(events[i]);
    }
  }
  return dateEvents;
}

// Get upcoming events
function getUpcomingEvents(limit) {
  let today = new Date();
  let todayDay = today.getDate();
  let todayMonth = today.getMonth();
  let todayYear = today.getFullYear();

  let upcoming = [];
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    let eventDate = new Date(event.year, event.month, event.day);
    let currentDate = new Date(todayYear, todayMonth, todayDay);

    if (eventDate >= currentDate) {
      upcoming.push(event);
    }
  }

  // Sort by date
  for (let i = 0; i < upcoming.length; i++) {
    for (let j = i + 1; j < upcoming.length; j++) {
      let dateI = new Date(upcoming[i].year, upcoming[i].month, upcoming[i].day);
      let dateJ = new Date(upcoming[j].year, upcoming[j].month, upcoming[j].day);
      if (dateJ < dateI) {
        let temp = upcoming[i];
        upcoming[i] = upcoming[j];
        upcoming[j] = temp;
      }
    }
  }

  let result = [];
  for (let i = 0; i < upcoming.length && i < limit; i++) {
    result.push(upcoming[i]);
  }
  return result;
}

// Delete event
function deleteEvent(eventId) {
  let keep = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].id !== eventId) {
      keep.push(events[i]);
    }
  }
  events = keep;
}

export {
  initCalendar,
  openCalendar,
  closeCalendar,
  getCalendarOpen,
  getCurrentMonth,
  getCurrentYear,
  getDaysInMonth,
  getFirstDayOfMonth,
  previousMonth,
  nextMonth,
  goToToday,
  createEvent,
  createDeadline,
  getAllEvents,
  getEventsForDate,
  getUpcomingEvents,
  deleteEvent,
};