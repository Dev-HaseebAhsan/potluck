# Potluck App 🍲

A social media platform for sharing recipes and food-related content.

This repository contains two main parts:

- `backend/` — Express API server (Node.js + Express + MongoDB + Firebase Admin)
- `app/` — Expo React Native app (mobile + web)

This README explains how to install, configure, and run the project locally.

## Quick start

1. Clone the repo and open the project root:

		```powershell
		# change to the path where you cloned the repository
		cd "<path-to-cloned-repo>/potluck"
		```

2. Backend: install dependencies and start in dev mode (uses nodemon):

	 ```powershell
	 cd backend
	 npm install
	 # requires a .env with MONGODB_URI and optionally PORT
	 npm run dev
	 ```

3. App (Expo): install and start the client (web/mobile):

	 ```powershell
	 cd ..\app\potluck
	 npm install
	 npm run web    # or: npm run start / npm run android / npm run ios
	 ```

	 Alternatively, from `app/potluck` you can run `npx expo start` and choose the target (web, Android, iOS).

## What you'll need

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB URI (Atlas or local)
- Firebase project for authentication/storage

Optional tools:

- Expo CLI (npx expo is fine)
- nodemon (used in backend dev script)

## Configuration

- Backend environment variables: Create a `.env` file in `backend/` with at least:

	```text
	MONGODB_URI=<your-mongodb-connection-string>
	PORT=5000
	```

- Firebase (backend): place your Firebase service account JSON at `backend/config/firebase-serviceAccountKey.json`. The backend imports it from `backend/config/firebase.js`.

- Firebase (client): the web/mobile firebase config is currently present at `app/config/firebase.js`. Replace the placeholder values with your own Firebase project's config if you publish or reinitialize the project.

- API URL: the client reads `app/src/config/api.js`. For local testing on a physical device, replace the IP with your machine's LAN IP. For Android emulator use `10.0.2.2`. For iOS simulator `localhost` typically works.

## Project structure (high level)

- backend/
	- server.js — Express server entry
	- package.json — backend scripts and dependencies
	- config/firebase.js — firebase-admin initialization (requires service account json)
	- middleware/ — auth middleware

- app/
	- package.json — shared dependencies used by the Expo workspace
	- potluck/ — Expo app (has its own package.json, scripts)
		- index.js — app entry
		- app.json / app.config.js
	- src/config/api.js — API URL helper used by the app
	- config/firebase.js — web/firebase client config (replace with your keys)

## Scripts

- Backend (`backend/package.json`):
	- `npm run start` — start the server (`node server.js`)
	- `npm run dev` — start with `nodemon` for development

- App (`app/potluck/package.json`):
	- `npm run start` — `expo start`
	- `npm run web` — start web build (`expo start --web`)
	- `npm run android` / `npm run ios` — open respective targets

## Notes & Tips

- API route note: The backend defines a base route at `/` and has a protected test route; make sure the client `API_URL` matches the backend host/port.
- If using a physical device to test the mobile app, ensure your computer and device are on the same network and update `app/src/config/api.js` with your computer's LAN IP.
- If you see Firebase or auth-related errors, check that `backend/config/firebase-serviceAccountKey.json` exists and is valid, and verify the client Firebase config in `app/config/firebase.js`.

## Troubleshooting

- MongoDB connection errors: verify `MONGODB_URI` and that your MongoDB server/Atlas cluster allows connections from your IP.
- CORS issues: the backend uses `cors()` middleware; ensure you are hitting the correct port and domain.
- Expo issues: clear Metro bundler cache with `npx expo start --clear`.

## Contributing

Feel free to open issues or PRs. For small changes, follow this flow locally:

1. Create a branch from `main`.
2. Make changes and run the app/backend locally to verify.
3. Open a PR with a short description of the change.

## License

Add a license as appropriate (this repository currently has none specified).

---