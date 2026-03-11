# Gharpayy Dashboard

## 🚀 What's New (Lead Management CRM MVP Update)

This update transforms Gharpayy Dashboard into a complete Lead Management CRM for PG accommodation businesses:

### ✅ What's Been Updated:

| Feature | Description |
|---------|-------------|
| **Pipeline Stages** | Added `Negotiation` stage to the sales pipeline |
| **Lead Scoring** | Automatic scoring (0-100) with Cold/Warm/Hot labels |
| **Search & Filter** | Search by name/phone/location + filter by agent |
| **Auto-Score on Create** | Leads get scored automatically when created |
| **Smart Lead Capture** | Paste WhatsApp messages to auto-extract details |
| **Kanban Pipeline** | Drag-and-drop lead management |
| **Visit Scheduler** | Schedule and track property visits |
| **Activity Timeline** | Track all lead interactions |
| **Follow-up Reminders** | Schedule and track follow-ups |
| **Analytics Dashboard** | Conversion funnels, agent performance, trends |

---

## Overview
Gharpayy Dashboard is a comprehensive administration and management system built for Gharpayy. It provides a centralized web-based application to handle various operational aspects, including leads, inventory, properties, bookings, and user analytics.

## Features
- **Authentication & Authorization**: Secure login, signup, and password reset functionalities.
- **Analytics & Reporting**: Data-driven insights and historical logs for business performance metrics.
- **CRM Pipeline**: Track and capture leads, manage conversations, and handle visits.
- **Inventory & Property Management**: Detailed property tracking, matching, and zone management.
- **Owner Portals**: Dedicated interfaces for tracking availability, handling owners, and managing bookings.

## Lead Management CRM Features
- **Smart Lead Capture**: Auto-extract lead details from WhatsApp messages and form submissions
- **Kanban Pipeline Board**: Drag-and-drop lead management through stages (New → Contacted → Requirement Collected → Property Suggested → Visit Scheduled → Negotiation → Booked/Lost)
- **Lead Scoring System**: Automatic scoring (Cold/Warm/Hot) based on data completeness and engagement
- **Agent Assignment**: Assign leads to agents with round-robin auto-assignment
- **Visit Scheduling**: Schedule and track property visits with outcome recording
- **Search & Filter**: Search leads by name, phone, location; filter by source, stage, and agent
- **Activity Timeline**: Track all lead interactions including messages, visits, and status changes
- **Follow-up Reminders**: Schedule and track follow-up activities
- **Analytics Dashboard**: Conversion funnels, source ROI, agent performance, and weekly trends

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui, Radix UI
- **State Management**: TanStack React Query
- **Backend & Database**: Supabase
- **Routing**: React Router

## Local Setup Instructions

Follow these steps to run the dashboard application on your local machine.

### Prerequisites
- Node.js
- npm (Node Package Manager)
- Git

### 1. Clone the Repository
Open your terminal and clone the repository:
```sh
git clone https://github.com/Vedant294/gharpayy-task
```

### 2. Navigate to the Project Directory
```sh
cd gharpayy-flow
```

### 3. Install Dependencies
Install all required packages:
```sh
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory of the project and add your Supabase credentials:
```env
VITE_SUPABASE_PROJECT_ID="your_project_id_here"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key_here"
VITE_SUPABASE_URL="https://your_project_id_here.supabase.co"
```

### 5. Start the Development Server
Run the application in development mode:
```sh
npm run dev
```

The application will launch and you can view it in your browser, typically at `http://localhost:8080` (or another port specified in the terminal output).

## Lead Management CRM Usage

### For Sales Teams:
1. **Capture Leads**: Use the "Add Lead" button or paste WhatsApp messages to auto-extract lead details
2. **Track in Pipeline**: Move leads through stages using drag-and-drop on the Pipeline page
3. **Assign Agents**: Assign leads to specific agents or use auto-assignment
4. **Schedule Visits**: Book property visits and track outcomes
5. **Follow Up**: Set reminders and track all communications

### Lead Scoring:
- **Cold (0-40)**: Basic info provided, needs engagement
- **Warm (41-70)**: Good engagement, ready for visit
- **Hot (71-100)**: High intent, ready for negotiation/bookings
