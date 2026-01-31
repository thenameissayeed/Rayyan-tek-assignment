# Nadwa Attendance Management System

A full-stack, bilingual (English/Urdu) attendance system for Admin and Teacher portals.

## 📁 Project Structure
- **backend/**: Node.js/Express API with MongoDB.
- **frontend/**: React Native (Expo) mobile/web application.

## 🚀 Live Deployments
- **Web App:** [Your Netlify Link]
- **API Server:** [Your Render Link]

## 🛠️ Installation & Local Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with: `PORT=5000` and `MONGO_URI=your_mongodb_uri`
4. `npm start` (Runs on http://localhost:5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. Start the app: `npx expo start`

## 🌐 Deployment Steps

### Backend (Render)
1. Push the code to GitHub.
2. Create a "Web Service" on Render and point it to the `backend` directory.
3. Set the Build Command: `npm install`
4. Set the Start Command: `node server.js`

### Frontend (Netlify)
1. Inside `frontend`, run: `npx expo export:web`
2. This generates the `web-build` folder.
3. Drag and drop the `web-build` folder into Netlify.

## 📱 Mobile Build (APK)
Generate the Android APK via EAS:
`eas build -p android --profile preview`