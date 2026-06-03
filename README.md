# ♻️ RecycleApp — MERN + Firebase Auth

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Local)
- Auth: Firebase Google Login
- Images: Cloudinary

---

## ✅ STEP 1 — Install MongoDB (Local)

1. Download here: https://www.mongodb.com/try/download/community
2. Install it (Next > Next > Finish)
3. MongoDB will run automatically on your PC

To test, type this in CMD:
```
mongosh
```
If you see "test>" it means it's working correctly

---

## ✅ STEP 2 — Authorize Web App in Firebase

1. Go to console.firebase.google.com
2. Open your project (recyle-app-7977b)
3. Authentication → Sign-in method → Google → Enable
4. Add "localhost" to Authorized domains

---

## ✅ STEP 3 — Create a Cloudinary Account (Free)

1. Go to cloudinary.com → Sign up
2. Copy these 3 things from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

---

## ✅ STEP 4 — Create server/.env file

Create a file named `.env` inside the server folder:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/recycleapp
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
FIREBASE_PROJECT_ID=recyle-app-7977b
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
```

---

## ✅ STEP 5 — Download Firebase Service Account

The server needs a Service Account to verify Firebase tokens:

1. console.firebase.google.com → Project Settings (gear icon)
2. Click the "Service accounts" tab
3. Click "Generate new private key"
4. Place the downloaded JSON file **inside the server folder**
5. Rename it to: **serviceAccount.json**

---

## ✅ STEP 6 — Run the Server

Open Terminal in VS Code:

```bash
cd server
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

## ✅ STEP 7 — Run the Client

Open a new terminal (+ button):

```bash
cd client
npm install
npm start
```

It will open in the browser at: http://localhost:3000

---

## ✅ STEP 8 — Create an Admin

1. First log in to the app with Google
2. Then open this URL in your browser:

```
http://localhost:5000/api/auth/make-admin/YOUR_EMAIL@gmail.com
```

3. Reload the page — Admin Panel will appear!

---

## Project Structure

```
recycle-mern/
├── client/
│   └── src/
│       ├── firebase.js        ← Firebase config (already set)
│       ├── context/AuthContext.js
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Home.js
│       │   ├── UploadItem.js
│       │   ├── Points.js
│       │   ├── Profile.js
│       │   └── AdminDashboard.js
│       └── components/Navbar.js
└── server/
    ├── .env                   ← You need to create this
    ├── serviceAccount.json    ← Download from Firebase
    ├── index.js
    ├── models/
    ├── routes/
    └── middleware/
```
