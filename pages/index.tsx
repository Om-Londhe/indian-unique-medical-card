import type { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import Entry from "../src/components/home/Entry";
import Footer from "../src/components/home/Footer";
import Goals from "../src/components/home/Goals";
import ParallaxHero from "../src/components/home/ParallaxHero";
import Tagline from "../src/components/home/Tagline";
import styles from "../styles/pages/home/Home.module.css";
import { pageAnimationVariants } from "../src/services/animationUtils";

const Home: NextPage = () => {
  return (
    <motion.div
      className={styles.main}
      variants={pageAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Head>
        <title>Indian Unique Medical Card | Home</title>
        <meta
          name="description"
          content="Indian Unique Medical Card, an end to end platform to manage medical data of whole India."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ParallaxHero />
      <Entry />
      <Tagline />
      <Goals />
      <Footer />
    </motion.div>
  );
};

export default Home;
