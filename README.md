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
- npm 

### Steps to Install

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/calendar-app.git
2. Navigate to the project directory:
   ```bash
   cd MyCalendar
3. Install the dependencies:
   ```bash
   npm install
4. Add Tailwind and its configuration
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
5. Update vite.config.ts
    ```bash
    npm install -D @types/node
6. Run the CLI
   ```bash
   npx shadcn@latest init
7. Configure components.json
   ```bash
   Which style would you like to use? › New York
   Which color would you like to use as base color? › Normal
   Do you want to use CSS variables for colors? › no / yes
6. Now have to add components 
    ```bash
    npx shadcn@latest add button
    npx shadcn@latest add card
    npx shadcn@latest add input
    npx shadcn@latest add textarea
    npx shadcn@latest add dialog
---
## Deployment

The app is deployed on [Netlify](https://www.netlify.com). You can visit the deployed app here:


- [Netlify Deployment Link](https://mycalendar-events.netlify.app/)




   

