import { sendSignInLinkToEmail } from "@firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";

export const uploadImage = async (image: File) => {
  const storageRef = await ref(
    storage,
    `/photos/${new Date().getMilliseconds()}-${image.name}`
  );
  await uploadBytes(storageRef, image);
  return await getDownloadURL(storageRef);
};

export const sendEmailVerificationLink = async (
  name: string,
  email: string,
  phoneNumber: string,
  address: string,
  photoURL: string,
  userType: string
) => {
  await sendSignInLinkToEmail(auth, email, {
    url: `https://indian-unique-medical-card.vercel.app/auth/registerUser?name=${name}&phoneNumber=${phoneNumber}&email=${email}&address=${address}&userType=${userType}&photoURL=${photoURL}`,
    handleCodeInApp: true,
  });
};

export const checkIfEmailExist = async (email: string) => {
  return await (
    await getDocs(query(collection(db, "Users"), where("email", "==", email)))
  ).docs.length;
};

export const saveUserData = async (
  name: string,
  email: string,
  phoneNumber: string,
  address: string,
  userType: string,
  photoURL: string
) => {
  const data = {
    name,
    email,
    phoneNumber,
    address,
    userType,
    photoURL,
    medicalData: [],
  };
  const documentReference = await addDoc(collection(db, "Users"), data);
  return {
    id: documentReference.id,
    ...data,
  };
};

export const getUserDataFromEmail = async (emailToCheck: string) => {
  const response = await (
    await getDocs(
      query(collection(db, "Users"), where("email", "==", emailToCheck))
    )
  ).docs[0];
  return {
    id: response.id,
    name: response.data()?.name,
    email: response.data()?.email,
    phoneNumber: response.data()?.phoneNumber,
    address: response.data()?.address,
    userType: response.data()?.userType,
    medicalData: response.data()?.medicalData,
    photoURL: response.data()?.photoURL,
  };
};

export const sendEmailVerificationLinkForLoggingIn = async (email: string) => {
  await sendSignInLinkToEmail(auth, email, {
    url: `https://indian-unique-medical-card.vercel.app/auth/registerUser?email=${email}`,
    handleCodeInApp: true,
  });
};

export const updateMedicalData = async (
  id: string,
  issue: string,
  fees: number,
  medicines: number
) => {
  await updateDoc(doc(db, "Users", id), {
    medicalData: arrayUnion({
      issue,
      fees,
      medicines,
      on: new Date().toLocaleString(),
    }),
  });
};
