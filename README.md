Alarm Application
A modular JavaScript-based alarm application built with Node.js that displays time, manages alarms, and tracks events.

Project Overview
This alarm application is designed with a modular architecture where each feature is implemented in its own file and imported into the main application.

Features
Current Time Display - Shows the current time in HH:MM:SS format and the current date
Set Alarms - Create and manage multiple alarms
Calendar - View what day it is and add events
Event Tracking - Set events for today or any other day
Assignment Deadline Alerts - Get notified when you're close to assignment submission deadlines
Sound/Vibration - Audio alerts and vibration notifications when alarms trigger

To run the application:
Open the index.html
The application will display the current time and date, updating every second.

Current Features
Time Display
Alarm Creation
The application shows:

Current time in 24-hour format (HH:MM:SS)
Current date with day name, month, and year
Creating and setting alarms
Changing from 12h to 24h format



File Descriptions:
main.mjs
The entry point of the application. It imports all feature modules and coordinates the overall application flow.

Functions:
Time
Handles all time-related functionality.

Alarm 
Handles creating, setting alarms.


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

All tasks for the project is managed here:
https://trello.com/invite/b/69663ff5930e034806347a50/ATTIf8eb83aae8d69251191249e4af744bbb5C45CC85/alarm-application

Author:
Solomon Essien
