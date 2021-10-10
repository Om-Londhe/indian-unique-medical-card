import { Avatar, IconButton } from "@material-ui/core";
import { HomeRounded } from "@material-ui/icons";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../../src/context/StateProvider";
import doctorStyles from "../../styles/pages/doctor/Doctor.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { pageAnimationVariants } from "../../src/services/animationUtils";

export const getStaticProps = async () => {
  const data = await axios.get("http://localhost:3000/api/doctor");
  return {
    props: {
      users: data.data,
    },
  };
};

interface DoctorIndexProps {
  users: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    userType: string;
    address: string;
    photoURL: string;
  }[];
}

const Doctor = ({ users }: DoctorIndexProps) => {
  const router = useRouter();
  const [{ user }] = useStateValue();
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    if (user && user?.userType !== "doctor") router.push("/dashboard");
  }, [user]);

  return (
    <motion.div
      className={doctorStyles.main}
      variants={pageAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className={doctorStyles.inputField}>
        <IconButton onClick={() => router.push("/dashboard")}>
          <HomeRounded />
        </IconButton>
        <input
          type="text"
          value={searchString}
          placeholder="Search by IUMC ID, Name, Email or Phone number."
          onChange={(e) => setSearchString(e.target.value.trim())}
        />
      </div>
      <div className={doctorStyles.users}>
        {users
          ?.filter(
            (user) =>
              user.id.toLowerCase().includes(searchString.toLowerCase()) ||
              user.name.toLowerCase().includes(searchString.toLowerCase()) ||
              user.email.toLowerCase().includes(searchString.toLowerCase()) ||
              user.phoneNumber
                .toLowerCase()
                .includes(searchString.toLowerCase())
          )
          .map((user) => (
            <Link href={`/patient/${user.id}`}>
              <a className={doctorStyles.user}>
                <Avatar
                  className={doctorStyles.avatar}
                  alt={
                    user?.name.split(" ").length >= 2
                      ? `${user?.name.split(" ")[0][0]}${
                          user?.name.split(" ")[1][0]
                        }`
                        ? user?.name.split(" ").length === 1
                          ? user?.name.split(" ")[0][0]
                          : ""
                        : ""
                      : ""
                  }
                  src={user?.photoURL || undefined}
                />
                <p className={doctorStyles.name}>{user?.name}</p>
              </a>
            </Link>
          ))}
      </div>
    </motion.div>
  );
};

export default Doctor;
