import { sendSignInLinkToEmail } from "@firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
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
    url: `http://localhost:3000/auth/verify?name=${name}&phoneNumber=${phoneNumber}&email=${email}&address=${address}&userType=${userType}&photoURL=${photoURL}`,
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
    photoURL: response.data()?.photoURL,
  };
};

export const sendEmailVerificationLinkForLoggingIn = async (email: string) => {
  await sendSignInLinkToEmail(auth, email, {
    url: `http://localhost:3000/auth/verify?email=${email}`,
    handleCodeInApp: true,
  });
};

export const updateMedicalData = async (
  issue: string,
  fees: number,
  medicines: number,
  patientID: string
) => {
  await addDoc(collection(db, "MedicalData"), {
    issue,
    fees,
    medicines,
    on: new Date().getTime(),
    patientID,
  });
};

export const getMedicalDataOfUserID = async (
  userID: string,
  filter: string
) => {
  if (filter === "lifetime") {
    return await (
      await getDocs(
        query(
          collection(db, "MedicalData"),
          where("patientID", "==", userID),
          orderBy("on", "desc")
        )
      )
    ).docs.map((doc) => ({
      id: doc.id,
      issue: doc.data().issue,
      fees: doc.data().fees,
      medicines: doc.data().medicines,
      on: doc.data().on,
      patientID: doc.data().patientID,
    }));
  } else {
    var filterDate: number;
    if (filter === "yearly") {
      filterDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      ).getTime();
    } else if (filter === "6months") {
      filterDate = new Date(
        new Date().setMonth(new Date().getMonth() - 6)
      ).getTime();
    } else if (filter === "3months") {
      filterDate = new Date(
        new Date().setMonth(new Date().getMonth() - 3)
      ).getTime();
    } else {
      filterDate = new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      ).getTime();
    }
    return await (
      await getDocs(
        query(
          collection(db, "MedicalData"),
          where("patientID", "==", userID),
          where("on", ">=", filterDate),
          orderBy("on", "desc")
        )
      )
    ).docs.map((doc) => ({
      id: doc.id,
      issue: doc.data().issue,
      fees: doc.data().fees,
      medicines: doc.data().medicines,
      on: doc.data().on,
      patientID: doc.data().patientID,
    }));
  }
};

export const getMedicalDataOfAllCitizens = async (filter: string) => {
  if (filter === "lifetime") {
    return await (
      await getDocs(query(collection(db, "MedicalData"), orderBy("on", "desc")))
    ).docs.map((doc) => ({
      id: doc.id,
      issue: doc.data().issue,
      fees: doc.data().fees,
      medicines: doc.data().medicines,
      on: doc.data().on,
      patientID: doc.data().patientID,
    }));
  } else {
    var filterDate: number;
    if (filter === "yearly") {
      filterDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      ).getTime();
    } else if (filter === "6months") {
      filterDate = new Date(
        new Date().setMonth(new Date().getMonth() - 6)
      ).getTime();
    } else if (filter === "3months") {
      filterDate = new Date(
        new Date().setMonth(new Date().getMonth() - 3)
      ).getTime();
    } else {
      filterDate = new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      ).getTime();
    }
    return await (
      await getDocs(
        query(
          collection(db, "MedicalData"),
          where("on", ">=", filterDate),
          orderBy("on", "desc")
        )
      )
    ).docs.map((doc) => ({
      id: doc.id,
      issue: doc.data().issue,
      fees: doc.data().fees,
      medicines: doc.data().medicines,
      on: doc.data().on,
      patientID: doc.data().patientID,
    }));
  }
};

export const getUserDataFromID = async (id: string) => {
  const response = await await getDoc(doc(db, "Users", id));
  return {
    id: response.id,
    name: response.data()?.name,
    email: response.data()?.email,
    phoneNumber: response.data()?.phoneNumber,
    address: response.data()?.address,
    userType: response.data()?.userType,
    photoURL: response.data()?.photoURL,
  };
};
