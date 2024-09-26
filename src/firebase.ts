import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  DocumentReference,
  WithFieldValue,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNx7bCOnKx_XJ7IJLDIZ0DhvvUcnVmXSs",
  authDomain: "bookie-app-c764b.firebaseapp.com",
  projectId: "bookie-app-c764b",
  storageBucket: "bookie-app-c764b.appspot.com",
  messagingSenderId: "55317092259",
  appId: "1:55317092259:web:493322f73fbd6579166c16",
  measurementId: "G-WPNSPZT73P",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export { logEvent };

const db = getFirestore(app);
// export const messaging = getMessaging(app);

export const PostData = async <T extends WithFieldValue<DocumentData>>({
  col,
  data,
}: {
  col: string;
  data: T;
}): Promise<DocumentReference<DocumentData>> => {
  const docRef = await addDoc(collection(db, col), data);
  return docRef;
};

export const UpdateData = async <T extends WithFieldValue<DocumentData>>({
  col,
  docId,
  data,
}: {
  col: string;
  docId: string;
  data: T;
}): Promise<void> => {
  const docRef = doc(db, col, docId);
  await updateDoc(docRef, data);
};

export const GetData = async <T>({ col }: { col: string }): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, col));
  const data: T[] = [];
  querySnapshot.forEach((doc) => {
    data.push({
      ...doc.data(),
      id: doc.id,
    } as T);
  });
  return data;
};

export const uploadFileToFirebase = (
  file: File,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
