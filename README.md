# Calendar App

**Description:**  
This is a calendar application that allows users to view a calendar, manage events, and store them persistently. Users can add, edit, and delete events for any day, and events are saved between page refreshes using `localStorage`. The app features a modern UI with clear visual indicators for the current day, selected day, and events. It also handles month transitions and prevents overlapping events.

---

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Features](#features)
5. [UI Requirements](#ui-requirements)
6. [Complex Logic](#complex-logic)
7. [Deployment](#deployment)

---

## Requirements

### 1. Feature Set:

- **Calendar View**:  
    - Display a calendar grid for the current month with all days properly aligned.
    - Allow users to switch between months using "Previous" and "Next" buttons.

- **Event Management**:  
    - Add, edit, or delete events by clicking on a day.
    - Each event includes:
        - Event name
        - Start time and end time
        - Optional description.

- **Event List**:  
    - Display a list of all events for the selected day.

- **Data Persistence**:  
    - Use `localStorage` to persist events between page refreshes.

### 2. UI Requirements:

- Clean and modern UI using **shadcn** for components.
- Display days in a grid with clear separation for weekends and weekdays.
- Highlight the current day and selected day visually.

### 3. Complex Logic:

- Automatically handle month transitions 
- Prevent overlapping events 
- Allow filtering of events by keyword.

---

## Installation

### Prerequisites
- Node.js
- npm or yarn

### Steps to Install

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/calendar-app.git
