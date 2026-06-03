# ♻️ RecycleApp — MERN + Firebase Auth

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Local)
- Auth: Firebase Google Login
- Images: Cloudinary

---

## ✅ STEP 1 — MongoDB Install karo (Local)

1. Download karo: https://www.mongodb.com/try/download/community
2. Install karo (Next > Next > Finish)
3. MongoDB automatically PC pe chal raha hoga

Test karne ke liye: CMD mein likho:
```
mongosh
```
"test>" dikhega matlab sahi chal raha hai

---

## ✅ STEP 2 — Firebase mein Web App authorize karo

1. console.firebase.google.com pe jao
2. Apna project kholo (recyle-app-7977b)
3. Authentication → Sign-in method → Google → Enable karo
4. Authorized domains mein "localhost" add karo

---

## ✅ STEP 3 — Cloudinary account banao (Free)

1. cloudinary.com pe jao → Sign up
2. Dashboard pe ye 3 cheezein copy karo:
   - Cloud Name
   - API Key
   - API Secret

---

## ✅ STEP 4 — server/.env file banao

server folder mein `.env` naam ki file banao:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/recycleapp
CLOUDINARY_CLOUD_NAME=yahan_cloud_name_likho
CLOUDINARY_API_KEY=yahan_api_key_likho
CLOUDINARY_API_SECRET=yahan_api_secret_likho
FIREBASE_PROJECT_ID=recyle-app-7977b
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
```

---

## ✅ STEP 5 — Firebase Service Account download karo

Server ko Firebase tokens verify karne ke liye Service Account chahiye:

1. console.firebase.google.com → Project Settings (gear icon)
2. "Service accounts" tab click karo
3. "Generate new private key" click karo
4. Jo JSON file download ho, usse **server folder mein** rakho
5. Naam rakho: **serviceAccount.json**

---

## ✅ STEP 6 — Server chalao

VS Code mein Terminal kholo:

```bash
cd server
npm install
npm run dev
```

Ye dikhna chahiye:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

## ✅ STEP 7 — Client chalao

Naya terminal kholo (+ button):

```bash
cd client
npm install
npm start
```

Browser mein khulega: http://localhost:3000

---

## ✅ STEP 8 — Admin banana

1. Pehle Google se login karo app mein
2. Phir browser mein ye URL kholo:

```
http://localhost:5000/api/auth/make-admin/TUMHARA_EMAIL@gmail.com
```

3. Page reload karo — Admin Panel dikhega!

---

## Project Structure

```
recycle-mern/
├── client/
│   └── src/
│       ├── firebase.js        ← Firebase config (already set hai)
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
    ├── .env                   ← Tumhe banana hai
    ├── serviceAccount.json    ← Firebase se download karna hai
    ├── index.js
    ├── models/
    ├── routes/
    └── middleware/
```
