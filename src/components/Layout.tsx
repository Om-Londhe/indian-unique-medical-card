import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { db } from "../services/firebase";
import { CircularProgress } from "@material-ui/core";

interface LayoutProps {
  children: ReactElement<any, any>;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [userStatus, setUserStatus] = useState("unknown");

  useEffect(() => {
    var unSubscribe = () => {};
    if (user) {
      if (
        router.pathname === "/" ||
        router.pathname === "/auth/register" ||
        router.pathname === "/auth/verify"
      ) {
        router.push("/dashboard").then(() => setUserStatus("exist"));
      }
    } else {
      const id = localStorage.getItem("Indian Unique Medical Card ID");
      if (id) {
        unSubscribe = onSnapshot(doc(db, "Users", id), (doc) => {
          dispatch({
            type: actionTypes.SET_USER,
            user: {
              id: id,
              name: doc.data()?.name,
              email: doc.data()?.email,
              phoneNumber: doc.data()?.phoneNumber,
              address: doc.data()?.address,
              userType: doc.data()?.userType,
              photoURL: doc.data()?.photoURL,
            },
          });
        });
        if (
          router.pathname.includes("dashboard") ||
          router.pathname.includes("doctor") ||
          router.pathname.includes("patient")
        ) {
          setUserStatus("exist");
        }
      } else {
        setUserStatus("unavailable");
        if (router.pathname.includes("/dashboard")) {
          router.replace("/");
        }
      }
    }
  }, [user, router]);

  return userStatus === "unknown" ? (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <CircularProgress color="secondary" size={24} />
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default Layout;
