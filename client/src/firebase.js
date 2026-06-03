import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZ8T_hyx15yYSX1dm1Bt_pWWBSJRZ3Aro",
  authDomain: "recyle-app-7977b.firebaseapp.com",
  projectId: "recyle-app-7977b",
  storageBucket: "recyle-app-7977b.firebasestorage.app",
  messagingSenderId: "396052299004",
  appId: "1:396052299004:web:584f85eb8cbcc14f42eb79",
  measurementId: "G-G8M935EKFN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
