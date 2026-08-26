import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVLOyGAnOdNsMZvuoFx_Wv-npJc1HkKrE",
  authDomain: "agripulse-8fbac.firebaseapp.com",
  projectId: "agripulse-8fbac",
  storageBucket: "agripulse-8fbac.firebasestorage.app",
  messagingSenderId: "756891981859",
  appId: "1:756891981859:web:1d4e7b95d84431e075b996",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { RecaptchaVerifier };
