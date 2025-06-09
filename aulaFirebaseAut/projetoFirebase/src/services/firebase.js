import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyASoqwPvhHp2bg5B7u6n6WHGNxEvVKWB9s",
  authDomain: "att-marcosmoreira-luisfilipe.firebaseapp.com",
  projectId: "att-marcosmoreira-luisfilipe",
  storageBucket: "att-marcosmoreira-luisfilipe.firebasestorage.app",
  messagingSenderId: "531924599531",
  appId: "1:531924599531:web:0de10422159636b484b4ae",
  measurementId: "G-PW79X87HQ2"
};

// Inicializa o App
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o Firestore
export const db = getFirestore(app);

// Inicializa e exporta o Auth
export const auth = getAuth(app);

export default app; 