import React, { useEffect } from "react";
import parallaxHeroStyles from "../../../styles/components/home/ParallaxHero.module.css";
import Link from "next/link";

const ParallaxHero = () => {
  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      const stars = document.getElementById("stars");
      const moon = document.getElementById("moon");
      const mountains_behind = document.getElementById("mountains_behind");
      const mountains_front = document.getElementById("mountains_front");
      const button = document.getElementById("button");

      stars && (stars.style.left = `${window.scrollY * 0.25}px`);
      moon && (moon.style.top = `${window.scrollY * 1.05}px`);
      mountains_behind &&
        (mountains_behind.style.top = `${window.scrollY * 0.5}px`);
      mountains_front &&
        (mountains_front.style.top = `${window.scrollY * 0}px`);
      button && (button.style.marginTop = `${window.scrollY * 1.5}px`);
    });

    return () => window.removeEventListener("scroll", () => {});
  }, []);

  return (
    <section className={parallaxHeroStyles.section}>
      <img src="/stars.png" alt="stars" id="stars" />
      <img
        src="/moon.png"
        alt="moon"
        id="moon"
        className={parallaxHeroStyles.moon}
      />
      <img
        src="/mountains_behind.png"
        alt="mountains_behind"
        id="mountains_behind"
      />
      <Link href="#entry">
        <a id="button" className={parallaxHeroStyles.button}>
          Get started!
        </a>
      </Link>
      <img
        src="/mountains_front.png"
        alt="mountains_front"
        id="mountains_front"
        className={parallaxHeroStyles.mountains_front}
      />
    </section>
  );
};

export default ParallaxHero;
