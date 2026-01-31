# Rayyan-tek Assignment

A full-stack, bilingual (English/Urdu) attendance system featuring dedicated Admin and Teacher portals.

## 📁 Project Structure
- **backend/**: Node.js/Express API with MongoDB integration.
- **frontend/**: React Native (Expo) cross-platform application (Web & Mobile).

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

---

## 📱 Mobile Build Instructions (APK/IPA)
This project uses **EAS (Expo Application Services)** for cloud-based native builds.

### To Generate Android APK:
1. **Install EAS CLI:** `npm install -g eas-cli`
2. **Login:** `eas login` (Using Expo account credentials)
3. **Configure:** Ensure `eas.json` is set to `"buildType": "apk"` under the preview profile.
4. **Build:** Run the following command:
   ```bash
   cd frontend
   eas build --platform android --profile preview
