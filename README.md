# Lingua 🌍

A Duolingo-inspired AI language learning mobile app built with Expo and React Native.

## Features

- **AI Teacher Lessons**: Interactive video-based lessons.
- **Audio Lessons**: Practice your listening and speaking.
- **AI Tutor Chat**: Real-time conversation practice.
- **Vocabulary Review**: Keep your skills sharp.
- **Gamified Experience**: Earn XP and maintain streaks.

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Authentication**: [Clerk](https://clerk.com/)
- **Video & Chat**: [Stream](https://getstream.io/)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** (`.env.local`)

   - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY` (server API routes)
   - `STREAM_API_KEY` and `STREAM_API_SECRET` (server only — never expose in the client)
   - `GOOGLE_API_KEY` (Vision Agent AI teacher — from [Google AI Studio](https://aistudio.google.com/))

3. **Start the app**

   Stream audio lessons require a **development build** (not Expo Go):

   ```bash
   npx expo prebuild --clean
   npx expo run:ios
   # or
   npx expo run:android
   ```

   For API routes during development:

   ```bash
   npx expo start
   ```

## Vision Agent (AI audio teacher)

The Python service in `vision-agent/` joins Stream lesson calls as a voice-only teacher (Gemini Realtime + Stream Edge).

```bash
cd vision-agent
uv sync
uv run main.py serve --host 127.0.0.1 --port 8000
```

Health check: `http://127.0.0.1:8000/health`

## Development

This project uses Expo Router for file-based navigation. Main screens are located in the `app/` directory.