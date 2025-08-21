# 🌟 Astro Journal App

A simple **React Native** mobile journal app that combines **daily horoscopes** with a **personal journaling** experience. Users can view their horoscope, toggle zodiac signs, and write & save daily journal entries with offline persistence.

<p align="center">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.81%2B-61dafb?logo=react" />
  <img alt="Navigation" src="https://img.shields.io/badge/Navigation-React%20Navigation-6a5acd" />
  <img alt="State" src="https://img.shields.io/badge/State-Redux%20Toolkit-764abc?logo=redux" />
  <img alt="Storage" src="https://img.shields.io/badge/Persistence-AsyncStorage-2c3e50" />
</p>

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Setup & Run](#-setup--run)
- [API](#-api)
- [Roadmap / Future Enhancements](#-roadmap--future-enhancements)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- **Daily Horoscope**
  - Fetch daily horoscope for the selected zodiac sign.

- **Journal Entries**
  - Write & save journal entries for each day.
  - View previously saved entries.
  - Offline persistence with **AsyncStorage**.

- **Zodiac Toggle**
  - Dropdown to select zodiac sign (Aries, Taurus, etc.).

- **Navigation**
  - **Home Screen** → Horoscope + date + “Write Journal” button.
  - **Journal Screen** → Editable journal input + saved entries.

- **Offline Access**
  - Works even without internet (local storage).

---

## 🧩 Tech Stack

- **React Native** `0.81+`
- **React Navigation** for routing
- **Redux Toolkit** (or **Context API**) for state management
- **AsyncStorage** for local persistence
- **Hooks** for stateful logic

---

## 📁 Folder Structure

/src
/components -> Reusable UI components
/screens -> Home, Journal, History, Settings
/services -> API services (horoscope fetch, storage)
/hooks -> Custom hooks (useJournal, etc.)
/utils -> Constants, helpers
/store -> Redux slices & store config

## ⚡️ Setup & Run

### 1) Clone the repo
```bash
git clone https://github.com/micksharma/astro-journal.git
cd astro-journal

### 2) Install dependencies
npm install
# or
yarn install

### 3) Run the app
# Android
npx react-native run-android

4) Start Metro Bundler (if not auto-started)
npx react-native start

API
Using the free horoscope API:
Endpoint
POST https://aztro.sameerkumar.website?sign=aries&day=today
Example
const response = await fetch(
  'https://aztro.sameerkumar.website?sign=aries&day=today',
  { method: 'POST' }
);
const data = await response.json();



🏗 Roadmap / Future Enhancements
This project is the foundation for a personal growth & astrology journaling product.
⏰ Push Notifications — “Remind me to journal” (Expo Notifications / Notifee)
🗃 SQLite Integration — richer offline data model and queries
☁️ Cloud Sync — multi-device access & backup
🤖 AI Insights — mood detection & summaries from entries
🎨 Customization — theming, dark mode, personalization
📤 Social Sharing — share horoscope insights
🧱 Modularization — stricter boundaries for services/store/hooks