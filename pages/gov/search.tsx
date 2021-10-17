import { Avatar, IconButton } from "@material-ui/core";
import { HomeRounded } from "@material-ui/icons";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../../src/context/StateProvider";
import searchStyles from "../../styles/pages/doctor/Doctor.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { pageAnimationVariants } from "../../src/services/animationUtils";

export const getStaticProps = async () => {
  const data = await axios.get(
    "https://indian-unique-medical-card.vercel.app/api/doctor"
  );
  return {
    props: {
      users: data.data,
      revalidate: 30,
    },
  };
};

interface SearchIndexProps {
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

const Search = ({ users }: SearchIndexProps) => {
  const router = useRouter();
  const [{ verified }] = useStateValue();
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    if (!verified) router.push("/dashboard");
  }, [verified]);

  return (
    <motion.div
      className={searchStyles.main}
      variants={pageAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className={searchStyles.inputField}>
        <IconButton onClick={() => router.push("/gov")}>
          <HomeRounded />
        </IconButton>
        <input
          type="text"
          value={searchString}
          placeholder="Search by IUMC ID, Name, Email or Phone number."
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>
      <div className={searchStyles.users}>
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
          .map((user, index) => (
            <Link href={`/patient/${user.id}`} key={index}>
              <a className={searchStyles.user} key={user?.id}>
                <Avatar
                  className={searchStyles.avatar}
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
                <p className={searchStyles.name}>{user?.name}</p>
              </a>
            </Link>
          ))}
      </div>
    </motion.div>
  );
};

export default Search;
