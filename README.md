Alarm Application
A modular JavaScript-based alarm application built with Node.js that displays time, manages alarms, and tracks events.

Project Overview
This alarm application is designed with a modular architecture where each feature is implemented in its own file and imported into the main application. The application is built using only fundamental JavaScript concepts: variables, conditionals, loops, lists, collections, functions, arrays, and structures.

Features
Current Time Display - Shows the current time in HH:MM:SS format and the current date
Set Alarms - Create and manage multiple alarms
Calendar - View what day it is and add events
Event Tracking - Set events for today or any other day
Assignment Deadline Alerts - Get notified when you're close to assignment submission deadlines
Sound/Vibration - Audio alerts and vibration notifications when alarms trigger

Project Structure:
alarm-app/
├── main.mjs                   # Main application entry point
├── features/
│   ├── time.mjs               # Time display functionality
│   ├── alarms.mjs             # Alarm management (to be implemented)
│   ├── calendar.mjs           # Calendar and event management (to be implemented)
│   └── notifications.mjs      # Sound and vibration alerts (to be implemented)
├── README.md                  # This file
└── package.json               # Project metadata

To run the application:
node main.mjs
The application will display the current time and date, updating every second.

Current Features
Time Display
The application shows:

Current time in 24-hour format (HH:MM:SS)
Current date with day name, month, and year

File Descriptions:
main.mjs
The entry point of the application. It imports all feature modules and coordinates the overall application flow.

Functions:
time.mjs
Handles all time-related functionality.

Future Development:
The following features are planned to be added:

Alarm Management (alarms.mjs)
Create alarms
Set alarm times
Enable/disable alarms
Delete alarms
Calendar & Events (calendar.mjs)
View calendar
Add events
Track assignment deadlines
Display upcoming events
Notifications (notifications.mjs)
Play alarm sounds
Trigger vibrations
Send deadline reminders
Development Notes


Author:
Solomon Essien

