import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyB1HL7KfA2tiMhbKEKj2J-xhL-5XubIp-o",
    authDomain: "fundflick-96f2b.firebaseapp.com",
    projectId: "fundflick-96f2b",
    storageBucket: "fundflick-96f2b.firebasestorage.app",
    messagingSenderId: "981452297470",
    appId: "1:981452297470:web:19935d291de525fe3bc1af",
    measurementId: "G-WCZD066QMG"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForFCMToken = async () => {
    return Notification.requestPermission()
        .then(permission => {
            if (permission === 'granted') {
                return getToken(messaging, {
                    vapidKey: import.meta.env.VITE_REACT_APP_FIREBASE_VAPID_KEY,
                });
            } else {
                throw new Error("Notification permission not granted")
            }
        }).catch(err => {
            console.log(err)
            throw err
        })
};

export const onMessageListen = () => {
    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload)
        });
    })
}


