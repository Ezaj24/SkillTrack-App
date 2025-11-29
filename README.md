SkillTrack – Mobile Skill & Goal Tracker

SkillTrack is a productivity-focused mobile application built with React Native (Expo) and connected to a .NET 8 Web API.
It allows users to track skills, set goals, and manage personal improvement through a clean and minimal UI.

Features
Authentication

Login and Register with JWT

Secure token storage using AsyncStorage

Skills

Add, edit, and delete skills

Grouped by category automatically

Level badges: Beginner / Intermediate / Advanced

Clean card layout

Goals

Add, edit, and delete goals

Automatically grouped by year → month

Upcoming goals visible on Dashboard

Calendar date picker for target date

Profile

Update name and email

Dark/Light mode toggle (saved permanently)

App info: version, terms, privacy

Logout with navigation reset

Dashboard

Greeting with first name

Total skills, goals, due soon

Quick add buttons

Daily motivational quote

Upcoming goals preview

Dark Mode

Fully supported across all screens

Status bar adjusts automatically

Tech Stack
Mobile App (Frontend)

React Native (Expo)

React Navigation

Context API (Theme)

Axios

AsyncStorage

Animated API

DateTimePicker

Backend API

.NET 8 Web API

Entity Framework Core

PostgreSQL

JWT Authentication

Render deployment

Project Structure

src/
• api – axios setup
• navigation – navigators
• screens – all UI modules
• theme – light/dark themes & context
• utils – quotes and animations

App.js – main entry
app.json – Expo configuration

Running the App

Install dependencies
npm install

Start development server
npx expo start

Open in Expo Go on your phone.

API Base URL

Configured inside:

src/api/api.js

Endpoints used:

/api/auth/login

/api/auth/register

/api/user/me

/api/user/update

/api/skills (CRUD)

/api/goals (CRUD)

Notes

Built for portfolio and real learning

UI is clean, minimal, and responsive

Version 1 is complete and stable

Project Status

SkillTrack v1 is finished.
Improvements such as animations, onboarding, charts, or reminders can be added later if needed.
