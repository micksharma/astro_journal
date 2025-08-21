# astro_journal

🌟 Astro Journal App
A simple React Native mobile journal app that combines daily horoscopes with a personal journaling experience. Users can view their horoscope, toggle zodiac signs, and write & save daily journal entries with offline persistence.
🚀 Features
Daily Horoscope
Fetch daily horoscope for the selected zodiac sign.
Journal Entries
Write & save journal entries for each day.
View previously saved entries.
Offline persistence with AsyncStorage.
Zodiac Toggle
Dropdown to select zodiac sign (Aries, Taurus, etc.).
Navigation
Home Screen → Horoscope + date + “Write Journal” button.
Journal Screen → Editable journal input + saved entries.
Offline Access
Works even without internet since journal data is stored locally.
🧩 Tech Stack
React Native (0.81+)
React Navigation for routing
Redux Toolkit (or Context API) for state management
AsyncStorage for local persistence
Hooks for stateful logic
📁 Folder Structure
/src
  /components   -> Reusable UI components
  /screens      -> Home, Journal, History, Settings
  /services     -> API services (horoscope fetch, storage)
  /hooks        -> Custom hooks (useJournal, etc.)
  /utils        -> Constants, helpers
  /store        -> Redux slices & store config
App.js
⚡️ Setup & Run
Clone the repo
git clone https://github.com/your-username/astro-journal.git
cd astro-journal
Install dependencies
npm install
# or
yarn install
Run the app
npx react-native run-android   # for Android
npx react-native run-ios       # for iOS
Start Metro Bundler (if not auto-started)
npx react-native start
🔮 API
Using free horoscope API:
POST https://aztro.sameerkumar.website?sign=aries&day=today
Example:
const response = await fetch('https://aztro.sameerkumar.website?sign=aries&day=today', {
  method: 'POST'
});
const data = await response.json();
🏗 Future Enhancements
This project is the foundation for a personal growth & astrology journaling product.
Planned enhancements:
Push Notifications → "Remind me to journal" using Expo Notifs / Notifee.
SQLite Integration → For richer offline data management.
Cloud Sync → Sync journal entries with backend API for multi-device access.
AI Insights → Generate mood/insight summaries from journal entries.
Customization → Themes, dark mode, personalized horoscope feeds.
Social Sharing → Option to share horoscope insights with friends.
⏱ Duration
Core implementation: ~3 hours (focused build).
Optional stretch features: additional 2–3 hours.
👨‍💻 Author
Built with ❤️ using React Native.
