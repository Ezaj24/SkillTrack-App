# SkillTrack – Mobile Skill & Goal Tracker

SkillTrack is a productivity-focused mobile application built with **React Native (Expo)** and connected to a **.NET 8 Web API**.  
It helps users track skills, set goals, and manage personal improvement through a clean and minimal UI.

---

## ✨ Features

### 🔐 Authentication
- Login and Register with JWT  
- Secure token storage using AsyncStorage  

### 📚 Skills
- Add, edit, and delete skills  
- Automatically grouped by category  
- Level badges: Beginner / Intermediate / Advanced  
- Clean card layout  

### 🎯 Goals
- Add, edit, and delete goals  
- Grouped automatically by **Year → Month**  
- Upcoming goals visible on Dashboard  
- Calendar date picker for target date  

### 👤 Profile
- Update name and email  
- Dark/Light mode toggle (saved permanently)  
- App info: version, terms, privacy  
- Logout with navigation reset  

### 🏠 Dashboard
- Personalized greeting with first name  
- Overview: total skills, goals, due soon  
- Quick add buttons  
- Daily motivational quote  
- Upcoming goals preview  

### 🌙 Dark Mode
- Fully supported across all screens  
- Status bar adjusts automatically  

---

## 🛠 Tech Stack

### Mobile App (Frontend)
- React Native (Expo)  
- React Navigation  
- Context API (Theme)  
- Axios  
- AsyncStorage  
- Animated API  
- DateTimePicker  

### Backend API
- .NET 8 Web API  
- Entity Framework Core  
- PostgreSQL  
- JWT Authentication  
- Render deployment  

---

## 📂 Project Structure

src/ ├── api # axios setup ├── navigation # navigators ├── screens # all UI modules ├── theme # light/dark themes & context └── utils # quotes and animations

App.js # main entry app.json # Expo configuration


---

## 📸 App Screenshots

### 🟦 Dark Mode

#### Home Screen
![Home Screen – Dark](assets/screens/Home%20%28Dark%29.jpg)

#### Skills Screen
![Skills Screen – Dark](assets/screens/Skills%20%28Dark%29.jpg)

#### Goals Screen
![Goals Screen – Dark](assets/screens/Goals%20%28Dark%29.jpg)

#### Profile Screen
![Profile Screen – Dark](assets/screens/Profile%20%28Dark%29.jpg)

---

### ⚪ Light Mode

#### Home Screen
![Home Screen – Light](assets/screens/Home%20%28Light%29.jpg)

#### Profile Screen
![Profile Screen – Light](assets/screens/Profile%20%28Light%29.jpg)

---

### 🔐 Authentication

#### Login Screen
![Login Screen – Light](assets/screens/Login%20%28Light%29.jpg)



## 🚀 Running the App

Install dependencies:
``bash
npm install

Start development server:


npx expo start

Open in Expo Go on your phone


🌐 API Base URL
Configured inside:

Code
src/api/api.js
Endpoints
/api/auth/login

/api/auth/register

/api/user/me

/api/user/update

/api/skills (CRUD)

/api/goals (CRUD)

📝 Notes
Built for portfolio and real learning

UI is clean, minimal, and responsive

Version 1 is complete and stable

📊 Project Status
SkillTrack v1 is finished. Future improvements may include animations, onboarding, charts, or reminders..
