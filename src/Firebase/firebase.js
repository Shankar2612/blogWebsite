import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDnOH3V3bfWVHOQDLNH0NvSnPo184Dtjw4",
    authDomain: "blogwebsite-3f492.firebaseapp.com",
    projectId: "blogwebsite-3f492",
    storageBucket: "blogwebsite-3f492.appspot.com",
    messagingSenderId: "874547210679",
    appId: "1:874547210679:web:61411b9a3ddb18a169e032",
    measurementId: "G-6KT7HZLBZ0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();
const fbprovider = new firebase.auth.FacebookAuthProvider();

export { auth, storage, provider, fbprovider, db };
