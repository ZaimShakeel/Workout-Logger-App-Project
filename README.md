Intelligent Workout Logger

A full-stack fitness logging system built using React, Node.js (Express), and PostgreSQL.
The app allows users to log workouts, track progress, and analyze muscle balance using automated, data-driven reports.
This repository includes the full SQL database schema used by the application.

⸻

Features

User Registration & Login (JWT Auth)
Log Workouts: date, exercises, sets, reps, weight (lb/kg)
View Workout History and drill into specific sessions
Edit & Delete Workout Records
Exercise Library & History (per-exercise logs)
Performance Progression Analyzer
Tracks weight progression over time
Calculates best weight, averages, 1RM estimate, and consistency
Shows trend (“Improving”, “Declining”, “Plateau”)
Recommends whether to increase or reduce weight
Muscle Balance Analyzer
Totals training volume per muscle group
Generates percentage breakdown (Chest, Back, Legs, etc.)
Highlights undertrained muscles with warnings

Included SQL Database

The repository contains the full SQL schema:
Tables: users, workoutlog, logdetail, exercises, muscles, exercise_muscles
Foreign key constraints
Sample insert data (optional)
Ready to import into PostgreSQL

Tech Stack

Frontend: React + React Router
Backend: Node.js, Express
Database: PostgreSQL
Security: JWT Auth, password hashing
Data: SQL joins, aggregates, and relational modeling


How to Run the Project

Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
Import the SQL database

Inside the /database or /sql folder (whichever you created), you will find:
schema.sql — full table creation script
inserts.sql — optional starter data

Run these inside PostgreSQL using pgAdmin or psql.

Configure backend database connection

Edit /backend/db.js with your PostgreSQL username, password, and database name.

Install backend dependencies

cd backend
npm install
npm run dev

Install frontend dependencies

cd frontend
npm install
npm run dev
