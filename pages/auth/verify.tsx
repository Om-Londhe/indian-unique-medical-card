import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { actionTypes } from "../../src/context/reducer";
import { useStateValue } from "../../src/context/StateProvider";
import { pageAnimationVariants } from "../../src/services/animationUtils";
import {
  checkIfEmailExist,
  getUserDataFromEmail,
  saveUserData,
} from "../../src/services/firebaseUtils";
import verifyStyles from "../../styles/pages/auth/Verify.module.css";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../../src/services/firebase";

const Verify = () => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();

  const updateUserDataInLocalStorageAndState = (data: {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    userType: string;
    photoURL: string;
    id: string;
  }) => {
    dispatch({
      type: actionTypes.SET_USER,
      user: data,
    });
    localStorage.setItem("Indian Unique Medical Card ID", data.id);
    router.replace("/dashboard");
  };

  const getExistingUserData = async (email: string) => {
    const data = await getUserDataFromEmail(email.toString()!);
    updateUserDataInLocalStorageAndState(data);
  };

  useEffect(() => {
    const handleVerification = async () => {
      const { name, email, phoneNumber, address, userType, photoURL, token } =
        router.query;
      if (name && phoneNumber && address && photoURL && userType && email) {
        if (!(await checkIfEmailExist(email?.toString()!))) {
          if (isSignInWithEmailLink(auth, location.href)) {
            try {
              const result = await signInWithEmailLink(
                auth,
                email?.toString(),
                location.href
              );
              if (result.user) {
                const data = await saveUserData(
                  name?.toString()!,
                  email?.toString()!,
                  phoneNumber?.toString()!,
                  address?.toString()!,
                  userType?.toString()!,
                  `${photoURL
                    ?.toString()
                    .replace(
                      "https://firebasestorage.googleapis.com/v0/b/indian-unique-medical-card.appspot.com/o/photos/",
                      "https://firebasestorage.googleapis.com/v0/b/indian-unique-medical-card.appspot.com/o/photos%2F"
                    )!}&token=${token?.toString()!}`
                );
                updateUserDataInLocalStorageAndState(data);
              }
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          getExistingUserData(email?.toString()!);
        }
      } else if (email) {
        getExistingUserData(email?.toString()!);
      } else {
        router.replace("/");
      }
    };

    if (router.isReady && !user) {
      handleVerification();
    }
  }, [router]);

  return (
    <motion.div
      className={verifyStyles.verify}
      variants={pageAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <CircularProgress color="secondary" />
      <p>Saving your information!</p>
    </motion.div>
  );
};

export default Verify;
